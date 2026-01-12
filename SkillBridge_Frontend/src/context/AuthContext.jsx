import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSellerMode, setIsSellerMode] = useState(false);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('skillbridge_user');
    const savedMode = localStorage.getItem('seller_mode') === 'true';
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsSellerMode(savedMode);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('skillbridge_user');
        localStorage.removeItem('seller_mode');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call - Replace with real API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email.endsWith('@ucp.edu.pk')) {
          reject(new Error('Only UCP email addresses allowed'));
          return;
        }

        if (password.length < 6) {
          reject(new Error('Invalid credentials'));
          return;
        }

        const mockUser = {
          _id: 'user_' + Date.now(),
          email,
          name: email.split('@')[0],
          department: 'Computer Science',
          year: 3,
          isVerified: true,
          createdAt: new Date().toISOString()
        };

        setUser(mockUser);
        localStorage.setItem('skillbridge_user', JSON.stringify(mockUser));
        localStorage.setItem('seller_mode', 'false');
        
        resolve(mockUser);
      }, 1000);
    });
  };

  const register = async (userData) => {
    // Simulate API call - Replace with real API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!userData.email.endsWith('@ucp.edu.pk')) {
          reject(new Error('Only UCP email addresses allowed'));
          return;
        }

        const mockUser = {
          _id: 'user_' + Date.now(),
          ...userData,
          isVerified: true,
          createdAt: new Date().toISOString()
        };

        setUser(mockUser);
        localStorage.setItem('skillbridge_user', JSON.stringify(mockUser));
        localStorage.setItem('seller_mode', 'false');
        
        resolve(mockUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsSellerMode(false);
    localStorage.removeItem('skillbridge_user');
    localStorage.removeItem('seller_mode');
  };

  const toggleSellerMode = () => {
    const newMode = !isSellerMode;
    setIsSellerMode(newMode);
    localStorage.setItem('seller_mode', newMode.toString());
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isSellerMode,
    toggleSellerMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};