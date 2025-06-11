import ProductList from "../components/ProductList";
import ProductRegisterForm from "../components/ProductRegisterForm";
import UserRegisterForm from "../components/UserRegisterForm";

export const routes = [
    {
        path: "/user/userRegister",
        label: "Cadastro de Usuário",
        element: <UserRegisterForm />,
    },
    {
        path: "/product/productRegister",
        label: "Cadastro de Produto",
        element: <ProductRegisterForm />,
    },
    {
        path: "/product/productList",
        label: "Lista de Produtos",
        element: <ProductList />,
    },
];
