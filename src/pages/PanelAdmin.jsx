import React, { useState, useEffect } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AdminCategorias from '../components/AdminCategorias';
import { Button, ValidatedInput, LoadingSpinner } from '../components/common';
import api from '../api/api';
import '../styles/pages/PanelAdmin.css';

function PanelAdmin() {
  const [vistaActual, setVistaActual] = useState('dashboard');
  
  // Estados de datos
  const [usuarios, setUsuarios] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // Estados para Modal de Bloqueo
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [motivoBloqueo, setMotivoBloqueo] = useState('');

  // Efectos de carga
  useEffect(() => {
    if (vistaActual === 'usuarios') cargarUsuarios();
    if (vistaActual === 'historial') cargarHistorial();
  }, [vistaActual]);

  // Llamadas a la API
  const cargarUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users');
      const data = res.data.data || res.data; 
      setUsuarios(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Error cargando usuarios", error);
      setUsuarios([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const cargarHistorial = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/users/historial/moderacion');
      const data = res.data.data || res.data;
      setHistorial(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error historial", error);
      setHistorial([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Acciones

  // Abrir modal de bloqueo
  const handleBlockClick = (user) => {
    setUsuarioSeleccionado(user);
    setMotivoBloqueo('');
    setShowBlockModal(true);
  };

  // Confirmar bloqueo o activación
  const confirmBlock = async () => {
    if (!usuarioSeleccionado) return;
    
    const estadoActual = usuarioSeleccionado.estado ? usuarioSeleccionado.estado.toLowerCase() : 'activo';
    const nuevoEstado = estadoActual === 'activo' ? 'bloqueado' : 'activo';

    try {
      await api.put(`/users/update-status/${usuarioSeleccionado.id_usuario}`, {
        estado: nuevoEstado,
        motivo: motivoBloqueo
      });
      
      alert(`Usuario ${nuevoEstado} exitosamente.`);
      setShowBlockModal(false);
      cargarUsuarios(); // Recargar lista
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al actualizar estado.';
      alert(`Error: ${msg}`);
      console.error(error);
    }
  };

  // Borrar historial completo
  const handleClearHistorial = async () => {
    if (!window.confirm('¡ATENCIÓN! \n\n¿Estás seguro de que deseas eliminar TODO el historial de moderación?\nEsta acción no se puede deshacer.')) {
      return;
    }

    try {
      await api.delete('/users/historial/moderacion');
      alert('Historial eliminado exitosamente.');
      cargarHistorial();
    } catch (error) {
      console.error("Error borrando historial", error);
      alert('Error al borrar el historial.');
    }
  };

  // Renderizado de vistas

  const renderTablaUsuarios = () => (
    <div className="card main-card">
      <div className="card-header">
        <h5><i className="bi bi-people me-2"></i>Gestión de Usuarios</h5>
      </div>
      <div className="card-body">
        {loadingUsers ? <LoadingSpinner /> : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const estadoNormalizado = u.estado ? u.estado.toLowerCase() : 'activo';
                  const esActivo = estadoNormalizado === 'activo';
                  
                  let nombreMostrar = 'Sin nombre';
                  if (u.cliente && u.cliente.nombre_completo) {
                      nombreMostrar = u.cliente.nombre_completo;
                  } else if (u.prestador && u.prestador.nombre_completo) {
                      nombreMostrar = u.prestador.nombre_completo;
                  } else if (u.rol?.nombre === 'Administrador') {
                      nombreMostrar = 'Administrador';
                  }

                  return (
                    <tr key={u.id_usuario}>
                      <td className="fw-bold">{nombreMostrar}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span className="badge bg-secondary">{u.rol?.nombre}</span>
                      </td>
                      <td>
                        <span className={`badge ${esActivo ? 'bg-success' : 'bg-danger'}`}>
                          {estadoNormalizado.charAt(0).toUpperCase() + estadoNormalizado.slice(1)}
                        </span>
                      </td>
                      <td className="text-end">
                        <Button 
                          size="small" 
                          variant={esActivo ? 'outline-danger' : 'outline-success'}
                          onClick={() => handleBlockClick(u)}
                          icon={esActivo ? 'lock' : 'unlock'}
                        >
                          {esActivo ? 'Bloquear' : 'Activar'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {usuarios.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-4 text-muted">No se encontraron usuarios.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistorial = () => (
    <div className="card main-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0"><i className="bi bi-clock-history me-2"></i>Historial de Moderación</h5>
        {historial.length > 0 && (
          <Button 
            variant="danger" 
            size="small" 
            onClick={handleClearHistorial}
            icon="trash"
          >
            Borrar Historial
          </Button>
        )}
      </div>
      <div className="card-body">
        {loadingUsers ? <LoadingSpinner /> : (
          <div className="list-group list-group-flush">
            {historial.map((h, idx) => (
              <div key={idx} className="list-group-item px-0 py-3">
                <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                  <h6 className="mb-0 text-primary">
                    <i className={`bi bi-${h.tipo_accion === 'BLOQUEO' ? 'lock-fill' : 'unlock-fill'} me-2`}></i>
                    {h.tipo_accion}
                  </h6>
                  <small className="text-muted">
                    {h.fecha_hora ? new Date(h.fecha_hora).toLocaleString() : 'Fecha desconocida'}
                  </small>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <small className="d-block text-muted">Usuario Afectado:</small>
                    <strong>{h.usuario_afectado?.correo || 'Usuario eliminado'}</strong>
                  </div>
                  <div className="col-md-6">
                    <small className="d-block text-muted">Moderador:</small>
                    <span>{h.admin?.correo || 'Sistema'}</span>
                  </div>
                </div>
                
                <div className="mt-2 p-2 bg-light rounded border-start border-3 border-warning">
                  <small className="text-muted d-block fw-bold">Motivo/Detalle:</small>
                  <span className="fst-italic">{h.descripcion || 'Sin descripción'}</span>
                </div>
              </div>
            ))}
            {historial.length === 0 && (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                Sin registros de moderación.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="panel-admin-container p-4 container-fluid">
      {/* HEADER PRINCIPAL */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="mb-1 fw-bold text-dark">Panel de Administración</h2>
          <p className="text-muted mb-0">Gestión integral de la plataforma OficiosYA</p>
        </div>
        
        {/* NAVEGACIÓN */}
        <div className="btn-group shadow-sm">
          <button 
            className={`btn ${vistaActual==='dashboard'?'btn-primary':'btn-outline-primary'}`} 
            onClick={()=>setVistaActual('dashboard')}
          >
            <i className="bi bi-graph-up me-2 d-none d-sm-inline"></i>Dashboard
          </button>
          <button 
            className={`btn ${vistaActual==='usuarios'?'btn-primary':'btn-outline-primary'}`} 
            onClick={()=>setVistaActual('usuarios')}
          >
            <i className="bi bi-people me-2 d-none d-sm-inline"></i>Usuarios
          </button>
          <button 
            className={`btn ${vistaActual==='categorias'?'btn-primary':'btn-outline-primary'}`} 
            onClick={()=>setVistaActual('categorias')}
          >
            <i className="bi bi-tags me-2 d-none d-sm-inline"></i>Categorías
          </button>
          <button 
            className={`btn ${vistaActual==='historial'?'btn-primary':'btn-outline-primary'}`} 
            onClick={()=>setVistaActual('historial')}
          >
            <i className="bi bi-clock-history me-2 d-none d-sm-inline"></i>Historial
          </button>
        </div>
      </div>

      {/* CONTENIDO DINÁMICO */}
      <div className="admin-content animate-fade-in">
        {vistaActual === 'dashboard' && <AdminDashboard />}
        {vistaActual === 'usuarios' && renderTablaUsuarios()}
        {vistaActual === 'categorias' && <AdminCategorias />}
        {vistaActual === 'historial' && renderHistorial()}
      </div>

      {/* MODAL DE CONFIRMACIÓN DE BLOQUEO */}
      {showBlockModal && (
        <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                  Confirmar Acción
                </h5>
                <button type="button" className="btn-close" onClick={()=>setShowBlockModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="fs-5 mb-3">
                  ¿Deseas cambiar el estado de <br/>
                  <strong className="text-primary">{usuarioSeleccionado?.correo}</strong>?
                </p>
                <div className="mb-3">
                  <ValidatedInput
                    label="Motivo de la acción (Obligatorio para el historial)"
                    value={motivoBloqueo}
                    onChange={(e) => setMotivoBloqueo(e.target.value)}
                    as="textarea"
                    rows={3}
                    placeholder="Ej: Comportamiento indebido, solicitud del usuario, etc."
                    className="mb-0"
                  />
                </div>
                <div className="alert alert-info py-2 small mb-0">
                  <i className="bi bi-info-circle me-1"></i>
                  Esta acción quedará registrada en el historial.
                </div>
              </div>
              <div className="modal-footer bg-light">
                <Button variant="secondary" onClick={()=>setShowBlockModal(false)}>Cancelar</Button>
                <Button 
                  variant="primary" 
                  onClick={confirmBlock} 
                  disabled={!motivoBloqueo.trim()} // Validar que no esté vacío
                >
                  Confirmar Cambio
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelAdmin;