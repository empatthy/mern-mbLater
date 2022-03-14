import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem(storageName);
    if (data !== null) {
      const parsedData = JSON.parse(data);
      if (parsedData.token) {
        login(parsedData.token, parsedData.userId);
      }
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, userId, ready };
};
