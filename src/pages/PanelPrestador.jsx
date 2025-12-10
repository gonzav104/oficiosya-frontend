import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, ValidatedInput } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import "../styles/pages/PanelPrestador.css";

/*
// Datos de Ejemplo
const solicitudes = [
  { 
    id: 10, 
    titulo: 'Instalación de grifo nuevo en baño', 
    categoria: 'Plomería',
    estado: 'Pendiente', 
    cliente: 'Carlos Rodriguez',
    localidad: 'Baradero',
    fechaRecepcion: '15/01/2025',
    descripcion: 'Necesito instalar un grifo nuevo en el baño principal. Ya tengo el grifo comprado, solo necesito la instalación profesional.',
    imagenes: []
  },
  { 
    id: 11, 
    titulo: 'Reparación de canilla en cocina', 
    categoria: 'Plomería',
    estado: 'Enviado', 
    cliente: 'María García',
    localidad: 'Baradero',
    fechaRecepcion: '14/01/2025',
    descripcion: 'Se necesita reparar una canilla que pierde agua constantemente. Es urgente.',
    miPresupuesto: {
      monto: 8500,
      plazo: 2,
      mensaje: 'Puedo realizar el trabajo mañana mismo. Incluye materiales.',
      fechaEnvio: '14/01/2025'
    },
    imagenes: []
  },
  { 
    id: 12, 
    titulo: 'Reparación de cañería rota', 
    categoria: 'Plomería',
    estado: 'Aceptado', 
    cliente: 'Ana López',
    localidad: 'San Pedro',
    fechaRecepcion: '12/01/2025',
    descripcion: 'Se rompió una cañería en la pared del baño y está perdiendo mucha agua. Es una emergencia.',
    miPresupuesto: {
      monto: 15000,
      plazo: 1,
      mensaje: 'Trabajo de emergencia. Puedo ir hoy mismo.',
      fechaEnvio: '12/01/2025',
      fechaAceptacion: '12/01/2025'
    },
    imagenes: []
  },
  { 
    id: 13, 
    titulo: 'Instalación de ducha eléctrica', 
    categoria: 'Plomería',
    estado: 'Rechazado', 
    cliente: 'Roberto Silva',
    localidad: 'Ramallo',
    fechaRecepcion: '10/01/2025',
    descripcion: 'Instalar ducha eléctrica nueva en baño secundario.',
    motivoRechazo: 'No tengo disponibilidad para esta fecha. Estoy ocupado con otros trabajos.',
    fechaRechazo: '10/01/2025',
    imagenes: []
  }
];


*/

// ----------------------------------------------------

