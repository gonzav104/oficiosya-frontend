import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Button, ValidatedInput } from '../components/common';
import { getUbicacionDelUsuario } from '../utils/userUtils'; // *CAMBIO*----------------------
import { getSolicitudes } from '../utils/solicitudes'; // *CAMBIO*----------------------
import { useAuth } from '../contexts/AuthContext'; // *CAMBIO*----------------------
import '../styles/pages/PanelSolicitante.css';



// Datos de Ejemplo
/*const solicitudesFalsas = [
  { 
    id: 1, 
    titulo: 'Reparación de canilla en cocina', 
    estado: 'Iniciada', 
    categoria: 'Plomería',
    localidad: 'Baradero', 
    fechaCreacion: '2025-01-15',
    hace: '2 horas', 
    descripcion: 'Se necesita reparar una canilla que pierde agua constantemente.',
    imagenes: []
  },
  { 
    id: 2, 
    titulo: 'Instalación de ventilador de techo', 
    estado: 'Enviada', 
    categoria: 'Electricidad',
    localidad: 'San Pedro', 
    fechaCreacion: '2025-01-14',
    hace: '1 día', 
    descripcion: 'Necesito instalar un ventilador de techo en el dormitorio principal.',
    imagenes: []
  },
  { 
    id: 3, 
    titulo: 'Pintura de fachada', 
    estado: 'Cotizada', 
    categoria: 'Pintura',
    localidad: 'Baradero', 
    fechaCreacion: '2025-01-12',
    hace: '3 días', 
    descripcion: 'Pintar la fachada de una casa de 2 pisos, aproximadamente 150m².',
    imagenes: []
  },
  { 
    id: 4, 
    titulo: 'Arreglo de enchufe', 
    estado: 'Pendiente de Calificación', 
    categoria: 'Electricidad',
    localidad: 'San Pedro', 
    fechaCreacion: '2025-01-08',
    hace: '1 semana', 
    descripcion: 'Un enchufe dejó de funcionar en la sala de estar.',
    imagenes: []
  },
  { 
    id: 5, 
    titulo: 'Revisión de instalación de gas', 
    estado: 'Cerrada', 
    categoria: 'Gasista',
    localidad: 'Baradero', 
    fechaCreacion: '2024-12-20',
    hace: '1 mes', 
    descripcion: 'Necesito revisión completa de la instalación de gas natural.',
    imagenes: []
  }
]; 
*/

// ------------------------------------

function PanelSolicitante() {

  const [filtro, setFiltro] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true); //*CAMIBIO*--------
  const [solicitudes, setSolicitudes] = useState([]); //*CAMIBIO*--------
  const [categorias, setCategorias] = useState([]); //*CAMIBIO*--------
  const [idUbicacionUsuario, setIdUbicacionUsuario] = useState(null); //*CAMIBIO*--------

  const { user } = useAuth();  //*CAMIBIO*--------


  // Estado del formulario de nueva solicitud
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    descripcion: '',
    imagenes: []
  });

  //---------------------------

  // Nuevo estado para el modal de presupuesto recibido
  const [showModalPresupuesto, setShowModalPresupuesto] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [presupuestoAceptado, setPresupuestoAceptado] = useState(false);




  // Simulación de presupuesto recibido
  const presupuestoEjemplo = {
    idSolicitud: 3,
    nombrePrestador: "Diego Martínez",
    monto: 25000,
    mensaje: "Incluye materiales y mano de obra. Finalización estimada: 2 días.",
    contacto: {
      telefono: "+54 9 3329 456789",
      correo: "diego.martinez@example.com",
      whatsapp: "https://wa.me/543329456789"
    }
  };



  const handleMostrarPresupuesto = () => {
    setPresupuestoSeleccionado(presupuestoEjemplo);
    setShowModalPresupuesto(true);
  };

  const handleAceptarPresupuesto = () => {
    setPresupuestoAceptado(true);
    alert("Presupuesto aceptado. La solicitud cambia a 'Pendiente de Calificación'.");
  };

  const handleRechazarPresupuesto = () => {
    alert("Has rechazado el presupuesto. La solicitud permanecerá en estado 'Cotizada'.");
    setShowModalPresupuesto(false);
  };



  //*CAMIBIO*---------------------------------------------------------------------------------------------

  // 1. Cargar solicitudes del cliente (depende de id_cliente)
  useEffect(() => {
    if (!user?.id_cliente) {
      setSolicitudes([]);
      return;
    }

    async function cargarSolicitudes() {
      setLoading(true);
      const data = await getSolicitudes(user.id_cliente);
      setSolicitudes(data);
      setLoading(false);
    }

    cargarSolicitudes();
  }, [user?.id_cliente]);


  // 2. Cargar categorías (solo una vez, nunca cambia)
  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then(res => res.json())
      .then(json => setCategorias(json.data?.categoriasCompletas || []))
      .catch(() => setCategorias([]));
  }, []);

  //3. Cargar ubicación del usuario
  useEffect(() => {
    if (!user?.id_cliente) {
      setIdUbicacionUsuario(null);
      return;
    }

    const cargarUbicacion = async () => {
      try {
        const idUbicacion = await getUbicacionDelUsuario(user.id_usuario);
        if (idUbicacion) {
          setIdUbicacionUsuario(idUbicacion);
        } else {
          alert("Completa tu ubicación en el perfil para poder crear solicitudes.");
        }
      } catch (error) {
        console.error("Error cargando ubicación:", error);
        alert("Error al cargar tu ubicación.");
      }
    };

    cargarUbicacion();
  }, [user?.id_cliente]);

  //-------------------------------------------------------------------------------------------------------


  // Filtrar solicitudes por estado

  const solicitudesFiltradas = solicitudes.filter(solicitud => {  //*CAMIBIO*--------SOLICITUDESFALSAS POR SOLICITUDES
    if (filtro === 'Todos') return true;
    return solicitud.estado === filtro;
  });

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Manejo de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const nuevosErrores = {};

    if (files.length > 3) {
      nuevosErrores.imagenes = 'Máximo 3 imágenes permitidas';
      setErrores(prev => ({ ...prev, ...nuevosErrores }));
      return;
    }

    const archivosValidos = [];
    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        nuevosErrores.imagenes = 'Cada imagen debe pesar menos de 5MB';
        break;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        nuevosErrores.imagenes = 'Solo se permiten archivos JPG, JPEG y PNG';
        break;
      }
      archivosValidos.push(file);
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(prev => ({ ...prev, ...nuevosErrores }));
      e.target.value = '';
    } else {
      setFormData(prev => ({
        ...prev,
        imagenes: archivosValidos
      }));
      setErrores(prev => ({
        ...prev,
        imagenes: null
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio';
    } else if (formData.titulo.trim().length < 5) {         // *CAMBIO*-----------
      nuevosErrores.titulo = 'El título debe tener al menos 5 caracteres';
    } else if (formData.titulo.length > 80) {
      nuevosErrores.titulo = 'Ingrese un título válido (máx. 80 caracteres)';
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'Debe seleccionar una categoría de servicio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.trim().length < 10) {     // *CAMBIO*-----------  
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.descripcion.length > 500) {
      nuevosErrores.descripcion = 'Ingrese una descripción de hasta 500 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejo de envío del formulario de nueva solicitud - *CAMBIO*----------------------

  const handleGuardarSolicitud = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;
    if (!user?.id_cliente) return alert("No estás autenticado");
    if (!idUbicacionUsuario) return alert("Falta ubicación");

    const body = {
      id_categoria: parseInt(formData.categoria),
      id_ubicacion: idUbicacionUsuario,
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim()
    };

    try {
      const response = await fetch(`http://localhost:3000/api/clientes/${user.id_cliente}/solicitudes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Solicitud creada con éxito");
        setFormData({
          titulo: '',
          categoria: '',
          descripcion: '',
          imagenes: []
        });
        setErrores({});
        setShowModal(false);
        // recargar solicitudes...
        const nuevas = await getSolicitudes(user.id_cliente);
        setSolicitudes(nuevas);
        
      } else {
        alert(result.message("Error al crear solicitud"));
      }

    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  const handleCancelar = () => {
    if (formData.titulo || formData.descripcion || formData.categoria) {
      if (window.confirm('¿Desea cancelar la creación de la solicitud? Los datos no guardados se perderán.')) {
        setFormData({
          titulo: '',
          categoria: '',
          descripcion: '',
          imagenes: []
        });
        setErrores({});
        setShowModal(false);
      }
    } else {
      setShowModal(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Iniciada': 'bg-secondary',
      'Enviada': 'bg-primary',
      'Cotizada': 'bg-info',
      'Pendiente de Calificación': 'bg-warning text-dark',
      'Cerrada': 'bg-success',
      'Cancelada': 'bg-danger'
    };
    return badges[estado] || 'bg-secondary';
  };

  return (
    <div className="panel-solicitante">
      {/* HEADER */}
      <div className="panel-header">
        <div>
          <h2 className="mb-1">¡Bienvenido, Juan!</h2>
          <p className="text-muted">Gestiona tus solicitudes de servicio</p>
        </div>
        <Button
          variant="success"
          size="large"
          onClick={() => setShowModal(true)}
          icon="plus-circle"
        >
          Crear Nueva Solicitud
        </Button>
      </div>

      {/* FILTROS */}
      <div className="filtros-section">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Mis Solicitudes
            <span className="badge bg-secondary ms-2">{solicitudesFiltradas.length}</span>
          </h4>
          <div className="dropdown">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <i className="bi bi-funnel me-2"></i>
              Filtrar: {filtro}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {['Todos', 'Iniciada', 'Enviada', 'Cotizada', 'Pendiente de Calificación', 'Cerrada', 'Cancelada'].map((estado) => (
                <li key={estado}>
                  <button
                    className={`dropdown-item ${filtro === estado ? 'active' : ''}`}
                    onClick={() => setFiltro(estado)}
                  >
                    {estado}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* GRILLA DE SOLICITUDES */}
      <div className="row g-4">
        {solicitudesFiltradas.length > 0 ? (
          solicitudesFiltradas.map((solicitud) => (
            <div key={solicitud.id} className="col-md-6 col-lg-4">
              <div className="card solicitud-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{solicitud.titulo}</h5>
                    <span className={`badge ${getEstadoBadge(solicitud.estado)}`}>
                      {solicitud.estado}
                    </span>
                  </div>
                  <div className="solicitud-meta mb-3">
                    <span className="me-3">
                      <i className="bi bi-tag me-1"></i>{solicitud.categoria}
                    </span>
                    <span className="me-3">
                      <i className="bi bi-geo-alt me-1"></i>{solicitud.localidad}
                    </span>
                    <span className="text-muted">
                      <i className="bi bi-clock me-1"></i>Hace {solicitud.hace}
                    </span>
                  </div>
                  <p className="card-text text-muted">
                    {solicitud.descripcion.length > 100
                      ? solicitud.descripcion.substring(0, 100) + '...'
                      : solicitud.descripcion}
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  <Button
                    as={Link}
                    to={`/solicitud/${solicitud.id}`}
                    variant="outline-primary"
                    size="small"
                    icon="eye"
                    className="w-100"
                  >
                    Ver Detalles
                  </Button>
                  {solicitud.estado === 'Cotizada' && (
                    <Button
                      variant="warning"
                      size="small"
                      onClick={handleMostrarPresupuesto}
                      icon="cash-coin"
                      className="w-100 mt-2"
                    >
                      Ver Presupuesto Recibido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron solicitudes con el filtro "{filtro}".
            </div>
          </div>
        )}
      </div>

      {/* MODAL CREAR SOLICITUD */}
      {showModal && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-file-earmark-plus me-2"></i>
                    Crear Nueva Solicitud de Servicio
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCancelar}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleGuardarSolicitud} id="formSolicitud">
                    {/* Campos del formulario */}
                    <ValidatedInput
                      type="text"
                      name="titulo"
                      label="Título"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      error={errores.titulo}
                      maxLength={80}
                      placeholder="Ej: Reparación de canilla en cocina"
                      required
                      helpText={`${formData.titulo.length}/80 caracteres`}
                    />

                    <div className="row">
                      <div className="mb-3">
                        <label htmlFor="categoria" className="form-label">Categoría <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
                          id="categoria"
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleInputChange}
                        >
                          <option value="">Seleccionar...</option>
                          {categorias.map(cat => <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>)}
                        </select>
                        {errores.categoria && <div className="invalid-feedback d-block">{errores.categoria}</div>}
                      </div>

                    </div>

                    <ValidatedInput
                      as="textarea"
                      name="descripcion"
                      label="Descripción"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      error={errores.descripcion}
                      rows={4}
                      maxLength={500}
                      placeholder="Describe detalladamente el servicio que necesitas..."
                      required
                      helpText={`${formData.descripcion.length}/500 caracteres`}
                    />

                    <div className="mb-3">
                      <label htmlFor="imagenes" className="form-label">Imágenes (opcional)</label>
                      <input
                        className={`form-control ${errores.imagenes ? 'is-invalid' : ''}`}
                        type="file"
                        id="imagenes"
                        onChange={handleImageChange}
                        multiple
                        accept=".jpg,.jpeg,.png"
                      />
                      {errores.imagenes && <div className="invalid-feedback d-block">{errores.imagenes}</div>}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={handleCancelar}
                    icon="x-circle"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    form="formSolicitud"
                    variant="primary"
                    icon="check-circle"
                  >
                    Publicar Solicitud
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL PRESUPUESTO RECIBIDO */}
      {showModalPresupuesto && presupuestoSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-cash-coin me-2"></i>Presupuesto Recibido
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModalPresupuesto(false)}></button>
                </div>

                <div className="modal-body text-center">
                  <h5 className="mb-3">{presupuestoSeleccionado.nombrePrestador}</h5>
                  <p className="fw-bold text-success fs-4 mb-3">${presupuestoSeleccionado.monto.toLocaleString()}</p>
                  <p className="text-muted mb-4">{presupuestoSeleccionado.mensaje}</p>

                  {!presupuestoAceptado ? (
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      ¿Deseas aceptar este presupuesto? Si lo haces, se mostrarán los datos de contacto del prestador.
                    </div>
                  ) : (
                    <div className="alert alert-success text-start">
                      <strong>Datos de contacto del prestador:</strong>
                      <ul className="mt-2">
                        <li><i className="bi bi-telephone me-2"></i>{presupuestoSeleccionado.contacto.telefono}</li>
                        <li><i className="bi bi-envelope me-2"></i>{presupuestoSeleccionado.contacto.correo}</li>
                        <li>
                          <i className="bi bi-whatsapp me-2"></i>
                          <a href={presupuestoSeleccionado.contacto.whatsapp} target="_blank" rel="noreferrer">
                            Enviar mensaje
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  {!presupuestoAceptado ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={handleRechazarPresupuesto}
                        icon="x-circle"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="success"
                        onClick={handleAceptarPresupuesto}
                        icon="check-circle"
                      >
                        Aceptar Presupuesto
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setShowModalPresupuesto(false)}
                      icon="door-closed"
                    >
                      Cerrar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PanelSolicitante;
