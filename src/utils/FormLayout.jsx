import React from "react";
import "../styles/form-layout.css";

export function FormLayout({ title, children }) {
    return (
        <div className="page-center">
            <div className="form-container">
                {title && <h2>{title}</h2>}
                {children}
            </div>
        </div>
    );
}