function PanelPrestador() {
  const { user } = useAuth();
  const idPrestador = user?.id_prestador;

  const [filtro, setFiltro] = useState("Pendiente");
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [mostrarModalPresupuesto, setMostrarModalPresupuesto] = useState(false);
  const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [errores, setErrores] = useState({});

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario de presupuesto
  const [formPresupuesto, setFormPresupuesto] = useState({
    monto: "",
    plazo: "",
    mensaje: "",
  });

  // Formulario de rechazo
  const [mensajeRechazo, setMensajeRechazo] = useState("");

  //---------------------------------------------------------------------------------------------------------------------

  // Cargar solicitudes recibidas
  useEffect(() => {
    if (!idPrestador) {
      setLoading(false);
      return;
    }

    const fetchSolicitudes = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filtro !== "Todos") {
          params.append("estado", filtro);
        }

        const response = await fetch(
          `http://localhost:3000/api/prestadores/${idPrestador}/solicitudes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Error al cargar solicitudes");

        const result = await response.json();
        // Mapear los datos para aplanar la estructura anidada
        const solicitudesMapeadas = (result.data || []).map((item) => {
          const presupuestosSolicitud = item.solicitud?.presupuestos || [];
          const presupuestoDelPrestador = presupuestosSolicitud.find(
            (p) => p.id_prestador === idPrestador
          );

          return {
            id: item.id_solicitud_prestador,
            id_solicitud_prestador: item.id_solicitud_prestador,
            estado: item.estado,
            titulo: item.solicitud?.titulo || "",
            descripcion: item.solicitud?.descripcion || "",
            cliente: item.solicitud?.cliente?.nombre_completo || "",
            categoria: item.solicitud?.categoria?.nombre || "",
            localidad: item.solicitud?.ubicacion?.localidad || "",
            fechaRecepcion: item.solicitud?.fecha_creacion
              ? new Date(item.solicitud.fecha_creacion).toLocaleDateString()
              : "",
            solicitud: item.solicitud,
            miPresupuesto: presupuestoDelPrestador
              ? {
                  id_presupuesto: presupuestoDelPrestador.id_presupuesto,
                  monto: presupuestoDelPrestador.monto,
                  plazo:
                    presupuestoDelPrestador.plazo_dias ??
                    presupuestoDelPrestador.plazo,
                  mensaje: presupuestoDelPrestador.mensaje,
                  estado: presupuestoDelPrestador.estado,
                  fechaEnvio: presupuestoDelPrestador.fecha_envio,
                  fechaAceptacion:
                    presupuestoDelPrestador.fecha_aceptacion || null,
                }
              : null,
          };
        });
        setSolicitudes(solicitudesMapeadas);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las solicitudes");
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [idPrestador]);

  //-----------------------------------------------------------------------------------------------------

  // Filtrar solicitudes según estado
  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (filtro === "Todos") return true;
    return s.estado === filtro;
  });

  // Obtener badge según estado
  const getEstadoBadge = (estado) => {
    const badges = {
      Pendiente: "bg-warning text-dark",
      Enviado: "bg-info",
      Aceptado: "bg-success",
      Rechazado: "bg-danger",
    };
    return badges[estado] || "bg-secondary";
  };

  // Abrir modal de presupuesto
  const abrirModalPresupuesto = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setFormPresupuesto({ monto: "", plazo: "", mensaje: "" });
    setErrores({});
    setMostrarModalPresupuesto(true);
  };

  // Abrir modal de rechazo
  const abrirModalRechazo = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setMensajeRechazo("");
    setMostrarModalRechazo(true);
  };

  // Ver detalles de solicitud
  const verDetalles = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setMostrarDetalles(true);
  };

  // Validar presupuesto
  const validarPresupuesto = () => {
    const nuevosErrores = {};

    if (!formPresupuesto.monto) {
      nuevosErrores.monto = "El monto es obligatorio";
    } else if (
      isNaN(formPresupuesto.monto) ||
      parseFloat(formPresupuesto.monto) <= 0
    ) {
      nuevosErrores.monto = "Ingrese un monto numérico mayor a 0";
    }

    if (!formPresupuesto.plazo) {
      nuevosErrores.plazo = "El plazo es obligatorio";
    } else if (
      isNaN(formPresupuesto.plazo) ||
      parseInt(formPresupuesto.plazo) <= 0
    ) {
      nuevosErrores.plazo = "Ingrese un plazo válido en días";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  /*

  // Enviar presupuesto
  const enviarPresupuesto = () => {
    if (validarPresupuesto()) {
      console.log("Presupuesto enviado:", {
        solicitud: solicitudSeleccionada.id,
        ...formPresupuesto,
      });

      alert(
        `Presupuesto enviado exitosamente a ${solicitudSeleccionada.cliente}\n\nMonto: ${formPresupuesto.monto}\nPlazo: ${formPresupuesto.plazo} días\n\nLa solicitud cambió al estado "Cotizada" y el cliente será notificado.`
      );

      setMostrarModalPresupuesto(false);
      setSolicitudSeleccionada(null);
      setFormPresupuesto({ monto: "", plazo: "", mensaje: "" });
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = () => {
    console.log("Solicitud rechazada:", {
      solicitud: solicitudSeleccionada.id,
      motivo: mensajeRechazo,
    });

    alert(
      `Solicitud rechazada\n\nSe notificó al cliente: ${solicitudSeleccionada.cliente}`
    );

    setMostrarModalRechazo(false);
    setSolicitudSeleccionada(null);
    setMensajeRechazo("");
  };

  */

  const enviarPresupuesto = async () => {
    if (!validarPresupuesto()) return;

    try {
      const id_solicitud_val =
        solicitudSeleccionada?.solicitud?.id_solicitud ||
        solicitudSeleccionada?.id_solicitud ||
        solicitudSeleccionada?.id ||
        null;

      if (!id_solicitud_val) {
        alert(
          "Falta el identificador de la solicitud (id_solicitud). No se puede enviar el presupuesto."
        );
        return;
      }

      const body = {
        id_solicitud: id_solicitud_val,
        monto: parseFloat(formPresupuesto.monto),
        plazo_dias: parseInt(formPresupuesto.plazo),
        mensaje: formPresupuesto.mensaje.trim() || null,
      };

      const response = await fetch("http://localhost:3000/api/presupuestos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        const nuevoPresupuesto =
          result.data?.presupuesto ||
          result.presupuesto ||
          result.data?.presupuesto ||
          result.presupuesto;
        const solicitudPrestadorActualizada =
          result.data?.solicitud_prestador ||
          result.solicitud_prestador ||
          null;

        setSolicitudes((prev) =>
          prev.map((s) => {
            if (
              s.id_solicitud_prestador ===
              solicitudSeleccionada.id_solicitud_prestador
            ) {
              return {
                ...s,
                estado: solicitudPrestadorActualizada?.estado || "Enviado",
                miPresupuesto: nuevoPresupuesto || {
                  monto: parseFloat(formPresupuesto.monto),
                  plazo: parseInt(formPresupuesto.plazo),
                  mensaje: formPresupuesto.mensaje.trim() || null,
                },
              };
            }
            return s;
          })
        );

        alert("¡Presupuesto enviado exitosamente!");
        setMostrarModalPresupuesto(false);
        setSolicitudSeleccionada(null);
        setFormPresupuesto({ monto: "", plazo: "", mensaje: "" });
      } else {
        const errMsg =
          result?.message ||
          result?.error ||
          result?.errors ||
          "Error al enviar presupuesto";

        const display =
          typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);
        alert(display);
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/prestadores/solicitudes-prestador/${solicitudSeleccionada.id_solicitud_prestador}/rechazar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({ message: mensajeRechazo.trim() || null }),
        }
      );

      if (response.ok) {
        alert("Solicitud rechazada correctamente");
        setMostrarModalRechazo(false);
        window.location.reload();
      } else {
        const err = await response.json();
        alert(err.message || "Error al rechazar");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="panel-prestador-container">
      {/* HEADER */}
      <div className="panel-header mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-briefcase me-2"></i>
            Panel de Prestador
          </h2>
          <p className="text-muted mb-0">
            Gestiona las solicitudes de presupuesto que recibes
          </p>
          {user && (
            <p className="text-primary fw-bold">
              Bienvenido, {user.nombre_completo}
            </p>
          )}
        </div>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stat-card stat-pendiente">
            <i className="bi bi-clock-history"></i>
            <div>
              <h3>
                {solicitudes.filter((s) => s.estado === "Pendiente").length}
              </h3>
              <p>Pendientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stat-card stat-enviado">
            <i className="bi bi-send-check"></i>
            <div>
              <h3>
                {solicitudes.filter((s) => s.estado === "Enviado").length}
              </h3>
              <p>Enviados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stat-card stat-aceptado">
            <i className="bi bi-check-circle"></i>
            <div>
              <h3>
                {solicitudes.filter((s) => s.estado === "Aceptado").length}
              </h3>
              <p>Aceptados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stat-card stat-rechazado">
            <i className="bi bi-x-circle"></i>
            <div>
              <h3>
                {solicitudes.filter((s) => s.estado === "Rechazado").length}
              </h3>
              <p>Rechazados</p>
            </div>
          </div>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN - RF18 */}
      <div className="filtros-tabs mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button
              className={`nav-link ${filtro === "Pendiente" ? "active" : ""}`}
              onClick={() => setFiltro("Pendiente")}
            >
              <i className="bi bi-clock me-2"></i>
              Pendientes
              <span className="badge bg-light text-dark ms-2">
                {solicitudes.filter((s) => s.estado === "Pendiente").length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filtro === "Enviado" ? "active" : ""}`}
              onClick={() => setFiltro("Enviado")}
            >
              <i className="bi bi-send me-2"></i>
              Enviados
              <span className="badge bg-light text-dark ms-2">
                {solicitudes.filter((s) => s.estado === "Enviado").length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filtro === "Aceptado" ? "active" : ""}`}
              onClick={() => setFiltro("Aceptado")}
            >
              <i className="bi bi-check-circle me-2"></i>
              Aceptados
              <span className="badge bg-light text-dark ms-2">
                {solicitudes.filter((s) => s.estado === "Aceptado").length}
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filtro === "Rechazado" ? "active" : ""}`}
              onClick={() => setFiltro("Rechazado")}
            >
              <i className="bi bi-x-circle me-2"></i>
              Rechazados
              <span className="badge bg-light text-dark ms-2">
                {solicitudes.filter((s) => s.estado === "Rechazado").length}
              </span>
            </button>
          </li>
        </ul>
      </div>

      {/* LISTA DE SOLICITUDES */}
      <div className="solicitudes-lista">
        {solicitudesFiltradas.length > 0 ? (
          solicitudesFiltradas.map((solicitud) => (
            <div key={solicitud.id} className="card solicitud-item mb-3">
              <div className="card-body">
                <div className="solicitud-header">
                  <div>
                    <h5 className="mb-2">{solicitud.titulo}</h5>
                    <div className="solicitud-meta">
                      <span className="me-3">
                        <i className="bi bi-person me-1"></i>
                        {solicitud.cliente}
                      </span>
                      <span className="me-3">
                        <i className="bi bi-geo-alt me-1"></i>
                        {solicitud.localidad}
                      </span>
                      <span className="me-3">
                        <i className="bi bi-tag me-1"></i>
                        {solicitud.categoria}
                      </span>
                      <span className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>
                        {solicitud.fechaRecepcion}
                      </span>
                    </div>
                  </div>
                  <span className={`badge ${getEstadoBadge(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                </div>

                <p className="solicitud-descripcion mt-3">
                  {solicitud.descripcion && solicitud.descripcion.length > 150
                    ? solicitud.descripcion.substring(0, 150) + "..."
                    : solicitud.descripcion || "Sin descripción"}
                </p>

                {/* RENDERIZADO SEGÚN ESTADO */}
                <div className="solicitud-acciones mt-3">
                  {/* PENDIENTE */}
                  {solicitud.estado === "Pendiente" && (
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant="success"
                        onClick={() => abrirModalPresupuesto(solicitud)}
                        icon="envelope-check"
                      >
                        Enviar Presupuesto
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => abrirModalRechazo(solicitud)}
                        icon="x-circle"
                      >
                        Rechazar
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => verDetalles(solicitud)}
                        icon="eye"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  )}

                  {/* ENVIADO */}
                  {solicitud.estado === "Enviado" &&
                    solicitud.miPresupuesto && (
                      <div className="presupuesto-info">
                        <div className="alert alert-info mb-2">
                          <strong>
                            <i className="bi bi-info-circle me-2"></i>
                            Tu Presupuesto
                          </strong>
                          <div className="mt-2">
                            <p className="mb-1">
                              <strong>Monto:</strong> $
                              {solicitud.miPresupuesto.monto.toLocaleString()}
                            </p>
                            {solicitud.miPresupuesto.mensaje && (
                              <p className="mb-0">
                                <strong>Mensaje:</strong>{" "}
                                {solicitud.miPresupuesto.mensaje}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline-secondary"
                          size="small"
                          onClick={() => verDetalles(solicitud)}
                          icon="eye"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    )}

                  {/* ACEPTADO */}
                  {solicitud.estado === "Aceptado" && (
                    <div>
                      <div className="alert alert-success mb-3">
                        <strong>
                          <i className="bi bi-check-circle me-2"></i>
                          ¡Presupuesto Aceptado!
                        </strong>
                        <p className="mb-2 mt-2">
                          <strong>Monto acordado:</strong> $
                          {solicitud.miPresupuesto.monto.toLocaleString()}
                        </p>
                      </div>

                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Próximos pasos:</strong> El cliente tiene acceso
                        a tus datos de contacto y se comunicará contigo para
                        coordinar el trabajo.
                      </div>

                      <Button
                        variant="outline-secondary"
                        size="small"
                        onClick={() => verDetalles(solicitud)}
                        icon="eye"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  )}

                  {/* RECHAZADO */}
                  {solicitud.estado === "Rechazado" && (
                    <div className="alert alert-danger">
                      <strong>
                        <i className="bi bi-x-circle me-2"></i>
                        Solicitud Rechazada
                      </strong>
                      {solicitud.motivoRechazo && (
                        <p className="mb-0 mt-2">
                          <strong>Motivo:</strong> {solicitud.motivoRechazo}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info text-center">
            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
            <h5>No hay solicitudes en este estado</h5>
            <p className="mb-0">
              Las solicitudes con estado "{filtro}" aparecerán aquí
            </p>
          </div>
        )}
      </div>

      {/* MODAL ENVIAR PRESUPUESTO */}
      {mostrarModalPresupuesto && solicitudSeleccionada && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-envelope-check me-2"></i>
                    Enviar Presupuesto
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModalPresupuesto(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Solicitud:</strong> {solicitudSeleccionada.titulo}
                  </div>
                  <div className="mb-3">
                    <strong>Cliente:</strong> {solicitudSeleccionada.cliente}
                  </div>

                  <hr />

                  <ValidatedInput
                    type="number"
                    name="monto"
                    label="Monto"
                    value={formPresupuesto.monto}
                    onChange={(e) =>
                      setFormPresupuesto({
                        ...formPresupuesto,
                        monto: e.target.value,
                      })
                    }
                    error={errores.monto}
                    placeholder="Ej: 15000"
                    required
                    icon={{ name: "currency-dollar", position: "left" }}
                  />

                  <ValidatedInput
                    type="number"
                    name="plazo"
                    label="Plazo de entrega"
                    value={formPresupuesto.plazo}
                    onChange={(e) =>
                      setFormPresupuesto({
                        ...formPresupuesto,
                        plazo: e.target.value,
                      })
                    }
                    error={errores.plazo}
                    placeholder="Ej: 3"
                    required
                    icon={{ name: "calendar-event", position: "right" }}
                    helpText="días"
                  />

                  <div className="mb-3">
                    <label className="form-label">
                      Mensaje al cliente{" "}
                      <span className="text-muted">(opcional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formPresupuesto.mensaje}
                      onChange={(e) =>
                        setFormPresupuesto({
                          ...formPresupuesto,
                          mensaje: e.target.value,
                        })
                      }
                      placeholder="Agrega información adicional sobre el presupuesto..."
                    ></textarea>
                  </div>

                  <div className="alert alert-warning">
                    <small>
                      <i className="bi bi-info-circle me-2"></i>
                      Al enviar, la solicitud cambiará al estado "Cotizada" y el
                      cliente será notificado.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarModalPresupuesto(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="success"
                    onClick={enviarPresupuesto}
                    icon="send"
                  >
                    Enviar Presupuesto
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL RECHAZAR SOLICITUD */}
      {mostrarModalRechazo && solicitudSeleccionada && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-x-circle me-2"></i>
                    Rechazar Solicitud
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setMostrarModalRechazo(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Solicitud:</strong> {solicitudSeleccionada.titulo}
                  </div>
                  <div className="mb-3">
                    <strong>Cliente:</strong> {solicitudSeleccionada.cliente}
                  </div>

                  <hr />

                  <div className="mb-3">
                    <label className="form-label">
                      Motivo del rechazo{" "}
                      <span className="text-muted">(opcional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={mensajeRechazo}
                      onChange={(e) => setMensajeRechazo(e.target.value)}
                      placeholder="Ejemplo: No tengo disponibilidad en esta fecha..."
                    ></textarea>
                  </div>

                  <div className="alert alert-warning">
                    <small>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Atención:</strong> Esta acción no se puede
                      deshacer y el cliente será notificado.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarModalRechazo(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={rechazarSolicitud}
                    icon="x-circle"
                  >
                    Confirmar Rechazo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL VER DETALLES */}
      {mostrarDetalles && solicitudSeleccionada && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-file-text me-2"></i>
                    Detalles de la Solicitud
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarDetalles(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <h5>{solicitudSeleccionada.titulo}</h5>
                  <div className="mb-3">
                    <span className="badge bg-secondary me-2">
                      {solicitudSeleccionada.categoria}
                    </span>
                    <span className="badge bg-info me-2">
                      {solicitudSeleccionada.localidad}
                    </span>
                    <span
                      className={`badge ${getEstadoBadge(
                        solicitudSeleccionada.estado
                      )}`}
                    >
                      {solicitudSeleccionada.estado}
                    </span>
                  </div>

                  <hr />

                  <h6>Descripción</h6>
                  <p>{solicitudSeleccionada.descripcion}</p>

                  {solicitudSeleccionada.imagenes &&
                    solicitudSeleccionada.imagenes.length > 0 && (
                      <>
                        <h6 className="mt-3">Imágenes adjuntas</h6>
                        <div className="row">
                          {solicitudSeleccionada.imagenes.map((img, index) => (
                            <div key={index} className="col-4 mb-2">
                              <img
                                src={img}
                                alt={`Imagen ${index + 1}`}
                                className="img-fluid rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                  <hr />

                  <div className="row">
                    <div className="col-6">
                      <strong>Cliente:</strong> {solicitudSeleccionada.cliente}
                    </div>
                    <div className="col-6">
                      <strong>Recibida:</strong>{" "}
                      {solicitudSeleccionada.fechaRecepcion}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarDetalles(false)}
                  >
                    Cerrar
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

export default PanelPrestador;
