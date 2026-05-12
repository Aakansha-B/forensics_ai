// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import {
//   FileText,
//   MessageSquare,
//   Phone,
//   Users,
//   AlertTriangle,
//   Upload,
//   Search,
//   BarChart2,
//   Flag,
// } from "lucide-react";
// import API from "../utils/api";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [cases, setCases] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     API.get("/cases")
//       .then((r) => setCases(Array.isArray(r.data) ? r.data : []))
//       .catch(() => setCases([]))
//       .finally(() => setLoading(false));
//   }, []);

//   // Derive stats from real case data
//   const totalCases = cases.length;
//   const totalRecords = cases.reduce((s, c) => s + (c.data?.length || 0), 0);
//   const recentCases = cases.slice(0, 5);

//   const statCards = [
//     {
//       label: "Total Cases",
//       value: totalCases,
//       icon: FileText,
//       color: "text-cyan-400",
//     },
//     {
//       label: "Total Records",
//       value: totalRecords,
//       icon: MessageSquare,
//       color: "text-blue-400",
//     },
//     {
//       label: "Call Logs",
//       value: cases.filter((c) => c.fileType === "text/csv").length,
//       icon: Phone,
//       color: "text-green-400",
//     },
//     {
//       label: "JSON Cases",
//       value: cases.filter((c) => c.fileType === "application/json").length,
//       icon: Users,
//       color: "text-purple-400",
//     },
//   ];

//   const quickActions = [
//     {
//       to: "/upload",
//       icon: Upload,
//       label: "Upload Data",
//       color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
//     },
//     {
//       to: "/search",
//       icon: Search,
//       label: "Natural Language Search",
//       color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
//     },
//     {
//       to: "/search?type=flagged",
//       icon: Flag,
//       label: "Review Flagged Items",
//       color: "bg-red-500/10 text-red-400 border-red-500/20",
//     },
//   ];

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="flex justify-between items-start mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-white">
//             Welcome back,{" "}
//             <span className="text-cyan-400">{user?.name?.split(" ")[0]}</span>
//           </h1>
//           <p className="text-gray-400 mt-1">
//             AI-Powered Digital Forensics Investigation Dashboard
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <Link
//             to="/search"
//             className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all hover:border-gray-500"
//           >
//             <Search className="w-4 h-4" />
//             Search Data
//           </Link>
//           <Link
//             to="/upload"
//             className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
//           >
//             <Upload className="w-4 h-4" />
//             Upload Data
//           </Link>
//         </div>
//       </div>

//       {/* Stat Cards */}
//       {loading ? (
//         <div className="grid grid-cols-4 gap-4 mb-8">
//           {Array(4)
//             .fill(0)
//             .map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-gray-900 rounded-xl p-5 animate-pulse h-24"
//               />
//             ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {statCards.map(({ label, value, icon: Icon, color }) => (
//             <div
//               key={label}
//               className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all"
//             >
//               <Icon className={`w-5 h-5 ${color} mb-3`} />
//               <div className="text-2xl font-bold text-white">
//                 {value ?? "0"}
//               </div>
//               <div className="text-xs text-gray-500 mt-1">{label}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="grid grid-cols-2 gap-6 mb-6">
//         {/* Recent Cases */}
//         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="font-semibold text-white">Recent Cases</h2>
//             <Link
//               to="/upload"
//               className="text-cyan-400 text-sm hover:text-cyan-300"
//             >
//               Upload New →
//             </Link>
//           </div>

//           {loading ? (
//             <div className="space-y-3">
//               {Array(3)
//                 .fill(0)
//                 .map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-12 bg-gray-800 rounded-lg animate-pulse"
//                   />
//                 ))}
//             </div>
//           ) : recentCases.length > 0 ? (
//             <div className="space-y-3">
//               {recentCases.map((c) => (
//                 <div
//                   key={c._id}
//                   onClick={() => navigate(`/visualizations/${c._id}`)}
//                   className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 rounded-lg px-4 py-3 cursor-pointer transition-all"
//                 >
//                   <div>
//                     <div className="text-sm font-medium text-white">
//                       {c.caseName}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {c.caseNumber} · {c.data?.length || 0} records
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">
//                       {c.fileType?.split("/")[1]?.toUpperCase() || "DATA"}
//                     </span>
//                     <BarChart2 className="w-4 h-4 text-gray-500" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 py-8">
//               No cases yet.{" "}
//               <Link to="/upload" className="text-cyan-400">
//                 Upload data
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Suspicious Activity */}
//         <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="font-semibold text-white flex items-center gap-2">
//               <AlertTriangle className="w-4 h-4 text-orange-400" />
//               Suspicious Activity
//             </h2>
//             <Link
//               to="/search?suspicious=true"
//               className="text-cyan-400 text-sm hover:text-cyan-300"
//             >
//               Investigate →
//             </Link>
//           </div>

