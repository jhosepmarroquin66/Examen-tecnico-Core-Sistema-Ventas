import api from '../api/axiosConfig';
export const listarCompras = () => api.get('/Compras');
export const registrarCompra = (data) => api.post('/Compras', data);