import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // 1. LA LÓGICA: Se agrega antes del return
  const handleLogout = () => {
    localStorage.removeItem('token'); // Borra el JWT del navegador
    window.location.href = '/login';   // Redirige al login y refresca la app
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🛒 SISTEMA VENTAS</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
            <Link className="nav-link" to="/compras">🛒 Compras</Link> 
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ventas">💰Ventas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kardex">📑 Kardex</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">📦Productos</Link>
            </li>
          </ul>

          {/* 2. EL BOTÓN: Se agrega al final de la lista o fuera de ella */}
          <div className="d-flex">
            <button 
              className="btn btn-outline-danger btn-sm px-3" 
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;