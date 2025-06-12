import { useState, useEffect } from "react";
import Modal from "react-modal";
import api from "../services/api";
import "../styles/checkout-form.css";

const CheckoutForm = ({ total, onClose }) => {
    const [form, setForm] = useState({
        cep: "",
        shippingAddress: "",
        shippingCost: null,
        name: "",
        paymentMethod: "",
    });
    const [mensagem, setMensagem] = useState(null);
    const [totalPedido, setTotalPedido] = useState(0);

    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                setMensagem(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleEndereco = async () => {
        const randomFrete = (Math.random() * 50).toFixed(2);

        setForm((prev) => ({
            ...prev,
            shippingCost: parseFloat(randomFrete),
        }));

        setTotalPedido(total + parseFloat(randomFrete));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            api.post("/order/createOrder", form);

            setMensagem({
                tipo: "success",
                texto: "Pedido criado com sucesso!",
            });

            localStorage.setItem("cartCount", 0);

            window.dispatchEvent(
                new CustomEvent("cartCountChanged", { detail: 0 })
            );
        } catch (err) {
            setMensagem({ tipo: "error", texto: err });
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Checkout"
            className="customModal"
            overlayClassName="customOverlay"
        >
            <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
                Finalizar Pedido
            </h2>

            <form onSubmit={handleSubmit} className="checkoutForm">
                <label>Nome destinatário:</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Digite seu nome"
                    required
                />

                <label>CEP:</label>
                <input
                    type="text"
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    placeholder="Digite o CEP"
                    maxLength={9}
                    required
                />

                <label>Endereço:</label>
                <input
                    type="text"
                    name="shippingAddress"
                    value={form.shippingAddress}
                    onChange={handleChange}
                    onBlur={handleEndereco}
                    placeholder="Endereço de entrega"
                    required
                />

                {form.shippingCost !== null && (
                    <div>
                        <strong>Frete estimado:</strong> R${" "}
                        {form.shippingCost.toFixed(2)}
                    </div>
                )}

                <label>Valor total de produtos:</label>
                <input
                    type="text"
                    value={total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    readOnly
                />

                <label>Total:</label>
                <input
                    type="text"
                    value={totalPedido.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    readOnly
                />

                <label>Forma de pagamento:</label>
                <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Selecione
                    </option>
                    <option value="cartaoCredito">Cartão de Crédito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="pix">PIX</option>
                    <option value="dinheiro">Dinheiro</option>
                </select>

                {mensagem && (
                    <div
                        className={
                            mensagem.tipo === "success"
                                ? "successMessage"
                                : "errorMessage"
                        }
                    >
                        {mensagem.texto}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={
                        !form.shippingAddress ||
                        !form.shippingCost ||
                        !form.paymentMethod
                    }
                    className="confirmButton"
                >
                    Confirmar Pedido
                </button>
            </form>
        </Modal>
    );
};

export default CheckoutForm;
