// pages/Search.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Search as SearchIcon, Brain, Trash2, Pin } from "lucide-react";

const QUICK_QUERIES = [
  "Show suspicious messages from last 7 days",
  "Find messages about Bitcoin",
  "Show all flagged contacts",
  "Calls longer than 5 minutes",
];

const STORAGE_KEY = "forensic_search_v2";

export default function Search() {
  const [tab, setTab] = useState("ai");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD STORAGE =================
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed.history || []);
      setResults(parsed.lastResult || null);
    }
  }, []);

  // ================= SAVE STORAGE =================
  const save = (newHistory, lastResult) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        history: newHistory,
        lastResult,
      }),
    );
  };

  // ================= SEARCH =================
  const handleSearch = async (customQuery) => {
    const finalQuery = customQuery || query;

    if (!finalQuery.trim()) return toast.error("Enter a search query");

    setLoading(true);

    try {
      if (tab === "ai") {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/query`,
          { query: finalQuery },
          { headers: { "Content-Type": "application/json" } },
        );

        const newResult = { answer: data.answer };

        const newHistoryItem = {
          id: Date.now(),
          query: finalQuery,
          result: newResult,
          time: new Date().toISOString(),
          pinned: false,
        };

        const updatedHistory = [newHistoryItem, ...history];

        setResults(newResult);
        setHistory(updatedHistory);
        save(updatedHistory, newResult);
        setQuery("");
      } else {
        toast.error("Keyword search not supported");
      }
    } catch (err) {
      toast.error(err.response?.data?.answer || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ================= QUICK QUERY FIX =================
  const runQuickQuery = (q) => {
    setQuery(q);
    setTimeout(() => handleSearch(q), 100);
  };

  // ================= DELETE HISTORY ITEM =================
  const deleteItem = (id) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    save(updated, results);
  };

  // ================= PIN ITEM =================
  const togglePin = (id) => {
    const updated = history.map((h) =>
      h.id === id ? { ...h, pinned: !h.pinned } : h,
    );

    // pinned on top
    updated.sort((a, b) => b.pinned - a.pinned);

    setHistory(updated);
    save(updated, results);
  };

  // ================= CLEAR ALL =================
  const clearHistory = () => {
    setHistory([]);
    setResults(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-1">
        Natural Language Search
      </h1>
      <p className="text-gray-400 mb-8">
        Search forensic data using plain English queries
      </p>

      {/* SEARCH BOX */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[["ai", Brain, "AI Search"]].map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                tab === id
                  ? "bg-cyan-500 text-black"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-3 w-4 h-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search forensic data..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-cyan-500 text-black px-6 py-2.5 rounded-lg"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {/* QUICK QUERIES (FIXED ✔ AUTO RUN) */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {QUICK_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => runQuickQuery(q)}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-3 py-1.5 rounded-full border border-gray-700"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT */}
      {results && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <div className="text-gray-400 text-sm mb-2">Latest Result</div>
          <div className="text-white whitespace-pre-wrap">{results.answer}</div>
        </div>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-gray-400 text-sm">Search History</h2>

            <button
              onClick={clearHistory}
              className="text-xs text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-cyan-400 text-sm">{h.query}</div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => togglePin(h.id)}
                      className={`text-xs ${
                        h.pinned ? "text-yellow-400" : "text-gray-500"
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteItem(h.id)}
                      className="text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-gray-300 text-sm mt-2 whitespace-pre-wrap">
                  {h.result.answer}
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  {new Date(h.time).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
