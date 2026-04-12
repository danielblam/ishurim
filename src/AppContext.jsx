import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [token, setToken] = useState(() => {
    return localStorage.getItem("sessiontoken") || null;
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userid") || null;
  })
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || null;
  })

  return (
    <AppContext.Provider value={{ token, setToken, userId, setUserId, username, setUsername}}>
      {children}
    </AppContext.Provider>
  );
};