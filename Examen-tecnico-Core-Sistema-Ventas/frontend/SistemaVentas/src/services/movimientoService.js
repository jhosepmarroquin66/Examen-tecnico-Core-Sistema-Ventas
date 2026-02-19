import api from '../api/axiosConfig';

// Verifica que el nombre sea exactamente este
export const obtenerHistorialProducto = async (id) => {
    return await api.get(`/Movimientos/producto/${id}`);
};