import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              padding: "12px 16px",
              fontSize: "0.875rem",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#059669",
                secondary: "#ecfdf5",
              },
              style: {
                border: "1px solid #a7f3d0",
                backgroundColor: "#f0fdf4",
                color: "#065f46",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fef2f2",
              },
              style: {
                border: "1px solid #fecaca",
                backgroundColor: "#fef2f2",
                color: "#991b1b",
              },
            },
          }}
        />
        <Outlet />
      </AuthProvider>
    </>
  );
};

export default App;