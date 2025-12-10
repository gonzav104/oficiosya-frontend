export async function getSolicitudes(idCliente) {
  if (!idCliente) {
    console.warn("No hay idCliente para cargar solicitudes");
    return [];
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    const resp = await fetch(`http://localhost:3000/api/clientes/${idCliente}/solicitudes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  
    const json = await resp.json();

    if (!resp.ok || !json.success) {
      throw new Error(json.message || "Error al cargar solicitudes");
    }

    return json.data.map(item => ({
      id: item.id_solicitud_servicio,
      titulo: item.titulo,
      estado: item.estado,
      categoria: item.categoria?.nombre || "Sin categoría",
      localidad: item.ubicacion?.localidad || "Sin ubicación",
      fechaCreacion: item.fecha_creacion,
      hace: calcularHace(item.fecha_creacion),
      descripcion: item.descripcion,
      imagenes: item.imagenes || [] 
    }));

  } catch (error) {
    console.error("Error cargando solicitudes:", error);
    return [];
  }
}

// Calcula el tiempo transcurrido desde la fecha dada hasta ahora
export function calcularHace(fecha) {
  const ahora = Date.now();
  const fechaCreacion = new Date(fecha).getTime();
  const diffMs = ahora - fechaCreacion;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHrs < 1) return "menos de una hora";
  if (diffHrs < 24) return `${diffHrs} hora${diffHrs > 1 ? 's' : ''}`;
  
  const diffDays = Math.floor(diffHrs / 24);
  return ` ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}

// Normaliza la estructura que devuelve tu backend
function mapPrestador(p) {
  return {
    id: p.id_prestador,
    nombrePublico: p.nombre_completo,
    categoria: p.categorias?.[0]?.nombre || "Sin categoría",
    localidad: p.ubicacion?.localidad,
    calificacionPromedio: 5,      // modificar si agregás ratings reales
    cantidadResenas: 0,
    trabajosRealizados: 0,
    experiencia: p.categorias?.[0]?.PrestadorCategoria?.descripcion_trabajo,
    foto: "👨‍🔧"
  };
}

// Obtener prestadores recomendados
export async function getPrestadores(idSolicitud) {
  try {
    const res = await fetch(`http://localhost:3000/api/clientes/solicitudes/${idSolicitud}/prestadores`);
    const data = await res.json();

    if (!data.success) return [];

    return data.data.prestadores.map(mapPrestador);
  } catch (error) {
    console.error("Error getPrestadores:", error);
    return [];
  }
}

// Obtener prestadores cercanos
export async function getPrestadoresCercanos(idSolicitud) {
  try {
    const res = await fetch(`http://localhost:3000/api/clientes/solicitudes/${idSolicitud}/prestadores-cercanos`);
    const data = await res.json();

    if (!data.success) return [];

    return data.data.prestadores.map(mapPrestador);
  } catch (error) {
    console.error("Error getPrestadoresCercanos:", error);
    return [];
  }
}
