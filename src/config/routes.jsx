import OrderList from "../components/OrderList";
import ProductList from "../components/ProductList";
import ProductRegisterForm from "../components/ProductRegisterForm";
import UserRegisterForm from "../components/UserRegisterForm";

export const getRoutes = (isAdmin) => [
    {
        path: "/product/productList",
        label: "Lista de Produtos",
        element: <ProductList />,
    },
    {
        path: "/user/userRegister",
        label: "Cadastro de Usuário",
        element: <UserRegisterForm />,
    },
    {
        path: "/orders/ordersList",
        label: "Meus Pedidos",
        element: <OrderList />,
    },
    ...(isAdmin
        ? [
              {
                  path: "/product/productRegister",
                  label: "Cadastro de Produto",
                  element: <ProductRegisterForm />,
              },
          ]
        : []),
];
