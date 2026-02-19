import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const ModalProducto = ({ onSave }) => {
  const [nombre, setNombre] = useState('');
  const [costo, setCosto] = useState(0);

  const guardar = async () => {
    try {
      const nuevoProd = { nombre, costo, precioVenta: costo * 1.35, stock: 0 };
      const res = await api.post('/Producto', nuevoProd);
      alert("Producto registrado con éxito");
      onSave(res.data); // Devuelve el producto a la vista de Compras
    } catch (error) {
      alert("Error al registrar");
    }
  };

  return (
    <div className="modal fade" id="modalProducto" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header"><h5>Nuevo Producto</h5></div>
          <div className="modal-body">
            <input type="text" className="form-control mb-2" placeholder="Nombre" onChange={e => setNombre(e.target.value)} />
            <input type="number" className="form-control" placeholder="Costo" onChange={e => setCosto(Number(e.target.value))} />
            <p className="mt-2 text-muted">Precio sugerido (x1.35): S/ {(costo * 1.35).toFixed(2)}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={guardar} data-bs-dismiss="modal">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalProducto;