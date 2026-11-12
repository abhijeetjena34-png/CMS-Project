import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('cms_admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Verify token is still valid on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('cms_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setAdmin(data.admin);
        localStorage.setItem('cms_admin', JSON.stringify(data.admin));
      } catch {
        // Token invalid — clear storage
        localStorage.removeItem('cms_token');
        localStorage.removeItem('cms_admin');
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cms_token', data.token);
    localStorage.setItem('cms_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cms_token');
    localStorage.removeItem('cms_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

