import { useState, createContext } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const savedUser = localStorage.getItem("user");
  const [isAuthenticated, setIsAuthenticated] = useState(!!savedUser);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
