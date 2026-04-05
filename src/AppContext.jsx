import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [token, setToken] = useState(() => {
    return localStorage.getItem("sessiontoken") || null;
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userid") || null;
  })

  return (
    <AppContext.Provider value={{ token, setToken, userId, setUserId }}>
      {children}
    </AppContext.Provider>
  );
};