import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "./styles/app.css";
import { routes } from "./config/routes";
import { MainLayout } from "./components/MainLayout";
import Login from "./components/Login";

function App() {
    return (
        <Router>
            <Routes>
                {/* Rota pública para login */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                {/* Rotas protegidas dentro do layout principal */}
                <Route element={<MainLayout />}>
                    {routes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
