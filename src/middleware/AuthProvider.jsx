import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(
        localStorage.getItem("admin") === "true"
    );

    const login = (admin) => {
        localStorage.setItem("admin", admin);
        setIsAdmin(admin);
    };

    const logout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
        setIsAdmin(false);
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAdmin(localStorage.getItem("admin") === "true");
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
