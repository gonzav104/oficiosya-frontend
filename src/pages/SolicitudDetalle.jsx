import React, { useState, useEffect, useMemo } from "react"; // *CAMBIO*----------------------
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/common";
import {
  getSolicitudes,
  getPrestadores,
  getPrestadoresCercanos,
} from "../utils/solicitudes"; // CAMBIO------------------------------
import { useAuth } from "../contexts/AuthContext"; // *CAMBIO*----------------------
import "../styles/pages/SolicitudDetalle.css";
/*
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
*/

// (Se obtiene dinámicamente desde backend)

/*
const prestadoresCercanos = {
  3: [
    { id: 106, nombrePublico: 'Roberto Gómez', categoria: 'Pintura', localidad: 'San Pedro', calificacionPromedio: 4.6, cantidadResenas: 45, trabajosRealizados: 52, experiencia: '6 años de experiencia', foto: '👨‍🎨', distancia: '15 km' },
    { id: 107, nombrePublico: 'Martín López', categoria: 'Pintura', localidad: 'Baradero', calificacionPromedio: 4.5, cantidadResenas: 38, trabajosRealizados: 41, experiencia: '4 años de experiencia', foto: '👨‍🎨', distancia: '20 km' },
  ],
};
*/

const presupuestosPorSolicitud = {
  3: [
    {
      id: 3,
      prestadorId: 106,
      prestadorNombre: "Diego Martínez",
      monto: 25000,
      plazo: 3,
      mensaje:
        "Incluye materiales de primera calidad y mano de obra. Garantía de 2 años.",
      estado: "Pendiente",
      fechaEnvio: "13/01/2025",
    },
  ],
  4: [
    {
      id: 4,
      prestadorId: 108,
      prestadorNombre: "Carlos Electricista",
      monto: 3500,
      plazo: 1,
      mensaje: "Trabajo realizado. Favor calificar el servicio.",
      estado: "Completado",
      fechaEnvio: "10/01/2025",
      fechaCompletado: "11/01/2025",
      datosContacto: {
        telefono: "11-2345-6789",
        email: "carlos.electricista@email.com",
        whatsapp: "https://wa.me/5491123456789",
      },
    },
  ],
};

function SolicitudDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [buscarCercanos, setBuscarCercanos] = useState(false);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [presupuestoAceptado, setPresupuestoAceptado] = useState(false);
  const [mostrarDetalleInline, setMostrarDetalleInline] = useState(false);
  const [showModalPresupuesto, setShowModalPresupuesto] = useState(false);
  const [mostrarModalCalificacion, setMostrarModalCalificacion] =
    useState(false);
  const [displayEstadoLocal, setDisplayEstadoLocal] = useState(null);
  const [calificacion, setCalificacion] = useState(0);
  const [comentarioCalificacion, setComentarioCalificacion] = useState("");

  //--------------------------------------------------------------

  const [prestadoresRecomendados, setPrestadoresRecomendados] = useState([]);
  const [prestadoresEnZonasCercanas, setPrestadoresEnZonasCercanas] = useState(
    []
  );
  const [prestadoresCargados, setPrestadoresCargados] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [sendingPrestadorIds, setSendingPrestadorIds] = useState([]);
  const [sentPrestadorIds, setSentPrestadorIds] = useState([]);
  const [prestadoresEnviadosLista, setPrestadoresEnviadosLista] = useState([]);
  // Presupuestos recibidos cargados desde backend (fallback al mock `presupuestosPorSolicitud`)
  const [presupuestosRecibidosState, setPresupuestosRecibidosState] = useState(
    []
  );

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

  useEffect(() => {
    if (!id) return;

    async function cargarPrestadores() {
      setLoading(true);
      const recomendados = await getPrestadores(id);
      const cercanos = await getPrestadoresCercanos(id);

      setPrestadoresRecomendados(recomendados);
      setPrestadoresEnZonasCercanas(cercanos);

      setPrestadoresCargados(true);
      setLoading(false);
    }

    cargarPrestadores();
  }, [id]);

  // Inicializar lista de prestadores enviados y sentPrestadorIds desde el mock (si existe)
  useEffect(() => {
    // Cargar desde backend los prestadores a los que ya se envió esta solicitud
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/clientes/solicitudes/${id}/prestadores-enviados`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.token}` },
            credentials: "include",
          }
        );
        const json = await res.json();

        if (res.ok) {
          const lista = Array.isArray(json.data) ? json.data : [];
          // debug log removed

          // Resolver calificación y cantidad de reseñas para cada prestador
          const token = localStorage.getItem('token');
          const enriched = await Promise.all(
            lista.map(async (p) => {
              const basic = {
                id: p.id,
                nombrePublico: p.nombrePublico || p.nombre_completo || null,
                categoria: "",
                localidad: "",
                calificacionPromedio: 0,
                cantidadResenas: 0,
                experiencia: "",
                foto: "👤",
                fechaEnvio: new Date(p.fechaEnvio).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
              };

              try {
                // Obtener info básica del prestador
                const r = await fetch(`http://localhost:3000/api/prestadores/${p.id}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : undefined,
                  },
                  credentials: 'include'
                });
                const jr = r.ok ? await r.json().catch(() => ({})) : {};
                const pdata = jr.data || jr || {};

                // Preferir estadísticas agregadas si el endpoint de prestador las incluye
                let promedio = 0;
                let cantidad = 0;
                if (pdata && (pdata.calificacionPromedio !== undefined || pdata.cantidadCalificaciones !== undefined)) {
                  promedio = pdata.calificacionPromedio || pdata.calificacion_promedio || 0;
                  cantidad = pdata.cantidadCalificaciones || pdata.cantidad_calificaciones || 0;
                } else {
                  // Obtener calificaciones (usamos el endpoint específico)
                  try {
                    const rc = await fetch(`http://localhost:3000/api/calificaciones/prestador/${p.id}?limit=50`, {
                      method: 'GET',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: token ? `Bearer ${token}` : undefined,
                      },
                      credentials: 'include'
                    });
                    if (rc.ok) {
                      const jrc = await rc.json().catch(() => ({}));
                      const rows = Array.isArray(jrc.data) ? jrc.data : [];
                      cantidad = (jrc.pagination && jrc.pagination.total) ? jrc.pagination.total : rows.length;
                      if (rows.length > 0) {
                        const sum = rows.reduce((s, c) => s + (c.estrellas || 0), 0);
                        promedio = +(sum / rows.length).toFixed(1);
                      }
                    }
                  } catch (eCal) {
                    console.warn('No se pudieron obtener calificaciones para prestador', p.id, eCal);
                  }
                }

                return {
                  ...basic,
                  nombrePublico: basic.nombrePublico || pdata.nombre_completo || pdata.nombre || basic.nombrePublico,
                  categoria: pdata.categorias && pdata.categorias[0] ? pdata.categorias[0].nombre : basic.categoria,
                  localidad: pdata.ubicacion ? pdata.ubicacion.localidad : basic.localidad,
                  calificacionPromedio: Number(promedio) || 0,
                  cantidadResenas: Number(cantidad) || 0,
                  experiencia: pdata.experiencia || basic.experiencia,
                  foto: pdata.imagenes && pdata.imagenes[0] ? pdata.imagenes[0].ruta_imagen : basic.foto,
                };
              } catch (e) {
                console.warn('No se pudo resolver prestador', p.id, e);
                return basic;
              }
            })
          );

          setPrestadoresEnviadosLista(enriched);
          setSentPrestadorIds(lista.map((p) => p.id));
        } else {
          console.warn("No se pudieron cargar prestadores enviados:", json);
          setPrestadoresEnviadosLista([]);
          setSentPrestadorIds([]);
        }
      } catch (err) {
        console.error("Error cargando prestadores enviados:", err);
        setPrestadoresEnviadosLista([]);
        setSentPrestadorIds([]);
      }
    })();
  }, [id]);

  //--------------------------------------------------------------

  const solicitud = solicitudes.find((s) => s.id === parseInt(id)); // CAMBIO------------------------------
  // Determinar qué mostrar según el estado.
  // Usamos un estado visual persistente (`displayEstado`) para mantener la apariencia tal cual
  // incluso si el backend actualiza `solicitud.estado`. Esto se guarda en localStorage por solicitud.
  const displayEstadoKey = `display_estado_solicitud_${id}`;
  const displayEstado =
    displayEstadoLocal ||
    (typeof window !== "undefined" && localStorage.getItem(displayEstadoKey)
      ? localStorage.getItem(displayEstadoKey)
      : solicitud
      ? solicitud.estado
      : undefined);

  const esPendienteCalificacion = displayEstado === "Pendiente de Calificación";
  const esCerrada = displayEstado === "Cerrada";

  // Guardar el estado visual inicial en localStorage la primera vez que cargue la solicitud
  React.useEffect(() => {
    if (!solicitud) return;
    try {
      if (
        typeof window !== "undefined" &&
        !localStorage.getItem(displayEstadoKey)
      ) {
        localStorage.setItem(displayEstadoKey, solicitud.estado);
      }
    } catch (e) {}
  }, [solicitud, displayEstadoKey]);
  // Preferir datos reales cargados desde backend; si no hay, usar el mock definido arriba
  const presupuestosRecibidos = useMemo(() => {
    return presupuestosRecibidosState && presupuestosRecibidosState.length > 0
      ? presupuestosRecibidosState
      : presupuestosPorSolicitud[parseInt(id)] || [];
  }, [presupuestosRecibidosState, id]);

  // Cargar presupuestos reales desde la API del backend para este cliente y filtrar por id de solicitud
  React.useEffect(() => {
    if (!user || !id) return;

    const cargar = async () => {
      try {
        // Intentamos consultar una ruta genérica que devuelva los presupuestos del cliente
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:3000/api/presupuestos/cliente",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            credentials: "include",
            body: JSON.stringify({ id_usuario: user.id_cliente }),
          }
        );

        if (!res.ok) {
          // Si la ruta no existe o hay error, no interrumpimos la UI: dejamos el fallback mock
          console.warn(
            "No se pudieron obtener presupuestos del backend:",
            res.status
          );
          return;
        }

        const json = await res.json();
        // Esperamos un array de presupuestos; si viene anidado en `data`, lo usamos
        const presupuestos = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];

        // Filtrar por id_solicitud y normalizar campos esperados por la UI
        const filtrados = presupuestos
          .filter((p) => Number(p.id_solicitud) === parseInt(id))
          .map((p) => ({
            id: p.id_presupuesto || p.id || null,
            prestadorId: p.id_prestador,
            prestadorNombre:
              (p.prestador &&
                (p.prestador.nombre_completo || p.prestador.nombre)) ||
              p.prestadorNombre ||
              `Prestador #${p.id_prestador}`,
            monto: p.monto || 0,
            plazo: p.plazo_dias || p.plazo || 0,
            mensaje: p.mensaje || "",
            estado: p.estado || "Pendiente",
            fechaEnvio: p.fecha_envio || p.fechaEnvio || null,
            fechaCompletado: p.fecha_completado || p.fechaCompletado || null,
            datosContacto: p.datosContacto || p.datos_contacto || null,
          }));

        // Resolver nombres reales de prestador si vienen faltantes o con el placeholder
        const idsParaResolver = Array.from(
          new Set(
            filtrados
              .filter(
                (f) =>
                  !f.prestadorNombre ||
                  /^Prestador #/i.test(String(f.prestadorNombre))
              )
              .map((f) => f.prestadorId)
              .filter(Boolean)
          )
        );

        if (idsParaResolver.length > 0) {
          await Promise.all(
            idsParaResolver.map(async (pid) => {
              try {
                const r = await fetch(
                  `http://localhost:3000/api/prestadores/${pid}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token ? `Bearer ${token}` : undefined,
                    },
                    credentials: "include",
                  }
                );
                if (!r.ok) return null;
                const jr = await r.json();
                const pdata = jr && jr.data ? jr.data : jr;
                const nombre =
                  pdata?.nombre_completo ||
                  pdata?.nombre ||
                  pdata?.nombrePublico ||
                  null;
                const telefono =
                  pdata?.telefono ||
                  pdata?.telefono_contacto ||
                  pdata?.celular ||
                  pdata?.mobile ||
                  null;
                const email =
                  pdata?.email ||
                  pdata?.correo ||
                  pdata?.email_contacto ||
                  null;
                const whatsapp =
                  pdata?.whatsapp ||
                  pdata?.contacto_whatsapp ||
                  (telefono
                    ? `https://wa.me/${telefono.replace(/[^0-9]/g, "")}`
                    : null);

                filtrados.forEach((f) => {
                  if (f.prestadorId === pid) {
                    if (nombre) f.prestadorNombre = nombre;
                    // Sólo asignar datosContacto si no vienen ya en el presupuesto
                    if (!f.datosContacto || !f.datosContacto.telefono) {
                      f.datosContacto = {
                        telefono:
                          telefono ||
                          (f.datosContacto && f.datosContacto.telefono) ||
                          null,
                        email:
                          email ||
                          (f.datosContacto && f.datosContacto.email) ||
                          null,
                        whatsapp:
                          whatsapp ||
                          (f.datosContacto && f.datosContacto.whatsapp) ||
                          null,
                      };
                    }
                  }
                });
              } catch (e) {
                console.warn("No se pudo resolver prestador", pid, e);
              }
            })
          );
        }

        setPresupuestosRecibidosState(filtrados);
      } catch (error) {
        console.warn("Error cargando presupuestos del backend:", error);
      }
    };

    cargar();
  }, [user, id]);

  // Si existe un presupuesto aceptado, abrir modal con sus datos al cargar la lista
  // NOTA: no sobrescribimos el estado visual si ya fue marcado localmente como 'Cerrada'
  React.useEffect(() => {
    if (!presupuestosRecibidos || presupuestosRecibidos.length === 0) return;
    const aceptado = presupuestosRecibidos.find(
      (p) => String(p.estado) === "Aceptado"
    );
    if (!aceptado) return;

    // Determinar el estado visual actual (priorizar override local)
    const estadoLocalStored =
      displayEstadoLocal ||
      (typeof window !== "undefined" &&
        localStorage.getItem(displayEstadoKey)) ||
      (solicitud ? solicitud.estado : undefined);

    // Si ya está marcado como Cerrada localmente, no forzamos Pendiente de Calificación
    if (String(estadoLocalStored) === "Cerrada") return;

    setPresupuestoSeleccionado(aceptado);
    setPresupuestoAceptado(true);
    // Mostrar la vista inline y abrir modal de calificación
    setMostrarDetalleInline(true);
    // Actualizar estado visual de la solicitud y ocultar listas de prestadores
    try {
      localStorage.setItem(displayEstadoKey, "Pendiente de Calificación");
    } catch (e) {}
    setPrestadoresRecomendados([]);
    setPrestadoresEnviadosLista([]);
    setSentPrestadorIds([]);
  }, [presupuestosRecibidos, displayEstadoKey, displayEstadoLocal, solicitud]);

  if (!solicitud) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <h3>Solicitud no encontrada</h3>
          <p>La solicitud que buscas no existe o fue eliminada.</p>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate("/panel-solicitante")}
          >
            Volver al Panel
          </Button>
        </div>
      </div>
    );
  }

  const prestadoresMostrados = buscarCercanos
    ? prestadoresEnZonasCercanas
    : mostrarTodos
    ? prestadoresRecomendados
    : prestadoresRecomendados.slice(0, 3);

  const renderEstrellas = (calificacion) => {
    const estrellas = [];
    const llenas = Math.floor(calificacion);
    const media = calificacion % 1 !== 0;
    for (let i = 0; i < llenas; i++)
      estrellas.push(
        <i key={`f${i}`} className="bi bi-star-fill text-warning"></i>
      );
    if (media)
      estrellas.push(<i key="m" className="bi bi-star-half text-warning"></i>);
    for (let i = 0; i < 5 - Math.ceil(calificacion); i++)
      estrellas.push(<i key={`v${i}`} className="bi bi-star text-warning"></i>);
    return estrellas;
  };

  const handleSolicitarPresupuesto = (prestador) => {
    if (!user?.id_cliente) return alert("No estás autenticado");

    const confirmSend = window.confirm(
      `Enviar solicitud a ${prestador.nombrePublico}?`
    );
    if (!confirmSend) return;

    const prestadorId = prestador.id;
    setSendingPrestadorIds((prev) => [...prev, prestadorId]);

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/clientes/solicitudes/prestadores/crear`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              id_cliente: user.id_cliente,
              id_solicitud: parseInt(id),
              id_prestador: prestadorId,
            }),
          }
        );

        const json = await res.json();
        if (!res.ok)
          throw new Error(json.message || "Error al solicitar presupuesto");

        // Actualizar lista local de prestadores enviados
        const nuevoPrestador = {
          id: prestador.id,
          nombrePublico:
            prestador.nombrePublico ||
            prestador.nombre ||
            prestador.nombre_completo ||
            "",
          categoria: prestador.categoria || "",
          localidad: prestador.localidad || "",
          calificacionPromedio: prestador.calificacionPromedio || 0,
          cantidadResenas: prestador.cantidadResenas || 0,
          trabajosRealizados: prestador.trabajosRealizados || 0,
          experiencia: prestador.experiencia || "",
          foto: prestador.foto || "👤",
          fechaEnvio: new Date().toLocaleDateString(),
        };

        // Refrescar lista de prestadores enviados desde backend (fuente de verdad)
        try {
          const res2 = await fetch(
            `http://localhost:3000/api/clientes/solicitudes/${id}/prestadores-enviados`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${localStorage.token}` },
              credentials: "include",
            }
          );
          const json2 = await res2.json();
          if (res2.ok) {
            const lista = Array.isArray(json2.data) ? json2.data : [];
            setPrestadoresEnviadosLista(
              lista.map((p) => ({
                id: p.id,
                nombrePublico: p.nombrePublico || p.nombre_completo || null,
                categoria: "",
                localidad: "",
                calificacionPromedio: "",
                cantidadResenas: "",
                trabajosRealizados: "",
                experiencia: "",
                foto: "👤",
                fechaEnvio: new Date(p.fechaEnvio).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
              }))
            );
            setSentPrestadorIds(lista.map((p) => p.id));
          } else {
            // si falla, asegurar que el botón quede como enviado localmente
            setPrestadoresEnviadosLista((prev) => [nuevoPrestador, ...prev]);
            setSentPrestadorIds((prev) =>
              Array.from(new Set([prestadorId, ...prev]))
            );
          }
        } catch (err2) {
          console.error("Error refrescando prestadores enviados:", err2);
          setPrestadoresEnviadosLista((prev) => [nuevoPrestador, ...prev]);
          setSentPrestadorIds((prev) =>
            Array.from(new Set([prestadorId, ...prev]))
          );
        }

        localStorage.setItem(displayEstadoKey, "Enviada");
        /*
        try {
  const resEstado = await fetch(`http://localhost:3000/api/clientes/solicitudes/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.token}` },
    credentials: 'include',
  });
  const jsonEstado = await resEstado.json();
  if (resEstado.ok && jsonEstado.data?.estado) {
    const nuevoEstado = jsonEstado.data.estado;
    localStorage.setItem(displayEstadoKey, nuevoEstado);
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === parseInt(id) ? { ...s, estado: nuevoEstado } : s
      )
    );
  }
} catch (errEstado) {
  console.error('Error obteniendo estado actualizado:', errEstado);
}

*/

        // No cambiar la apariencia visual de la solicitud aquí (se mantiene como el usuario la vio)

        alert("Solicitud enviada al prestador correctamente");
      } catch (err) {
        console.error(err);
        alert("Error al enviar la solicitud: " + (err.message || ""));
      } finally {
        setSendingPrestadorIds((prev) => prev.filter((x) => x !== prestadorId));
      }
    })();
  };

  const handleVerPresupuesto = (presupuesto) => {
    // Seleccionar presupuesto y abrir modal de confirmación (igual que PanelSolicitante)
    setPresupuestoSeleccionado(presupuesto);
    // marcar si este presupuesto ya está aceptado
    setPresupuestoAceptado(String(presupuesto?.estado) === "Aceptado");
    // asegurar que la vista inline y el modal de calificación estén cerrados
    setMostrarDetalleInline(false);
    setMostrarModalCalificacion(false);
    // abrir el modal de presupuesto (misma UI que antes)
    setShowModalPresupuesto(true);
  };

  const handleAceptarPresupuesto = async () => {
    if (!presupuestoSeleccionado)
      return alert("No hay presupuesto seleccionado");
    const idPresupuesto =
      presupuestoSeleccionado.id_presupuesto ||
      presupuestoSeleccionado.id ||
      presupuestoSeleccionado.id_presupuesto;
    if (!idPresupuesto) return alert("ID de presupuesto no disponible");

    try {
      const res = await fetch(
        `http://localhost:3000/api/clientes/presupuesto/${idPresupuesto}/aceptar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const json = await res.json();
      if (!res.ok) {
        console.error("Error aceptando presupuesto:", json);
        return alert(
          json.error || json.message || "Error al aceptar presupuesto"
        );
      }

      const actualizado = json.data || json.presupuesto || null;

      // Actualizar la lista local de presupuestos con los datos devueltos (si los hay)
      setPresupuestosRecibidosState((prev) =>
        prev.map((p) => {
          if (
            (p.id && String(p.id) === String(idPresupuesto)) ||
            (p.id_presupuesto &&
              String(p.id_presupuesto) === String(idPresupuesto))
          ) {
            return {
              ...p,
              estado: (actualizado && actualizado.estado) || "Aceptado",
              datosContacto:
                (actualizado &&
                  (actualizado.datosContacto || actualizado.datos_contacto)) ||
                p.datosContacto ||
                presupuestoSeleccionado.datosContacto ||
                null,
            };
          }
          return p;
        })
      );

      setPresupuestoSeleccionado((prev) => ({
        ...(prev || {}),
        estado: (actualizado && actualizado.estado) || "Aceptado",
        datosContacto:
          (actualizado &&
            (actualizado.datosContacto || actualizado.datos_contacto)) ||
          (prev && prev.datosContacto) ||
          null,
      }));

      setPresupuestoAceptado(true);
      // Mostrar la vista inline del presupuesto aceptado inmediatamente
      setMostrarDetalleInline(true);
      // Forzar estado visual local para que la sección de calificación aparezca sin esperar refresh
      try {
        setDisplayEstadoLocal("Pendiente de Calificación");
      } catch (e) {}
      setShowModalPresupuesto(false);

      // Actualizar estado visual y ocultar prestadores
      try {
        localStorage.setItem(displayEstadoKey, "Pendiente de Calificación");
      } catch (e) {}
      setPrestadoresRecomendados([]);
      setPrestadoresEnviadosLista([]);
      setSentPrestadorIds([]);

      alert(
        "Presupuesto aceptado. La solicitud pasó a Pendiente de Calificación"
      );

      // Refrescar solicitudes
      try {
        if (user?.id_cliente) {
          const nuevas = await getSolicitudes(user.id_cliente);
          setSolicitudes(nuevas);
        }
      } catch (e) {
        console.warn(
          "No se pudieron refrescar solicitudes tras aceptar presupuesto",
          e
        );
      }
    } catch (err) {
      console.error("Error aceptando presupuesto:", err);
      alert("Error al aceptar presupuesto. Intenta nuevamente.");
    }
  };

  const handleRechazarPresupuesto = (presupuesto) => {
    // Si se llama desde el modal sin parámetro, solo cerrar
    if (!presupuesto && presupuestoSeleccionado) {
      // cerrar modal si estuviera abierta
      setShowModalPresupuesto(false);
      return;
    }

    // Si se recibe un presupuesto, actualizar estado localmente como rechazado
    if (presupuesto) {
      setPresupuestosRecibidosState((prev) =>
        prev.map((p) =>
          p.id === presupuesto.id ? { ...p, estado: "Rechazado" } : p
        )
      );
      // si el modal está abierto para ese presupuesto, cerrarlo
      if (
        presupuestoSeleccionado &&
        presupuestoSeleccionado.id === presupuesto.id
      ) {
        setShowModalPresupuesto(false);
      }
      alert("Presupuesto rechazado.");
      return;
    }
  };

  const handleMostrarModalCalificacion = () => {
    setMostrarModalCalificacion(true);
  };

  const handleEnviarCalificacion = () => {
    if (calificacion === 0) {
      alert("Por favor selecciona una calificación de 1 a 5 estrellas.");
      return;
    }

    // Enviar la calificación al backend:
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const idPrestador =
          presupuestoSeleccionado?.prestadorId ||
          presupuestoSeleccionado?.id_prestador ||
          null;
        if (!idPrestador) {
          return alert("No se encontró el prestador para calificar.");
        }

        // 1) Marcar la solicitud como 'Cerrada' en backend (flujo: calificar => cerrar)
        try {
          if (user?.id_cliente) {
            await fetch(
              `http://localhost:3000/api/clientes/${user.id_cliente}/solicitudes/${id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token ? `Bearer ${token}` : undefined,
                },
                credentials: "include",
                body: JSON.stringify({ estado: "Cerrada" }),
              }
            );
          }
        } catch (e) {
          console.warn(
            "No se pudo actualizar estado a Cerrada previo a calificar:",
            e
          );
        }

        // 2) Enviar la calificación
        const res = await fetch("http://localhost:3000/api/calificaciones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          credentials: "include",
          body: JSON.stringify({
            estrellas: calificacion,
            comentario: comentarioCalificacion || null,
            id_solicitud: parseInt(id),
            id_prestador: idPrestador,
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          console.error("Error guardando calificación:", json);
          return alert(
            json.error || json.message || "Error al enviar la calificación"
          );
        }

        // Éxito: actualizar UI localmente
        alert("Calificación enviada correctamente. Gracias por tu feedback.");
        setMostrarModalCalificacion(false);
        setCalificacion(0);
        setComentarioCalificacion("");
        try {
          setDisplayEstadoLocal("Cerrada");
          try {
            localStorage.setItem(displayEstadoKey, "Cerrada");
          } catch (e) {}
        } catch (e) {}

        // Refrescar solicitudes y presupuestos
        try {
          if (user?.id_cliente) {
            const nuevas = await getSolicitudes(user.id_cliente);
            setSolicitudes(nuevas);
          }
        } catch (e) {
          console.warn(
            "No se pudieron refrescar solicitudes tras calificar",
            e
          );
        }

        // Navegar o mantener en la misma página según prefieras
        setTimeout(() => navigate("/panel-solicitante"), 1200);
      } catch (err) {
        console.error("Error enviando calificación:", err);
        alert("Error al enviar la calificación. Intenta nuevamente.");
      }
    })();
  };

  const renderEstrellasCalificacion = (rating, setRating) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <i
          key={i}
          className={`bi ${
            i <= rating ? "bi-star-fill" : "bi-star"
          } estrella-calificacion`}
          onClick={() => setRating(i)}
          style={{
            cursor: "pointer",
            color: i <= rating ? "#ffc107" : "#dee2e6",
            fontSize: "2rem",
            marginRight: "0.5rem",
          }}
        ></i>
      );
    }
    return estrellas;
  };

  return (
    <div className="solicitud-detalle-container">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate("/panel-solicitante")}
      >
        ← Volver a Mis Solicitudes
      </Button>

      {/* --- Detalle de la solicitud --- */}
      <div className="card solicitud-card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between">
            <div>
              <h3>{solicitud.titulo}</h3>
              <div className="solicitud-meta">
                <span className="badge bg-secondary me-2">
                  {solicitud.categoria}
                </span>
                <span className="badge bg-info me-2">
                  {solicitud.localidad}
                </span>
                <span className="badge bg-light text-dark">
                  {new Date(solicitud.fechaCreacion).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span
              className={`badge-estado ${
                displayEstado === "Iniciada"
                  ? "bg-secondary"
                  : displayEstado === "Enviada"
                  ? "bg-primary"
                  : displayEstado === "Cotizada"
                  ? "bg-info"
                  : displayEstado === "Pendiente de Calificación"
                  ? "bg-warning text-dark"
                  : "bg-success"
              }`}
            >
              {displayEstado}
            </span>
          </div>
        </div>
        <div className="card-body">
          <h5>Descripción del Servicio</h5>
          <p>{solicitud.descripcion}</p>
        </div>
      </div>

      {/* Recomendaciones (mostrar si la solicitud no está cerrada y no hay presupuesto aceptado) */}
      {!esCerrada && !presupuestoAceptado && !esPendienteCalificacion && (
        <div className="recomendaciones-section">
          <div className="section-header mb-4">
            <h4>
              {buscarCercanos
                ? "Prestadores en Zonas Cercanas"
                : "Prestadores Recomendados"}
            </h4>
          </div>

          {/* CARGA CON SPINER */}
          {!prestadoresCargados ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Buscando prestadores...</p>
            </div>
          ) : prestadoresMostrados.length > 0 ? (
            <>
              <div className="row g-4">
                {prestadoresMostrados.map((p) => (
                  <div key={p.id} className="col-md-6 col-lg-4">
                    <div className="card prestador-card h-100">
                      <div className="card-body text-center">
                        <div className="prestador-avatar mb-2">{p.foto}</div>
                        <h5>{p.nombrePublico}</h5>
                        <p className="text-muted">
                          {p.categoria} • {p.localidad}
                        </p>
                        <div>{renderEstrellas(p.calificacionPromedio)}</div>
                        <small className="text-muted d-block mb-2">
                          • {p.cantidadResenas} reseñas
                        </small>
                        <div className="info-box mb-3">{p.experiencia}</div>
                        <div className="d-grid gap-2">
                          <Button
                            variant="outline-primary"
                            onClick={() => navigate(`/perfil/${p.id}`)}
                          >
                            Ver Perfil
                          </Button>
                          <Button
                            variant={
                              sentPrestadorIds.includes(p.id)
                                ? "outline-secondary"
                                : "success"
                            }
                            onClick={() => handleSolicitarPresupuesto(p)}
                            disabled={
                              sendingPrestadorIds.includes(p.id) ||
                              sentPrestadorIds.includes(p.id)
                            }
                          >
                            {sendingPrestadorIds.includes(p.id)
                              ? "Enviando..."
                              : sentPrestadorIds.includes(p.id)
                              ? "Enviada..."
                              : "Solicitar Presupuesto"}
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
                  <Button
                    variant="outline-secondary"
                    size="large"
                    onClick={() => setMostrarTodos(!mostrarTodos)}
                  >
                    {mostrarTodos
                      ? "Ver menos"
                      : `Ver todos (${prestadoresRecomendados.length})`}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-warning text-center">
              <h5>
                No se encontraron prestadores de {solicitud.categoria} en{" "}
                {solicitud.localidad}
              </h5>
              {prestadoresEnZonasCercanas.length > 0 && !buscarCercanos ? (
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => setBuscarCercanos(true)}
                >
                  Buscar en localidades cercanas (
                  {prestadoresEnZonasCercanas.length})
                </Button>
              ) : buscarCercanos ? (
                <Button
                  variant="outline-secondary"
                  className="mt-3"
                  onClick={() => setBuscarCercanos(false)}
                >
                  Volver a búsqueda original
                </Button>
              ) : (
                <p className="text-muted mt-2">
                  Tampoco hay prestadores cercanos disponibles.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Prestadores Enviados (ocultar si ya se aceptó un presupuesto o está pendiente calificación) */}
      {!presupuestoAceptado && !esPendienteCalificacion && !esCerrada && (
        <div className="prestadores-enviados-section">
          <div className="section-header mb-4">
            <h4>Prestadores a los que se envió la solicitud</h4>
            <p className="text-muted">
              Esperando respuesta de los prestadores contactados
            </p>
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
                          <p className="text-muted mb-0">
                            {p.categoria} • {p.localidad}
                          </p>
                        </div>
                      </div>
                      <div className="mb-2">
                        {renderEstrellas(p.calificacionPromedio)}
                      </div>
                      <small className="text-muted d-block mb-3">
                        • {p.cantidadResenas} reseñas 
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

      {/* Presupuestos list removed - UI now shows accepted/completed card and calificación section below */}

      {/* Presupuestos Recibidos: mostrar salvo que ya se haya aceptado uno */}
      {!presupuestoAceptado && (
        <div className="presupuestos-section mt-4">
          <div className="section-header mb-3">
            <h4>Presupuestos Recibidos</h4>
            <p className="text-muted">
              Revisa las propuestas que te enviaron los prestadores
            </p>
          </div>

          {presupuestosRecibidos && presupuestosRecibidos.length > 0 ? (
            <div className="row g-4">
              {presupuestosRecibidos.map((p) => (
                <div key={p.id} className="col-md-6">
                  <div
                    className={`card presupuesto-card ${
                      p.estado === "Aceptado" ? "presupuesto-aceptado" : ""
                    }`}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <h5>{p.prestadorNombre}</h5>
                        <span
                          className={`badge ${
                            p.estado === "Aceptado"
                              ? "bg-success"
                              : p.estado === "Completado"
                              ? "bg-primary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {p.estado}
                        </span>
                      </div>
                      <p>
                        <strong>Monto:</strong> $
                        {p.monto?.toLocaleString?.() ?? p.monto}
                      </p>
                      <p>
                        <strong>Plazo:</strong> {p.plazo} días
                      </p>
                      <p>{p.mensaje}</p>

                      {![
                        "aceptado",
                        "completado",
                        "rechazado",
                        "cerrada",
                      ].includes(
                        String(p.estado || "")
                          .trim()
                          .toLowerCase()
                      ) && (
                        <div className="d-grid gap-2">
                          <Button
                            variant="success"
                            onClick={() => handleVerPresupuesto(p)}
                            icon="check-circle"
                          >
                            Aceptar Presupuesto
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleRechazarPresupuesto(p)}
                            icon="x-circle"
                          >
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>No hay presupuestos
              recibidos aún.
            </div>
          )}
        </div>
      )}

      {/* Aviso para calificación (estado pendiente de calificación) */}
      {esPendienteCalificacion && (
        <div className="calificacion-pendiente-section">
          {/* Primero: Información del prestador */}
          {presupuestosRecibidos
            .filter((p) =>
              ["Completado", "Aceptado"].includes(String(p.estado))
            )
            .map((p) => (
              <div key={p.id} className={`card presupuesto-completado mb-4`}>
                <div className="card-body">
                  <h4 className="text-center mb-4">
                    <i
                      className={`me-2 ${
                        p.estado === "Completado"
                          ? "bi bi-person-check"
                          : "bi bi-person-plus"
                      }`}
                    ></i>
                    {p.estado === "Completado"
                      ? `Trabajo Completado por ${p.prestadorNombre}`
                      : `Prestador Aceptado: ${p.prestadorNombre}`}
                  </h4>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <p>
                        <strong>Prestador:</strong> {p.prestadorNombre}
                      </p>
                      <p>
                        <strong>Trabajo realizado:</strong> {solicitud.titulo}
                      </p>
                    </div>
                    <div className="col-md-6 text-end">
                      <p className="monto-valor mb-0">
                        ${p.monto.toLocaleString()}
                      </p>
                      <small className="text-muted">Monto final</small>
                    </div>
                  </div>
                  {p.datosContacto && (
                    <div className="contacto-box-aceptado mt-3 d-flex justify-content-between align-items-center">
                      <div className="contact-left">
                        <div>
                          <p className="mb-0">📞 {p.datosContacto.telefono}</p>
                          {p.datosContacto.email && (
                            <p className="mb-0">📧 {p.datosContacto.email}</p>
                          )}
                        </div>
                      </div>
                      <div className="contact-right">
                        <a
                          href={p.datosContacto.whatsapp}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-success whatsapp-btn"
                        >
                          <i className="bi bi-whatsapp me-2"></i>WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {/* Segundo: Sección para calificar */}
          <div className="alert alert-warning text-center">
            <h4>
              <i className="bi bi-star me-2"></i>Califica el Servicio Recibido
            </h4>
            <p className="mb-3">
              Tu opinión es muy importante. Ayuda a otros usuarios calificando
              el trabajo realizado.
            </p>
            <Button
              variant="warning"
              size="large"
              onClick={handleMostrarModalCalificacion}
              icon="star-fill"
            >
              Calificar Prestador
            </Button>
          </div>
        </div>
      )}

      {/* Solicitud Cerrada */}
      {esCerrada && (
        <div className="solicitud-cerrada-section">
          <div className="alert alert-success text-center">
            <h4>
              <i className="bi bi-check-circle me-2"></i>Solicitud Completada
            </h4>
            <p className="mb-0">
              Esta solicitud ha sido cerrada exitosamente. El trabajo fue
              completado y calificado.
            </p>
          </div>

          <div className="card trabajo-finalizado mt-4">
            <div className="card-body">
              <h5 className="text-center mb-4">
                Resumen del Trabajo Finalizado
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Servicio:</strong> {solicitud.titulo}
                  </p>
                  <p>
                    <strong>Categoría:</strong> {solicitud.categoria}
                  </p>
                  <p>
                    <strong>Localidad:</strong> {solicitud.localidad}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Fecha de solicitud:</strong>{" "}
                    {solicitud.fechaCreacion}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span className="badge bg-success">Cerrada</span>
                  </p>
                  <p>
                    <strong>Resultado:</strong> Trabajo completado
                    satisfactoriamente
                  </p>
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

      {/* La confirmación de aceptación se muestra inline; el modal se ha eliminado. */}

      {/* Modal de Presupuesto (copiado de PanelSolicitante) */}
      {showModalPresupuesto && presupuestoSeleccionado && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-cash-coin me-2"></i>Presupuesto Recibido
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModalPresupuesto(false)}
                  ></button>
                </div>

                <div className="modal-body text-center">
                  <h5 className="mb-3">
                    {presupuestoSeleccionado.prestador?.nombre_completo ||
                      presupuestoSeleccionado.prestadorNombre}
                  </h5>
                  <p className="fw-bold text-success fs-4 mb-3">
                    $
                    {presupuestoSeleccionado.monto?.toLocaleString?.() ??
                      presupuestoSeleccionado.monto}
                  </p>
                  <p className="text-muted mb-4">
                    {presupuestoSeleccionado.mensaje}
                  </p>

                  {!presupuestoAceptado ? (
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      ¿Deseas aceptar este presupuesto? Si lo haces, se
                      mostrarán los datos de contacto del prestador.
                    </div>
                  ) : (
                    <div className="alert alert-success text-start">
                      <strong>Datos de contacto del prestador:</strong>
                      <ul className="mt-2">
                        <li>
                          <i className="bi bi-telephone me-2"></i>
                          {presupuestoSeleccionado.datosContacto?.telefono ||
                            presupuestoSeleccionado.prestador?.telefono}
                        </li>
                        <li>
                          <i className="bi bi-whatsapp me-2"></i>
                          <a
                            href={
                              presupuestoSeleccionado.datosContacto?.whatsapp ||
                              (presupuestoSeleccionado.prestador?.telefono
                                ? `https://wa.me/${String(
                                    presupuestoSeleccionado.prestador?.telefono
                                  ).replace(/[^0-9]/g, "")}`
                                : "#")
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
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
                        onClick={() => {
                          setShowModalPresupuesto(false);
                        }}
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

      {/* Modal para calificar prestador */}
      {mostrarModalCalificacion && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-star me-2"></i>Calificar Prestador
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModalCalificacion(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-4">
                    <h5>¿Cómo fue el servicio?</h5>
                    <p className="text-muted">
                      Tu calificación ayuda a otros usuarios a tomar mejores
                      decisiones
                    </p>
                  </div>

                  <div className="text-center mb-4">
                    <p className="fw-bold mb-3">Selecciona tu calificación:</p>
                    <div className="estrellas-container">
                      {renderEstrellasCalificacion(
                        calificacion,
                        setCalificacion
                      )}
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
                    <label htmlFor="comentario" className="form-label">
                      Comentario (opcional)
                    </label>
                    <textarea
                      className="form-control"
                      id="comentario"
                      rows="3"
                      placeholder="Comparte tu experiencia con este prestador..."
                      value={comentarioCalificacion}
                      onChange={(e) =>
                        setComentarioCalificacion(e.target.value)
                      }
                      maxLength="300"
                    ></textarea>
                    <small className="text-muted">
                      {comentarioCalificacion.length}/300 caracteres
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarModalCalificacion(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="warning"
                    onClick={handleEnviarCalificacion}
                    icon="star-fill"
                  >
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
