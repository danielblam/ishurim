import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [token, setToken] = useState(() => {
    return localStorage.getItem("sessiontoken") || null;
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  })
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  })

  return (
    <AppContext.Provider value={{ token, setToken, username, setUsername, role, setRole}}>
      {children}
    </AppContext.Provider>
  );
};