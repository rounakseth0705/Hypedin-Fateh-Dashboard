import { createContext, useEffect, useState } from "react";
import API from "../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [ambassador, setAmbassador] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await API.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response && response.data) {
        if (response.data.success) {
          toast.success("Logged in successfully!");

          setUser(response.data.user);
          setIsLoggedIn(true);
          if (response.data.user.role === "Ambassador") {
            setAmbassador(response.data.ambassador);
            navigate("/ambassador");
          } else if (response.data.user.role === "Admin") {
            navigate("/adminDashboard");
          }
        } else {
          toast.error(response.data.message || "Invalid credentials.");
        }
      } else {
        toast.error("Something went wrong with the server response.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to log in. Please try again."
      );
    }
  };

  const verifyUser = async () => {
    try {
      const response = await API.get("/auth/verifyMe");

      if (response && response.data?.success) {
        setUser(response.data.user);
        if (response.data.user.role === "Ambassador") {
          setAmbassador(response.data.ambassador);
        }
        setIsLoggedIn(true);
      }
    } catch (error) {
      await API.post("/auth/logout");
      // Optional: notify session expired only if user was previously interacting
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const value = {
    login,
    isLoggedIn,
    ambassador,
    user,
    isCheckingAuth,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthProvider;