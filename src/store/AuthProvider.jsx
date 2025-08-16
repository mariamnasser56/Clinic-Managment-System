import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/baseURL";

const storedUser = JSON.parse(sessionStorage.getItem("user"));
const storedToken = sessionStorage.getItem("token");

function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  const isAuthenticated = !!token;

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) sessionStorage.setItem("token", token);
    else sessionStorage.removeItem("token");
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      toast.error(error || "Login Failed");
      return;
    }

    const data = await response.json();
    setUser({ email: data.email });
    setToken(data.token);
    toast.success("Login success");

    return data.token;
  };

  const register = async (fullName, email, password, birthDate, gender) => {
    const response = await fetch(`${BASE_URL}/Auth/register-patient`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, birthDate, gender }),
    });
    const data = await response.json();

    if (!response.ok) {
      if (Array.isArray(data) && data.length > 0) {
        toast.error(data[0].description || "Regiseration Failed");
      } else {
        toast.error("Registration failed");
      }
      return false;
    }

    setUser({ email: data.email });
    setToken(data.token);
    toast.success("Registration Success");
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  const contextValue = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
