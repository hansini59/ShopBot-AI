
import { useState, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`
    };
    
    login(newUser);
    return newUser;
  }, [login]);

  const signIn = useCallback(async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`
    };
    
    login(existingUser);
    return existingUser;
  }, [login]);

  return {
    user,
    login,
    logout,
    signup,
    signIn
  };
};
