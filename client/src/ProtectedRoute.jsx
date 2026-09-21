import { useContext } from "react";
import { UserContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isCheckingAuth } = useContext(UserContext);

    if (isCheckingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
        );
    }

    return isLoggedIn
        ? children
        : <Navigate to="/" replace />;
};

export default ProtectedRoute;