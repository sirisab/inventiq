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
    console.log("Logging out...");

    // Kontrollera om token är satt
    console.log("Token before logout:", token);

    setToken(null);

    // Kontrollera om token är uppdaterad till null
    console.log("Token after logout:", token);

    localStorage.removeItem("@library/token");

    // Kontrollera om localStorage är rensat
    console.log("Token removed from localStorage");
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
