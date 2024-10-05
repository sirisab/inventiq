"use client";

import { createContext, useContext, useEffect, useState } from "react";

const defaultState = {
  user: null,
  token: null,
  setToken: () => {},
  logout: () => {},
};

const AuthContext = createContext(defaultState);

function AuthProvider({ children }) {
  const [token, setToken] = useState(defaultState.token);

  useEffect(() => {
    const savedToken = localStorage.getItem("@library/token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  function logout() {
    setToken(null);

    localStorage.removeItem("@library/token");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user: null,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
