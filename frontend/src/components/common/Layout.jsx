// // // import React from 'react';
// // // import { NavLink, useNavigate } from 'react-router-dom';
// // // import { useAuth } from '../../context/AuthContext';
// // // import { LayoutDashboard, Upload, Search, BarChart2, Shield, LogOut } from 'lucide-react';

// // // const Layout = ({ children }) => {
// // //   const { user, logout } = useAuth();
// // //   const navigate = useNavigate();

// // //   const handleLogout = () => { logout(); navigate('/'); };

// // //   const navItems = [
// // //     { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
// // //     { to: '/upload', icon: Upload, label: 'Upload Data' },
// // //     { to: '/search', icon: Search, label: 'Search' },
// // //     { to: '/visualizations', icon: BarChart2, label: 'Visualizations' },
// // //   ];

// // //   return (
// // //     <div className="flex min-h-screen bg-gray-950">
// // //       {/* Sidebar */}
// // //       <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
// // //         <div className="p-5 border-b border-gray-800 flex items-center gap-3">
// // //           <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
// // //             <Shield className="w-4 h-4 text-cyan-400" />
// // //           </div>
// // //           <div>
// // //             <div className="font-semibold text-white text-sm">Forensics AI</div>
// // //             <div className="text-xs text-gray-500">Digital Assistant</div>
// // //           </div>
// // //         </div>
// // //         <nav className="flex-1 p-4 space-y-1">
// // //           {navItems.map(({ to, icon: Icon, label }) => (
// // //             <NavLink key={to} to={to} className={({ isActive }) =>
// // //               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? 'bg-cyan-500/10 text-cyan-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
// // //             }>
// // //               <Icon className="w-4 h-4" />{label}
// // //             </NavLink>
// // //           ))}
// // //         </nav>
// // //         <div className="p-4 border-t border-gray-800">
// // //           <div className="flex items-center gap-3 mb-3">
// // //             <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs font-bold">
// // //               {user?.name?.[0]?.toUpperCase()}
// // //             </div>
// // //             <div className="flex-1 min-w-0">
// // //               <div className="text-sm font-medium text-white truncate">{user?.name}</div>
// // //               <div className="text-xs text-gray-500 truncate">{user?.email}</div>
// // //             </div>
// // //           </div>
// // //           <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 w-full transition-all">
// // //             <LogOut className="w-4 h-4" />Sign Out
// // //           </button>
// // //         </div>
// // //       </aside>
// // //       <main className="flex-1 overflow-auto">{children}</main>
// // //     </div>
// // //   );
// // // };
// // // export default Layout;


// // import React from 'react';
// // import { NavLink, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../../context/AuthContext';
// // import { LayoutDashboard, Upload, Search, BarChart2, Shield, LogOut } from 'lucide-react';

// // const Layout = ({ children }) => {
// //   const { user, logout } = useAuth();
// //   const navigate = useNavigate();

// //   const handleLogout = () => { logout(); navigate('/'); };

// //   const navItems = [
// //     { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
// //     { to: '/upload',    icon: Upload,          label: 'Upload Data' },
// //     { to: '/search',    icon: Search,          label: 'Search' },
// //   ];

// //   return (
// //     <div className="flex min-h-screen bg-gray-950">
// //       {/* Sidebar */}
// //       <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
// //         <div className="p-5 border-b border-gray-800 flex items-center gap-3">
// //           <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
// //             <Shield className="w-4 h-4 text-cyan-400" />
// //           </div>
// //           <div>
// //             <div className="font-semibold text-white text-sm">Forensics AI</div>
// //             <div className="text-xs text-gray-500">Digital Assistant</div>
// //           </div>
// //         </div>

// //         <nav className="flex-1 p-4 space-y-1">
// //           {navItems.map(({ to, icon: Icon, label }) => (
// //             <NavLink key={to} to={to} className={({ isActive }) =>
// //               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
// //                 isActive
// //                   ? 'bg-cyan-500/10 text-cyan-400 font-medium'
// //                   : 'text-gray-400 hover:text-white hover:bg-gray-800'
// //               }`
// //             }>
// //               <Icon className="w-4 h-4" />{label}
// //             </NavLink>
// //           ))}

// //           {/* Visualizations — active when on any /visualizations/:id route */}
// //           <NavLink
// //             to="/dashboard"
// //             className={({ isActive }) => {
// //               const onViz = window.location.pathname.startsWith('/visualizations');
// //               return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
// //                 onViz
// //                   ? 'bg-cyan-500/10 text-cyan-400 font-medium'
// //                   : 'text-gray-400 hover:text-white hover:bg-gray-800'
// //               }`;
// //             }}
// //             onClick={(e) => {
// //               // If already on a visualization page, don't navigate away
// //               if (window.location.pathname.startsWith('/visualizations')) {
// //                 e.preventDefault();
// //               }
// //             }}
// //           >
// //             <BarChart2 className="w-4 h-4" />Visualizations
// //           </NavLink>
// //         </nav>