//           {loading ? (
//             <div className="space-y-3">
//               {Array(3)
//                 .fill(0)
//                 .map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-12 bg-gray-800 rounded-lg animate-pulse"
//                   />
//                 ))}
//             </div>
//           ) : cases.length > 0 ? (
//             <div className="space-y-3">
//               {cases
//                 .slice(0, 4)
//                 .map((c) => {
//                   // Flag cases with night-time data patterns
//                   const nightKeywords = [
//                     "bitcoin",
//                     "transfer",
//                     "urgent",
//                     "delete",
//                     "destroy",
//                     "cash",
//                     "police",
//                     "erase",
//                   ];
//                   const suspicious =
//                     c.data?.filter((row) =>
//                       Object.values(row).some((v) =>
//                         nightKeywords.some((kw) =>
//                           String(v).toLowerCase().includes(kw),
//                         ),
//                       ),
//                     ).length || 0;

//                   if (suspicious === 0) return null;

//                   return (
//                     <div
//                       key={c._id}
//                       onClick={() => navigate(`/visualizations/${c._id}`)}
//                       className="flex items-center justify-between bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-3 cursor-pointer transition-all"
//                     >
//                       <div>
//                         <div className="text-sm font-medium text-white">
//                           {c.caseName}
//                         </div>
//                         <div className="text-xs text-orange-400">
//                           {suspicious} suspicious records
//                         </div>
//                       </div>
//                       <AlertTriangle className="w-4 h-4 text-orange-400" />
//                     </div>
//                   );
//                 })
//                 .filter(Boolean)}

//               {cases.every((c) => {
//                 const nightKeywords = [
//                   "bitcoin",
//                   "transfer",
//                   "urgent",
//                   "delete",
//                   "destroy",
//                   "cash",
//                   "police",
//                   "erase",
//                 ];
//                 return !c.data?.some((row) =>
//                   Object.values(row).some((v) =>
//                     nightKeywords.some((kw) =>
//                       String(v).toLowerCase().includes(kw),
//                     ),
//                   ),
//                 );
//               }) && (
//                 <div className="text-center text-gray-500 py-8">
//                   No suspicious activity detected
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 py-8">
//               Upload data to see suspicious activity
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
//         <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-3 gap-4">
//           {quickActions.map(({ to, icon: Icon, label, color }) => (
//             <Link
//               key={to}
//               to={to}
//               className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all hover:scale-105 ${color}`}
//             >
//               <Icon className="w-6 h-6" />
//               <span className="text-sm font-medium text-center">{label}</span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  MessageSquare,
  Phone,
  AlertTriangle,
  Upload,
  Search,
  BarChart2,
  Clock,
  ChevronRight,
  TrendingUp,
  Database,
  Activity,
} from "lucide-react";
import API from "../utils/api";

// ── Suspicious keyword scanner ────────────────────────────────────────────
const SUSPICIOUS_KEYWORDS = [
  "bitcoin",
  "transfer",
  "urgent",
  "delete",
  "destroy",
  "cash",
  "police",
  "erase",
  "proof",
  "hide",
  "weapon",
  "drugs",
  "kill",
  "threat",
  "ransom",
  "launder",
];

function countSuspicious(caseData) {
  return (caseData || []).filter((row) =>
    Object.values(row).some((v) =>
      SUSPICIOUS_KEYWORDS.some((kw) => String(v).toLowerCase().includes(kw)),
    ),
  ).length;
}

