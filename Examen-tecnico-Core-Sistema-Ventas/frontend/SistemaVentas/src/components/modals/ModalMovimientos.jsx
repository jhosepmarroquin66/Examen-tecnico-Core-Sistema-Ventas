import React from 'react';

const ModalMovimientos = ({ lista, nombre }) => {
    // Formateador de fecha opcional para que se vea más limpio
    const formatearFecha = (fechaStr) => {
        return new Date(fechaStr).toLocaleString('es-PE', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="modal fade" id="modalMovs" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-lg shadow-lg">
                <div className="modal-content border-0">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">📦 Historial: {nombre}</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body p-0">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Fecha y Hora</th>
                                    <th>Tipo</th>
                                    <th className="text-center">Cant.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((m, index) => (
                                    <tr key={index}>
                                        <td>{formatearFecha(m.fec_registro)}</td>
                                        <td>
                                            <span className={`badge ${m.tipoMovimiento.includes('Entrada') ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {m.tipoMovimiento}
                                            </span>
                                        </td>
                                        <td className="text-center fw-bold text-primary">{m.cantidad}</td>
                                    </tr>
                                ))}
                                {lista.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-muted">Sin movimientos registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalMovimientos;