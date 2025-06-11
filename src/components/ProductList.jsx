import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/product-list.css";
import "../styles/form-layout.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [cartCount, setCartCount] = useState(() => {
        // Tenta recuperar do localStorage ao iniciar
        const saved = localStorage.getItem("cartCount");
        return saved ? parseInt(saved, 10) : 0;
    });
    const [cartItems, setCartItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const total = cartItems.reduce((acc, item) => {
        const price = item.Product?.price || 0;
        return acc + item.quantity * price;
    }, 0);

    const url = "http://localhost:3000/uploads";

    useEffect(() => {
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
    }, []);

    const handleAddToCart = async (productId) => {
        const quantity = quantities[productId] || 1;

        try {
            // Exemplo: enviar o id do produto para o backend adicionar ao carrinho
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
            setIsModalOpen(true); // abre o modal após buscar os itens
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

                {loading && (
                    <p className="product-list-message">
                        Carregando produtos...
                    </p>
                )}

                {!loading && message && (
                    <p className="product-list-message sucess">{message}</p>
                )}

                {!loading && products.length === 0 && !message && (
                    <p className="product-list-message">
                        Nenhum produto cadastrado.
                    </p>
                )}

                {!loading && products.length > 0 && (
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
                            {products.map((prod) => (
                                <tr key={prod.id}>
                                    <td>
                                        {prod.image && (
                                            <img
                                                src={`${url}/${prod.image}`}
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
                    style={{
                        content: {
                            top: "50%",
                            left: "50%",
                            right: "auto",
                            bottom: "auto",
                            marginRight: "-50%",
                            transform: "translate(-50%, -50%)",
                            padding: "20px",
                            maxWidth: "600px",
                            width: "90%",
                            backgroundColor: "#fff",
                            color: "#000",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        },
                        overlay: {
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1000,
                        },
                    }}
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
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th
                                                style={{
                                                    padding: "8px",
                                                    textAlign: "left",
                                                    width: "80px",
                                                }}
                                            >
                                                Imagem
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px",
                                                    textAlign: "left",
                                                }}
                                            >
                                                Produto
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px",
                                                    textAlign: "center",
                                                    width: "100px",
                                                }}
                                            >
                                                Quantidade
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px",
                                                    textAlign: "right",
                                                    width: "100px",
                                                }}
                                            >
                                                Preço Unitário
                                            </th>
                                            <th
                                                style={{
                                                    padding: "8px",
                                                    textAlign: "right",
                                                    width: "100px",
                                                }}
                                            >
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => {
                                            const preco =
                                                item.Product?.price || 0;
                                            const total = preco * item.quantity;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #ccc",
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {item.Product
                                                            ?.image && (
                                                            <img
                                                                src={`http://localhost:3000/uploads/${item.Product.image}`}
                                                                alt={
                                                                    item.Product
                                                                        .name ||
                                                                    item.Product
                                                                        .nome
                                                                }
                                                                style={{
                                                                    width: "70px",
                                                                    height: "70px",
                                                                    objectFit:
                                                                        "contain",
                                                                    borderRadius:
                                                                        "6px",
                                                                    backgroundColor:
                                                                        "#fff",
                                                                    margin: "0 auto",
                                                                }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            verticalAlign:
                                                                "middle",
                                                        }}
                                                    >
                                                        {item.Product?.name ||
                                                            item.Product?.nome}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            textAlign: "center",
                                                            verticalAlign:
                                                                "middle",
                                                        }}
                                                    >
                                                        {item.quantity}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            textAlign: "right",
                                                            verticalAlign:
                                                                "middle",
                                                        }}
                                                    >
                                                        {preco.toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }
                                                        )}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            textAlign: "right",
                                                            verticalAlign:
                                                                "middle",
                                                        }}
                                                    >
                                                        {total.toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                style: "currency",
                                                                currency: "BRL",
                                                            }
                                                        )}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    item.Product
                                                                        ?.id
                                                                )
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#ff4d4f",
                                                                color: "#fff",
                                                                border: "none",
                                                                borderRadius:
                                                                    "4px",
                                                                padding:
                                                                    "4px 8px",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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
                        Total: R${" "}
                        {total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </div>
                    <button onClick={() => setIsModalOpen(false)}>
                        Fechar
                    </button>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                        }}
                    >
                        <button onClick={() => setIsModalOpen(false)}>
                            Fechar
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default ProductList;
