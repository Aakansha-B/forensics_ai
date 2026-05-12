import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import API from "../utils/api";

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

/* ── Field detection ─────────────────────────────────────────────────────── */
function detectFields(rows) {
  const sample = rows[0] || {};
  const keys = Object.keys(sample);
  const lower = keys.map((k) => k.toLowerCase());

  const find = (candidates) => {
    const idx = lower.findIndex((k) => candidates.includes(k));
    return idx >= 0 ? keys[idx] : null;
  };

  // Strict: call data must have duration_seconds/duration OR caller+receiver
  const duration = find(["duration_seconds", "duration", "call_duration"]);
  const caller = find(["caller"]);
  const receiver = find(["receiver"]);
  const callType = find(["call_type"]); // strict — NOT "type"

  // Chat data must have message field
  const message = find(["message", "content", "text", "body"]);
  const contact = find(["contact", "name", "sender", "caller", "phone"]);
  const timestamp = find([
    "timestamp",
    "start_time",
    "date",
    "time",
    "datetime",
  ]);
  const language = find(["language", "lang"]);

  const isCall = !!(duration || (caller && receiver));
  const isChat = !!message;

  return {
    type: isCall ? "calls" : isChat ? "chat" : "generic",
    fields: {
      contact,
      timestamp,
      message,
      duration,
      callType,
      language,
      caller,
    },
  };
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function safeDate(val) {
  const d = new Date(val);
  return isNaN(d) ? null : d;
}

function buildTimeline(rows, key) {
  if (!key)
    return rows.slice(0, 20).map((_, i) => ({ date: String(i + 1), count: 1 }));
  const map = {};
  rows.forEach((r) => {
    const d = safeDate(r[key]);
    if (!d) return;
    const day = d.toISOString().split("T")[0];
    map[day] = (map[day] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }));
}

function buildHourly(rows, key) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0,
    isNight: i >= 22 || i <= 5,
  }));
  if (!key) return hours;
  rows.forEach((r) => {
    const d = safeDate(r[key]);
    if (!d) return;
    hours[d.getHours()].count += 1;
  });
  return hours;
}

