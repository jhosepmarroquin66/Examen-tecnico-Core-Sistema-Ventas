import api from '../api/axiosConfig';

export const listarProductos = () => api.get('/Productos');

export const registrarProducto = (data) => api.post('/Productos', data);

// ESTA ES LA QUE TE FALTA:
export const actualizarProducto = (id, data) => api.put(`/Productos/${id}`, data);