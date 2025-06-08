import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/ProductListForm.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/product/getAllProducts');
                setProducts(response.data || []);
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setMessage('Erro ao carregar os produtos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="product-list-container">
            <h2 className="product-list-title">Lista de Produtos</h2>

            {loading && <p className="product-list-message">Carregando produtos...</p>}

            {!loading && message && (
                <p className="product-list-message error">{message}</p>
            )}

            {!loading && products.length === 0 && !message && (
                <p className="product-list-message">Nenhum produto cadastrado.</p>
            )}

            {!loading && products.length > 0 && (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Categoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((prod) => (
                            <tr key={prod.id}>
                                <td>
                                    {prod.image && (
                                    <img
                                        src={`http://localhost:3000/uploads/${prod.image}`}
                                        alt={prod.name || prod.nome}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'cover', borderRadius: 4 }}
                                    />
                                    )}
                                </td>
                                <td>{prod.name || prod.nome}</td>
                                <td>R$ {Number(prod.price || prod.preco)?.toFixed(2)}</td>
                                <td>{prod.category || prod.categoria}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductList;