function buildTopContacts(rows, key) {
  if (!key) return [];
  const map = {};
  rows.forEach((r) => {
    const name = String(r[key] || "Unknown");
    map[name] = (map[name] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, count]) => ({
      name: name.length > 15 ? "…" + name.slice(-12) : name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function buildPie(rows, key) {
  if (!key) return [];
  const map = {};
  rows.forEach((r) => {
    const val = String(r[key] || "Unknown");
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function buildDurations(rows, key) {
  if (!key) return [];
  const b = { "< 1 min": 0, "1–3 min": 0, "3–7 min": 0, "7+ min": 0 };
  rows.forEach((r) => {
    const s = parseInt(r[key] || 0);
    if (s < 60) b["< 1 min"]++;
    else if (s < 180) b["1–3 min"]++;
    else if (s < 420) b["3–7 min"]++;
    else b["7+ min"]++;
  });
  return Object.entries(b).map(([name, value]) => ({ name, value }));
}

/* ── Small components ────────────────────────────────────────────────────── */
function Stat({ title, value, color = "text-white" }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? "—"}</p>
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-0.5">{title}</h2>
      {desc && <p className="text-xs text-gray-500 mb-5">{desc}</p>}
      {children}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function Visualizations() {
  const { id } = useParams();

  const [caseInfo, setCaseInfo] = useState(null);
  const [charts, setCharts] = useState({});
  const [dataType, setDataType] = useState("unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCase = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!id || id === "undefined") {
        setError("Invalid case ID. Please upload a file first.");
        return;
      }

      const res = await API.get("/cases/" + id);
      const raw = res.data;
      const rows = Array.isArray(raw.data) ? raw.data : [];

      if (rows.length === 0) {
        setError("No data found in this case.");
        return;
      }

      setCaseInfo({
        caseName: raw.caseName,
        caseNumber: raw.caseNumber,
        total: rows.length,
      });

      const { type, fields } = detectFields(rows);
      setDataType(type);

      if (type === "calls") {
        setCharts({
          timeline: buildTimeline(rows, fields.timestamp),
          hourly: buildHourly(rows, fields.timestamp),
          topContacts: buildTopContacts(rows, fields.caller || fields.contact),
          pie: buildPie(rows, fields.callType),
          pieLabel: "Call Type Breakdown",
          durations: buildDurations(rows, fields.duration),
        });
      } else if (type === "chat") {
        setCharts({
          timeline: buildTimeline(rows, fields.timestamp),
          hourly: buildHourly(rows, fields.timestamp),
          topContacts: buildTopContacts(rows, fields.contact),
          pie: buildPie(rows, fields.language || fields.contact),
          pieLabel: fields.language
            ? "Language Breakdown"
            : "Contact Distribution",
        });
      } else {
        const firstKey = Object.keys(rows[0])[0];
        const tsKey =
          Object.keys(rows[0]).find((k) =>
            ["timestamp", "date", "time", "start_time"].includes(
              k.toLowerCase(),
            ),
          ) || null;
        setCharts({
          timeline: buildTimeline(rows, tsKey),
          hourly: buildHourly(rows, tsKey),
          topContacts: buildTopContacts(rows, firstKey),
          pie: [],
          pieLabel: "Distribution",
        });
      }
    } catch (err) {
      console.error("Visualization fetch error:", err);
      if (err.response?.status === 404) {
        setError("Case not found.");
      } else if (err.response?.status === 500) {
        setError("Server error. Check your backend is running.");
      } else {
        setError("Failed to load case. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  if (loading)
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-gray-800 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-900 rounded-xl animate-pulse"
            />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-900 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-red-400 flex items-center gap-2">
        <span>⚠</span> <span>{error}</span>
      </div>
    );

  const nightCount = (charts.hourly || [])
    .filter((h) => h.isNight)
    .reduce((s, h) => s + h.count, 0);
  const totalRecs = (charts.hourly || []).reduce((s, h) => s + h.count, 0);

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
          {dataType === "calls"
            ? "Call Log Analysis"
            : dataType === "chat"
              ? "Chat Analysis"
              : "Data Analysis"}
        </p>
        <h1 className="text-3xl text-white font-bold">{caseInfo?.caseName}</h1>
        <p className="text-gray-400 text-sm mt-1">
          Case #{caseInfo?.caseNumber} &middot; {caseInfo?.total} records
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Total Records" value={caseInfo?.total} />
        <Stat
          title="Unique Contacts"
          value={charts.topContacts?.length || 0}
          color="text-purple-400"
        />
        <Stat title="Night Activity" value={nightCount} color="text-red-400" />
        <Stat
          title="Active Days"
          value={charts.timeline?.length || 0}
          color="text-green-400"
        />
      </div>

      {/* Timeline */}
      <Section
        title="Activity Timeline"
        desc="Records per day over the dataset period"
      >
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={charts.timeline || []}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                color: "#e5e7eb",
              }}
            />
            <Line
              dataKey="count"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Top Contacts */}
      <Section
        title={dataType === "calls" ? "Top Callers" : "Top Contacts"}
        desc="Most frequent in dataset"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={charts.topContacts || []} layout="vertical">
            <CartesianGrid stroke="#1f2937" />
            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 10 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                color: "#e5e7eb",
              }}
            />
            <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Pie */}
      {charts.pie?.length > 0 && (
        <Section
          title={charts.pieLabel || "Breakdown"}
          desc="Distribution across dataset"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={charts.pie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {charts.pie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #374151",
                  color: "#e5e7eb",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: "#9ca3af" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Hourly */}
      <Section
        title="Hourly Activity Pattern"
        desc="Red bars = night time (10 PM – 5 AM)"
      >
        {nightCount > 0 && (
          <p className="text-xs text-yellow-400 mb-3">
            ⚠ {nightCount} night-time records detected
          </p>
        )}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={charts.hourly || []}>
            <CartesianGrid stroke="#1f2937" />
            <XAxis dataKey="hour" tick={{ fill: "#6b7280", fontSize: 9 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                color: "#e5e7eb",
              }}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {(charts.hourly || []).map((d, i) => (
                <Cell key={i} fill={d.isNight ? "#ef4444" : "#06b6d4"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Call durations — calls only */}
      {dataType === "calls" && charts.durations?.length > 0 && (
        <Section
          title="Call Duration Distribution"
          desc="How long calls lasted"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.durations}>
              <CartesianGrid stroke="#1f2937" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid #374151",
                  color: "#e5e7eb",
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Night alert */}
      {nightCount > 0 && totalRecs > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm">
          ⚠ {nightCount} of {totalRecs} records (
          {Math.round((nightCount / totalRecs) * 100)}%) occurred between 10 PM
          and 5 AM. This pattern may warrant investigation.
        </div>
      )}
    </div>
  );
}
