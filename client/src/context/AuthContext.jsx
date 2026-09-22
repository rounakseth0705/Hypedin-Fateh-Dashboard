import { createContext, useEffect, useState } from "react";
import API from "../config/api";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [user, setUser] = useState(null);
    const [ambassador, setAmbassador] = useState(null);
    const [admin, setAdmin] = useState(null);
    const login = async (email,password) => {
        try {
            const response = await API.post("/auth/login", { email, password },{ withCredentials: true });
            // Handle successful login (e.g., save token, redirect, etc.)
            if (response) {
                console.log(response);
                if (response.data.success) {
                    if (response.data.user.role === "Ambassador") {
                        setUser(response.data.user);
                        setAmbassador(response.data.ambassador);
                        setIsLoggedIn(true);
                        navigate("/ambassador");
                    } else if (response.data.user.role === "Admin") {
                        setUser(response.data.user);
                        setAdmin(response.data.admin);
                        setIsLoggedIn(true);
                        navigate("/adminDashboard");
                    }
                } else {
                    console.log(response.data.message);
                }
            } else {
                console.log("Something went wrong");
            }
        } catch(error) {
            console.log(error.message);
        }
    }

    const verifyUser = async () => {
        try {
            const response = await API.get("/auth/verifyMe");

            if (response) {
                if (response.data.success) {
                    setUser(response.data.user);
                    if (response.data.user.role === "Admin") {
                        setAdmin(response.data.admin);
                    } else {
                        setAmbassador(response.data.ambassador);
                    }
                    setIsLoggedIn(true);
                }
            }
        } catch(error) {
            await API.post("/auth/logout");
        } finally {
            setIsCheckingAuth(false);
        }
    }
    useEffect(() => {
        verifyUser();
    },[]);
    const value = {
        login,
        isLoggedIn,
        ambassador,
        admin,
        user,
        isCheckingAuth
    }
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default AuthProvider;