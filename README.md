# Nome do Projeto

mvp_ecommerce-frontend

Aplicação frontend em React para gerenciamento de produtos, carrinho, checkout e autenticação.

## Tecnologias Utilizadas

-   React 18+
-   React Router Dom (v6+)
-   Axios (ou fetch) para comunicação com API
-   Context API para gerenciamento de autenticação
-   CSS Modules / CSS externo para estilos
-   React Modal para modais

## Funcionalidades Principais

-   Autenticação com login/logout usando JWT armazenado no localStorage
-   Menu lateral (sidebar) dinâmico conforme permissão (admin ou usuário)
-   Rotas protegidas via React Router
-   Formulário de checkout com cálculo de frete simulado
-   Armazenamento e controle do carrinho (ex: contador no localStorage e contexto)
-   Feedback visual (mensagens de sucesso/erro)
-   Modal para finalizar pedido

---

## Como Rodar Localmente

### Pré-requisitos

-   Node.js 16+ instalado
-   Backend rodando e acessível (API REST)

### Passos

1. Clone o repositório:

```bash
git clone https://github.com/vitmac1/mvp-ecommerce-frontend.git
cd mvp-ecommerce-frontend
```

2. Instale as dependências:

npm install ou yarn install

3. Configure a URL base da API do backend no .ENV:

VITE_API_URL=http://localhost:3000

4.Inicie a aplicação:

npm start ou yarn start

Estrutura de Pastas

/src
/components # Componentes reutilizáveis (Sidebar, LogoutButton, etc.)
/pages # Páginas e rotas (Login, ProductList, Checkout, etc.)
/services # Configuração API (axios) e chamadas ao backend
/styles # Arquivos CSS globais ou módulos CSS
/middleware # Contextos (AuthContext), hooks personalizados
/utils # Funções auxiliares, layouts (ex: FormLayout)

Rotas Principais

O sistema possui as seguintes rotas configuradas, sendo que algumas são exclusivas para usuários administradores:

/product/productList Lista de Produtos Todos
/user/userRegister Cadastro de Usuário Todos
/orders/ordersList Meus Pedidos Todos
/product/productRegister Cadastro de Produto Somente admin
