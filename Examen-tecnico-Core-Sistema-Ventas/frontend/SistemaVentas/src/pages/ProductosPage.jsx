import React, { useEffect, useState } from 'react';
import { listarProductos, registrarProducto, actualizarProducto } from '../services/productoService';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre_producto: '', nroLote: '', costo: '', precioVenta: '' });

  useEffect(() => { cargarProds(); }, []);

  const cargarProds = async () => {
    const res = await listarProductos();
    setProductos(res.data);
  };

  const guardar = async (e) => {
    e.preventDefault();
    await registrarProducto(form);
    setForm({ nombre_producto: '', nroLote: '', costo: '', precioVenta: '' });
    cargarProds();
  };

  return (
    <div className="container">
      <h3 className="mb-4 text-primary">📦Administración de Productos</h3>
      <div className="card p-3 mb-4 shadow-sm">
        <form className="row g-3" onSubmit={guardar}>
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Nombre Producto" value={form.nombre_producto} 
                   onChange={e => setForm({...form, nombre_producto: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input type="text" className="form-control" placeholder="Lote" value={form.nroLote} 
                   onChange={e => setForm({...form, nroLote: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Costo" value={form.costo} 
                   onChange={e => setForm({...form, costo: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Precio Venta" value={form.precioVenta} 
                   onChange={e => setForm({...form, precioVenta: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">+ Agregar</button>
          </div>
        </form>
      </div>

      <table className="table table-bordered bg-white">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Lote</th>
            <th>Costo</th>
            <th>Precio Venta</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nombre_producto}</td>
              <td>{p.nroLote}</td>
              <td>S/.{p.costo}</td>
              <td>S/.{p.precioVenta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosPage;