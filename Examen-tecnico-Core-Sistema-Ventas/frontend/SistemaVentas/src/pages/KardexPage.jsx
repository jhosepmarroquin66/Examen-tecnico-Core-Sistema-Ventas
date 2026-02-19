import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import ModalMovimientos from '../components/modals/ModalMovimientos';
import { obtenerHistorialProducto } from '../services/movimientoService'; 

const KardexPage = () => {
    const [data, setData] = useState([]);
    const [movs, setMovs] = useState([]);
    const [prodNom, setProdNom] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarKardex();
    }, []);

    const cargarKardex = () => {
        api.get('/Kardex')
            .then(res => {
                setData(res.data || []);
            })
            .catch(err => console.error("Error al cargar Kardex:", err));
    };

    const verDetalle = async (id, nombre) => {
    setProdNom(nombre);
    setMovs([]); // Limpiamos la tabla del modal para que no se vea el historial anterior
    setLoading(true);
    try {
        const res = await obtenerHistorialProducto(id);
        // Los nombres en tu JSON son "fec_registro", "tipoMovimiento" y "cantidad"
        setMovs(res.data); 
        } catch (error) {
            console.error("Error al obtener movimientos del backend:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
          <h3 className="mb-4 text-primary">📊 Kardex de Inventario</h3>
            <div className="card shadow border-0">
                <div className="card-body p-0">
                    <table className="table table-bordered bg-white">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Stock Actual</th>
                                <th>Costo</th>
                                <th>Precio Venta</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id_producto}>
                                    <td>{item.id_producto}</td>
                                    <td>{item.nombre_producto}</td>
                                    <td>
                                        <span className={`badge ${item.stock_actual < 10 ? 'bg-danger' : 'bg-success'}`}>
                                            {item.stock_actual}
                                        </span>
                                    </td>
                                    <td>S/ {item.costo?.toFixed(2)}</td>
                                    <td>S/ {item.precioVenta?.toFixed(2)}</td>
                                    <td className="text-center">
                                        <button 
                                            className="btn btn-info btn-sm text-white shadow-sm"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#modalMovs"
                                            onClick={() => verDetalle(item.id_producto, item.nombre_producto)}
                                        >
                                            👁 Ver Historial
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Modal de movimientos */}
            <ModalMovimientos lista={movs} nombre={prodNom} />
        </div>
    );
};

export default KardexPage;