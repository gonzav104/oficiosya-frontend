import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { USER_ROLES } from "../utils/constants";
import { categoriaService } from "../api/api";
import { getProvincias, getLocalidades } from "../api/georef";
import {
  ValidatedInput,
  PasswordInput,
  Button,
  AlertMessage,
  LoadingSpinner,
} from "../components/common";
import "../styles/pages/Auth.css";
import logo from "../assets/logo_isotipo.png";
import {
  generarEnlaceWhatsApp,
  validarRegistroCompleto,
  validarImagenes,
  politicaContrasena,
} from "../utils/validaciones.js";
import { crearUbicacion } from "../utils/ubicacion.js";

function Registro() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const [paso, setPaso] = useState(1);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [errores, setErrores] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);

  // Datos comunes para ambos tipos de usuario
  const [datosComunes, setDatosComunes] = useState({
    email: "",
    contrasena: "",
    confirmarContrasena: "",
    edad: "",
    provincia: "",
    localidad: "",
    direccion: "",
  });

  // Datos específicos del solicitante
  const [datosSolicitante, setDatosSolicitante] = useState({
    nombreCompleto: "",
  });

  // Datos específicos del prestador
  const [datosPrestador, setDatosPrestador] = useState({
    nombreCompleto: "",
    telefono: "",
    whatsapp: "",
    descripcion: "",
    experienciaAnios: 0,
    categorias: [],
    imagenes: [],
  });

  // Estado para búsqueda de categorías
  const [busquedaCategoria, setBusquedaCategoria] = useState("");

  // Cargar datos del backend al montar componente
  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingData(true);
      try {
        // Obtener categorías del back y provincias (GeoRef)
        const [categoriasResponse, provinciasGeoRef] = await Promise.all([
          categoriaService.getAll(),
          getProvincias(),
        ]);
        const categoriasData =
          categoriasResponse.data || categoriasResponse.categorias || [];
        setCategorias(categoriasData);
        setProvincias(provinciasGeoRef);
      } catch (error) {
        // Fallback en caso de error
        setCategorias([
          "Plomería",
          "Electricidad",
          "Pintura",
          "Carpintería",
          "Albañilería",
          "Gasista",
          "Herrería",
          "Jardinería",
          "Techista",
          "Limpieza",
          "Refrigeración",
          "Aire Acondicionado",
        ]);
        setProvincias([
          "Buenos Aires",
          "Córdoba",
          "Santa Fe",
          "Mendoza",
          "Tucumán",
          "Entre Ríos",
          "Salta",
          "Chaco",
        ]);
      } finally {
        setLoadingData(false);
      }
    };
    cargarDatos();
  }, []);

  // Cargar localidades cuando cambia la provincia
  useEffect(() => {
    const cargarLocalidades = async () => {
      setLoadingLocalidades(true);
      try {
        if (datosComunes.provincia) {
          const localidadesGeoRef = await getLocalidades(
            datosComunes.provincia
          );
          setLocalidades(localidadesGeoRef);
        } else {
          setLocalidades([]);
        }
      } catch (error) {
        setLocalidades([]);
      } finally {
        setLoadingLocalidades(false);
      }
    };
    cargarLocalidades();
  }, [datosComunes.provincia]);

  // Filtrar sugerencias de categorías
  const sugerenciasFiltradas = Array.isArray(categorias)
    ? categorias.filter(
        (categoria) =>
          categoria.toLowerCase().includes(busquedaCategoria.toLowerCase()) &&
          !datosPrestador.categorias.includes(categoria)
      )
    : [];

  // Seleccionar tipo de usuario
  const seleccionarTipoUsuario = (tipo) => {
    setTipoUsuario(tipo);
    setPaso(2);
    setErrores({});
  };

  // Volver al paso anterior
  const volverAlPaso1 = () => {
    setPaso(1);
    setTipoUsuario("");
    setErrores({});
  };

  // Limpiar error de un campo específico
  const limpiarError = (nombreCampo) => {
    if (errores[nombreCampo]) {
      setErrores((erroresAnteriores) => ({
        ...erroresAnteriores,
        [nombreCampo]: null,
      }));
    }
  };

  // Manejo de cambios en datos comunes
  const handleComunesChange = (evento) => {
    const { name, value } = evento.target;
    setDatosComunes((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }));
    limpiarError(name);
  };

  // Manejo de cambios en datos de solicitante
  const handleSolicitanteChange = (evento) => {
    const { name, value } = evento.target;
    setDatosSolicitante((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }));
    limpiarError(name);
  };

  // Manejo de cambios en datos de prestador
  const handlePrestadorChange = (evento) => {
    const { name, value } = evento.target;

    // Si el campo es teléfono, generar automáticamente el enlace de WhatsApp
    if (name === "telefono") {
      const enlaceWhatsApp = generarEnlaceWhatsApp(value);
      setDatosPrestador((datosAnteriores) => ({
        ...datosAnteriores,
        [name]: value,
        whatsapp: enlaceWhatsApp,
      }));
    } else {
      setDatosPrestador((datosAnteriores) => ({
        ...datosAnteriores,
        [name]: value,
      }));
    }

    limpiarError(name);
  };

  // Agregar categoría para prestador
  const agregarCategoria = (categoria) => {
    if (!datosPrestador.categorias.includes(categoria)) {
      setDatosPrestador((datosAnteriores) => ({
        ...datosAnteriores,
        categorias: [...datosAnteriores.categorias, categoria],
      }));
      setBusquedaCategoria("");
      limpiarError("categorias");
    }
  };

  // Remover categoría para prestador
  const removerCategoria = (categoria) => {
    setDatosPrestador((datosAnteriores) => ({
      ...datosAnteriores,
      categorias: datosAnteriores.categorias.filter((cat) => cat !== categoria),
    }));
  };

  // Manejo de imágenes para prestador
  const handleImagenesChange = (evento) => {
    const archivos = Array.from(evento.target.files);
    const erroresValidacion = validarImagenes(archivos);

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores((erroresAnteriores) => ({
        ...erroresAnteriores,
        ...erroresValidacion,
      }));
      evento.target.value = "";
    } else {
      setDatosPrestador((datosAnteriores) => ({
        ...datosAnteriores,
        imagenes: archivos,
      }));
      limpiarError("imagenes");
    }
  };

  // Probar enlace de WhatsApp
  const probarWhatsApp = () => {
    if (datosPrestador.whatsapp) {
      window.open(datosPrestador.whatsapp, "_blank");
    }
  };

  // Enviar formulario
  const handleSubmit = async (evento) => {
    evento.preventDefault();

    const datosEspecificos =
      tipoUsuario === "solicitante" ? datosSolicitante : datosPrestador;
    const erroresValidacion = validarRegistroCompleto(
      tipoUsuario,
      datosComunes,
      datosEspecificos
    );

    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length === 0) {
      setIsLoading(true);
      setErrores({});

      try {
        
        console.log("🌍 Enviando ubicación:", {
          provincia: datosComunes.provincia,
          localidad: datosComunes.localidad,
          direccion: datosComunes.direccion,
        });

        const ubicacionId = await crearUbicacion({
          provincia: datosComunes.provincia,
          localidad: datosComunes.localidad,
          direccion: datosComunes.direccion,
        });
        // Construir datos base
        const datosBase = {
          email: datosComunes.email,
          password: datosComunes.contrasena,
          fechaNacimiento: datosComunes.edad
            ? new Date(
                new Date().getFullYear() - parseInt(datosComunes.edad),
                0,
                1
              )
                .toISOString()
                .split("T")[0]
            : null,
          ubicacionId,
        };

        // Agregar datos específicos según el tipo de usuario
        const datosRegistro =
          tipoUsuario === "solicitante"
            ? {
                ...datosBase,
                nombreCompleto: datosSolicitante.nombreCompleto,
                userType: "solicitante", // Agregar userType para el mapeo
              }
            : {
                ...datosBase,
                nombreCompleto: datosPrestador.nombreCompleto,
                telefono: datosPrestador.telefono,
                descripcion: datosPrestador.descripcion,
                experiencia: parseInt(datosPrestador.experienciaAnios) || 0,
                categorias: datosPrestador.categorias,
                userType: "prestador", // Agregar userType para el mapeo
              };

        const resultado = await register(datosRegistro, tipoUsuario);

        // Registro exitoso - redirigir según el tipo y si hay token
        if (resultado.token) {
          // Auto-login exitoso, dar un pequeño delay para que el estado se actualice
          setTimeout(() => {
            if (tipoUsuario === "solicitante") {
              navigate("/panel-solicitante");
            } else {
              navigate("/panel-prestador");
            }
          }, 100);
        } else {
          // Registro exitoso pero sin token, redirigir al login
          navigate("/login", {
            state: {
              message: "Registro exitoso. Por favor, inicia sesión.",
              email: datosRegistro.email,
            },
          });
        }
      } catch (error) {
        setErrores({
          general:
            error.message ||
            "Error al registrarse. Por favor, intentá nuevamente.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

      // Si el usuario ya está autenticado, no permitir acceder a registro
      if (isAuthenticated && user) {
        const rol = user.rol ? user.rol.toLowerCase() : '';

        if (rol === USER_ROLES.CLIENTE_LOWER) {
          return <Navigate to="/panel-solicitante" replace />;
        }

        if (rol === USER_ROLES.PRESTADOR_LOWER) {
          return <Navigate to="/panel-prestador" replace />;
        }

        if (rol === USER_ROLES.ADMIN_LOWER) {
          return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/" replace />;
      }

  if (loadingData) {
    return (
      <div className="auth-page">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p>Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar paso 1: Selección de tipo de usuario
  if (paso === 1) {
    return (
      <div className="auth-page">
        {/* Botón de volver al home */}
        <Link to="/" className="btn-back-home">
          <i className="bi bi-arrow-left"></i>
          <span className="ms-2">Volver al inicio</span>
        </Link>

        <div className="auth-header">
          <Link to="/" className="auth-logo-link">
            <img src={logo} alt="Logo OficiosYA" className="auth-logo" />
            <h1 className="auth-title">OficiosYA</h1>
            <p className="auth-subtitle">Conectando servicios en Argentina</p>
          </Link>
        </div>

        <div className="auth-card">
          <h2 className="text-center mb-3">
            ¿Qué tipo de cuenta querés crear?
          </h2>
          <p className="text-center text-muted mb-4">
            Elegí la opción que mejor describa tu necesidad
          </p>

          <div className="row g-3">
            <div className="col-md-6">
              <div
                className="card tipo-usuario-card h-100"
                onClick={() => seleccionarTipoUsuario("solicitante")}
              >
                <div className="card-body text-center">
                  <i className="bi bi-person-check display-1 text-primary mb-3"></i>
                  <h4>Solicitante</h4>
                  <p className="text-muted mb-3">
                    Busco contratar servicios para mi hogar o negocio
                  </p>
                  <ul className="list-unstyled text-start small">
                    <li>
                      <i className="bi bi-check text-success me-2"></i>Publicar
                      solicitudes
                    </li>
                    <li>
                      <i className="bi bi-check text-success me-2"></i>Recibir
                      presupuestos
                    </li>
                    <li>
                      <i className="bi bi-check text-success me-2"></i>Contactar
                      prestadores
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="card tipo-usuario-card h-100"
                onClick={() => seleccionarTipoUsuario("prestador")}
              >
                <div className="card-body text-center">
                  <i className="bi bi-tools display-1 text-success mb-3"></i>
                  <h4>Prestador</h4>
                  <p className="text-muted mb-3">
                    Ofrezco servicios profesionales y quiero conseguir clientes
                  </p>
                  <ul className="list-unstyled text-start small">
                    <li>
                      <i className="bi bi-check text-success me-2"></i>Recibir
                      solicitudes
                    </li>
                    <li>
                      <i className="bi bi-check text-success me-2"></i>Enviar
                      presupuestos
                    </li>
                    <li>
                      <i className="bi bi-check text-success me-2"></i>Mostrar
                      trabajos
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p>
              ¿Ya tenés cuenta?{" "}
              <Link to="/login" className="auth-link">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar paso 2: Formulario según tipo de usuario
  return (
    <div className="auth-page">
      {/* Botón de volver al home */}
      <Link to="/" className="btn-back-home">
        <i className="bi bi-arrow-left"></i>
        <span className="ms-2">Volver al inicio</span>
      </Link>

      <div className="auth-header">
        <Link to="/" className="auth-logo-link">
          <img src={logo} alt="Logo OficiosYA" className="auth-logo" />
          <h1 className="auth-title">OficiosYA</h1>
          <p className="auth-subtitle">Conectando servicios en Argentina</p>
        </Link>
      </div>

      <div className="auth-card auth-card-large">
        {/* Header del formulario */}
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="outline-secondary"
            size="medium"
            onClick={volverAlPaso1}
            icon="arrow-left"
            className="me-3"
          />
          <div>
            <h2 className="mb-0">
              Registro como{" "}
              {tipoUsuario === "solicitante" ? "Solicitante" : "Prestador"}
            </h2>
            <p className="text-muted mb-0">
              Completá tus datos para crear tu cuenta
            </p>
          </div>
        </div>

        {errores.general && (
          <AlertMessage
            type="error"
            message={errores.general}
            icon="exclamation-triangle"
          />
        )}

        <form onSubmit={handleSubmit}>
          {/* DATOS PERSONALES */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-person-fill me-2"></i>
              Datos Personales
            </div>
            <div className="card-body">
              {tipoUsuario === "solicitante" ? (
                <div className="mb-3">
                  <label htmlFor="nombreCompleto" className="form-label">
                    Nombre Completo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errores.nombreCompleto ? "is-invalid" : ""
                    }`}
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={datosSolicitante.nombreCompleto}
                    onChange={handleSolicitanteChange}
                    placeholder="Juan Pérez"
                  />
                  {errores.nombreCompleto && (
                    <div className="invalid-feedback">
                      {errores.nombreCompleto}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-3">
                  <label
                    htmlFor="nombreCompletoPrestador"
                    className="form-label"
                  >
                    Nombre completo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errores.nombreCompleto ? "is-invalid" : ""
                    }`}
                    id="nombreCompletoPrestador"
                    name="nombreCompleto"
                    value={datosPrestador.nombreCompleto}
                    onChange={handlePrestadorChange}
                    placeholder="Juan Pérez"
                    maxLength="100"
                  />
                  {errores.nombreCompleto && (
                    <div className="invalid-feedback">
                      {errores.nombreCompleto}
                    </div>
                  )}
                </div>
              )}

              <ValidatedInput
                type="number"
                name="edad"
                label="Edad"
                value={datosComunes.edad}
                onChange={handleComunesChange}
                error={errores.edad}
                placeholder="25"
                min="18"
                max="100"
                required
                helpText="Debés ser mayor de 18 años"
              />

              {tipoUsuario === "prestador" && (
                <>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                      Descripción de servicios{" "}
                      <span className="text-muted">(opcional)</span>
                    </label>
                    <textarea
                      className={`form-control ${
                        errores.descripcion ? "is-invalid" : ""
                      }`}
                      id="descripcion"
                      name="descripcion"
                      value={datosPrestador.descripcion}
                      onChange={handlePrestadorChange}
                      rows="3"
                      placeholder="Describí tu experiencia y servicios..."
                    ></textarea>
                    <small className="text-muted">
                      {datosPrestador.descripcion.length > 0
                        ? `${datosPrestador.descripcion.length}/500 caracteres`
                        : "Mínimo 20 caracteres (opcional)"}
                    </small>
                    {errores.descripcion && (
                      <div className="invalid-feedback d-block">
                        {errores.descripcion}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="experienciaAnios" className="form-label">
                      Años de experiencia{" "}
                      <span className="text-muted">(opcional)</span>
                    </label>
                    <select
                      className={`form-select ${
                        errores.experienciaAnios ? "is-invalid" : ""
                      }`}
                      id="experienciaAnios"
                      name="experienciaAnios"
                      value={datosPrestador.experienciaAnios}
                      onChange={handlePrestadorChange}
                    >
                      <option value="">Seleccioná tu experiencia</option>
                      <option value="0">Sin experiencia previa</option>
                      <option value="1">1 año</option>
                      <option value="2">2 años</option>
                      <option value="3">3 años</option>
                      <option value="4">4 años</option>
                      <option value="5">5 años</option>
                      <option value="6">6-10 años</option>
                      <option value="11">11-15 años</option>
                      <option value="16">16-20 años</option>
                      <option value="21">Más de 20 años</option>
                    </select>
                    <small className="text-muted">
                      Seleccioná los años de experiencia que tenés en el oficio
                      (opcional)
                    </small>
                    {errores.experienciaAnios && (
                      <div className="invalid-feedback d-block">
                        {errores.experienciaAnios}
                      </div>
                    )}
                  </div>
                </>
              )}
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
                    className={`form-select ${
                      errores.provincia ? "is-invalid" : ""
                    }`}
                    id="provincia"
                    name="provincia"
                    value={datosComunes.provincia}
                    onChange={handleComunesChange}
                  >
                    <option value="">Seleccioná una provincia</option>
                    {provincias.map((provincia) => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </select>
                  {errores.provincia && (
                    <div className="invalid-feedback">{errores.provincia}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="localidad" className="form-label">
                    Localidad <span className="text-danger">*</span>
                  </label>
                  {loadingLocalidades ? (
                    <div
                      className="form-control bg-light text-muted"
                      style={{ minHeight: 38 }}
                    >
                      Cargando localidades...
                    </div>
                  ) : (
                    <select
                      className={`form-select ${
                        errores.localidad ? "is-invalid" : ""
                      }`}
                      id="localidad"
                      name="localidad"
                      value={datosComunes.localidad}
                      onChange={handleComunesChange}
                      disabled={
                        !datosComunes.provincia || localidades.length === 0
                      }
                    >
                      <option value="">Seleccioná una localidad</option>
                      {localidades.map((localidad) => (
                        <option key={localidad} value={localidad}>
                          {localidad}
                        </option>
                      ))}
                    </select>
                  )}
                  {errores.localidad && (
                    <div className="invalid-feedback">{errores.localidad}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">
                  Dirección <span className="text-muted">(opcional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="direccion"
                  name="direccion"
                  value={datosComunes.direccion}
                  onChange={handleComunesChange}
                  placeholder="Av. Corrientes 1234"
                />
                <small className="text-muted">
                  La dirección completa es opcional y no se mostrará
                  públicamente
                </small>
              </div>
            </div>
          </div>

          {/* CATEGORÍAS */}
          {tipoUsuario === "prestador" && (
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-tools me-2"></i>
                Servicios que ofrecés
              </div>
              <div className="card-body">
                <label className="form-label">
                  Especialidades <span className="text-danger">*</span>
                </label>
                <div className="position-relative mb-3">
                  <input
                    type="text"
                    className={`form-control ${
                      errores.categorias ? "is-invalid" : ""
                    }`}
                    placeholder="Buscá: Electricidad, Plomería..."
                    value={busquedaCategoria}
                    onChange={(evento) =>
                      setBusquedaCategoria(evento.target.value)
                    }
                  />
                  {busquedaCategoria && sugerenciasFiltradas.length > 0 && (
                    <ul className="list-group position-absolute w-100 sugerencias-list">
                      {sugerenciasFiltradas.map((categoria) => (
                        <li
                          key={categoria}
                          className="list-group-item list-group-item-action"
                          onClick={() => agregarCategoria(categoria)}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          {categoria}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errores.categorias && (
                    <div className="invalid-feedback d-block">
                      {errores.categorias}
                    </div>
                  )}
                </div>

                {/* Categorías seleccionadas */}
                {datosPrestador.categorias.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {datosPrestador.categorias.map((categoria) => (
                      <span key={categoria} className="badge badge-categoria">
                        <i className="bi bi-tools me-1"></i>
                        {categoria}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => removerCategoria(categoria)}
                          aria-label={`Remover ${categoria}`}
                        ></button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <small className="text-muted">
                    No seleccionaste ninguna especialidad
                  </small>
                )}
              </div>
            </div>
          )}

          {/* CONTACTO */}
          {tipoUsuario === "prestador" && (
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-telephone-fill me-2"></i>
                Información de Contacto
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <ValidatedInput
                      type="tel"
                      name="telefono"
                      label="Teléfono"
                      value={datosPrestador.telefono}
                      onChange={handlePrestadorChange}
                      error={errores.telefono}
                      placeholder="11-2345-6789"
                      required
                      helpText="El enlace de WhatsApp se creará automáticamente"
                      icon="info-circle"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="whatsapp" className="form-label">
                      WhatsApp{" "}
                      <span className="text-success">
                        (generado automáticamente)
                      </span>
                    </label>
                    <div className="input-group">
                      <input
                        type="url"
                        className={`form-control ${
                          errores.whatsapp ? "is-invalid" : ""
                        }`}
                        id="whatsapp"
                        name="whatsapp"
                        value={datosPrestador.whatsapp}
                        readOnly
                        placeholder="Enlace generado automáticamente..."
                        style={{ backgroundColor: "#f8f9fa" }}
                      />
                      {datosPrestador.whatsapp && (
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          onClick={probarWhatsApp}
                          title="Probar enlace de WhatsApp"
                        >
                          <i className="bi bi-whatsapp"></i>
                        </button>
                      )}
                    </div>
                    {errores.whatsapp && (
                      <div className="invalid-feedback d-block">
                        {errores.whatsapp}
                      </div>
                    )}
                    {datosPrestador.whatsapp && (
                      <small className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Enlace de WhatsApp generado correctamente
                      </small>
                    )}
                  </div>
                </div>

                {/* Vista previa del enlace de WhatsApp */}
                {datosPrestador.telefono && datosPrestador.whatsapp && (
                  <div className="alert alert-info mt-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-whatsapp text-success me-2 fs-4"></i>
                      <div className="flex-grow-1">
                        <strong>Vista previa del enlace:</strong>
                        <br />
                        <code className="small">{datosPrestador.whatsapp}</code>
                        <br />
                        <small className="text-muted">
                          Los clientes podrán contactarte directamente por
                          WhatsApp
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-success ms-2"
                        onClick={probarWhatsApp}
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i>
                        Probar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GALERÍA */}
          {tipoUsuario === "prestador" && (
            <div className="card mb-4">
              <div className="card-header">
                <i className="bi bi-images me-2"></i>
                Galería de trabajos{" "}
                <span className="text-muted">(opcional)</span>
              </div>
              <div className="card-body">
                <input
                  className={`form-control ${
                    errores.imagenes ? "is-invalid" : ""
                  }`}
                  type="file"
                  id="imagenes"
                  onChange={handleImagenesChange}
                  accept=".jpg,.jpeg,.png"
                />
                <small className="text-muted d-block mt-1">
                  Máximo 1 imagen. JPG, JPEG, PNG. Máximo 5MB cada una.
                </small>
                {errores.imagenes && (
                  <div className="invalid-feedback d-block">
                    {errores.imagenes}
                  </div>
                )}
                {datosPrestador.imagenes.length > 0 && (
                  <div className="alert alert-success mt-2">
                    <i className="bi bi-check-circle me-2"></i>
                    {datosPrestador.imagenes.length} imagen(es) seleccionada(s)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUENTA */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="bi bi-key-fill me-2"></i>
              Datos de la Cuenta
            </div>
            <div className="card-body">
              <ValidatedInput
                type="email"
                name="email"
                label="Email"
                value={datosComunes.email}
                onChange={handleComunesChange}
                error={errores.email}
                placeholder="tu@email.com"
                required
              />

              <div className="row">
                <div className="col-md-6 mb-3">
                  <PasswordInput
                    name="contrasena"
                    label="Contraseña"
                    value={datosComunes.contrasena}
                    onChange={handleComunesChange}
                    error={errores.contrasena || errores.password}
                    placeholder="********"
                    required
                  />

                  {/* Política de seguridad */}
                  <div className="mt-2">
                    <small className="text-muted d-block mb-1">
                      <strong>Política de seguridad:</strong>
                    </small>
                    {politicaContrasena.map((regla, index) => (
                      <small key={index} className="text-muted d-block">
                        • {regla}
                      </small>
                    ))}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <PasswordInput
                    name="confirmarContrasena"
                    label="Confirmar Contraseña"
                    value={datosComunes.confirmarContrasena}
                    onChange={handleComunesChange}
                    error={
                      errores.confirmarContrasena || errores.confirmPassword
                    }
                    placeholder="********"
                    required
                    helpText="Las contraseñas deben coincidir"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button
              variant="outline-secondary"
              size="medium"
              onClick={volverAlPaso1}
              icon="arrow-left"
              className="me-md-2"
            >
              Volver
            </Button>
            <Button
              type="submit"
              variant="success"
              size="large"
              loading={isLoading}
              loadingText="Creando cuenta..."
              icon="check-circle"
              disabled={isLoading}
            >
              Crear cuenta y acceder
            </Button>
          </div>

          <div className="text-center mt-3">
            <p>
              ¿Ya tenés cuenta?{" "}
              <Link to="/login" className="auth-link">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
