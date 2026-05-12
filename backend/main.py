import re
import os
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

# ================== MONGODB ==================
MONGO_URI  = os.environ.get("MONGO_URI")
DB_NAME    = os.environ.get("DB_NAME", "test")       
COLLECTION = os.environ.get("COLLECTION", "cases")   
client     = MongoClient(MONGO_URI)
db         = client[DB_NAME]
collection = db[COLLECTION]

# ================== MODEL ==================
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded.")

# ================== FASTAPI ==================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace * with your Vercel URL after deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== HELPERS ==================
def fetch_documents():
    """Fetch all cases from MongoDB and flatten each data array into documents."""
    documents = []
    cases = list(collection.find({}))
    for case in cases:
        case_meta = {
            "caseNumber": case.get("caseNumber", ""),
            "caseName":   case.get("caseName", ""),
        }
        for item in case.get("data", []):
            documents.append({"case": case_meta, "data": item})
    return documents


def doc_to_text(doc):
    return f"{doc['case']['caseName']} {doc['case']['caseNumber']} {str(doc['data'])}"


def build_index(documents):
    texts      = [doc_to_text(d) for d in documents]
    embeddings = np.array(model.encode(texts, show_progress_bar=False)).astype("float32")
    index      = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index


def format_result(doc):
    d    = doc["data"]
    case = doc["case"]
    base = f"[{case['caseName']} / {case['caseNumber']}] "
    dtype = str(d.get("type", "")).lower()

    if dtype == "sms":
        return base + f"SMS — {d.get('name','?')} ({d.get('phone','?')}): '{d.get('message','')}' at {d.get('timestamp','')}."
    if dtype == "whatsapp":
        return base + f"WhatsApp — {d.get('name','?')} ({d.get('phone','?')}): '{d.get('message','')}' at {d.get('timestamp','')}."
    if "chat_id" in d:
        return base + f"Chat with {d.get('contact','?')} at {d.get('timestamp','')}: '{d.get('message','')}'."
    if "device_id" in d:
        return base + f"{d.get('owner_name','?')} uses {d.get('model','?')} ({d.get('os','?')}) — phone: {d.get('phone_number','?')}."
    if "sms_id" in d:
        return base + f"SMS from {d.get('sender','?')} to {d.get('receiver','?')} at {d.get('timestamp','')}: '{d.get('message','')}'."
    if "call_id" in d:
        return base + f"{d.get('call_type','?')} call between {d.get('caller','?')} and {d.get('receiver','?')} — {d.get('duration_seconds','?')}s."
    if "history_id" in d:
        return base + f"Browser: visited '{d.get('title','?')}' ({d.get('url','?')}) at {d.get('visit_time','')}."
    if "file_id" in d:
        return base + f"File {d.get('file_name','?')} at {d.get('timestamp','')} ({d.get('latitude','?')},{d.get('longitude','?')})."
    if "location_id" in d:
        return base + f"Location ({d.get('latitude','?')},{d.get('longitude','?')}) at {d.get('timestamp','')}."
    return base + str(d)


# ================== QUERY LOGIC ==================
phrases = [
    "information about","details about","details of","data for","records of","info about",
    "show me","give me","get me","fetch me","provide","display","list",
    "find","search","lookup","retrieve","tell me about","i want","i need",
    "chats between","calls between","time stamps","messages","between"
]
stop_words = ["the", "a", "an", "of", "for", "to"]

def clean_query(query):
    query = query.lower()
    for p in phrases:
        query = re.sub(rf"\b{re.escape(p)}\b", "", query)
    return re.sub(r"\s+", " ", query).strip()

def remove_stopwords(text):
    return " ".join([w for w in text.split() if w not in stop_words])

def extract_entity(query):
    phone = re.search(r"\+?\d{10,13}", query)
    if phone:
        return phone.group()
    words = query.split()
    return words[-1] if words else query

def smart_query(query, documents, index):
    cleaned = remove_stopwords(clean_query(query))
    entity  = extract_entity(cleaned)

    if re.search(r"\+?\d{10,13}", entity):
        results = [d for d in documents if entity in str(d["data"])]
    else:
        q_vec    = model.encode([cleaned]).astype("float32")
        D, I     = index.search(q_vec, 5)
        results  = [documents[i] for i in I[0]]
        filtered = [r for r in results if cleaned in str(r["data"]).lower()]
        if filtered:
            results = filtered

    if not results:
        return "No related data found."

    results = [r for r in results if "unknown" not in str(r["data"]).lower()]
    if not results:
        return "No related data found."

    return " ".join([format_result(r) for r in results[:5]])


# ================== ROUTES ==================
class QueryRequest(BaseModel):
    query: str

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Backend is running"}

@app.post("/query")
def get_answer(req: QueryRequest):
    try:
        documents = fetch_documents()
        if not documents:
            return {"answer": "No data found in database."}
        index  = build_index(documents)
        answer = smart_query(req.query, documents, index)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))