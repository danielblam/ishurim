import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [token, setToken] = useState(() => {
    return localStorage.getItem("sessiontoken") || null;
  });
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user") || null;
  })

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};