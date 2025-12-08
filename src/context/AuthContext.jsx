import { createContext, useContext, useState, useEffect } from "react";

// 1. create the context (the 'radio station')
const AuthContext = createContext();

// 2. create the provider component (the 'radio tower')
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // check for saved token on initial app load
  useEffect(() => {
    const storedToken = localStorage.getItem("site_token");
    const storedUser = localStorage.getItem("site_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // -- Actions --
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    // persist to local storage so refresh doesn't log them out
    localStorage.setItem("site_token", authToken);
    localStorage.setItem("site_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("site_token");
    localStorage.removeItem("site_user");
  };

  // the value object is what will be accessible to any component using useAuth()
  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. create the custom hook (the 'radio receiver')
// this is what we import in other files as: import { useAuth } from ...
export const useAuth = () => {
  return useContext(AuthContext);
};
