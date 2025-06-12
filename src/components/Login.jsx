import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FormLayout } from "../utils/FormLayout";
import "../styles/login.css";
import { AuthContext } from "../middleware/AuthContext";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await api.post("/user/login", form),
                { token, admin } = response.data;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("cartCount", 0);

                login(admin);

                navigate("/product/productList");
            } else {
                setMessage("Login falhou. Verifique email e senha.");
            }
        } catch (error) {
            setMessage(error);
        }
    };

    return (
        <FormLayout title="Login">
            {message && <p className="login-message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <label>Senha:</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Entrar</button>

                {/* Link para cadastro */}
                <p>
                    Não tem conta?{" "}
                    <Link to="/user/userRegister">Cadastre-se aqui</Link>
                </p>
            </form>
        </FormLayout>
    );
};

export default Login;
