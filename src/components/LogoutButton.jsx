import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../middleware/AuthContext";

export function LogoutButton() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                width: "100%",
                marginTop: "20px",
            }}
        >
            Sair
        </button>
    );
}
