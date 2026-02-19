import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ModalNuevoProducto from '../components/modals/ModalNuevoProducto';

const ComprasPage = () => {
    const [productos, setProductos] = useState([]);
    const [listaCompras, setListaCompras] = useState([]);
    const [item, setItem] = useState({ 
        idProducto: '', 
        nombre: '', 
        cantidad: '', 
        costoActual: 0, 
        precioVentaActual: 0 
    });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        api.get('/Kardex')
            .then(res => setProductos(res.data || []))
            .catch(err => console.error("Error al cargar productos", err));
    };

    const handleProductoChange = (id) => {
        const prod = productos.find(p => p.id_producto == id);
        if (prod) {
            setItem({
                ...item,
                idProducto: id,
                nombre: prod.nombre_producto,
                costoActual: prod.costo || 0,
                precioVentaActual: prod.precioVenta || 0
            });
        } else {
            setItem({ idProducto: '', nombre: '', cantidad: '', costoActual: 0, precioVentaActual: 0 });
        }
    };

    const agregarALista = () => {
      // 1. Buscamos el stock del producto en nuestro estado 'productos'
        const productoInfo = productos.find(p => p.id_producto == item.idProducto);
        const stockDisponible = productoInfo ? productoInfo.stock_actual : 0;

        if (!item.idProducto || !item.cantidad || item.cantidad <= 0) {
            return alert("Seleccione un producto y asigne una cantidad válida");
        }

        // 3. Validación de Stock: Si es 0, mostramos el mensaje exacto que pediste
        //if (stockDisponible <= 0) {
        //    return alert(`Cantidad insuficiente. Stock disponible: ${stockDisponible}`);
        //}

        const subtotalItem = parseInt(item.cantidad) * parseFloat(item.costoActual);
        
        const nuevoItem = {
            ...item,
            cantidad: parseInt(item.cantidad),
            subtotal: subtotalItem,
            // Requerimiento: El nuevo precio de venta basado en el costo actual
            nuevoPrecioVenta: parseFloat(item.costoActual) * 1.35 
        };

        setListaCompras([...listaCompras, nuevoItem]);
        
        // Limpiar selección
        setItem({ idProducto: '', nombre: '', cantidad: '', costoActual: 0, precioVentaActual: 0 });
    };

    const quitarDeLista = (index) => {
        setListaCompras(listaCompras.filter((_, i) => i !== index));
    };

    const calcularTotales = () => {
        const subtotalGeneral = listaCompras.reduce((acc, el) => acc + el.subtotal, 0);
        const igv = subtotalGeneral * 0.18;
        return {
            subtotal: subtotalGeneral,
            igv: igv,
            total: subtotalGeneral + igv
        };
    };

    const guardarCompraFinal = async () => {
        if (listaCompras.length === 0) return alert("Agregue al menos un producto a la lista");

        try {
            // Procesamos cada item de la lista
            for (const prod of listaCompras) {
                const dataPost = {
                    idProducto: parseInt(prod.idProducto),
                    cantidad: parseInt(prod.cantidad),
                    precio: parseFloat(prod.costoActual),
                    precioVenta: parseFloat(prod.nuevoPrecioVenta),
                    total: prod.subtotal * 1.18 // Total con IGV por producto
                };
                await api.post('/Compras', dataPost);
            }

            alert("✅ Compra masiva registrada con éxito. Stock actualizado.");
            setListaCompras([]);
            cargarProductos();
        } catch (err) {
            console.error(err);
            alert("Error al registrar la compra masiva.");
        }
    };

    const res = calcularTotales();

    return (
        <div className="container mt-4">
            {/* SECCIÓN DE ENTRADA DE DATOS */}
            <h3 className="mb-4 text-primary">📥 Registro de Ingresos (Compras)</h3>
            <div className="card shadow border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-10">
                            <label className="form-label fw-bold">Producto</label>
                            <select className="form-select" value={item.idProducto} onChange={e => handleProductoChange(e.target.value)}>
                                <option value="">-- Seleccione un producto --</option>
                                {productos.map(p => (
                                    <option key={p.id_producto} value={p.id_producto}>
                                        {p.nombre_producto} (Stock: {p.stock_actual})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                          <button 
                              className="btn btn-success form-label" 
                              type="button" 
                              data-bs-toggle="modal" 
                              data-bs-target="#modalRegistroProducto">
                              <i className="bi bi-plus-circle"></i> + Nuevo producto
                          </button>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-muted">Costo Actual (Unit.)</label>
                            <input type="text" className="form-control bg-light" value={`S/ ${item.costoActual}`} readOnly />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label text-muted">P. Venta Actual</label>
                            <input type="text" className="form-control bg-light" value={`S/ ${item.precioVentaActual}`} readOnly />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Cantidad a Comprar</label>
                            <input 
                                type="number" 
                                className="form-control border-primary" 
                                value={item.cantidad} 
                                onChange={e => setItem({...item, cantidad: e.target.value})}
                                placeholder="0"
                            />
                        </div>

                        <div className="col-md-3 d-flex align-items-end">
                            <button type="button" className="btn btn-primary w-100"  onClick={agregarALista}>
                                + Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA DETALLE DE COMPRA */}
            <div className="card shadow border-0">
                <div className="card-header bg-dark text-white">
                    <h6 className="mb-0">Lista de Productos a Procesar</h6>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Producto</th>
                                <th className="text-center">Cant.</th>
                                <th>Costo Unit.</th>
                                <th>Subtotal</th>
                                <th>Nuevo P. Venta (x1.35)</th>
                                <th className="text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaCompras.map((prod, index) => (
                                <tr key={index}>
                                    <td>{prod.nombre}</td>
                                    <td className="text-center">{prod.cantidad}</td>
                                    <td>S/ {prod.costoActual.toFixed(2)}</td>
                                    <td>S/ {prod.subtotal.toFixed(2)}</td>
                                    <td className="text-primary fw-bold">S/ {prod.nuevoPrecioVenta.toFixed(2)}</td>
                                    <td className="text-center">
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => quitarDeLista(index)}>
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {listaCompras.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">No hay productos en la lista de compra</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer bg-light p-4">
                    <div className="row justify-content-end">
                        <div className="col-md-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>S/ {res.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>IGV (18%):</span>
                                <span>S/ {res.igv.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <span className="h5 fw-bold">Total Final:</span>
                                <span className="h5 fw-bold text-success">S/ {res.total.toFixed(2)}</span>
                            </div>
                            <button 
                                className="btn btn-success btn-lg px-5 shadow" 
                                onClick={guardarCompraFinal}
                                disabled={listaCompras.length === 0}
                            >
                                📦 Confirmar compras
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalNuevoProducto onGuardar={cargarProductos} />
        </div>
    );
};

export default ComprasPage;