import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/product-list.css";
import "../styles/form-layout.css";
import Modal from "react-modal";
import CheckoutForm from "./CheckoutForm";

Modal.setAppElement("#root");

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [cartCount, setCartCount] = useState(() => {
        const saved = localStorage.getItem("cartCount");
        return saved ? parseInt(saved, 10) : 0;
    });
    const [cartItems, setCartItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const total = cartItems.reduce((acc, item) => {
        const price = item.Product?.price || 0;
        return acc + item.quantity * price;
    }, 0);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handleCartCountChanged = (e) => {
            setCartCount(e.detail);
            localStorage.setItem("cartCount", 0);
        };

        window.addEventListener("cartCountChanged", handleCartCountChanged);

        const fetchProducts = async () => {
            try {
                const response = await api.get("/product/getAllProducts", {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                setProducts(response.data || []);
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
                setMessage("Erro ao carregar os produtos.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            window.removeEventListener(
                "cartCountChanged",
                handleCartCountChanged
            );
        };
    }, []);

    const filteredProducts = products.filter((prod) => {
        return (
            prod.id.toString().includes(query.toLowerCase()) ||
            (prod.name?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
            (prod.category?.toLowerCase().includes(query.toLowerCase()) ??
                false)
        );
    });

    const handleAddToCart = async (productId) => {
        const quantity = quantities[productId] || 1;

        try {
            const response = await api.post("/cart/addToCart", {
                productId,
                quantity,
            });

            if (response.status === 200) {
                incrementCartCount(quantity);

                setMessage("Produto adicionado ao carrinho!");
            } else {
                setMessage("Erro ao adicionar o produto.");
            }
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            setMessage("Erro ao adicionar o produto.");
        }
    };

    const handleQuantityChange = async (productId, value) => {
        const quantidade = parseInt(value, 10);
        if (quantidade >= 1) {
            setQuantities((prev) => ({ ...prev, [productId]: quantidade }));
        }
    };

    const incrementCartCount = (quantity) => {
        setCartCount((prev) => {
            const newCount = prev + quantity;
            localStorage.setItem("cartCount", newCount);
            return newCount;
        });
    };

    const fetchCartItems = async () => {
        try {
            const response = await api.get("/cart/getCartByUserId");
            setCartItems(response.data || []);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Erro ao buscar itens do carrinho", error);
            setMessage("Erro ao buscar itens do carrinho");
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            const url = `http://localhost:3000/cart/deleteCart/${productId}`;

            await api.delete(url);

            // Atualiza o estado removendo o item com base no productId
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.Product?.id !== productId)
            );
        } catch (error) {
            console.error("Erro ao remover item do carrinho:", error);
        }
    };

    return (
        <div className="page-center">
            <div className="product-list-container">
                <h2 className="product-list-title">Lista de Produtos</h2>

                {/* Barra de busca */}
                <input
                    type="text"
                    placeholder="Buscar por id, nome, descrição ou categoria..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        padding: "8px",
                        marginBottom: "20px",
                        width: "100%",
                    }}
                />

                {loading && (
                    <p className="product-list-message">
                        Carregando produtos...
                    </p>
                )}

                {!loading && message && (
                    <p className="product-list-message sucess">{message}</p>
                )}

                {!loading && filteredProducts.length === 0 && !message && (
                    <p className="product-list-message">
                        Nenhum produto cadastrado.
                    </p>
                )}

                {!loading && filteredProducts.length > 0 && (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Imagem</th>
                                <th>Nome</th>
                                <th>Preço</th>
                                <th>Categoria</th>
                                <th>Quantidade</th>
                                <th>Carrinho</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((prod) => (
                                <tr key={prod.id}>
                                    <td>
                                        {prod.image && (
                                            <img
                                                src={`http://localhost:3000/uploads/${prod.image}`}
                                                alt={prod.name || prod.nome}
                                            />
                                        )}
                                    </td>
                                    <td>{prod.name || prod.nome}</td>
                                    <td>
                                        R${" "}
                                        {Number(
                                            prod.price || prod.preco
                                        )?.toFixed(2)}
                                    </td>
                                    <td>{prod.category || prod.categoria}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[prod.id] || 1}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    prod.id,
                                                    e.target.value
                                                )
                                            }
                                            style={{ width: "60px" }}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleAddToCart(prod.id)
                                            }
                                        >
                                            Adicionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <button onClick={fetchCartItems}>
                    🛒 Ver Carrinho ({cartCount})
                </button>

                <div className="cart-counter">
                    🛒 Carrinho: {cartCount} item{cartCount !== 1 ? "s" : ""}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Itens do Carrinho"
                    className="modal-content"
                    overlayClassName="modal-overlay"
                >
                    <h2>Itens no Carrinho</h2>
                    {cartItems.length === 0 ? (
                        <p>Seu carrinho está vazio.</p>
                    ) : (
                        <>
                            <div
                                style={{
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                }}
                            >
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <th>Imagem</th>
                                            <th>Nome</th>
                                            <th>Quantidade</th>
                                            <th>Preço Unitário</th>
                                            <th>Subtotal</th>
                                            <th>Remover</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                style={{
                                                    borderBottom:
                                                        "1px solid #ccc",
                                                }}
                                            >
                                                <td>
                                                    {item.Product?.image && (
                                                        <img
                                                            src={`http://localhost:3000/uploads/${item.Product.image}`}
                                                            alt={
                                                                item.Product
                                                                    .name ||
                                                                item.Product
                                                                    .nome
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    {item.Product?.name ||
                                                        item.Product?.nome}
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    {(
                                                        item.Product?.price || 0
                                                    ).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </td>
                                                <td>
                                                    {(
                                                        (item.Product?.price ||
                                                            0) *
                                                        (item.quantity || 0)
                                                    ).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    })}
                                                </td>
                                                <td>
                                                    <button
                                                        className="remove-btn"
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                item.Product?.id
                                                            )
                                                        }
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    <div
                        style={{
                            marginTop: "16px",
                            textAlign: "right",
                            fontWeight: "bold",
                            fontSize: "16px",
                        }}
                    >
                        Total:{" "}
                        {total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </div>
                    <div className="modal-actions">
                        <button
                            className="modal-close-btn"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Fechar
                        </button>
                        <button
                            className="modal-checkout-btn"
                            onClick={() => {
                                setIsModalOpen(false);
                                setIsCheckoutOpen(true);
                            }}
                        >
                            Finalizar Pedido
                        </button>
                    </div>
                </Modal>

                {isCheckoutOpen && (
                    <CheckoutForm
                        total={total}
                        onClose={() => setIsCheckoutOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductList;
