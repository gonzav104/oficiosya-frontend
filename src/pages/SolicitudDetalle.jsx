import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/common';
import '../styles/pages/SolicitudDetalle.css';

// Datos de prueba
const solicitudesFalsas = [
  { id: 1, titulo: 'Reparación de canilla en cocina', categoria: 'Plomería', localidad: 'Baradero', estado: 'Iniciada', fechaCreacion: '15/01/2025', descripcion: 'Se necesita reparar una canilla que pierde agua constantemente.', imagenes: [] },
  { id: 2, titulo: 'Instalación de ventilador de techo', categoria: 'Electricidad', localidad: 'San Pedro', estado: 'Enviada', fechaCreacion: '14/01/2025', descripcion: 'Necesito instalar un ventilador de techo en el dormitorio principal.', imagenes: [] },
  { id: 3, titulo: 'Pintura de fachada', categoria: 'Pintura', localidad: 'Ramallo', estado: 'Cotizada', fechaCreacion: '13/01/2025', descripcion: 'Pintar la fachada de una casa de 2 pisos.', imagenes: [] },
  { id: 4, titulo: 'Arreglo de enchufe', categoria: 'Electricidad', localidad: 'San Pedro', estado: 'Pendiente de Calificación', fechaCreacion: '10/01/2025', descripcion: 'Un enchufe dejó de funcionar en la sala de estar.', imagenes: [] },
  { id: 5, titulo: 'Revisión de instalación de gas', categoria: 'Gasista', localidad: 'Baradero', estado: 'Cerrada', fechaCreacion: '20/12/2024', descripcion: 'Necesito revisión completa de la instalación de gas natural.', imagenes: [] },
];

const prestadoresRecomendadosPorSolicitud = {
  1: [
    { id: 101, nombrePublico: 'Carlos Rodríguez', categoria: 'Plomería', localidad: 'Baradero', calificacionPromedio: 4.8, cantidadResenas: 127, trabajosRealizados: 156, experiencia: 'Más de 10 años de experiencia', foto: '👨‍🔧' },
    { id: 102, nombrePublico: 'Laura Fernández', categoria: 'Plomería', localidad: 'Baradero', calificacionPromedio: 4.9, cantidadResenas: 89, trabajosRealizados: 94, experiencia: '8 años de experiencia', foto: '👩‍🔧' },
    { id: 103, nombrePublico: 'Diego Martínez', categoria: 'Plomería', localidad: 'Baradero', calificacionPromedio: 4.7, cantidadResenas: 54, trabajosRealizados: 67, experiencia: '5 años de experiencia', foto: '👨‍🔧' },
    { id: 104, nombrePublico: 'Ana Torres', categoria: 'Plomería', localidad: 'Baradero', calificacionPromedio: 4.6, cantidadResenas: 32, trabajosRealizados: 38, experiencia: '3 años de experiencia', foto: '👩‍🔧' },
    { id: 105, nombrePublico: 'Miguel Santos', categoria: 'Plomería', localidad: 'Baradero', calificacionPromedio: 4.5, cantidadResenas: 28, trabajosRealizados: 35, experiencia: '4 años de experiencia', foto: '👨‍🔧' },
  ],
  2: [],
  3: [],
  4: [],
};

// Prestadores a los que se les envió presupuesto (para estado "Enviada")
const prestadoresEnviados = {
  2: [
    { id: 104, nombrePublico: 'Roberto Gómez', categoria: 'Electricidad', localidad: 'San Pedro', calificacionPromedio: 4.6, cantidadResenas: 45, trabajosRealizados: 52, experiencia: '6 años de experiencia', foto: '⚡', fechaEnvio: '14/01/2025' },
    { id: 105, nombrePublico: 'Ana Torres', categoria: 'Electricidad', localidad: 'San Pedro', calificacionPromedio: 4.8, cantidadResenas: 67, trabajosRealizados: 74, experiencia: '8 años de experiencia', foto: '⚡', fechaEnvio: '14/01/2025' },
  ],
};