// //         <div className="p-4 border-t border-gray-800">
// //           <div className="flex items-center gap-3 mb-3">
// //             <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs font-bold">
// //               {user?.name?.[0]?.toUpperCase()}
// //             </div>
// //             <div className="flex-1 min-w-0">
// //               <div className="text-sm font-medium text-white truncate">{user?.name}</div>
// //               <div className="text-xs text-gray-500 truncate">{user?.email}</div>
// //             </div>
// //           </div>
// //           <button
// //             onClick={handleLogout}
// //             className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 w-full transition-all"
// //           >
// //             <LogOut className="w-4 h-4" />Sign Out
// //           </button>
// //         </div>
// //       </aside>

// //       <main className="flex-1 overflow-auto">{children}</main>
// //     </div>
// //   );
// // };

// // export default Layout;

// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { LayoutDashboard, Upload, Search, BarChart2, Shield, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
// import API from '../../utils/api';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [casesOpen, setCasesOpen] = useState(false);
//   const [cases, setCases] = useState([]);
//   const [loadingCases, setLoadingCases] = useState(false);

//   const onViz = location.pathname.startsWith('/visualizations');

//   const handleLogout = () => { logout(); navigate('/'); };

//   const handleVizClick = () => {
//     setCasesOpen(prev => !prev);
//     if (!casesOpen && cases.length === 0) {
//       setLoadingCases(true);
//       API.get('/cases')
//         .then(r => setCases(Array.isArray(r.data) ? r.data.slice(0, 10) : []))
//         .catch(() => setCases([]))
//         .finally(() => setLoadingCases(false));
//     }
//   };

//   // Auto-open dropdown when already on a viz page
//   useEffect(() => {
//     if (onViz && cases.length === 0) {
//       setLoadingCases(true);
//       API.get('/cases')
//         .then(r => setCases(Array.isArray(r.data) ? r.data.slice(0, 10) : []))
//         .catch(() => setCases([]))
//         .finally(() => setLoadingCases(false));
//     }
//   }, [onViz]);

//   const navItems = [
//     { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//     { to: '/upload',    icon: Upload,          label: 'Upload Data' },
//     { to: '/search',    icon: Search,          label: 'Search' },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-950">
//       <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">

//         {/* Logo */}
//         <div className="p-5 border-b border-gray-800 flex items-center gap-3">
//           <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
//             <Shield className="w-4 h-4 text-cyan-400" />
//           </div>
//           <div>
//             <div className="font-semibold text-white text-sm">Forensics AI</div>
//             <div className="text-xs text-gray-500">Digital Assistant</div>
//           </div>
//         </div>

//         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

//           {/* Regular nav items */}
//           {navItems.map(({ to, icon: Icon, label }) => (
//             <NavLink key={to} to={to} className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
//                 isActive
//                   ? 'bg-cyan-500/10 text-cyan-400 font-medium'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-800'
//               }`
//             }>
//               <Icon className="w-4 h-4" />{label}
//             </NavLink>
//           ))}

//           {/* Visualizations with case dropdown */}
//           <div>
//             <button
//               onClick={handleVizClick}
//               className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
//                 onViz
//                   ? 'bg-cyan-500/10 text-cyan-400 font-medium'
//                   : 'text-gray-400 hover:text-white hover:bg-gray-800'
//               }`}
//             >
//               <BarChart2 className="w-4 h-4" />
//               <span className="flex-1 text-left">Visualizations</span>
//               {casesOpen
//                 ? <ChevronDown className="w-3 h-3" />
//                 : <ChevronRight className="w-3 h-3" />
//               }
//             </button>

//             {/* Case list dropdown */}
//             {casesOpen && (
//               <div className="mt-1 ml-4 space-y-0.5">
//                 {loadingCases ? (
//                   <div className="px-3 py-2 text-xs text-gray-500">Loading cases...</div>
//                 ) : cases.length === 0 ? (
//                   <div className="px-3 py-2 text-xs text-gray-500">
//                     No cases yet.{' '}
//                     <button
//                       onClick={() => navigate('/upload')}
//                       className="text-cyan-400 hover:underline"
//                     >
//                       Upload one
//                     </button>
//                   </div>
//                 ) : (
//                   cases.map(c => (
//                     <button
//                       key={c._id}
//                       onClick={() => navigate(`/visualizations/${c._id}`)}
//                       className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all truncate ${
//                         location.pathname === `/visualizations/${c._id}`
//                           ? 'bg-cyan-500/10 text-cyan-400'
//                           : 'text-gray-400 hover:text-white hover:bg-gray-800'
//                       }`}
//                     >
//                       {c.caseName}
//                       <span className="block text-gray-600 text-[10px]">{c.caseNumber}</span>
//                     </button>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>

