// MainLayout.jsx
import React from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

// MainLayout.jsx
export function MainLayout() {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                margin: 0,
                padding: 0,
            }}
        >
            <Sidebar />
            <main style={{ flexGrow: 1, padding: "20px" }}>
                <Outlet />
            </main>
        </div>
    );
}
