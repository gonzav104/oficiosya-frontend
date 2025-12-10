import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/common";
import "../styles/pages/PerfilPrestador.css";

/*
// Datos de Ejemplo
const prestadoresData = {
  101: {
    id: 101,
    nombreCompleto: 'Carlos Rodríguez',
    nombrePublico: 'Carlos R.',
    categorias: ['Plomería', 'Gasista'],
    localidad: 'Baradero',
    telefono: '11-2345-6789',
    email: 'carlos.rodriguez@email.com',
    whatsappLink: 'https://wa.me/5491123456789',
    descripcion: 'Plomero matriculado con más de 10 años de experiencia en instalaciones residenciales y comerciales. Especializado en reparaciones de emergencia, instalaciones sanitarias completas y sistemas de gas natural.',
    experiencia: 'Más de 10 años de experiencia',
    calificacionPromedio: 4.8,
    cantidadCalificaciones: 127,
    trabajosRealizados: 156,
    
    // Calificaciones y comentarios
    calificaciones: [
      {
        id: 1,
        cliente: 'María González',
        estrellas: 5,
        comentario: 'Excelente profesional, muy responsable y prolijo en su trabajo. Resolvió un problema de cañería en tiempo récord.',
        fecha: '10/01/2025',
        trabajo: 'Reparación de cañería'
      },
      {
        id: 2,
        cliente: 'Juan Pérez',
        estrellas: 5,
        comentario: 'Muy recomendable. Llegó puntual y solucionó el problema de la canilla que perdía. Precio justo.',
        fecha: '05/01/2025',
        trabajo: 'Reparación de canilla'
      },
      {
        id: 3,
        cliente: 'Laura Martínez',
        estrellas: 4,
        comentario: 'Buen trabajo, aunque demoró un poco más de lo esperado. El resultado final fue satisfactorio.',
        fecha: '28/12/2024',
        trabajo: 'Instalación de termotanque'
      },
      {
        id: 4,
        cliente: 'Roberto Silva',
        estrellas: 5,
        comentario: 'Profesional y muy eficiente. Instaló todo el sistema de agua de mi casa nueva sin problemas.',
        fecha: '15/12/2024',
        trabajo: 'Instalación completa de plomería'
      }
    ],
    
    // Imágenes de trabajos previos con descripción
    imagenesTrabajos: [
      {
        id: 1,
        url: 'https://placehold.co/600x400/1b8a5e/ffffff?text=Instalacion+Sanitaria',
        descripcion: 'Instalación completa de baño - Incluye sanitarios, grifería y azulejos',
        fecha: '01/2025'
      },
      {
        id: 2,
        url: 'https://placehold.co/600x400/2196F3/ffffff?text=Reparacion+Cañeria',
        descripcion: 'Reparación de cañería principal - Trabajo de emergencia resuelto en 3 horas',
        fecha: '12/2024'
      },
      {
        id: 3,
        url: 'https://placehold.co/600x400/FF9800/ffffff?text=Termotanque',
        descripcion: 'Instalación de termotanque solar - Sistema eco-friendly',
        fecha: '11/2024'
      },
      {
        id: 4,
        url: 'https://placehold.co/600x400/4CAF50/ffffff?text=Cocina',
        descripcion: 'Instalación de grifería de cocina moderna con filtro',
        fecha: '10/2024'
      }
    ]
  },
  102: {
    id: 102,
    nombreCompleto: 'Laura Fernández',
    nombrePublico: 'Laura F.',
    categorias: ['Plomería'],
    localidad: 'Baradero',
    telefono: '11-3456-7890',
    email: 'laura.fernandez@email.com',
    whatsappLink: 'https://wa.me/5491134567890',
    descripcion: 'Plomera con 8 años de experiencia. Especializada en reparaciones domiciliarias y mantenimiento preventivo.',
    experiencia: '8 años de experiencia',
    calificacionPromedio: 4.9,
    cantidadCalificaciones: 89,
    trabajosRealizados: 94,
    calificaciones: [
      {
        id: 1,
        cliente: 'Pedro Gómez',
        estrellas: 5,
        comentario: 'Muy profesional y atenta. Explicó todo el proceso y dejó todo impecable.',
        fecha: '12/01/2025',
        trabajo: 'Instalación de grifería'
      }
    ],
    imagenesTrabajos: []
  }
};

*/

