from sklearn.feature_extraction.text import TfidfVectorizer
import re
import os
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

from sklearn.metrics.pairwise import cosine_similarity

# ================== MONGODB ==================
MONGO_URI  = os.environ.get("MONGO_URI")
DB_NAME    = os.environ.get("DB_NAME", "test")
COLLECTION = os.environ.get("COLLECTION", "cases")

client     = MongoClient(MONGO_URI)
db         = client[DB_NAME]
collection = db[COLLECTION]

# ================== FASTAPI ==================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== HELPERS ==================
def fetch_documents():
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

def smart_query(query, documents):
    cleaned = remove_stopwords(clean_query(query))

    # direct phone match
    phone = re.search(r"\+?\d{10,13}", cleaned)
    if phone:
        results = [d for d in documents if phone.group() in str(d["data"])]
        if results:
            return " ".join([format_result(r) for r in results[:5]])

    # TF-IDF similarity search
    texts = [doc_to_text(d) for d in documents]
    texts_with_query = texts + [cleaned]

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(texts_with_query)

    query_vec = tfidf_matrix[-1]
    doc_vecs  = tfidf_matrix[:-1]

    scores  = cosine_similarity(query_vec, doc_vecs).flatten()
    top_idx = scores.argsort()[-5:][::-1]

    results = [documents[i] for i in top_idx if scores[i] > 0]

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
        answer = smart_query(req.query, documents)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)