//         </nav>

//         {/* User + Logout */}
//         <div className="p-4 border-t border-gray-800">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs font-bold">
//               {user?.name?.[0]?.toUpperCase()}
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="text-sm font-medium text-white truncate">{user?.name}</div>
//               <div className="text-xs text-gray-500 truncate">{user?.email}</div>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 w-full transition-all"
//           >
//             <LogOut className="w-4 h-4" />Sign Out
//           </button>
//         </div>

//       </aside>

//       <main className="flex-1 overflow-auto">{children}</main>
//     </div>
//   );
// };

// export default Layout;
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Upload, Search, BarChart2, Shield,
  LogOut, ChevronDown, ChevronRight, Menu, X
} from 'lucide-react';
import API from '../../utils/api';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [casesOpen, setCasesOpen]     = useState(false);
  const [cases, setCases]             = useState([]);
  const [loadingCases, setLoadingCases] = useState(false);

  const onViz = location.pathname.startsWith('/visualizations');

  const handleLogout = () => { logout(); navigate('/'); };

  const handleVizClick = () => {
    // If sidebar is collapsed, open it first then show dropdown
    if (!sidebarOpen) {
      setSidebarOpen(true);
      setCasesOpen(true);
    } else {
      setCasesOpen(prev => !prev);
    }
    if (cases.length === 0) {
      setLoadingCases(true);
      API.get('/cases')
        .then(r => setCases(Array.isArray(r.data) ? r.data.slice(0, 10) : []))
        .catch(() => setCases([]))
        .finally(() => setLoadingCases(false));
    }
  };

  // Auto-load cases when on viz page
  useEffect(() => {
    if (onViz && cases.length === 0) {
      setLoadingCases(true);
      API.get('/cases')
        .then(r => setCases(Array.isArray(r.data) ? r.data.slice(0, 10) : []))
        .catch(() => setCases([]))
        .finally(() => setLoadingCases(false));
    }
  }, [onViz]);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload',    icon: Upload,          label: 'Upload Data' },
    { to: '/search',    icon: Search,          label: 'Search' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-950">

      {/* ── Sidebar ── */}
      <aside
        className={`
          relative flex flex-col bg-gray-900 border-r border-gray-800
          transition-all duration-300 ease-in-out flex-shrink-0
          ${sidebarOpen ? 'w-60' : 'w-16'}
        `}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          {sidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
        </button>

        {/* Logo */}
        <div className={`border-b border-gray-800 flex items-center gap-3 transition-all duration-300 ${sidebarOpen ? 'p-5' : 'p-4 justify-center'}`}>
          <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="font-semibold text-white text-sm whitespace-nowrap">Forensics AI</div>
              <div className="text-xs text-gray-500 whitespace-nowrap">Digital Assistant</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">

          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={!sidebarOpen ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${sidebarOpen ? '' : 'justify-center'}
                ${isActive
                  ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}

          {/* Visualizations */}
          <div>
            <button
              onClick={handleVizClick}
              title={!sidebarOpen ? 'Visualizations' : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${sidebarOpen ? '' : 'justify-center'}
                ${onViz
                  ? 'bg-cyan-500/10 text-cyan-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <BarChart2 className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left whitespace-nowrap">Visualizations</span>
                  {casesOpen
                    ? <ChevronDown className="w-3 h-3 flex-shrink-0" />
                    : <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  }
                </>
              )}
            </button>

            {/* Case dropdown — only when sidebar is open */}
            {casesOpen && sidebarOpen && (
              <div className="mt-1 ml-4 space-y-0.5">
                {loadingCases ? (
                  <div className="px-3 py-2 text-xs text-gray-500">Loading cases...</div>
                ) : cases.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-500">
                    No cases yet.{' '}
                    <button onClick={() => navigate('/upload')} className="text-cyan-400 hover:underline">
                      Upload one
                    </button>
                  </div>
                ) : (
                  cases.map(c => (
                    <button
                      key={c._id}
                      onClick={() => navigate(`/visualizations/${c._id}`)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-xs transition-all
                        ${location.pathname === `/visualizations/${c._id}`
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="truncate">{c.caseName}</div>
                      <div className="text-gray-600 text-[10px]">{c.caseNumber}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

        </nav>

        {/* User + Logout */}
        <div className={`border-t border-gray-800 transition-all duration-300 ${sidebarOpen ? 'p-4' : 'p-3'}`}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs font-bold flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-800 w-full transition-all"
              >
                <LogOut className="w-4 h-4" />Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                title={user?.name}
                className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs font-bold cursor-default"
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto">{children}</main>

    </div>
  );
};

export default Layout;