function PerfilPrestador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id_solicitud = location.state?.solicitudId || 1; // Valor por defecto si no se pasa
  const [imagenModalOpen, setImagenModalOpen] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [mostrarTodasCalificaciones, setMostrarTodasCalificaciones] = useState(false);
  const [prestador, setPrestador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrestador = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:3000/api/prestadores/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Error al obtener el prestador");
        }

        const data = json.data || json; // según cómo responda tu ResponseService

        // 🔹 Mapear datos del backend al formato que ya usa tu UI
        const viewModel = {
          // nombre / ubicación
          nombrePublico: data.nombre_completo,
          localidad: data.ubicacion?.localidad || "",
          provincia: data.ubicacion?.provincia || "",

          // categorías -> array de strings
          categorias: (data.categorias || []).map((c) => c.nombre),

          // rating (por ahora, si no tenés calificaciones en la API, hardcodeamos)
          calificacionPromedio: data.calificacion_promedio || 0,
          cantidadCalificaciones: data.cantidad_calificaciones || 0,

          // estadísticas simples
          trabajosRealizados: data.trabajos_realizados || 0,
          experiencia: data.experiencia || "Sin información",

          // descripción
          descripcion:
            data.descripcion || "Este prestador aún no cargó una descripción.",

          // imágenes de trabajos -> desde ImagenPrestador
          imagenesTrabajos: (data.imagenes || []).map((img) => ({
            id: img.id_imagen_prestador,
            url: img.ruta_imagen,
            descripcion: img.descripcion || "Trabajo realizado",
            fecha: img.fecha_subida
              ? new Date(img.fecha_subida).toLocaleDateString()
              : "",
          })),

          // calificaciones: si todavía no tenés en la API, lo dejamos vacío
          calificaciones: [], // cuando tengas endpoint de calificaciones lo llenás acá
        };

        setPrestador(viewModel);
        // Cargar calificaciones reales del backend para este prestador
        try {
          const token = localStorage.getItem("token");
          const resCal = await fetch(
            `http://localhost:3000/api/calificaciones/prestador/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              credentials: "include",
            }
          );
          const jc = await resCal.json();
          if (resCal.ok && Array.isArray(jc.data)) {
            const califs = jc.data.map((c) => ({
              id: c.id_calificacion || c.id || null,
              cliente: c.cliente?.nombre_completo || (c.cliente && c.cliente.nombre_completo) || "Anónimo",
              estrellas: c.estrellas,
              comentario: c.comentario || "",
              fecha: c.fecha_creacion ? new Date(c.fecha_creacion).toLocaleDateString() : (c.fecha ? c.fecha : ""),
              trabajo: c.solicitud?.titulo || "",
            }));

            setPrestador((prev) => ({
              ...(prev || {}),
              calificaciones: califs,
              cantidadCalificaciones: jc.pagination?.total || califs.length,
              calificacionPromedio:
                califs.length > 0
                  ? (
                      califs.reduce((s, it) => s + (it.estrellas || 0), 0) /
                      califs.length
                    ).toFixed(1)
                  : prev.calificacionPromedio || 0,
            }));
          }
        } catch (errCal) {
          console.warn("No se pudieron cargar calificaciones del prestador:", errCal);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestador();
  }, [id]);

  // 🔹 Mientras carga
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status"></div>
        <p className="mt-3">Cargando perfil del prestador...</p>
      </div>
    );
  }

  // 🔹 Si hubo error o no existe
  if (error || !prestador) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle fs-1 d-block mb-3"></i>
          <h3>Prestador no encontrado</h3>
          <p>{error || "El perfil que buscas no existe o fue eliminado."}</p>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate(-1)}
            icon="arrow-left"
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }
  // Función para renderizar estrellas
  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    const estrellaCompleta = Math.floor(calificacion);
    const tieneMedia = calificacion % 1 !== 0;

    for (let i = 0; i < estrellaCompleta; i++) {
      estrellas.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
    }
    if (tieneMedia) {
      estrellas.push(<i key="half" className="bi bi-star-half"></i>);
    }
    const estrellasVacias = 5 - Math.ceil(calificacion);
    for (let i = 0; i < estrellasVacias; i++) {
      estrellas.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
    }
    return estrellas;
  };

  // Mostrar solo primeras 3 calificaciones o todas
  const calificacionesMostradas = mostrarTodasCalificaciones
    ? prestador.calificaciones
    : prestador.calificaciones.slice(0, 3);

  // Abrir imagen en modal
  const abrirImagenModal = (imagen) => {
    setImagenSeleccionada(imagen);
    setImagenModalOpen(true);
  };

  return (
    <div className="perfil-prestador-container">
      {/* BOTÓN VOLVER */}
      <div className="mb-4">
        <Button
          variant="outline-secondary"
          onClick={() => navigate(-1)}
          icon="arrow-left"
        >
          Volver
        </Button>
      </div>

      <div className="row">
        {/* COLUMNA IZQUIERDA - INFO PRINCIPAL */}
        <div className="col-lg-4">
          <div className="card perfil-card sticky-top">
            <div className="card-body text-center">
              {/* Avatar */}
              <div className="prestador-avatar-grande mb-3">
                {prestador.nombrePublico.charAt(0)}
              </div>

              {/* Nombre y ubicación */}
              <h2 className="fw-bold mb-1">{prestador.nombrePublico}</h2>
              <p className="text-muted mb-2">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {prestador.localidad}
              </p>

              {/* Categorías */}
              <div className="categorias-badges mb-3">
                {prestador.categorias.map((cat) => (
                  <span key={cat} className="badge bg-primary me-1 mb-1">
                    <i className="bi bi-tools me-1"></i>
                    {cat}
                  </span>
                ))}
              </div>

              {/* Calificación */}
              <div className="calificacion-principal mb-3">
                <div className="estrellas-grandes mb-1">
                  {renderEstrellas(prestador.calificacionPromedio)}
                </div>
                <div className="calificacion-numero">
                  {prestador.calificacionPromedio}
                </div>
                <small className="text-muted d-block">
                  {prestador.cantidadCalificaciones} calificaciones
                </small>
              </div>

              {/* Estadísticas */}
              <div className="estadisticas-box mb-3">
                <div className="stat-item">
                  <i className="bi bi-award-fill"></i>
                  <div>
                    <strong>{prestador.experiencia}</strong>
                    <small>Experiencia</small>
                  </div>
                </div>
              </div>

              {/* NO mostrar datos de contacto */}
              <div className="alert alert-info mb-3">
                <i className="bi bi-shield-check me-2"></i>
                <small>
                  <strong>Datos de contacto protegidos</strong>
                  <br />
                  Se mostrarán al aceptar un presupuesto
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - DETALLES */}
        <div className="col-lg-8">
          {/* DESCRIPCIÓN */}
          <div className="card info-card mb-4">
            <div className="card-body">
              <h4 className="card-title">
                <i className="bi bi-person-badge me-2"></i>
                Sobre mí
              </h4>
              <p className="descripcion-texto">{prestador.descripcion}</p>
            </div>
          </div>

          {/* GALERÍA DE TRABAJOS */}
          {prestador.imagenesTrabajos.length > 0 && (
            <div className="card info-card mb-4">
              <div className="card-body">
                <h4 className="card-title mb-4">
                  <i className="bi bi-images me-2"></i>
                  Galería de Trabajos Previos
                  <span className="badge bg-secondary ms-2">
                    {prestador.imagenesTrabajos.length}
                  </span>
                </h4>
                <div className="row g-3">
                  {prestador.imagenesTrabajos.map((imagen) => (
                    <div key={imagen.id} className="col-md-6">
                      <div
                        className="trabajo-imagen-card"
                        onClick={() => abrirImagenModal(imagen)}
                      >
                        <img
                          src={imagen.url}
                          alt={imagen.descripcion}
                          className="img-fluid rounded"
                        />
                        <div className="imagen-overlay">
                          <i className="bi bi-zoom-in fs-1"></i>
                        </div>
                        <div className="imagen-info">
                          <small className="d-block mb-1">
                            <i className="bi bi-calendar3 me-1"></i>
                            {imagen.fecha}
                          </small>
                          <p className="mb-0">{imagen.descripcion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CALIFICACIONES Y COMENTARIOS */}
          <div className="card info-card">
            <div className="card-body">
              <h4 className="card-title mb-4">
                <i className="bi bi-chat-left-quote me-2"></i>
                Calificaciones y Comentarios
                <span className="badge bg-warning ms-2">
                  {prestador.cantidadCalificaciones}
                </span>
              </h4>

              {prestador.calificaciones.length > 0 ? (
                <>
                  <div className="calificaciones-lista">
                    {calificacionesMostradas.map((cal) => (
                      <div key={cal.id} className="calificacion-item">
                        <div className="calificacion-header">
                          <div>
                            <div className="cliente-avatar">
                              {cal.cliente.charAt(0)}
                            </div>
                            <div>
                              <strong>{cal.cliente}</strong>
                              <small className="text-muted d-block">
                                {cal.trabajo} • {cal.fecha}
                              </small>
                            </div>
                          </div>
                          <div className="estrellas-calificacion">
                            {renderEstrellas(cal.estrellas)}
                          </div>
                        </div>
                        <p className="calificacion-comentario">
                          "{cal.comentario}"
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Botón ver más calificaciones */}
                  {prestador.calificaciones.length > 3 && (
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-primary"
                        onClick={() =>
                          setMostrarTodasCalificaciones(
                            !mostrarTodasCalificaciones
                          )
                        }
                      >
                        {mostrarTodasCalificaciones
                          ? "Ver menos"
                          : `Ver todas las calificaciones (${
                              prestador.calificaciones.length - 3
                            } más)`}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-chat-left-dots fs-1 d-block mb-2"></i>
                  <p>Este prestador aún no tiene calificaciones</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL IMAGEN AMPLIADA */}
      {imagenModalOpen && imagenSeleccionada && (
        <>
          <div
            className="modal-backdrop show"
            onClick={() => setImagenModalOpen(false)}
          ></div>
          <div
            className="modal show d-block"
            onClick={() => setImagenModalOpen(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {imagenSeleccionada.descripcion}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setImagenModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={imagenSeleccionada.url}
                    alt={imagenSeleccionada.descripcion}
                    className="img-fluid rounded"
                  />
                  <p className="text-muted mt-3">
                    <i className="bi bi-calendar3 me-2"></i>
                    {imagenSeleccionada.fecha}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PerfilPrestador;
