import { useState } from "react";
import api from "../services/api";
import { buildFormData } from "../utils/formDataBuilder";
import { FormLayout } from "../utils/FormLayout";

const ProductRegisterForm = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        const formData = buildFormData(form, "image", imageFile);

        setLoading(true);

        try {
            await api.post("/product/createProduct", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("Produto cadastrado com sucesso!");
            setForm({ name: "", description: "", price: "", category: "" });
            setImageFile(null);
        } catch (error) {
            console.error(error);
            setMessage("Erro ao cadastrar produto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormLayout title="Cadastrar Produto">
            {message && <p className="product-register-message">{message}</p>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>
                    Nome:
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Descrição:
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Preço:
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Categoria:
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Imagem:
                    <input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imageFile && (
                        <span className="file-name">{imageFile.name}</span>
                    )}
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Cadastrar"}
                </button>
            </form>
        </FormLayout>
    );
};

export default ProductRegisterForm;
