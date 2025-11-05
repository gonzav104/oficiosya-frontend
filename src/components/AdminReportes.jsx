import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ValidatedInput } from './common';
import '../styles/components/AdminReportes.css';

// Datos de ejemplo para reportes
const reportesIniciales = [
  {
    id_reporte: 1,
    fecha_reporte: '2024-12-01 14:30:00',
    estado: 'pendiente',
    motivo: 'El prestador no se presentó al trabajo acordado y no respondió a mis mensajes. Perdí tiempo esperándolo.',
    usuario_reportante: {
      id_usuario: 3,
      nombre: 'María García',
      email: 'maria.garcia@email.com',
      rol: 'Cliente'
    },
    usuario_reportado: {
      id_usuario: 8,
      nombre: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      rol: 'Prestador',
      categoria: 'Pintura'
    }
  },
  {
    id_reporte: 2,
    fecha_reporte: '2024-12-02 09:15:00',
    estado: 'pendiente',
    motivo: 'El cliente me solicitó un presupuesto, acordamos el trabajo y luego dejó de responder. Esto ya me pasó varias veces con este usuario.',
    usuario_reportante: {
      id_usuario: 12,
      nombre: 'Ana López',
      email: 'ana.lopez@email.com',
      rol: 'Prestador',
      categoria: 'Electricidad'
    },
    usuario_reportado: {
      id_usuario: 15,
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@email.com',
      rol: 'Cliente'
    }
  },
  {
    id_reporte: 3,
    fecha_reporte: '2024-11-28 16:45:00',
    estado: 'resuelto',
    motivo: 'El prestador me cobró un precio diferente al acordado inicialmente y su trabajo no fue de buena calidad.',
    usuario_reportante: {
      id_usuario: 7,
      nombre: 'Pedro Rodríguez',
      email: 'pedro.rodriguez@email.com',
      rol: 'Cliente'
    },
    usuario_reportado: {
      id_usuario: 9,
      nombre: 'Luis Martínez',
      email: 'luis.martinez@email.com',
      rol: 'Prestador',
      categoria: 'Plomería'
    },
    fecha_resolucion: '2024-11-30 10:20:00',
    admin_resolucion: 'Admin Principal',
    nota_resolucion: 'Se contactó con ambas partes. El prestador reconoció el error y reembolsó la diferencia. Se le advirtió sobre mantener los precios acordados.'
  },
  {
    id_reporte: 4,
    fecha_reporte: '2024-12-03 11:00:00',
    estado: 'pendiente',
    motivo: 'Este usuario utiliza lenguaje inapropiado en los mensajes y tiene una actitud agresiva. No se puede trabajar con él.',
    usuario_reportante: {
      id_usuario: 18,
      nombre: 'Sofía González',
      email: 'sofia.gonzalez@email.com',
      rol: 'Prestador',
      categoria: 'Limpieza'
    },
    usuario_reportado: {
      id_usuario: 22,
      nombre: 'Diego Torres',
      email: 'diego.torres@email.com',
      rol: 'Cliente'
    }
  },
  {
    id_reporte: 5,
    fecha_reporte: '2024-11-25 13:20:00',
    estado: 'desestimado',
    motivo: 'El cliente no me quiere pagar el trabajo completo, dice que no le gustó pero yo hice exactamente lo que me pidió.',
    usuario_reportante: {
      id_usuario: 14,
      nombre: 'Fernando Ruiz',
      email: 'fernando.ruiz@email.com',
      rol: 'Prestador',
      categoria: 'Carpintería'
    },
    usuario_reportado: {
      id_usuario: 5,
      nombre: 'Laura Benítez',
      email: 'laura.benitez@email.com',
      rol: 'Cliente'
    },
    fecha_resolucion: '2024-11-27 15:10:00',
    admin_resolucion: 'Admin Principal',
    nota_resolucion: 'Tras revisar las evidencias y conversaciones, se determinó que se trata de una diferencia contractual normal. Se aconsejó mejor comunicación previa.'
  }
];

function AdminReportes() {
  const [reportes, setReportes] = useState(reportesIniciales);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  
  // Modales
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [showResolucionModal, setShowResolucionModal] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  
  // Estados para resolución
  const [estadoResolucion, setEstadoResolucion] = useState('resuelto');
  const [notaResolucion, setNotaResolucion] = useState('');

  // Filtrar reportes
  const reportesFiltrados = reportes.filter(reporte => {
    let estadoMatch = filtroEstado === 'todos';
    if (filtroEstado === 'pendientes') estadoMatch = reporte.estado === 'pendiente';
    if (filtroEstado === 'resueltos') estadoMatch = reporte.estado === 'resuelto';
    if (filtroEstado === 'desestimados') estadoMatch = reporte.estado === 'desestimado';
    
    const busquedaMatch = busqueda === '' || 
      reporte.usuario_reportante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      reporte.usuario_reportado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      reporte.motivo.toLowerCase().includes(busqueda.toLowerCase());
    
    return estadoMatch && busquedaMatch;
  });

  // Estadísticas
  const totalReportes = reportes.length;
  const reportesPendientes = reportes.filter(r => r.estado === 'pendiente').length;
  const reportesResueltos = reportes.filter(r => r.estado === 'resuelto').length;
  const reportesDesestimados = reportes.filter(r => r.estado === 'desestimado').length;

  // Ver detalles del reporte
  const verDetalles = (reporte) => {
    setReporteSeleccionado(reporte);
    setShowDetalleModal(true);
  };

  // Gestionar reporte
  const gestionarReporte = (reporte) => {
    setReporteSeleccionado(reporte);
    setEstadoResolucion('resuelto');
    setNotaResolucion('');
    setShowResolucionModal(true);
  };

  // Confirmar resolución
  const confirmarResolucion = () => {
    const ahora = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setReportes(reportes.map(r => 
      r.id_reporte === reporteSeleccionado.id_reporte 
        ? { 
            ...r, 
            estado: estadoResolucion,
            fecha_resolucion: ahora,
            admin_resolucion: 'Admin Principal',
            nota_resolucion: notaResolucion || 'Sin notas adicionales'
          } 
        : r
    ));

    const accion = estadoResolucion === 'resuelto' ? 'resuelto' : 'desestimado';
    alert(`Reporte ${accion} exitosamente\n\nEl reporte ha sido ${accion} y se ha registrado la resolución.`);
    
    setShowResolucionModal(false);
    setNotaResolucion('');
  };

  // Obtener badge de estado
  const getBadgeEstado = (estado) => {
    const badges = {
      'pendiente': 'bg-warning',
      'resuelto': 'bg-success',
      'desestimado': 'bg-secondary'
    };
    return badges[estado] || 'bg-light';
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-reportes">
      {/* HEADER */}
      <div className="reportes-header mb-4">
        <h3 className="mb-1">
          <i className="bi bi-flag-fill me-2"></i>
          Gestión de Reportes
        </h3>
        <p className="text-muted mb-0">
          Moderación y resolución de reportes entre usuarios
        </p>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="row mb-4 g-3">
        <div className="col-md col-sm-6">
          <div className="stat-card stat-total">
            <i className="bi bi-flag"></i>
            <div>
              <h3>{totalReportes}</h3>
              <p>Total Reportes</p>
            </div>
          </div>
        </div>
        <div className="col-md col-sm-6">
          <div className="stat-card stat-pendientes">
            <i className="bi bi-clock-fill"></i>
            <div>
              <h3>{reportesPendientes}</h3>
              <p>Pendientes</p>
            </div>
          </div>
        </div>
        <div className="col-md col-sm-6">
          <div className="stat-card stat-resueltos">
            <i className="bi bi-check-circle-fill"></i>
            <div>
              <h3>{reportesResueltos}</h3>
              <p>Resueltos</p>
            </div>
          </div>
        </div>
        <div className="col-md col-sm-6">
          <div className="stat-card stat-desestimados">
            <i className="bi bi-x-circle-fill"></i>
            <div>
              <h3>{reportesDesestimados}</h3>
              <p>Desestimados</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="card main-card">
        <div className="card-header">
          <h5 className="mb-3">
            <i className="bi bi-funnel me-2"></i>
            Lista de Reportes
          </h5>
          
          <div className="filtros-container">
            {/* Búsqueda */}
            <div className="busqueda-box">
              <i className="bi bi-search"></i>
              <input 
                type="text" 
                className="form-control"
                placeholder="Buscar por usuario o motivo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Filtros de estado */}
            <div className="filtros-buttons">
              <div className="btn-group">
                <button 
                  className={`btn btn-sm ${filtroEstado === 'todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltroEstado('todos')}
                >
                  Todos ({totalReportes})
                </button>
                <button 
                  className={`btn btn-sm ${filtroEstado === 'pendientes' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltroEstado('pendientes')}
                >
                  <i className="bi bi-clock me-1"></i>
                  Pendientes ({reportesPendientes})
                </button>
                <button 
                  className={`btn btn-sm ${filtroEstado === 'resueltos' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltroEstado('resueltos')}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Resueltos ({reportesResueltos})
                </button>
                <button 
                  className={`btn btn-sm ${filtroEstado === 'desestimados' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFiltroEstado('desestimados')}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Desestimados ({reportesDesestimados})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA DE REPORTES */}
        <div className="card-body p-0">
          {reportesFiltrados.length > 0 ? (
            <div className="reportes-lista">
              {reportesFiltrados.map(reporte => (
                <div key={reporte.id_reporte} className="reporte-item">
                  <div className="reporte-header">
                    <div className="reporte-id">
                      <span className="badge bg-light text-dark">
                        ID: {reporte.id_reporte}
                      </span>
                    </div>
                    <div className="reporte-estado">
                      <span className={`badge ${getBadgeEstado(reporte.estado)}`}>
                        {reporte.estado.charAt(0).toUpperCase() + reporte.estado.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="reporte-info">
                    <div className="reporte-usuarios">
                      <div className="usuario-reportante">
                        <strong>Reportante:</strong>
                        <span className="usuario-nombre">{reporte.usuario_reportante.nombre}</span>
                        <span className="badge bg-info">{reporte.usuario_reportante.rol}</span>
                        {reporte.usuario_reportante.categoria && (
                          <span className="badge bg-primary">{reporte.usuario_reportante.categoria}</span>
                        )}
                      </div>
                      
                      <div className="usuario-reportado">
                        <strong>Reportado:</strong>
                        <span className="usuario-nombre">{reporte.usuario_reportado.nombre}</span>
                        <span className="badge bg-info">{reporte.usuario_reportado.rol}</span>
                        {reporte.usuario_reportado.categoria && (
                          <span className="badge bg-primary">{reporte.usuario_reportado.categoria}</span>
                        )}
                      </div>
                    </div>

                    <div className="reporte-motivo">
                      <strong>Motivo:</strong>
                      <p>{reporte.motivo.length > 150 
                        ? `${reporte.motivo.substring(0, 150)}...` 
                        : reporte.motivo
                      }</p>
                    </div>

                    <div className="reporte-fecha">
                      <i className="bi bi-calendar3 me-2"></i>
                      <strong>Fecha del reporte:</strong> {formatearFecha(reporte.fecha_reporte)}
                    </div>

                    {reporte.estado !== 'pendiente' && (
                      <div className="reporte-resolucion">
                        <i className="bi bi-check-circle me-2"></i>
                        <strong>Resuelto el:</strong> {formatearFecha(reporte.fecha_resolucion)}
                        <span className="mx-2">por</span>
                        <strong>{reporte.admin_resolucion}</strong>
                      </div>
                    )}
                  </div>

                  <div className="reporte-acciones">
                    <Button 
                      variant="outline-primary" 
                      size="small"
                      onClick={() => verDetalles(reporte)}
                      icon="eye"
                    >
                      Ver Detalles
                    </Button>
                    
                    {reporte.estado === 'pendiente' && (
                      <Button 
                        variant="warning" 
                        size="small"
                        onClick={() => gestionarReporte(reporte)}
                        icon="gear"
                      >
                        Gestionar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-flag fs-1 text-muted d-block mb-3"></i>
              <h5 className="text-muted">No se encontraron reportes</h5>
              <p className="text-muted">Intenta con otros filtros o búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DETALLES DEL REPORTE */}
      {showDetalleModal && reporteSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-flag-fill me-2"></i>
                    Detalles del Reporte #{reporteSeleccionado.id_reporte}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDetalleModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Estado del reporte */}
                  <div className="mb-4">
                    <h6>Estado del Reporte</h6>
                    <span className={`badge ${getBadgeEstado(reporteSeleccionado.estado)} fs-6`}>
                      {reporteSeleccionado.estado.charAt(0).toUpperCase() + reporteSeleccionado.estado.slice(1)}
                    </span>
                  </div>

                  {/* Información de usuarios */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="usuario-detalle">
                        <h6>Usuario Reportante</h6>
                        <p><strong>Nombre:</strong> {reporteSeleccionado.usuario_reportante.nombre}</p>
                        <p><strong>Email:</strong> {reporteSeleccionado.usuario_reportante.email}</p>
                        <p><strong>Rol:</strong> {reporteSeleccionado.usuario_reportante.rol}</p>
                        {reporteSeleccionado.usuario_reportante.categoria && (
                          <p><strong>Categoría:</strong> {reporteSeleccionado.usuario_reportante.categoria}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="usuario-detalle">
                        <h6>Usuario Reportado</h6>
                        <p><strong>Nombre:</strong> {reporteSeleccionado.usuario_reportado.nombre}</p>
                        <p><strong>Email:</strong> {reporteSeleccionado.usuario_reportado.email}</p>
                        <p><strong>Rol:</strong> {reporteSeleccionado.usuario_reportado.rol}</p>
                        {reporteSeleccionado.usuario_reportado.categoria && (
                          <p><strong>Categoría:</strong> {reporteSeleccionado.usuario_reportado.categoria}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Motivo del reporte */}
                  <div className="mb-4">
                    <h6>Motivo del Reporte</h6>
                    <div className="alert alert-light">
                      <p className="mb-0">{reporteSeleccionado.motivo}</p>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="mb-4">
                    <h6>Información Temporal</h6>
                    <p><strong>Fecha del Reporte:</strong> {formatearFecha(reporteSeleccionado.fecha_reporte)}</p>
                    {reporteSeleccionado.fecha_resolucion && (
                      <>
                        <p><strong>Fecha de Resolución:</strong> {formatearFecha(reporteSeleccionado.fecha_resolucion)}</p>
                        <p><strong>Resuelto por:</strong> {reporteSeleccionado.admin_resolucion}</p>
                      </>
                    )}
                  </div>

                  {/* Nota de resolución */}
                  {reporteSeleccionado.nota_resolucion && (
                    <div className="mb-4">
                      <h6>Nota de Resolución</h6>
                      <div className="alert alert-info">
                        <p className="mb-0">{reporteSeleccionado.nota_resolucion}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <Button 
                    variant="secondary"
                    onClick={() => setShowDetalleModal(false)}
                  >
                    Cerrar
                  </Button>
                  {reporteSeleccionado.estado === 'pendiente' && (
                    <Button 
                      variant="warning"
                      onClick={() => {
                        setShowDetalleModal(false);
                        gestionarReporte(reporteSeleccionado);
                      }}
                      icon="gear"
                    >
                      Gestionar Reporte
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL GESTIONAR REPORTE */}
      {showResolucionModal && reporteSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title">
                    <i className="bi bi-gear me-2"></i>
                    Gestionar Reporte #{reporteSeleccionado.id_reporte}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowResolucionModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Resolviendo reporte:</strong> {reporteSeleccionado.usuario_reportante.nombre} vs {reporteSeleccionado.usuario_reportado.nombre}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Resolución del Reporte</strong>
                    </label>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="resolucion" 
                        id="resuelto"
                        value="resuelto"
                        checked={estadoResolucion === 'resuelto'}
                        onChange={(e) => setEstadoResolucion(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="resuelto">
                        <strong>Resuelto</strong> - El reporte es válido y se ha tomado acción
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="resolucion" 
                        id="desestimado"
                        value="desestimado"
                        checked={estadoResolucion === 'desestimado'}
                        onChange={(e) => setEstadoResolucion(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="desestimado">
                        <strong>Desestimado</strong> - El reporte no es válido o no requiere acción
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Notas de Resolución</strong> <span className="text-muted">(opcional)</span>
                    </label>
                    <ValidatedInput
                      as="textarea"
                      rows={4}
                      value={notaResolucion}
                      onChange={(e) => setNotaResolucion(e.target.value)}
                      placeholder="Describe las acciones tomadas, contactos realizados, o motivos de la resolución..."
                    />
                  </div>

                  <div className="alert alert-warning mb-0">
                    <small>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Esta acción quedará registrada en el historial administrativo y no se puede deshacer.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button 
                    variant="secondary"
                    onClick={() => setShowResolucionModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant={estadoResolucion === 'resuelto' ? 'success' : 'secondary'}
                    onClick={confirmarResolucion}
                    icon={estadoResolucion === 'resuelto' ? 'check-circle' : 'x-circle'}
                  >
                    {estadoResolucion === 'resuelto' ? 'Resolver Reporte' : 'Desestimar Reporte'}
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

export default AdminReportes;