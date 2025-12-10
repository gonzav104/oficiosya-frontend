export async function crearUbicacion({ provincia, localidad, direccion }) {
  try {
    const res = await fetch("http://localhost:3000/api/ubicaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provincia,
        localidad,
        direccion: direccion || null
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message || "Error al crear ubicación");
    }

    const id = json?.data?.id_ubicacion;

    if (!id) {
      throw new Error("No se recibió un id_ubicacion válido del servidor");
    }

    return id;
  } catch (error) {
    console.error("Error en crearUbicacion():", error);
    throw error;
  }
}