import { createContext } from 'react';

export const AuthContext = createContext({
  token: null,
  userId: null,
  login: (jwtToken: any, id: any) => {},
  logout: () => {},
  isAuthenticated: false,
});