function getFileLabel(fileType) {
  if (!fileType) return "DATA";
  if (fileType.includes("json")) return "JSON";
  if (fileType.includes("csv")) return "CSV";
  if (fileType.includes("sheet")) return "XLSX";
  return fileType.split("/")[1]?.toUpperCase() || "DATA";
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${color}`} />
        {sub && <span className="text-xs text-gray-600">{sub}</span>}
      </div>
      <div className="text-2xl font-bold text-white">{value ?? "0"}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function SectionCard({ title, action, actionTo, icon: Icon, children }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
          {title}
        </h2>
        {action && actionTo && (
          <Link
            to={actionTo}
            className="text-cyan-400 text-xs hover:text-cyan-300 flex items-center gap-1"
          >
            {action} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/cases")
      .then((r) => setCases(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats ──
  const stats = useMemo(() => {
    const totalRecords = cases.reduce((s, c) => s + (c.data?.length || 0), 0);
    const totalSuspicious = cases.reduce(
      (s, c) => s + countSuspicious(c.data),
      0,
    );
    const chatCases = cases.filter(
      (c) => c.data?.[0]?.message || c.data?.[0]?.contact,
    ).length;
    const callCases = cases.filter(
      (c) => c.data?.[0]?.caller || c.data?.[0]?.duration_seconds,
    ).length;
    return { totalRecords, totalSuspicious, chatCases, callCases };
  }, [cases]);

  const recentCases = cases.slice(0, 6);
  const suspiciousList = cases
    .map((c) => ({ ...c, suspiciousCount: countSuspicious(c.data) }))
    .filter((c) => c.suspiciousCount > 0)
    .sort((a, b) => b.suspiciousCount - a.suspiciousCount)
    .slice(0, 5);

  // ── Loading skeleton ──
  if (loading)
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 w-72 bg-gray-800 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-900 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gray-900 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl space-y-6">
      {/* ── Header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back,{" "}
            <span className="text-cyan-400">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            AI-Powered Digital Forensics Investigation Dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/search"
            className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all hover:border-gray-500"
          >
            <Search className="w-4 h-4" />
            Search
          </Link>
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Data
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Cases"
          value={cases.length}
          color="text-cyan-400"
        />
        <StatCard
          icon={Database}
          label="Total Records"
          value={stats.totalRecords}
          color="text-blue-400"
        />
        <StatCard
          icon={AlertTriangle}
          label="Suspicious Records"
          value={stats.totalSuspicious}
          color="text-orange-400"
        />
        <StatCard
          icon={Activity}
          label="Active Datasets"
          value={stats.chatCases + stats.callCases}
          color="text-green-400"
          sub={`${stats.chatCases} chat · ${stats.callCases} calls`}
        />
      </div>

      {/* ── Recent Cases + Suspicious Activity ── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Cases */}
        <SectionCard
          title="Recent Cases"
          action="Upload New"
          actionTo="/upload"
          icon={FileText}
        >
          {recentCases.length > 0 ? (
            <div className="space-y-2">
              {recentCases.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/visualizations/${c._id}`)}
                  className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 rounded-lg px-4 py-3 cursor-pointer transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {c.caseName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {c.caseNumber} · {c.data?.length || 0} records
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">
                      {getFileLabel(c.fileType)}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {timeAgo(c.createdAt)}
                    </span>
                    <BarChart2 className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Database className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No cases yet</p>
              <Link
                to="/upload"
                className="text-cyan-400 text-sm hover:text-cyan-300 mt-1 inline-block"
              >
                Upload your first dataset →
              </Link>
            </div>
          )}
        </SectionCard>

        {/* Suspicious Activity */}
        <SectionCard
          title="Suspicious Activity"
          action="Investigate"
          actionTo="/search?suspicious=true"
          icon={AlertTriangle}
        >
          {suspiciousList.length > 0 ? (
            <div className="space-y-2">
              {suspiciousList.map((c) => (
                <div
                  key={c._id}
                  onClick={() => navigate(`/visualizations/${c._id}`)}
                  className="flex items-center justify-between bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-3 cursor-pointer transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {c.caseName}
                    </div>
                    <div className="text-xs text-orange-400 mt-0.5">
                      {c.suspiciousCount} suspicious record
                      {c.suspiciousCount !== 1 ? "s" : ""} detected
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-orange-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cases.length > 0 ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-green-400 text-sm font-medium">All clear</p>
              <p className="text-gray-500 text-xs mt-1">
                No suspicious activity detected
              </p>
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertTriangle className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Upload data to detect suspicious activity
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Case Overview Table ── */}
      {cases.length > 0 && (
        <SectionCard
          title="All Cases"
          action="Upload New"
          actionTo="/upload"
          icon={Database}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-3 font-medium">Case Name</th>
                  <th className="text-left pb-3 font-medium">Case #</th>
                  <th className="text-left pb-3 font-medium">Type</th>
                  <th className="text-left pb-3 font-medium">Records</th>
                  <th className="text-left pb-3 font-medium">Suspicious</th>
                  <th className="text-left pb-3 font-medium">Uploaded</th>
                  <th className="text-left pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {cases.map((c) => {
                  const suspicious = countSuspicious(c.data);
                  return (
                    <tr
                      key={c._id}
                      onClick={() => navigate(`/visualizations/${c._id}`)}
                      className="cursor-pointer hover:bg-gray-800/50 transition-all group"
                    >
                      <td className="py-3 text-white font-medium pr-4">
                        {c.caseName}
                      </td>
                      <td className="py-3 text-gray-400 pr-4">
                        {c.caseNumber}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                          {getFileLabel(c.fileType)}
                        </span>
                      </td>
                      <td className="py-3 text-gray-300 pr-4">
                        {c.data?.length || 0}
                      </td>
                      <td className="py-3 pr-4">
                        {suspicious > 0 ? (
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {suspicious}
                          </span>
                        ) : (
                          <span className="text-xs text-green-400">Clean</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-500 text-xs pr-4">
                        {timeAgo(c.createdAt)}
                      </td>
                      <td className="py-3">
                        <span className="text-xs text-gray-600 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
                          <BarChart2 className="w-3 h-3" /> View
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* ── Quick Actions ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              to: "/upload",
              icon: Upload,
              label: "Upload Dataset",
              sub: "JSON, CSV or Excel",
              color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            },
            {
              to: "/search",
              icon: Search,
              label: "Search Cases",
              sub: "Natural language query",
              color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            },
            {
              to: "/search",
              icon: Clock,
              label: "Recent Activity",
              sub: "Browse recent uploads",
              color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            },
          ].map(({ to, icon: Icon, label, sub, color }) => (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02] ${color}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs opacity-60 mt-0.5">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
