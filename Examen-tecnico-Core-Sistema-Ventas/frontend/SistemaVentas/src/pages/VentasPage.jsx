import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const VentasPage = () => {
    const [kardex, setKardex] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [sel, setSel] = useState({ id: '', cant: '' });

    useEffect(() => { cargarStock(); }, []);

    const cargarStock = () => {
        api.get('/Kardex')
            .then(res => {
                // Sincronizamos con tu JSON real
                setKardex(res.data || []);
            })
            .catch(err => console.error("Error al cargar stock:", err));
    };

    const agregarAVenta = () => {
        if (!sel.id || !sel.cant) return alert("Seleccione producto y cantidad");
        
        // Buscamos usando 'id_producto' (minúscula) como viene en tu JSON
        const prod = kardex.find(p => p.id_producto == sel.id);
        
        if (!prod) return alert("Producto no encontrado");

        if (parseInt(sel.cant) > prod.stock_actual) {
            return alert(`Cantidad insuficiente. Stock disponible: ${prod.stock_actual}`);
        }

        // Usamos 'precioVenta' (v mayúscula) como viene en tu JSON
        const subtotal = parseInt(sel.cant) * prod.precioVenta;
        const igv = subtotal * 0.18;
        
        setCarrito([...carrito, { 
            tempId: Date.now(),
            id: prod.id_producto, 
            nombre: prod.nombre_producto, 
            cant: parseInt(sel.cant), 
            precio: prod.precioVenta, 
            subtotal, igv, total: subtotal + igv 
        }]);
        
        setSel({ id: '', cant: '' });
    };

    const finalizarVenta = async () => {
        try {
            for (const v of carrito) {
                await api.post('/Ventas', {
                    idProducto: v.id,
                    cantidad: v.cant,
                    precioVenta: v.precio,
                    subTotal: v.subtotal,
                    igv: v.igv,
                    total: v.total
                });
            }
            alert("Venta registrada con éxito");
            setCarrito([]);
            cargarStock();
        } catch (err) { 
            alert("Error al procesar la venta"); 
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4 text-primary">💰 Registro de Ventas</h3>
            <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Producto (Stock disponible)</label>
                        <select 
                            className="form-select" 
                            value={sel.id} 
                            onChange={e => setSel({...sel, id: e.target.value})}
                        >
                            <option value="">-- Seleccione un producto --</option>
                            {kardex.map((p) => (
                                // Usamos id_producto y nombre_producto según tu JSON
                                <option key={p.id_producto} value={p.id_producto}>
                                    {p.nombre_producto} (Stock: {p.stock_actual}) (Precio: {p.precioVenta})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Cantidad</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={sel.cant} 
                            onChange={e => setSel({...sel, cant: e.target.value})} 
                        />
                    </div>
                    <div className="col-md-3 d-flex align-items-end">
                        <button className="btn btn-primary w-100" onClick={agregarAVenta}>
                            + Agregar
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle shadow-sm bg-white">
                    <thead className="table-dark">
                        <tr>
                            <th>Producto</th>
                            <th className="text-center">Cant.</th>
                            <th>Precio Unit.</th>
                            <th>Subtotal</th>
                            <th>IGV</th>
                            <th>Total (inc. IGV)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.length > 0 ? carrito.map((v) => (
                            <tr key={v.tempId}>
                                <td>{v.nombre}</td>
                                <td className="text-center">{v.cant}</td>
                                <td>S/ {v.precio.toFixed(2)}</td>
                                <td>S/ {v.subtotal.toFixed(2)}</td>
                                <td className="fw-bold text-success">S/ {(v.total - (v.total / 1.18)).toFixed(2)}</td>
                                <td className="fw-bold text-success">S/ {v.total.toFixed(2)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">No hay productos seleccionados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-3 text-end">
                <button 
                    className="btn btn-success btn-lg px-5 shadow" 
                    onClick={finalizarVenta} 
                    disabled={carrito.length === 0}
                >
                    Confirmar Venta
                </button>
            </div>
        </div>
    );
};

export default VentasPage;