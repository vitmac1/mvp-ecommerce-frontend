import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../config/routes";

// Sidebar.jsx
export function Sidebar() {
    return (
        <nav
            style={{
                width: "200px",
                height: "100vh", // preenche toda a altura da tela
                backgroundColor: "#222",
                color: "#fff",
                boxSizing: "border-box",
                margin: 0, // sem margem que empurre
                padding: "20px",
            }}
        >
            <h3 style={{ marginTop: 0 }}>Menu</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {routes.map(({ path, label }) => (
                    <li key={path} style={{ marginBottom: "10px" }}>
                        <Link
                            to={path}
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "bold",
                            }}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
