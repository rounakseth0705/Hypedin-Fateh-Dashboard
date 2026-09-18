import { createContext, useEffect, useState } from "react";
import API from "../config/api";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
                        navigate("/ambassador");
                    } else if (response.data.user.role === "Admin") {
                        setUser(response.data.user);
                        setAdmin(response.data.admin);
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
    useEffect(() => {

    },[]);
    const value = {
        login,
        isLoggedIn,
        ambassador,
        admin,
        user
    }
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default AuthProvider;