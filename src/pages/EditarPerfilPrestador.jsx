import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditarPerfilPrestador.css';

const categoriasDisponibles = [
  'Plomería',
  'Electricidad',
  'Pintura',
  'Carpintería',
  'Albañilería',
  'Gasista',
  'Herrería',
  'Jardinería',
  'Techista',
  'Limpieza',
  'Refrigeración',
  'Aire Acondicionado'
];

// CU-004: Gestión de Perfil del Prestador
function EditarPerfilPrestador({ onProfileComplete }) {
  const navigate = useNavigate();
  const [errores, setErrores] = useState({});

  // RF6: Campos del perfil del prestador
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    whatsapp: '',
    descripcion: '',
    categorias: [],
    imagenes: []
  });

  // Estado para búsqueda de categorías
  const [busquedaCategoria, setBusquedaCategoria] = useState('');

  // Sugerencias filtradas
  const sugerenciasFiltradas = categoriasDisponibles.filter(
    cat => 
      cat.toLowerCase().includes(busquedaCategoria.toLowerCase()) && 
      !formData.categorias.includes(cat)
  );

  // Manejo de cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Agregar categoría
  const agregarCategoria = (categoria) => {
    if (!formData.categorias.includes(categoria)) {
      setFormData(prev => ({
        ...prev,
        categorias: [...prev.categorias, categoria]
      }));
      setBusquedaCategoria('');
      // Limpiar error
      if (errores.categorias) {
        setErrores(prev => ({
          ...prev,
          categorias: null
        }));
      }
    }
  };

  // Remover categoría
  const removerCategoria = (categoria) => {
    setFormData(prev => ({
      ...prev,
      categorias: prev.categorias.filter(c => c !== categoria)
    }));
  };

  // Manejo de imágenes (máximo 5, 5MB cada una) - RF6
  const handleImagenesChange = (e) => {
    const files = Array.from(e.target.files);
    const nuevosErrores = {};

    // Validar cantidad (máximo 5)
    if (files.length > 5) {
      nuevosErrores.imagenes = 'Máximo 5 imágenes permitidas';
      setErrores(prev => ({ ...prev, ...nuevosErrores }));
      e.target.value = '';
      return;
    }

    // Validar tamaño y formato
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

  // Validaciones según CU-004
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Nombre: obligatorio, solo letras y espacios
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)) {
      nuevosErrores.nombre = 'El nombre y apellido solo pueden contener letras y espacios';
    }

    // Apellido: obligatorio, solo letras y espacios
    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellido)) {
      nuevosErrores.apellido = 'El nombre y apellido solo pueden contener letras y espacios';
    }

    // Teléfono: entre 8 y 15 dígitos
    const telefonoLimpio = formData.telefono.replace(/\D/g, '');
    if (!telefonoLimpio) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (telefonoLimpio.length < 8 || telefonoLimpio.length > 15) {
      nuevosErrores.telefono = 'Ingrese un número de celular válido (entre 8 y 15 dígitos)';
    }

    // WhatsApp: formato correcto
    if (!formData.whatsapp.trim()) {
      nuevosErrores.whatsapp = 'El enlace de WhatsApp es obligatorio';
    } else if (!formData.whatsapp.startsWith('https://wa.me/')) {
      nuevosErrores.whatsapp = 'Ingrese un enlace válido de WhatsApp (ejemplo: https://wa.me/549XXXXXXXXXX)';
    }

    // Categorías: al menos una
    if (formData.categorias.length === 0) {
      nuevosErrores.categorias = 'Debe seleccionar al menos una categoría de servicio';
    }

    // Descripción: opcional pero si existe debe tener contenido válido
    if (formData.descripcion.trim() && formData.descripcion.length < 20) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 20 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar perfil - CU-004
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      console.log('Perfil guardado:', formData);
      
      // Simular guardado exitoso
      alert('✅ Perfil actualizado correctamente.\n\nAhora puedes acceder al panel de prestador.');
      
      // Marcar perfil como completo y redirigir
      if (onProfileComplete) {
        onProfileComplete();
      }
      navigate('/panel-prestador');
    }
  };

  // Calcular progreso del perfil
  const calcularProgreso = () => {
    let completados = 0;
    const totalCampos = 6; // nombre, apellido, telefono, whatsapp, categorias, descripcion

    if (formData.nombre.trim()) completados++;
    if (formData.apellido.trim()) completados++;
    if (formData.telefono.trim()) completados++;
    if (formData.whatsapp.trim()) completados++;
    if (formData.categorias.length > 0) completados++;
    if (formData.descripcion.trim()) completados++;

    return Math.round((completados / totalCampos) * 100);
  };

  const progreso = calcularProgreso();

  return (
    <div className="editar-perfil-container">
      {/* HEADER */}
      <div className="perfil-header mb-4">
        <div>
          <h2 className="mb-2">
            <i className="bi bi-person-badge me-2"></i>
            Completá tu Perfil de Prestador
          </h2>
          <p className="text-muted mb-0">
            Para poder recibir solicitudes de trabajo, es necesario completar tu información profesional
          </p>
        </div>
      </div>

      {/* BARRA DE PROGRESO */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Progreso del perfil</strong>
            <span className="badge bg-primary">{progreso}%</span>
          </div>
          <div className="progress" style={{ height: '10px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${progreso}%` }}
              aria-valuenow={progreso}
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          {progreso < 100 && (
            <small className="text-muted mt-2 d-block">
              <i className="bi bi-info-circle me-1"></i>
              Completa todos los campos para acceder al panel
            </small>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* INFORMACIÓN PERSONAL */}
        <div className="card perfil-section-card mb-4">
          <div className="card-header">
            <i className="bi bi-person-fill me-2"></i>
            Información Personal
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Juan"
                />
                {errores.nombre && (
                  <div className="invalid-feedback">{errores.nombre}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="apellido" className="form-label">
                  Apellido <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  className={`form-control ${errores.apellido ? 'is-invalid' : ''}`}
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Pérez"
                />
                {errores.apellido && (
                  <div className="invalid-feedback">{errores.apellido}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción de tus servicios <span className="text-muted">(opcional)</span>
              </label>
              <textarea 
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                placeholder="Contale a los clientes sobre tu experiencia, qué trabajos realizás, etc..."
              ></textarea>
              <small className="text-muted">
                Mínimo 20 caracteres. Actual: {formData.descripcion.length}
              </small>
              {errores.descripcion && (
                <div className="invalid-feedback d-block">{errores.descripcion}</div>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORÍAS DE SERVICIO - RF6 */}
        <div className="card perfil-section-card mb-4">
          <div className="card-header">
            <i className="bi bi-tools me-2"></i>
            Categorías de Servicio
          </div>
          <div className="card-body">
            <label className="form-label">
              Buscá y agregá tus especialidades <span className="text-danger">*</span>
            </label>
            <div className="position-relative mb-3">
              <input 
                type="text"
                className={`form-control ${errores.categorias ? 'is-invalid' : ''}`}
                placeholder="Ej: Electricidad, Plomería..."
                value={busquedaCategoria}
                onChange={(e) => setBusquedaCategoria(e.target.value)}
              />
              {busquedaCategoria && sugerenciasFiltradas.length > 0 && (
                <ul className="list-group position-absolute w-100 sugerencias-list">
                  {sugerenciasFiltradas.map(cat => (
                    <li 
                      key={cat} 
                      className="list-group-item list-group-item-action"
                      onClick={() => agregarCategoria(cat)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
              {errores.categorias && (
                <div className="invalid-feedback d-block">{errores.categorias}</div>
              )}
            </div>

            {/* Categorías seleccionadas */}
            <div className="categorias-seleccionadas">
              <small className="text-muted d-block mb-2">Categorías seleccionadas:</small>
              {formData.categorias.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {formData.categorias.map(cat => (
                    <span key={cat} className="badge badge-categoria">
                      <i className="bi bi-tools me-1"></i>
                      {cat}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        onClick={() => removerCategoria(cat)}
                      ></button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <small>No has seleccionado ninguna categoría aún</small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DE CONTACTO - RF6 */}
        <div className="card perfil-section-card mb-4">
          <div className="card-header">
            <i className="bi bi-telephone-fill me-2"></i>
            Información de Contacto
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="telefono" className="form-label">
                  Número de Celular <span className="text-danger">*</span>
                </label>
                <input 
                  type="tel" 
                  className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="11-2345-6789"
                />
                <small className="text-muted">Entre 8 y 15 dígitos</small>
                {errores.telefono && (
                  <div className="invalid-feedback d-block">{errores.telefono}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="whatsapp" className="form-label">
                  Enlace de WhatsApp <span className="text-danger">*</span>
                </label>
                <input 
                  type="url" 
                  className={`form-control ${errores.whatsapp ? 'is-invalid' : ''}`}
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="https://wa.me/5491123456789"
                />
                <small className="text-muted">Formato: https://wa.me/549...</small>
                {errores.whatsapp && (
                  <div className="invalid-feedback d-block">{errores.whatsapp}</div>
                )}
              </div>
            </div>

            <div className="alert alert-info">
              <i className="bi bi-shield-check me-2"></i>
              <small>
                <strong>Privacidad:</strong> Tus datos de contacto solo se mostrarán a los clientes 
                cuando acepten tu presupuesto.
              </small>
            </div>
          </div>
        </div>

        {/* GALERÍA DE TRABAJOS PREVIOS - RF6 */}
        <div className="card perfil-section-card mb-4">
          <div className="card-header">
            <i className="bi bi-images me-2"></i>
            Galería de Trabajos Previos <span className="text-muted">(opcional)</span>
          </div>
          <div className="card-body">
            <label htmlFor="imagenes" className="form-label">
              Subí ejemplos de tus trabajos
            </label>
            <input 
              className={`form-control ${errores.imagenes ? 'is-invalid' : ''}`}
              type="file" 
              id="imagenes"
              onChange={handleImagenesChange}
              multiple 
              accept=".jpg,.jpeg,.png"
            />
            <small className="text-muted d-block mt-1">
              Máximo 5 imágenes. Formatos: JPG, JPEG, PNG. Tamaño máximo: 5MB por imagen.
            </small>
            {errores.imagenes && (
              <div className="invalid-feedback d-block">{errores.imagenes}</div>
            )}
            {formData.imagenes.length > 0 && (
              <div className="mt-3">
                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>
                  <small>{formData.imagenes.length} imagen(es) seleccionada(s)</small>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="text-center">
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-lg me-3"
            onClick={() => navigate('/')}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-success btn-lg"
            disabled={progreso < 100}
          >
            <i className="bi bi-check-circle me-2"></i>
            Guardar y Acceder al Panel
          </button>
        </div>

        {progreso < 100 && (
          <div className="text-center mt-3">
            <small className="text-danger">
              <i className="bi bi-exclamation-circle me-1"></i>
              Debes completar todos los campos obligatorios para continuar
            </small>
          </div>
        )}
      </form>
    </div>
  );
}

export default EditarPerfilPrestador;