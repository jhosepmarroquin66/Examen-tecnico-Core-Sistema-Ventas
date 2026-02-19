import api from '../api/axiosConfig';
export const listarVentas = () => api.get('/Ventas');
export const registrarVenta = (data) => api.post('/Ventas', data);