import React, { useState } from 'react';
import api from '../services/api';
import '../styles/UserRegisterForm.css';

const UserRegisterForm = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        cpf: '',
        address: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            await api.post('/user/registerUser', form);
            setMessage('Usuário cadastrado com sucesso!');
            setForm({ email: '', password: '', cpf: '', address: ''});
        } catch (err) {
            setMessage(err);
        }
    }

    return (
        <div className='user-register-container'>
            <h2 className='user-register-title'>Cadastro de Usuário</h2>
            {message && <p className='user-register-message'>{message}</p>}
            <form onSubmit={handleSubmit} className='user-register-form'>
                <div className='user-register-group'>
                    <label className='user-register-label'> Email: </label>
                    <input
                        type='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        className='user-register-input'
                        required
                    />
                </div>

                <div className='user-register-group'>
                    <label className='user-register-label'>Senha:</label>
                    <input
                        type='password'
                        name='password'
                        value={form.password}
                        onChange={handleChange}
                        className='user-register-input'
                        required
                    />
                </div>

                <div className='user-register-group'>
                    <label className='user-register-label'>CPF:</label>
                    <input
                        type='text'
                        name='cpf'
                        value={form.cpf}
                        onChange={handleChange}
                        className='user-register-input'
                        required
                    />
                </div>

                <div className='user-register-group'>
                    <label className='user-register-label'>Endereço:</label>
                    <input
                        type='text'
                        name='address'
                        value={form.address}
                        onChange={handleChange}
                        className='user-register-input'
                    />
                </div>

                <button type='submit' className='user-register-button'>Cadastrar</button>
            </form>
        </div>
    );
};

export default UserRegisterForm;