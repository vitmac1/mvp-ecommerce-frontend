import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/order-list.css";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/order/getOrders");
                setOrders(response.data);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="order-container">
            <div className="order-wrapper">
                <h2 className="order-title">Meus Pedidos</h2>

                {loading ? (
                    <p className="order-message">Carregando...</p>
                ) : orders.length === 0 ? (
                    <p className="order-message">Nenhum pedido encontrado.</p>
                ) : (
                    <div>
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Total</th>
                                    <th>Frete</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td>
                                            R$ {Number(order.total).toFixed(2)}
                                        </td>
                                        <td>
                                            R${" "}
                                            {Number(order.shippingCost).toFixed(
                                                2
                                            )}
                                        </td>
                                        <td>{order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
