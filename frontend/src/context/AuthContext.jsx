import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check local storage for existing session (mock)
    const storedUser = localStorage.getItem('site_ops_user');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('site_ops_user');
      return null;
    }
  });
  const [loading] = useState(false);

  const login = async (email, tenantId) => {
    // Mock login logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !tenantId) {
          reject('Invalid credentials');
          return;
        }

        // Simulating role based on email for testing
        let role = 'VIEWER';
        if (email.includes('admin')) role = 'SUPER_ADMIN';
        else if (email.includes('manager')) role = 'PROJECT_MANAGER';
        else if (email.includes('engineer')) role = 'SITE_ENGINEER';
        else if (email.includes('store')) role = 'STORE_KEEPER';

        const userData = {
          id: 'u-' + Date.now(),
          name: email.split('@')[0],
          email,
          role,
          tenantId
        };

        setUser(userData);
        localStorage.setItem('site_ops_user', JSON.stringify(userData));
        resolve(userData);
      }, 800);
    });
  };

  const signup = async (companyName, name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password || !companyName) {
          reject('All fields are required');
          return;
        }

        const tenantId = companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const userData = {
          id: 'u-' + Date.now(),
          name,
          email,
          role: 'SUPER_ADMIN', // New signups are always admins of their tenant
          tenantId
        };

        setUser(userData);
        localStorage.setItem('site_ops_user', JSON.stringify(userData));
        resolve(userData);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('site_ops_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
