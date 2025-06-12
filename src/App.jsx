import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/app.css";
import { MainLayout } from "./components/MainLayout";
import Login from "./components/Login";
import { getRoutes } from "./config/routes";
import { AuthProvider } from "./middleware/AuthProvider";
import { AuthContext } from "./middleware/AuthContext";

function AppRoutes() {
    const { isAdmin } = useContext(AuthContext);
    const routes = getRoutes(isAdmin);

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
                {routes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
