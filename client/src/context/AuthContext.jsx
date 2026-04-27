import { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const stored = localStorage.getItem('unilance_user');

      if (!stored) {
        setLoading(false);
        return;
      }

      let parsedUser;
      try {
        parsedUser = JSON.parse(stored);
      } catch {
        // Malformed JSON in localStorage — clear it
        localStorage.removeItem('unilance_user');
        setLoading(false);
        return;
      }

      // Validate that parsed data is a proper user object with a token
      if (!parsedUser || typeof parsedUser !== 'object' || !parsedUser.token) {
        localStorage.removeItem('unilance_user');
        setLoading(false);
        return;
      }

      // Immediately set cached user so the UI doesn't flash to login
      setUser(parsedUser);

      try {
        // Refresh user data from server
        const { data } = await getMe();
        const hydratedUser = { ...parsedUser, ...data, token: parsedUser.token };
        setUser(hydratedUser);
        localStorage.setItem('unilance_user', JSON.stringify(hydratedUser));
      } catch (err) {
        // If 401/403, token is expired/invalid — log out
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setUser(null);
          localStorage.removeItem('unilance_user');
        }
        // For network errors (no response), keep the cached user
        // This allows offline/slow-loading scenarios to still work
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('unilance_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unilance_user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('unilance_user', JSON.stringify(updated));
  };

  const refreshUser = async () => {
    if (!user?.token) {
      return null;
    }

    const { data } = await getMe();
    const refreshedUser = { ...user, ...data };
    setUser(refreshedUser);
    localStorage.setItem('unilance_user', JSON.stringify(refreshedUser));
    return refreshedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
