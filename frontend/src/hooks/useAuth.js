import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username');
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken !== token) setToken(storedToken);
    if (storedUsername !== username) setUsername(storedUsername);
  }, []);

  const login = useCallback((newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  }, []);

  return { token, username, login, logout };
};
