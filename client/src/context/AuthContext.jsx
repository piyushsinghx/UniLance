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

      try {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);

        if (parsedUser?.token) {
          const { data } = await getMe();
          const hydratedUser = { ...parsedUser, ...data, token: parsedUser.token };
          setUser(hydratedUser);
          localStorage.setItem('unilance_user', JSON.stringify(hydratedUser));
        }
      } catch {
        setUser(null);
        localStorage.removeItem('unilance_user');
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
