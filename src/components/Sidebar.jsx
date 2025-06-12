import { useContext } from "react";
import { Link } from "react-router-dom";
import { getRoutes } from "../config/routes";
import { AuthContext } from "../middleware/AuthContext";
import { LogoutButton } from "./LogoutButton";

export function Sidebar() {
    const { isAdmin } = useContext(AuthContext);
    const routes = getRoutes(isAdmin);

    return (
        <nav
            style={{
                width: "200px",
                height: "100vh",
                backgroundColor: "#222",
                color: "#fff",
                boxSizing: "border-box",
                margin: 0,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // posiciona o botão no rodapé
            }}
        >
            <div>
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
            </div>

            <LogoutButton />
        </nav>
    );
}
