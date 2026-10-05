import { createContext, useState, type ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'PARTNER';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // আসল ব্যাকএন্ড API কল করার ফাংশন
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // টোকেন এবং ইউজার ডেটা সেভ করা
      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      alert('Login Successful!');
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};