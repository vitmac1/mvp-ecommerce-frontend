import React, { useState } from 'react';
import api from '../services/api';
import { buildFormData } from '../utils/formDataBuilder';

const ProductRegisterForm = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        const formData = buildFormData(form, 'image', imageFile);

        setLoading(true);

        try {
            await api.post('/product/registerUser', formData, {
    
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    
            setMessage('Produto cadastrado com sucesso!');
            setForm({ name: '', description: '', price: '', category: '' });
            setImageFile(null);
        } catch (error) {
            console.error(error);
            setMessage('Erro ao cadastrar produto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2>Cadastrar Produto</h2>
            {message && <p>{message}</p>}

            <label>Nome:
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>Descrição:
                <textarea name="description" value={form.description} onChange={handleChange} />
            </label>

            <label>Preço:
                <input type="number" name="price" value={form.price} onChange={handleChange} required />
            </label>

            <label>Categoria:
                <input type="text" name="category" value={form.category} onChange={handleChange} required />
            </label>

            <label>Imagem:
                <input type="file" accept="image/*" onChange={handleImageChange} required />
            </label>

            <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Cadastrar'}
            </button>
        </form>
        );
};

export default ProductRegisterForm;
