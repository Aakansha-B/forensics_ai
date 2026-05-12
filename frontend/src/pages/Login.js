// // pages/Login.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import { Shield, Eye, EyeOff } from 'lucide-react';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(form.email, form.password);
//       toast.success('Welcome back!');
//       navigate('/dashboard');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-4">
//             <Shield className="w-6 h-6 text-cyan-400" />
//           </div>
//           <h1 className="text-2xl font-bold text-white">Investigator Login</h1>
//           <p className="text-gray-400 text-sm mt-1">Access the Forensics AI Dashboard</p>
//         </div>
//         <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs text-gray-400 mb-1.5">Email</label>
//               <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="investigator@dept.gov"
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors" required />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-400 mb-1.5">Password</label>
//               <div className="relative">
//                 <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••"
//                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors pr-10" required />
//                 <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-300">
//                   {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>
//             <button type="submit" disabled={loading}
//               className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
//               {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
//             </button>
//           </form>
//           <p className="text-center text-gray-500 text-sm mt-6">Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300">Register</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-4">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Investigator Login</h1>
          <p className="text-gray-400 text-sm mt-1">
            Access the Forensics AI Dashboard
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="investigator@dept.gov"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm pr-10 focus:outline-none focus:border-cyan-500"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2.5 rounded-lg flex justify-center items-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}