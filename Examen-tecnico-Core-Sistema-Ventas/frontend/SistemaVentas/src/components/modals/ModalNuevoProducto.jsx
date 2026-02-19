import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const ModalNuevoProducto = ({ onGuardar }) => {
    // Definimos los 4 estados para los campos
    const [nombre, setNombre] = useState("");
    const [lote, setLote] = useState("");
    const [costo, setCosto] = useState("");
    const [precio, setPrecio] = useState("");

    const manejarGuardar = async () => {
        // Validar que los campos no estén vacíos
        if (!nombre || !lote || !costo || !precio) {
            return alert("Por favor, complete todos los campos");
        }

        const nuevoProducto = {
            id_producto: 0, // El backend suele generarlo, pero lo enviamos en 0
            nombre_producto: nombre,
            nroLote: lote,
            costo: parseFloat(costo),
            precioVenta: parseFloat(precio)
        };

        try {
            // Reemplaza '/Productos' por la ruta real de tu endpoint de creación
            await api.post('/Productos', nuevoProducto);
            
            alert("✅ Producto registrado correctamente");
            
            // 1. Avisamos a la página de Compras para que recargue la lista
            onGuardar(); 
            
            // 2. Limpiamos los campos del modal
            setNombre(""); setLote(""); setCosto(""); setPrecio("");
            
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("Error al registrar el producto");
        }
    };

    return (
        <div className="modal fade" id="modalRegistroProducto" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">🆕 Nuevo Producto</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Nombre del Producto</label>
                            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Mouse Gamer Pro" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Número de Lote</label>
                            <input type="text" className="form-control" value={lote} onChange={(e) => setLote(e.target.value)} placeholder="Ej: LOTE-2024-A" />
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Costo</label>
                                <input type="number" className="form-control" value={costo} onChange={(e) => setCosto(e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Precio Venta</label>
                                <input type="number" className="form-control" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-success" onClick={manejarGuardar} data-bs-dismiss={(nombre && lote && costo && precio) ? "modal" : ""}>
                            Guardar Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevoProducto;