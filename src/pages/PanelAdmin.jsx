import React, { useState } from 'react';
import './PanelAdmin.css';

// --- Datos de Ejemplo para Usuarios ---
const usuariosIniciales = [
  { 
    id: 1, 
    nombre: 'María García', 
    email: 'maria.garcia@email.com', 
    rol: 'Solicitante', 
    estado: 'Activo', 
    fechaRegistro: '05/09/2024',
    solicitudes: 12, 
    localidad: 'CABA',
    ultimoAcceso: '20/01/2025'
  },
  { 
    id: 2, 
    nombre: 'Elmer Acuña Malvaceda', 
    email: 'elmer.acuna@email.com', 
    rol: 'Prestador', 
    estado: 'Activo', 
    fechaRegistro: '05/10/2024',
    trabajos: 156, 
    localidad: 'Baradero',
    categorias: ['Plomería', 'Gasista'],
    calificacion: 4.8,
    ultimoAcceso: '21/01/2025'
  },
  { 
    id: 3, 
    nombre: 'Carlos Rodríguez', 
    email: 'carlos.rodriguez@email.com', 
    rol: 'Solicitante', 
    estado: 'Bloqueado', 
    fechaRegistro: '06/08/2024',
    solicitudes: 3, 
    localidad: 'Córdoba',
    fechaBloqueo: '15/01/2025',
    motivoBloqueo: 'Comportamiento inapropiado reportado',
    ultimoAcceso: '14/01/2025'
  },
  { 
    id: 4, 
    nombre: 'Ana López Fernández', 
    email: 'ana.lopez@email.com', 
    rol: 'Prestador', 
    estado: 'Activo', 
    fechaRegistro: '08/04/2024',
    trabajos: 89, 
    localidad: 'Rosario',
    categorias: ['Electricidad'],
    calificacion: 4.9,
    ultimoAcceso: '21/01/2025'
  },
  { 
    id: 5, 
    nombre: 'Roberto Silva', 
    email: 'roberto.silva@email.com', 
    rol: 'Prestador', 
    estado: 'Bloqueado', 
    fechaRegistro: '10/03/2024',
    trabajos: 12, 
    localidad: 'San Pedro',
    categorias: ['Pintura'],
    calificacion: 3.2,
    fechaBloqueo: '18/01/2025',
    motivoBloqueo: 'Calificaciones bajas y quejas de clientes',
    ultimoAcceso: '17/01/2025'
  },
  { 
    id: 6, 
    nombre: 'Laura Martínez', 
    email: 'laura.martinez@email.com', 
    rol: 'Solicitante', 
    estado: 'Activo', 
    fechaRegistro: '12/11/2024',
    solicitudes: 7, 
    localidad: 'San Nicolás',
    ultimoAcceso: '20/01/2025'
  },
];

// Historial de acciones administrativas
const accionesAdministrativasIniciales = [
  {
    id: 1,
    tipoAccion: 'Bloqueo',
    usuario: 'Carlos Rodríguez',
    usuarioId: 3,
    admin: 'Admin Principal',
    fecha: '15/01/2025 14:30',
    descripcion: 'Usuario bloqueado por comportamiento inapropiado'
  },
  {
    id: 2,
    tipoAccion: 'Bloqueo',
    usuario: 'Roberto Silva',
    usuarioId: 5,
    admin: 'Admin Principal',
    fecha: '18/01/2025 10:15',
    descripcion: 'Usuario bloqueado por calificaciones bajas'
  }
];
// ------------------------------------

function PanelAdmin() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [accionesAdmin, setAccionesAdmin] = useState(accionesAdministrativasIniciales);
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [vistaActual, setVistaActual] = useState('usuarios');
  
  // Modales
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  
  // Formulario de bloqueo
  const [motivoBloqueo, setMotivoBloqueo] = useState('');

  // RF28: Bloquear usuario
  const handleBlockClick = (user) => {
    setUsuarioSeleccionado(user);
    setMotivoBloqueo('');
    setShowBlockModal(true);
  };

  // RF30: Reactivar usuario
  const handleReactivateClick = (user) => {
    setUsuarioSeleccionado(user);
    setShowReactivateModal(true);
  };

  // Ver detalles del usuario
  const verDetalles = (user) => {
    setUsuarioSeleccionado(user);
    setShowDetalleModal(true);
  };

  // Confirmar bloqueo - RF28
  const confirmBlock = () => {
    const ahora = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setUsuarios(usuarios.map(u => 
      u.id === usuarioSeleccionado.id 
        ? { 
            ...u, 
            estado: 'Bloqueado',
            fechaBloqueo: ahora.split(' ')[0],
            motivoBloqueo: motivoBloqueo || 'Sin motivo especificado'
          } 
        : u
    ));

    const nuevaAccion = {
      id: accionesAdmin.length + 1,
      tipoAccion: 'Bloqueo',
      usuario: usuarioSeleccionado.nombre,
      usuarioId: usuarioSeleccionado.id,
      admin: 'Admin Principal',
      fecha: ahora,
      descripcion: motivoBloqueo || 'Usuario bloqueado sin motivo especificado'
    };
    setAccionesAdmin([nuevaAccion, ...accionesAdmin]);

    alert(`✅ Usuario bloqueado exitosamente\n\n${usuarioSeleccionado.nombre} ya no podrá acceder a la plataforma.`);
    
    setShowBlockModal(false);
    setMotivoBloqueo('');
  };

  // Confirmar reactivación - RF30
  const confirmReactivate = () => {
    const ahora = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setUsuarios(usuarios.map(u => 
      u.id === usuarioSeleccionado.id 
        ? { 
            ...u, 
            estado: 'Activo',
            fechaBloqueo: null,
            motivoBloqueo: null
          } 
        : u
    ));

    const nuevaAccion = {
      id: accionesAdmin.length + 1,
      tipoAccion: 'Reactivación',
      usuario: usuarioSeleccionado.nombre,
      usuarioId: usuarioSeleccionado.id,
      admin: 'Admin Principal',
      fecha: ahora,
      descripcion: `Usuario ${usuarioSeleccionado.nombre} reactivado`
    };
    setAccionesAdmin([nuevaAccion, ...accionesAdmin]);

    alert(`✅ Usuario reactivado exitosamente\n\n${usuarioSeleccionado.nombre} puede acceder nuevamente a la plataforma.`);
    
    setShowReactivateModal(false);
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(u => {
    let rolMatch = filtroRol === 'Todos';
    if (filtroRol === 'Prestadores') rolMatch = u.rol === 'Prestador';
    if (filtroRol === 'Solicitantes') rolMatch = u.rol === 'Solicitante';
    
    let estadoMatch = filtroEstado === 'Todos';
    if (filtroEstado === 'Activos') estadoMatch = u.estado === 'Activo';
    if (filtroEstado === 'Bloqueados') estadoMatch = u.estado === 'Bloqueado';
    
    const busquedaMatch = busqueda === '' || 
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.localidad.toLowerCase().includes(busqueda.toLowerCase());
    
    return rolMatch && estadoMatch && busquedaMatch;
  });

  // Estadísticas
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.estado === 'Activo').length;
  const usuariosBloqueados = usuarios.filter(u => u.estado === 'Bloqueado').length;
  const totalPrestadores = usuarios.filter(u => u.rol === 'Prestador').length;
  const totalSolicitantes = usuarios.filter(u => u.rol === 'Solicitante').length;

  // Función para renderizar estrellas
  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    const estrellaCompleta = Math.floor(calificacion);
    const tieneMedia = calificacion % 1 !== 0;

    for (let i = 0; i < estrellaCompleta; i++) {
      estrellas.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    if (tieneMedia) {
      estrellas.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    const estrellasVacias = 5 - Math.ceil(calificacion);
    for (let i = 0; i < estrellasVacias; i++) {
      estrellas.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    return estrellas;
  };

  return (
    <div className="panel-admin-container">
      {/* HEADER */}
      <div className="admin-header mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-shield-check me-2"></i>
            Panel de Administración
          </h2>
          <p className="text-muted mb-0">Gestión de usuarios y moderación de la plataforma</p>
        </div>
        <div className="header-actions">
          <button 
            className={`btn ${vistaActual === 'usuarios' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setVistaActual('usuarios')}
          >
            <i className="bi bi-people me-2"></i>
            Usuarios
          </button>
          <button 
            className={`btn ${vistaActual === 'historial' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setVistaActual('historial')}
          >
            <i className="bi bi-clock-history me-2"></i>
            Historial
          </button>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="row mb-4 g-3">
        <div className="col-md col-sm-6">
          <div className="stat-card stat-total">
            <i className="bi bi-people-fill"></i>
            <div>
              <h3>{totalUsuarios}</h3>
              <p>Total Usuarios</p>
            </div>
          </div>
        </div>
        <div className="col-md col-sm-6">
          <div className="stat-card stat-activos">
            <i className="bi bi-check-circle-fill"></i>
            <div>
              <h3>{usuariosActivos}</h3>
              <p>Activos</p>
            </div>
          </div>
        </div>
        <div className="col-md col-sm-6">
          <div className="stat-card stat-bloqueados">
            <i className="bi bi-x-circle-fill"></i>
            <div>
              <h3>{usuariosBloqueados}</h3>
              <p>Bloqueados</p>
            </div>
          </div>
        </div>
        <div className="col-md col-sm-6">
          <div className="stat-card stat-prestadores">
            <i className="bi bi-briefcase-fill"></i>
            <div>
              <h3>{totalPrestadores}</h3>
              <p>Prestadores</p>
            </div>
          </div>
        </div>
        <div className="col-md col-sm-6">
          <div className="stat-card stat-solicitantes">
            <i className="bi bi-person-fill"></i>
            <div>
              <h3>{totalSolicitantes}</h3>
              <p>Solicitantes</p>
            </div>
          </div>
        </div>
      </div>

      {/* VISTA DE USUARIOS */}
      {vistaActual === 'usuarios' && (
        <div className="card main-card">
          <div className="card-header">
            <h5 className="mb-3">
              <i className="bi bi-people me-2"></i>
              Gestión de Usuarios
            </h5>
            
            {/* FILTROS Y BÚSQUEDA */}
            <div className="filtros-container">
              {/* Búsqueda */}
              <div className="busqueda-box">
                <i className="bi bi-search"></i>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Buscar por nombre, email o localidad..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {/* Filtros */}
              <div className="filtros-buttons">
                {/* Filtro Estado */}
                <div className="btn-group me-2">
                  <button 
                    className={`btn btn-sm ${filtroEstado === 'Todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltroEstado('Todos')}
                  >
                    Todos ({totalUsuarios})
                  </button>
                  <button 
                    className={`btn btn-sm ${filtroEstado === 'Activos' ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltroEstado('Activos')}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Activos ({usuariosActivos})
                  </button>
                  <button 
                    className={`btn btn-sm ${filtroEstado === 'Bloqueados' ? 'btn-danger' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltroEstado('Bloqueados')}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Bloqueados ({usuariosBloqueados})
                  </button>
                </div>

                {/* Filtro Rol */}
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${filtroRol === 'Todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltroRol('Todos')}
                  >
                    Todos los roles
                  </button>
                  <button 
                    className={`btn btn-sm ${filtroRol === 'Prestadores' ? 'btn-info' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltroRol('Prestadores')}
                  >
                    <i className="bi bi-briefcase me-1"></i>
                    Prestadores
                  </button>
                  <button 
                    className={`btn btn-sm ${filtroRol === 'Solicitantes' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setFiltroRol('Solicitantes')}
                  >
                    <i className="bi bi-person me-1"></i>
                    Solicitantes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LISTA DE USUARIOS */}
          <div className="card-body p-0">
            {usuariosFiltrados.length > 0 ? (
              <div className="usuarios-lista">
                {usuariosFiltrados.map(user => (
                  <div key={user.id} className="usuario-item">
                    <div className="usuario-info">
                      {/* Avatar */}
                      <div className="usuario-avatar">
                        {user.nombre.charAt(0)}
                      </div>

                      {/* Datos principales */}
                      <div className="usuario-datos">
                        <div className="usuario-nombre-badges">
                          <h6>{user.nombre}</h6>
                          <div className="badges-group">
                            <span className={`badge ${user.rol === 'Prestador' ? 'bg-info' : 'bg-secondary'}`}>
                              <i className={`bi bi-${user.rol === 'Prestador' ? 'briefcase' : 'person'} me-1`}></i>
                              {user.rol}
                            </span>
                            <span className={`badge ${user.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                              <i className={`bi bi-${user.estado === 'Activo' ? 'check-circle' : 'x-circle'} me-1`}></i>
                              {user.estado}
                            </span>
                          </div>
                        </div>

                        <div className="usuario-detalles">
                          <span>
                            <i className="bi bi-envelope"></i>
                            {user.email}
                          </span>
                          <span>
                            <i className="bi bi-geo-alt"></i>
                            {user.localidad}
                          </span>
                          <span>
                            <i className="bi bi-calendar3"></i>
                            Registro: {user.fechaRegistro}
                          </span>
                          <span>
                            <i className="bi bi-clock"></i>
                            Último acceso: {user.ultimoAcceso}
                          </span>
                        </div>

                        {/* Info adicional según rol */}
                        {user.rol === 'Prestador' && (
                          <div className="usuario-extra">
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-briefcase me-1"></i>
                              {user.trabajos} trabajos realizados
                            </span>
                            {user.calificacion && (
                              <span className="badge bg-light text-dark">
                                {renderEstrellas(user.calificacion)}
                                <span className="ms-1">{user.calificacion}</span>
                              </span>
                            )}
                            {user.categorias && user.categorias.map(cat => (
                              <span key={cat} className="badge bg-primary">{cat}</span>
                            ))}
                          </div>
                        )}

                        {user.rol === 'Solicitante' && (
                          <div className="usuario-extra">
                            <span className="badge bg-light text-dark">
                              <i className="bi bi-file-text me-1"></i>
                              {user.solicitudes} solicitudes creadas
                            </span>
                          </div>
                        )}

                        {/* Info de bloqueo */}
                        {user.estado === 'Bloqueado' && user.motivoBloqueo && (
                          <div className="alert alert-danger mt-2 mb-0 py-2 px-3">
                            <small>
                              <strong>Bloqueado el {user.fechaBloqueo}:</strong> {user.motivoBloqueo}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="usuario-acciones">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => verDetalles(user)}
                      >
                        <i className="bi bi-eye"></i>
                        Ver Detalles
                      </button>
                      {user.estado === 'Activo' ? (
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleBlockClick(user)}
                        >
                          <i className="bi bi-lock"></i>
                          Bloquear
                        </button>
                      ) : (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleReactivateClick(user)}
                        >
                          <i className="bi bi-unlock"></i>
                          Reactivar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                <h5 className="text-muted">No se encontraron usuarios</h5>
                <p className="text-muted">Intenta con otros filtros o búsqueda</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA DE HISTORIAL - RNF8 */}
      {vistaActual === 'historial' && (
        <div className="card main-card">
          <div className="card-header">
            <h5>
              <i className="bi bi-clock-history me-2"></i>
              Historial de Acciones Administrativas
            </h5>
            <p className="text-muted mb-0">Registro completo de todas las acciones de moderación</p>
          </div>
          <div className="card-body">
            {accionesAdmin.length > 0 ? (
              <div className="timeline">
                {accionesAdmin.map(accion => (
                  <div key={accion.id} className="timeline-item">
                    <div className={`timeline-badge ${accion.tipoAccion === 'Bloqueo' ? 'bg-danger' : 'bg-success'}`}>
                      <i className={`bi bi-${accion.tipoAccion === 'Bloqueo' ? 'lock' : 'unlock'}`}></i>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h6 className="mb-1">
                          {accion.tipoAccion === 'Bloqueo' ? '🔒 Usuario Bloqueado' : '🔓 Usuario Reactivado'}
                        </h6>
                        <small className="text-muted">{accion.fecha}</small>
                      </div>
                      <p className="mb-1"><strong>Usuario:</strong> {accion.usuario}</p>
                      <p className="mb-1"><strong>Administrador:</strong> {accion.admin}</p>
                      {accion.descripcion && (
                        <p className="mb-0 text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          {accion.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-clock-history fs-1 text-muted d-block mb-3"></i>
                <h5 className="text-muted">No hay acciones registradas</h5>
                <p className="text-muted">Las acciones administrativas aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL BLOQUEAR USUARIO - RF28 */}
      {showBlockModal && usuarioSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-lock me-2"></i>
                    Bloquear Usuario
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowBlockModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>¿Estás seguro?</strong>
                  </div>

                  <div className="usuario-info-modal mb-3">
                    <strong>Usuario:</strong> {usuarioSeleccionado.nombre}<br/>
                    <strong>Email:</strong> {usuarioSeleccionado.email}<br/>
                    <strong>Rol:</strong> {usuarioSeleccionado.rol}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Motivo del bloqueo <span className="text-muted">(opcional)</span>
                    </label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={motivoBloqueo}
                      onChange={(e) => setMotivoBloqueo(e.target.value)}
                      placeholder="Describe el motivo del bloqueo..."
                    ></textarea>
                  </div>

                  <div className="alert alert-danger mb-0">
                    <small>
                      <i className="bi bi-info-circle me-2"></i>
                      El usuario no podrá acceder a la plataforma hasta que sea reactivado por un administrador.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowBlockModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={confirmBlock}
                  >
                    <i className="bi bi-lock me-2"></i>
                    Confirmar Bloqueo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL REACTIVAR USUARIO - RF30 */}
      {showReactivateModal && usuarioSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-unlock me-2"></i>
                    Reactivar Usuario
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowReactivateModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>¿Deseas reactivar este usuario?</strong>
                  </div>

                  <div className="usuario-info-modal mb-3">
                    <strong>Usuario:</strong> {usuarioSeleccionado.nombre}<br/>
                    <strong>Email:</strong> {usuarioSeleccionado.email}<br/>
                    <strong>Rol:</strong> {usuarioSeleccionado.rol}
                  </div>

                  {usuarioSeleccionado.motivoBloqueo && (
                    <div className="alert alert-warning mb-3">
                      <strong>Motivo del bloqueo anterior:</strong><br/>
                      {usuarioSeleccionado.motivoBloqueo}
                    </div>
                  )}

                  <div className="alert alert-success mb-0">
                    <small>
                      <i className="bi bi-check-circle me-2"></i>
                      El usuario volverá a tener acceso completo a la plataforma.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowReactivateModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={confirmReactivate}
                  >
                    <i className="bi bi-unlock me-2"></i>
                    Confirmar Reactivación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL DETALLES DEL USUARIO */}
      {showDetalleModal && usuarioSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Detalles del Usuario
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDetalleModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="usuario-detalle-info">
                    <h6>Información Básica</h6>
                    <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre}</p>
                    <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
                    <p><strong>Rol:</strong> {usuarioSeleccionado.rol}</p>
                    <p><strong>Estado:</strong> {usuarioSeleccionado.estado}</p>
                    <p><strong>Localidad:</strong> {usuarioSeleccionado.localidad}</p>
                    <p><strong>Fecha de Registro:</strong> {usuarioSeleccionado.fechaRegistro}</p>
                    <p><strong>Último Acceso:</strong> {usuarioSeleccionado.ultimoAcceso}</p>
                  </div>

                  {usuarioSeleccionado.rol === 'Prestador' && (
                    <div className="usuario-detalle-info mt-4">
                      <h6>Información del Prestador</h6>
                      <p><strong>Trabajos Realizados:</strong> {usuarioSeleccionado.trabajos}</p>
                      {usuarioSeleccionado.calificacion && (
                        <p>
                          <strong>Calificación:</strong> {renderEstrellas(usuarioSeleccionado.calificacion)} ({usuarioSeleccionado.calificacion})
                        </p>
                      )}
                      {usuarioSeleccionado.categorias && (
                        <p>
                          <strong>Categorías:</strong> {usuarioSeleccionado.categorias.join(', ')}
                        </p>
                      )}
                    </div>
                  )}

                  {usuarioSeleccionado.rol === 'Solicitante' && (
                    <div className="usuario-detalle-info mt-4">
                      <h6>Información del Solicitante</h6>
                      <p><strong>Solicitudes Creadas:</strong> {usuarioSeleccionado.solicitudes}</p>
                    </div>
                  )}

                  {usuarioSeleccionado.estado === 'Bloqueado' && (
                    <div className="usuario-detalle-info mt-4">
                      <h6>Información de Bloqueo</h6>
                      <p><strong>Fecha de Bloqueo:</strong> {usuarioSeleccionado.fechaBloqueo}</p>
                      <p><strong>Motivo del Bloqueo:</strong> {usuarioSeleccionado.motivoBloqueo}</p>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowDetalleModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PanelAdmin;
