import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ValidatedInput } from '../components/common';
import '../styles/pages/EditarPerfilPrestador.css';

function EditarPerfilPrestador() {
  const navigate = useNavigate();
  const [errores, setErrores] = useState({});

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    whatsapp: '',
    descripcion: '',
    categorias: [],
    imagenes: [],
    provincia: '',
    localidad: '',
    direccion: '',
    edad: ''
  });

  // Cargar datos existentes del prestador al montar el componente
  useEffect(() => {

    const datosExistentes = {
      nombre: 'Juan',
      apellido: 'Pérez', 
      telefono: '11-2345-6789',
      whatsapp: 'https://wa.me/5491123456789',
      descripcion: 'Plomero con 10 años de experiencia...',
      categorias: ['Plomería', 'Gasista'],
      imagenes: [],
      provincia: 'Buenos Aires',
      localidad: 'La Plata',
      direccion: 'Av. 7 N° 1234',
      edad: '35'
    };
    
    setFormData(datosExistentes);
  }, []);

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

  // Validaciones
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)) {
      nuevosErrores.nombre = 'El nombre solo puede contener letras y espacios';
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellido)) {
      nuevosErrores.apellido = 'El apellido solo puede contener letras y espacios';
    }

    const telefonoLimpio = formData.telefono.replace(/\D/g, '');
    if (!telefonoLimpio) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (telefonoLimpio.length < 8 || telefonoLimpio.length > 15) {
      nuevosErrores.telefono = 'Ingrese un número válido (entre 8 y 15 dígitos)';
    }

    if (!formData.whatsapp.trim()) {
      nuevosErrores.whatsapp = 'El enlace de WhatsApp es obligatorio';
    } else if (!formData.whatsapp.startsWith('https://wa.me/')) {
      nuevosErrores.whatsapp = 'Ingrese un enlace válido de WhatsApp';
    }

    if (formData.categorias.length === 0) {
      nuevosErrores.categorias = 'Debe seleccionar al menos una categoría';
    }

    if (formData.descripcion.trim() && formData.descripcion.length < 20) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 20 caracteres';
    }

    // Validar ubicación y edad
    const edad = parseInt(formData.edad);
    if (!formData.edad) {
      nuevosErrores.edad = 'La edad es obligatoria';
    } else if (isNaN(edad) || edad < 18) {
      nuevosErrores.edad = 'Debes ser mayor de 18 años';
    }

    if (!formData.provincia) {
      nuevosErrores.provincia = 'La provincia es obligatoria';
    }

    if (!formData.localidad.trim()) {
      nuevosErrores.localidad = 'La localidad es obligatoria';
    }

    return nuevosErrores;
  };

  // Guardar cambios
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const erroresValidacion = validarFormulario();
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length === 0) {
      console.log('Perfil actualizado:', formData);
      alert('✅ Perfil actualizado correctamente.');
      navigate('/panel-prestador');
    }
  };

  return (
    <div className="editar-perfil-container">
      {/* HEADER - Solo para edición */}
      <div className="perfil-header mb-4">
        <div className="d-flex align-items-center">
          <Button 
            variant="outline-secondary"
            className="me-3"
            onClick={() => navigate('/panel-prestador')}
            icon="arrow-left"
          />
          <div>
            <h2 className="mb-0">
              <i className="bi bi-pencil-square me-2"></i>
              Editar Mi Perfil
            </h2>
            <p className="text-muted mb-0">
              Actualiza tu información y servicios
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* INFORMACIÓN PERSONAL */}
        <div className="card mb-4">
          <div className="card-header">
            <i className="bi bi-person-fill me-2"></i>
            Información Personal
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <ValidatedInput
                  type="text"
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Juan"
                  error={errores.nombre}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <ValidatedInput
                  type="text"
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Pérez"
                  error={errores.apellido}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <ValidatedInput
                  type="number"
                  label="Edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  min={18}
                  max={100}
                  error={errores.edad}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <ValidatedInput
                as="textarea"
                label="Descripción de servicios"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe tu experiencia y servicios..."
                error={errores.descripcion}
                helperText={`Mínimo 20 caracteres. Actual: ${formData.descripcion.length}`}
              />
            </div>
          </div>
        </div>

        {/* UBICACIÓN */}
        <div className="card mb-4">
          <div className="card-header">
            <i className="bi bi-geo-alt-fill me-2"></i>
            Ubicación
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="provincia" className="form-label">
                  Provincia <span className="text-danger">*</span>
                </label>
                <select 
                  className={`form-select ${errores.provincia ? 'is-invalid' : ''}`}
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una provincia</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Santa Fe">Santa Fe</option>
                </select>
                {errores.provincia && (
                  <div className="invalid-feedback">{errores.provincia}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <ValidatedInput
                  type="text"
                  label="Localidad"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleInputChange}
                  placeholder="La Plata"
                  error={errores.localidad}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <ValidatedInput
                type="text"
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Av. 7 N° 1234"
                helperText="(opcional)"
              />
            </div>
          </div>
        </div>
        {/* BOTONES */}
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <Button 
            variant="outline-secondary"
            className="me-md-2"
            onClick={() => navigate('/panel-prestador')}
            icon="x-circle"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="success"
            size="large"
            icon="check-circle"
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditarPerfilPrestador;