export async function getDatosCompletosUsuario(idUsuario) {
  if (!idUsuario) return null;

  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:3000/api/users/${idUsuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Error al obtener datos del usuario");

  const json = await res.json();
  return json.data; 
}

export async function getUbicacionDelUsuario(idUsuario) {
  if (!idUsuario) return null;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No hay token");
      return null;
    }

    const response = await fetch(`http://localhost:3000/api/users/${idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    return json.data?.cliente?.id_ubicacion || null;

  } catch (error) {
    console.error("Error obteniendo la ubicacion del usuario:", error);
    return null;
  }
}