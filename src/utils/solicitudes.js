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
      imagenes: item.imagenes || [] // por si vienen
    }));

  } catch (error) {
    console.error("Error cargando solicitudes:", error);
    return [];
  }
}

// Función auxiliar 
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