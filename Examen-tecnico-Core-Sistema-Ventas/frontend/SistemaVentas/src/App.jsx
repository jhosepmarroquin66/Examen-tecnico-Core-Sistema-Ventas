import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import KardexPage from './pages/KardexPage';
import ProductosPage from './pages/ProductosPage';
import VentasPage from './pages/VentasPage';
import ComprasPage from './pages/ComprasPage'; // 1. Importar

function App() {
  // Verificamos si existe el token en el storage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      {/* Solo mostramos el Navbar si el usuario está logueado */}
      {isAuthenticated && <Navbar />}
      
      <div className="container mt-4">
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas: Si no está autenticado, manda al login */}
          <Route 
            path="/kardex" 
            element={isAuthenticated ? <KardexPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/productos" 
            element={isAuthenticated ? <ProductosPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/ventas" 
            element={isAuthenticated ? <VentasPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/compras" 
            element={isAuthenticated ? <ComprasPage /> : <Navigate to="/login" />} 
          />
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/kardex" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;