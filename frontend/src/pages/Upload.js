import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload as UploadIcon, FileJson } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [form, setForm] = useState({
    caseNumber: "",
    caseName: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [meta, setMeta] = useState({ totalRows: 0, totalColumns: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const isValid =
      f.name.endsWith(".json") ||
      f.name.endsWith(".csv") ||
      f.name.endsWith(".xlsx");

    if (!isValid) {
      toast.error("Only JSON, CSV, or Excel files allowed");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(f);
    setPreview(null);
    setMeta({ totalRows: 0, totalColumns: 0 });
    toast.success(`${f.name} selected`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.caseName) return toast.error("Case name is required");
    if (!file) return toast.error("Please upload a file");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("caseNumber", form.caseNumber);
      formData.append("caseName", form.caseName);
      formData.append("description", form.description);
      formData.append("file", file);

      const { data } = await axios.post(
        "http://localhost:5000/api/cases",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setPreview(data.preview || null);
      setMeta({
        totalRows: data.totalRows || 0,
        totalColumns: data.totalColumns || 0,
      });

      toast.success(data.message || "Case uploaded successfully!");

      // Navigate to visualizations with the returned case ID
      navigate(`/visualizations/${data.caseId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-1">
        Upload Forensic Data
      </h1>
      <p className="text-gray-400 mb-8">
        Upload JSON, CSV, or Excel files for analysis
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4"
        >
          <h2 className="font-semibold text-white">Case Information</h2>

          {[
            ["caseNumber", "Case Number", "Enter Case Number"],
            ["caseName", "Case Name *", "Enter Case Name"],
          ].map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1.5">
                {label}
              </label>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief description..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
            />
          </div>

          {/* UPLOAD BOX */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Data File *
            </label>
            <label className="border-2 border-dashed border-gray-700 hover:border-cyan-400 hover:bg-gray-800/40 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer transition-all">
              <UploadIcon className="w-6 h-6 text-gray-500" />
              <span className="text-sm text-gray-300 flex items-center gap-2">
                {file ? file.name : "Click to upload or drag and drop"}
                {file && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                    Ready
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-600">JSON, CSV, or Excel</span>
              <input
                type="file"
                accept=".json,.csv,.xlsx"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadIcon className="w-4 h-4" />
            )}
            {loading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </form>

        {/* RIGHT PANEL — File Insights */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FileJson className="w-4 h-4 text-cyan-400" />
            File Insights
          </h2>

          {!file ? (
            <p className="text-gray-500 text-sm">
              Upload a file to view insights.
            </p>
          ) : (
            <div className="space-y-4">
              {/* File info — always shown once file is selected */}
              <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 space-y-1">
                <p className="text-green-400 font-medium">✔ File selected</p>
                <p>
                  Name: <span className="text-white">{file.name}</span>
                </p>
                <p>
                  Type:{" "}
                  <span className="text-white">
                    {file.name.split(".").pop().toUpperCase()}
                  </span>
                </p>
                <p>
                  Size:{" "}
                  <span className="text-white">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </p>
              </div>

              {/* Row / column stats — shown after upload */}
              {meta.totalRows > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 flex justify-between">
                  <span>
                    Rows:{" "}
                    <span className="text-white font-semibold">
                      {meta.totalRows}
                    </span>
                  </span>
                  <span>
                    Columns:{" "}
                    <span className="text-white font-semibold">
                      {meta.totalColumns}
                    </span>
                  </span>
                </div>
              )}

              {/* Preview table — shown after upload */}
              {preview && preview.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-3 overflow-auto max-h-64">
                  <table className="text-xs w-full text-left">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        {Object.keys(preview[0]).map((key) => (
                          <th key={key} className="px-2 py-1 whitespace-nowrap">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, i) => (
                        <tr key={i} className="border-b border-gray-700">
                          {Object.values(row).map((val, j) => (
                            <td
                              key={j}
                              className="px-2 py-1 text-gray-300 whitespace-nowrap"
                            >
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Before submit message */}
              {!preview && (
                <p className="text-sm text-gray-500">
                  Click "Upload & Analyze" to process and preview your data.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
