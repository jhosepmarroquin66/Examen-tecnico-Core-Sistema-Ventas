import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // AJUSTA ESTA URL a la de tu controlador de Acceso en .NET
      const response = await axios.post('http://localhost:5183/api/Auth/login', {
        username: correo,
        password: clave
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        window.location.href = '/kardex'; // Recarga para actualizar el estado de App.jsx
      }
    } catch (error) {
      alert("Error al iniciar sesión. Revisa tus credenciales o el CORS.");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-4">
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white text-center">
            <h4>🔐 Acceso al Sistema</h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input 
                  //type="email" 
                  className="form-control" 
                  value={correo} 
                  onChange={(e) => setCorreo(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={clave} 
                  onChange={(e) => setClave(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Ingresar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;