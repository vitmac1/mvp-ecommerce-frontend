import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FormLayout } from "../utils/FormLayout";

const UserRegisterForm = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        cpf: "",
        cep: "",
        address: "",
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setMessageType("");

        try {
            await api.post("/user/registerUser", form);
            showMessage("Usuário cadastrado com sucesso!", "sucess");
            setForm({ email: "", password: "", cpf: "", cep: "", address: "" });
        } catch (err) {
            showMessage(err, "error");
        }
    };

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 5000);
    };

    // Consulta ViaCEP quando o usuário terminar de digitar o CEP (blur)
    const handleCepBlur = async () => {
        const cep = form.cep.replace(/\D/g, ""); // só números

        if (cep.length !== 8) {
            showMessage("CEP inválido", "error");
            return;
        }

        try {
            const url = `https://viacep.com.br/ws/${cep}/json/`;
            const response = await fetch(url);

            const data = await response.json();

            if (data.erro) {
                showMessage("CEP não encontrado", "error");
                return;
            }

            // Monta o endereço (você pode ajustar o que quer incluir)
            const fullAddress = `${data.localidade} - ${data.uf}`;

            setForm((prevForm) => ({
                ...prevForm,
                address: fullAddress,
            }));

            showMessage("Endereço preenchido pelo CEP", "success");
        } catch (error) {
            showMessage(error, "error");
        }
    };

    return (
        <FormLayout title="Cadastro de Usuário">
            {message && (
                <p
                    className={`message ${
                        messageType === "success" ? "success" : "error"
                    }`}
                >
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="user-register-form">
                <label className="user-register-label">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="user-register-input"
                    required
                />
                <label className="user-register-label">Senha:</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="user-register-input"
                    required
                />

                <label className="user-register-label">CPF:</label>
                <input
                    type="text"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    className="user-register-input"
                    required
                />

                <label className="user-register-label">CEP:</label>
                <input
                    type="text"
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    onBlur={handleCepBlur}
                    className="user-register-input"
                    maxLength={9} // formato 00000-000
                    placeholder="Digite o CEP"
                    required
                />

                <label className="user-register-label">Endereço:</label>
                <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="user-register-input"
                />

                <button type="submit" className="user-register-button">
                    Cadastrar
                </button>
                <p>
                    Já possui conta? <Link to="/">Fazer Login</Link>
                </p>
            </form>
        </FormLayout>
    );
};

export default UserRegisterForm;
