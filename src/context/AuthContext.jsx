import { createContext, useContext, useState, useCallback } from 'react';
import { users } from '../mock/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password, role) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    const mockUser = users[role] || users.seller;
    setUser({ ...mockUser, role });
    setIsLoading(false);
    return mockUser;
  }, []);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const mockUser = users[data.role] || users.seller;
    setUser({ ...mockUser, ...data });
    setIsLoading(false);
    return mockUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
