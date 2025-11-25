import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface User { id: string; email: string; name?: string; }
interface AuthContextType { user: User | null; token: string | null; login: (token: string, user: User) => void; logout: () => void; }

export const AuthContext = createContext<AuthContextType>({
  user: null, token: null, login: () => {}, logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (t: string, u: User) => { setToken(t); setUser(u); };
  const logout = () => { setToken(null); setUser(null); };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};
