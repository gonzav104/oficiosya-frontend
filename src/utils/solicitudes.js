export async function getSolicitudes(idCliente) {
  if (!idCliente) {
    console.warn("No hay idCliente para cargar solicitudes");
    return [];
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    const resp = await fetch(
      `http://localhost:3000/api/clientes/${idCliente}/solicitudes/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const json = await resp.json();

    if (!resp.ok || !json.success) {
      throw new Error(json.message || "Error al cargar solicitudes");
    }

    return json.data.map((item) => ({
      id: item.id_solicitud_servicio,
      titulo: item.titulo,
      estado: item.estado,
      categoria: item.categoria?.nombre || "Sin categoría",
      localidad: item.ubicacion?.localidad || "Sin ubicación",
      fechaCreacion: item.fecha_creacion,
      hace: calcularHace(item.fecha_creacion),
      descripcion: item.descripcion,
      imagenes: item.imagenes || [],
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
  if (diffHrs < 24) return `${diffHrs} hora${diffHrs > 1 ? "s" : ""}`;

  const diffDays = Math.floor(diffHrs / 24);
  return ` ${diffDays} día${diffDays > 1 ? "s" : ""}`;
}

// Normaliza la estructura que devuelve tu backend
function mapPrestador(p) {
  return {
    id: p.id_prestador,
    nombrePublico: p.nombre_completo,
    categoria: p.categorias?.[0]?.nombre || "Sin categoría",
    localidad: p.ubicacion?.localidad,
    calificacionPromedio: 0, // modificar si agregás ratings reales
    cantidadResenas: 0,
    trabajosRealizados: 0,
    experiencia: p.categorias?.[0]?.PrestadorCategoria?.descripcion_trabajo,
    foto: "👨‍🔧",
  };
}

// Obtener prestadores recomendados
export async function getPrestadores(idSolicitud) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/clientes/solicitudes/${idSolicitud}/prestadores`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    const data = await res.json();

    if (!data.success) return [];

    // Mapear y enriquecer con calificaciones reales si el backend lo permite
    const base = data.data.prestadores.map(mapPrestador);
    const token = localStorage.getItem('token');
    const enriched = await Promise.all(
      base.map(async (p) => {
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers.Authorization = `Bearer ${token}`;

          const r = await fetch(`http://localhost:3000/api/prestadores/${p.id}`, {
            method: 'GET',
            headers,
            credentials: 'include',
          });
          if (!r.ok) return p;
          const jr = await r.json().catch(() => ({}));
          const pdata = jr.data || jr || {};

          // intentar extraer promedios desde varias keys posibles
          let avg = pdata.calificacionPromedio ?? pdata.calificacion_promedio ?? pdata.calificacionPromedio?.toString?.() ?? undefined;
          let count = pdata.cantidadCalificaciones ?? pdata.cantidad_calificaciones ?? pdata.cantidadCalificaciones?.toString?.() ?? undefined;

          // si no vienen agregados, pedir calificaciones y calcular promedio
          if ((avg === undefined || avg === null) && (count === undefined || count === null)) {
            try {
              const rc = await fetch(`http://localhost:3000/api/calificaciones/prestador/${p.id}`, {
                method: 'GET',
                headers,
                credentials: 'include',
              });
              if (rc.ok) {
                const jc = await rc.json().catch(() => ({}));
                const calificaciones = jc.data?.calificaciones || jc.data || jc.calificaciones || [];
                if (Array.isArray(calificaciones)) {
                  const total = calificaciones.length;
                  const sum = calificaciones.reduce((s, c) => s + (Number(c.estrellas) || Number(c.puntaje) || 0), 0);
                  avg = total > 0 ? sum / total : 0;
                  count = total;
                }
              }
            } catch (err2) {
              // ignore and fallback to defaults below
              console.warn('No se pudo obtener calificaciones como fallback', p.id, err2);
            }
          }

          const avgNum = Number(avg ?? p.calificacionPromedio) || 0;
          const countNum = Number(count ?? p.cantidadResenas) || 0;

          return {
            ...p,
            nombrePublico: p.nombrePublico || pdata.nombre_completo || pdata.nombre || p.nombrePublico,
            calificacionPromedio: avgNum,
            cantidadResenas: countNum,
            foto: pdata.imagenes && pdata.imagenes[0] ? pdata.imagenes[0].ruta_imagen : p.foto,
          };
        } catch (err) {
          console.warn('No se pudo enriquecer prestador', p.id, err);
          return p;
        }
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error getPrestadores:", error);
    return [];
  }
}

// Obtener prestadores cercanos
export async function getPrestadoresCercanos(idSolicitud) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/clientes/solicitudes/${idSolicitud}/prestadores-cercanos`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    const data = await res.json();

    if (!data.success) return [];

    // Mapear y enriquecer con calificaciones reales
    const base = data.data.prestadores.map(mapPrestador);
    const token = localStorage.getItem('token');
    const enriched = await Promise.all(
      base.map(async (p) => {
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers.Authorization = `Bearer ${token}`;

          const r = await fetch(`http://localhost:3000/api/prestadores/${p.id}`, {
            method: 'GET',
            headers,
            credentials: 'include',
          });
          if (!r.ok) return p;
          const jr = await r.json().catch(() => ({}));
          const pdata = jr.data || jr || {};

          let avg = pdata.calificacionPromedio ?? pdata.calificacion_promedio ?? pdata.calificacionPromedio?.toString?.() ?? undefined;
          let count = pdata.cantidadCalificaciones ?? pdata.cantidad_calificaciones ?? pdata.cantidadCalificaciones?.toString?.() ?? undefined;

          if ((avg === undefined || avg === null) && (count === undefined || count === null)) {
            try {
              const rc = await fetch(`http://localhost:3000/api/calificaciones/prestador/${p.id}`, {
                method: 'GET',
                headers,
                credentials: 'include',
              });
              if (rc.ok) {
                const jc = await rc.json().catch(() => ({}));
                const calificaciones = jc.data?.calificaciones || jc.data || jc.calificaciones || [];
                if (Array.isArray(calificaciones)) {
                  const total = calificaciones.length;
                  const sum = calificaciones.reduce((s, c) => s + (Number(c.estrellas) || Number(c.puntaje) || 0), 0);
                  avg = total > 0 ? sum / total : 0;
                  count = total;
                }
              }
            } catch (err2) {
              console.warn('No se pudo obtener calificaciones como fallback', p.id, err2);
            }
          }

          const avgNum = Number(avg ?? p.calificacionPromedio) || 0;
          const countNum = Number(count ?? p.cantidadResenas) || 0;

          return {
            ...p,
            nombrePublico: p.nombrePublico || pdata.nombre_completo || pdata.nombre || p.nombrePublico,
            calificacionPromedio: avgNum,
            cantidadResenas: countNum,
            foto: pdata.imagenes && pdata.imagenes[0] ? pdata.imagenes[0].ruta_imagen : p.foto,
          };
        } catch (err) {
          console.warn('No se pudo enriquecer prestador', p.id, err);
          return p;
        }
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error getPrestadoresCercanos:", error);
    return [];
  }
}
