import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/common';

// Datos de ejemplo para simular la búsqueda
const solicitud = { id: 1, titulo: 'Reparación de canilla en cocina' };
const prestador = { id: 101, nombre: 'Carlos Rodríguez' };

function SolicitarPresupuesto() {
  const { solicitudId } = useParams();
  const navigate = useNavigate();

  const handleConfirmar = () => {
    // Aquí iría la lógica para enviar la solicitud al backend
    alert(`Se envió la solicitud de presupuesto a ${prestador.nombre}`);
    navigate(`/solicitud/${solicitudId}/recomendaciones`); // Vuelve a la página de recomendaciones
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card text-center w-100" style={{ maxWidth: '500px' }}>
        <div className="card-header">
          Confirmar Envío de Solicitud
        </div>
        <div className="card-body">
          <h5 className="card-title">¿Enviar solicitud a {prestador.nombre}?</h5>
          <p className="card-text">
            Estás a punto de enviar tu solicitud de <strong>"{solicitud.titulo}"</strong> para que sea presupuestada.
          </p>
          <Button onClick={handleConfirmar} variant="primary" className="me-2">Confirmar y Enviar</Button>
          <Button as={Link} to={`/solicitud/${solicitudId}/recomendaciones`} variant="secondary">Cancelar</Button>
        </div>
      </div>
    </div>
  );
}

export default SolicitarPresupuesto;