const prestadoresCercanos = {
  3: [
    { id: 106, nombrePublico: 'Roberto Gómez', categoria: 'Pintura', localidad: 'San Pedro', calificacionPromedio: 4.6, cantidadResenas: 45, trabajosRealizados: 52, experiencia: '6 años de experiencia', foto: '👨‍🎨', distancia: '15 km' },
    { id: 107, nombrePublico: 'Martín López', categoria: 'Pintura', localidad: 'Baradero', calificacionPromedio: 4.5, cantidadResenas: 38, trabajosRealizados: 41, experiencia: '4 años de experiencia', foto: '👨‍🎨', distancia: '20 km' },
  ],
};

const presupuestosPorSolicitud = {
  3: [
    {
      id: 3,
      prestadorId: 106,
      prestadorNombre: 'Diego Martínez',
      monto: 25000,
      plazo: 3,
      mensaje: 'Incluye materiales de primera calidad y mano de obra. Garantía de 2 años.',
      estado: 'Pendiente',
      fechaEnvio: '13/01/2025',
    },
  ],
  4: [
    {
      id: 4,
      prestadorId: 108,
      prestadorNombre: 'Carlos Electricista',
      monto: 3500,
      plazo: 1,
      mensaje: 'Trabajo realizado. Favor calificar el servicio.',
      estado: 'Completado',
      fechaEnvio: '10/01/2025',
      fechaCompletado: '11/01/2025',
      datosContacto: {
        telefono: '11-2345-6789',
        email: 'carlos.electricista@email.com',
        whatsapp: 'https://wa.me/5491123456789',
      },
    },
  ],
};

function SolicitudDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [buscarCercanos, setBuscarCercanos] = useState(false);
  const [mostrarModalPresupuesto, setMostrarModalPresupuesto] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [presupuestoAceptado, setPresupuestoAceptado] = useState(false);
  const [mostrarModalCalificacion, setMostrarModalCalificacion] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentarioCalificacion, setComentarioCalificacion] = useState('');

  const solicitud = solicitudesFalsas.find((s) => s.id === parseInt(id));
  const prestadoresRecomendados = prestadoresRecomendadosPorSolicitud[parseInt(id)] || [];
  const prestadoresEnZonasCercanas = prestadoresCercanos[parseInt(id)] || [];
  const prestadoresEnviadosLista = prestadoresEnviados[parseInt(id)] || [];
  const presupuestosRecibidos = presupuestosPorSolicitud[parseInt(id)] || [];

  if (!solicitud) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <h3>Solicitud no encontrada</h3>
          <p>La solicitud que buscas no existe o fue eliminada.</p>
          <Button variant="primary" className="mt-3" onClick={() => navigate('/panel-solicitante')}>
            Volver al Panel
          </Button>
        </div>
      </div>
    );
  }

  // Determinar qué mostrar según el estado
  const esIniciada = solicitud.estado === 'Iniciada';
  const esEnviada = solicitud.estado === 'Enviada';
  const esCotizada = solicitud.estado === 'Cotizada';
  const esPendienteCalificacion = solicitud.estado === 'Pendiente de Calificación';
  const esCerrada = solicitud.estado === 'Cerrada';

  const prestadoresMostrados = buscarCercanos
    ? prestadoresEnZonasCercanas
    : mostrarTodos
    ? prestadoresRecomendados
    : prestadoresRecomendados.slice(0, 3);

  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    const llenas = Math.floor(calificacion);
    const media = calificacion % 1 !== 0;
    for (let i = 0; i < llenas; i++) estrellas.push(<i key={`f${i}`} className="bi bi-star-fill text-warning"></i>);
    if (media) estrellas.push(<i key="m" className="bi bi-star-half text-warning"></i>);
    for (let i = 0; i < 5 - Math.ceil(calificacion); i++) estrellas.push(<i key={`v${i}`} className="bi bi-star text-warning"></i>);
    return estrellas;
  };

  const handleSolicitarPresupuesto = (prestador) => {
    alert(`Solicitud de presupuesto enviada a ${prestador.nombrePublico}`);
    setTimeout(() => navigate('/panel-solicitante'), 1500);
  };

  const handleVerPresupuesto = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setMostrarModalPresupuesto(true);
  };

  const handleAceptarPresupuesto = () => {
    const presupuestoConContacto = {
      ...presupuestoSeleccionado,
      estado: 'Aceptado',
      datosContacto: {
        telefono: '11-9876-5432',
        email: 'diego.martinez@email.com',
        whatsapp: 'https://wa.me/5491198765432',
      }
    };
    
    setPresupuestoSeleccionado(presupuestoConContacto);
    setPresupuestoAceptado(true);
    alert('Presupuesto aceptado. Se muestran los datos de contacto del prestador.');
  };

  const handleRechazarPresupuesto = () => {
    alert('Presupuesto rechazado.');
    setMostrarModalPresupuesto(false);
  };

  const handleMostrarModalCalificacion = () => {
    setMostrarModalCalificacion(true);
  };

  const handleEnviarCalificacion = () => {
    if (calificacion === 0) {
      alert('Por favor selecciona una calificación de 1 a 5 estrellas.');
      return;
    }
    
    alert(`Calificación enviada: ${calificacion} estrellas. ¡Gracias por tu feedback!`);
    setMostrarModalCalificacion(false);
    setCalificacion(0);
    setComentarioCalificacion('');
    setTimeout(() => navigate('/panel-solicitante'), 1500);
  };

  const renderEstrellasCalificacion = (rating, setRating) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <i
          key={i}
          className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'} estrella-calificacion`}
          onClick={() => setRating(i)}
          style={{ 
            cursor: 'pointer',
            color: i <= rating ? '#ffc107' : '#dee2e6',
            fontSize: '2rem',
            marginRight: '0.5rem'
          }}
        ></i>
      );
    }
    return estrellas;
  };

  return (
    <div className="solicitud-detalle-container">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/panel-solicitante')}>
        ← Volver a Mis Solicitudes
      </Button>

      {/* --- Detalle de la solicitud --- */}
      <div className="card solicitud-card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between">
            <div>
              <h3>{solicitud.titulo}</h3>
              <div className="solicitud-meta">
                <span className="badge bg-secondary me-2">{solicitud.categoria}</span>
                <span className="badge bg-info me-2">{solicitud.localidad}</span>
                <span className="badge bg-light text-dark">{solicitud.fechaCreacion}</span>
              </div>
            </div>
            <span className={`badge-estado ${
              solicitud.estado === 'Iniciada'
                ? 'bg-secondary'
                : solicitud.estado === 'Enviada'
                ? 'bg-primary'
                : solicitud.estado === 'Cotizada'
                ? 'bg-info'
                : solicitud.estado === 'Pendiente de Calificación'
                ? 'bg-warning text-dark'
                : 'bg-success'
            }`}>{solicitud.estado}</span>
          </div>
        </div>
        <div className="card-body">
          <h5>Descripción del Servicio</h5>
          <p>{solicitud.descripcion}</p>
        </div>
      </div>

      {/* Recomendaciones (Solo estado Iniciada) */}
      {esIniciada && (
        <div className="recomendaciones-section">
          <div className="section-header mb-4">
            <h4>{buscarCercanos ? 'Prestadores en Zonas Cercanas' : 'Prestadores Recomendados'}</h4>
          </div>

          {prestadoresMostrados.length > 0 ? (
            <>
              <div className="row g-4">
                {prestadoresMostrados.map((p) => (
                  <div key={p.id} className="col-md-6 col-lg-4">
                    <div className="card prestador-card h-100">
                      <div className="card-body text-center">
                        <div className="prestador-avatar mb-2">{p.foto}</div>
                        <h5>{p.nombrePublico}</h5>
                        <p className="text-muted">{p.categoria} • {p.localidad}</p>
                        <div>{renderEstrellas(p.calificacionPromedio)}</div>
                        <small className="text-muted d-block mb-2">
                          {p.cantidadResenas} reseñas • {p.trabajosRealizados} trabajos
                        </small>
                        <div className="info-box mb-3">{p.experiencia}</div>
                        <div className="d-grid gap-2">
                          <Button variant="outline-primary" onClick={() => navigate(`/perfil/${p.id}`)}>
                            Ver Perfil
                          </Button>
                          <Button variant="success" onClick={() => handleSolicitarPresupuesto(p)}>
                            Solicitar Presupuesto
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ver más (solo en estado Iniciada cuando no se buscan cercanos) */}
              {!buscarCercanos && prestadoresRecomendados.length > 3 && (
                <div className="text-center mt-4">
                  <Button variant="outline-secondary" size="large" onClick={() => setMostrarTodos(!mostrarTodos)}>
                    {mostrarTodos ? 'Ver menos' : `Ver todos (${prestadoresRecomendados.length})`}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-warning text-center">
              <h5>No se encontraron prestadores de {solicitud.categoria} en {solicitud.localidad}</h5>
              {prestadoresEnZonasCercanas.length > 0 && !buscarCercanos ? (
                <Button variant="primary" className="mt-3" onClick={() => setBuscarCercanos(true)}>
                  Buscar en localidades cercanas ({prestadoresEnZonasCercanas.length})
                </Button>
              ) : buscarCercanos ? (
                <Button variant="outline-secondary" className="mt-3" onClick={() => setBuscarCercanos(false)}>
                  Volver a búsqueda original
                </Button>
              ) : (
                <p className="text-muted mt-2">Tampoco hay prestadores cercanos disponibles.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Prestadores Enviados (Solo estado Enviada) */}
      {esEnviada && (
        <div className="prestadores-enviados-section">
          <div className="section-header mb-4">
            <h4>Prestadores a los que se envió la solicitud</h4>
            <p className="text-muted">Esperando respuesta de los prestadores contactados</p>
          </div>

          {prestadoresEnviadosLista.length > 0 ? (
            <div className="row g-4">
              {prestadoresEnviadosLista.map((p) => (
                <div key={p.id} className="col-md-6">
                  <div className="card prestador-card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="prestador-avatar-sm me-3">{p.foto}</div>
                        <div>
                          <h5 className="mb-1">{p.nombrePublico}</h5>
                          <p className="text-muted mb-0">{p.categoria} • {p.localidad}</p>
                        </div>
                      </div>
                      <div className="mb-2">{renderEstrellas(p.calificacionPromedio)}</div>
                      <small className="text-muted d-block mb-3">
                        {p.cantidadResenas} reseñas • {p.trabajosRealizados} trabajos
                      </small>
                      <div className="alert alert-info mb-0">
                        <small>
                          <i className="bi bi-clock me-2"></i>
                          Solicitud enviada el {p.fechaEnvio}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se han enviado solicitudes a ningún prestador aún.
            </div>
          )}
        </div>
      )}

      {/* Presupuestos recibidos (estados cotizada, pero no pendiente de calificación) */}
      {(esCotizada || (presupuestosRecibidos.length > 0 && !esPendienteCalificacion)) && (
        <div className="presupuestos-section">
          <div className="section-header mb-4">
            <h4>
              {esCotizada ? 'Presupuesto Recibido' : 'Presupuestos Recibidos'}
            </h4>
            {esCotizada && (
              <p className="text-muted">Revisa el presupuesto y decide si aceptarlo o rechazarlo</p>
            )}
          </div>

          <div className="row g-4">
            {presupuestosRecibidos.map((p) => (
              <div key={p.id} className="col-md-6">
                <div className={`card presupuesto-card ${p.estado === 'Aceptado' ? 'presupuesto-aceptado' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                      <h5>{p.prestadorNombre}</h5>
                      <span className={`badge ${
                        p.estado === 'Aceptado' ? 'bg-success' : 
                        p.estado === 'Completado' ? 'bg-primary' : 
                        'bg-warning text-dark'
                      }`}>
                        {p.estado}
                      </span>
                    </div>
                    <p><strong>Monto:</strong> ${p.monto.toLocaleString()}</p>
                    <p><strong>Plazo:</strong> {p.plazo} días</p>
                    <p>{p.mensaje}</p>

                    {esCotizada && p.estado === 'Pendiente' && (
                      <div className="d-grid gap-2">
                        <Button variant="success" onClick={() => handleVerPresupuesto(p)} icon="check-circle">
                          Aceptar Presupuesto
                        </Button>
                        <Button variant="outline-danger" onClick={() => handleRechazarPresupuesto()} icon="x-circle">
                          Rechazar
                        </Button>
                      </div>
                    )}

                    {(p.estado === 'Aceptado' || p.estado === 'Completado') && p.datosContacto && (
                      <div className="contacto-box-aceptado">
                        <h6>Datos de Contacto</h6>
                        <p>📞 {p.datosContacto.telefono}</p>
                        <p>📧 {p.datosContacto.email}</p>
                        <a href={p.datosContacto.whatsapp} target="_blank" rel="noreferrer" className="btn btn-success btn-sm w-100">
                          Contactar por WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aviso para calificación (estado pendiente de calificación) */}
      {esPendienteCalificacion && (
        <div className="calificacion-pendiente-section">
          {/* Primero: Información del prestador */}
          {presupuestosRecibidos.filter(p => p.estado === 'Completado').map((p) => (
            <div key={p.id} className="card presupuesto-completado mb-4">
              <div className="card-body">
                <h4 className="text-center mb-4">
                  <i className="bi bi-person-check me-2"></i>
                  Trabajo Completado por {p.prestadorNombre}
                </h4>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Prestador:</strong> {p.prestadorNombre}</p>
                    <p><strong>Trabajo realizado:</strong> {solicitud.titulo}</p>
                    <p><strong>Monto final:</strong> ${p.monto.toLocaleString()}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Fecha de finalización:</strong> {p.fechaCompletado}</p>
                    <p><strong>Estado:</strong> <span className="badge bg-success">Completado</span></p>
                  </div>
                </div>
                {p.datosContacto && (
                  <div className="contacto-box-aceptado mt-3">
                    <h6>Datos de Contacto</h6>
                    <div className="row">
                      <div className="col-md-4">
                        <p>📞 {p.datosContacto.telefono}</p>
                      </div>
                      <div className="col-md-4">
                        <p>📧 {p.datosContacto.email}</p>
                      </div>
                      <div className="col-md-4">
                        <a href={p.datosContacto.whatsapp} target="_blank" rel="noreferrer" className="btn btn-success btn-sm w-100">
                          <i className="bi bi-whatsapp me-2"></i>WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Segundo: Sección para calificar */}
          <div className="alert alert-warning text-center">
            <h4><i className="bi bi-star me-2"></i>Califica el Servicio Recibido</h4>
            <p className="mb-3">
              Tu opinión es muy importante. Ayuda a otros usuarios calificando el trabajo realizado.
            </p>
            <Button variant="warning" size="large" onClick={handleMostrarModalCalificacion} icon="star-fill">
              Calificar Prestador
            </Button>
          </div>
        </div>
      )}

      {/* Solicitud Cerrada */}
      {esCerrada && (
        <div className="solicitud-cerrada-section">
          <div className="alert alert-success text-center">
            <h4><i className="bi bi-check-circle me-2"></i>Solicitud Completada</h4>
            <p className="mb-0">
              Esta solicitud ha sido cerrada exitosamente. El trabajo fue completado y calificado.
            </p>
          </div>
          
          <div className="card trabajo-finalizado mt-4">
            <div className="card-body">
              <h5 className="text-center mb-4">Resumen del Trabajo Finalizado</h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Servicio:</strong> {solicitud.titulo}</p>
                  <p><strong>Categoría:</strong> {solicitud.categoria}</p>
                  <p><strong>Localidad:</strong> {solicitud.localidad}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Fecha de solicitud:</strong> {solicitud.fechaCreacion}</p>
                  <p><strong>Estado:</strong> <span className="badge bg-success">Cerrada</span></p>
                  <p><strong>Resultado:</strong> Trabajo completado satisfactoriamente</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-light rounded">
                <h6>Descripción del servicio realizado:</h6>
                <p className="mb-0">{solicitud.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para confirmar aceptación de presupuesto */}
      {mostrarModalPresupuesto && presupuestoSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-check-circle me-2"></i>Confirmar Aceptación
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModalPresupuesto(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <h5>{presupuestoSeleccionado.prestadorNombre}</h5>
                    <p className="fs-4 text-success fw-bold">${presupuestoSeleccionado.monto.toLocaleString()}</p>
                    <p>{presupuestoSeleccionado.mensaje}</p>
                  </div>
                  
                  {!presupuestoAceptado ? (
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Al aceptar este presupuesto, se mostrarán los datos de contacto del prestador y podrás coordinar el trabajo directamente.
                    </div>
                  ) : (
                    <div className="alert alert-success">
                      <h6 className="mb-3">
                        <i className="bi bi-check-circle me-2"></i>
                        ¡Presupuesto Aceptado! Datos de Contacto:
                      </h6>
                      <p className="mb-1">📞 {presupuestoSeleccionado.datosContacto.telefono}</p>
                      <p className="mb-1">📧 {presupuestoSeleccionado.datosContacto.email}</p>
                      <a 
                        href={presupuestoSeleccionado.datosContacto.whatsapp} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-success btn-sm w-100 mt-2"
                      >
                        <i className="bi bi-whatsapp me-2"></i>Contactar por WhatsApp
                      </a>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  {!presupuestoAceptado ? (
                    <>
                      <Button variant="secondary" onClick={() => setMostrarModalPresupuesto(false)}>
                        Cancelar
                      </Button>
                      <Button variant="success" onClick={handleAceptarPresupuesto} icon="check-circle">
                        Aceptar Presupuesto
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" onClick={() => {
                      setMostrarModalPresupuesto(false);
                      setPresupuestoAceptado(false);
                      setTimeout(() => navigate('/panel-solicitante'), 1000);
                    }} icon="door-closed">
                      Cerrar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal para calificar prestador */}
      {mostrarModalCalificacion && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-star me-2"></i>Calificar Prestador
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setMostrarModalCalificacion(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <h5>¿Cómo fue el servicio?</h5>
                    <p className="text-muted">Tu calificación ayuda a otros usuarios a tomar mejores decisiones</p>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="fw-bold mb-3">Selecciona tu calificación:</p>
                    <div className="estrellas-container">
                      {renderEstrellasCalificacion(calificacion, setCalificacion)}
                    </div>
                    {calificacion > 0 && (
                      <p className="mt-2 text-success">
                        {calificacion === 1 && "😞 Muy malo"}
                        {calificacion === 2 && "😐 Malo"}
                        {calificacion === 3 && "😊 Regular"}
                        {calificacion === 4 && "😃 Bueno"}
                        {calificacion === 5 && "🤩 Excelente"}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="comentario" className="form-label">Comentario (opcional)</label>
                    <textarea 
                      className="form-control" 
                      id="comentario"
                      rows="3"
                      placeholder="Comparte tu experiencia con este prestador..."
                      value={comentarioCalificacion}
                      onChange={(e) => setComentarioCalificacion(e.target.value)}
                      maxLength="300"
                    ></textarea>
                    <small className="text-muted">{comentarioCalificacion.length}/300 caracteres</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button variant="secondary" onClick={() => setMostrarModalCalificacion(false)}>
                    Cancelar
                  </Button>
                  <Button variant="warning" onClick={handleEnviarCalificacion} icon="star-fill">
                    Enviar Calificación
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SolicitudDetalle;
