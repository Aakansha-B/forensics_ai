// // context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchUser = async () => {
//     try {
//       const { data } = await axios.get('/api/auth/me');
//       setUser(data.user);
//     } catch {
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const { data } = await axios.post('/api/auth/login', { email, password });
//     localStorage.setItem('token', data.token);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
//     setToken(data.token);
//     setUser(data.user);
//     return data;
//   };

//   const register = async (formData) => {
//     const { data } = await axios.post('/api/auth/register', formData);
//     localStorage.setItem('token', data.token);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
//     setToken(data.token);
//     setUser(data.user);
//     return data;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout, token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data.user);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });

    localStorage.setItem('token', data.token);
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);

    localStorage.setItem('token', data.token);
    API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);