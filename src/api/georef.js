// src/api/georef.js
// Utilidades para consumir la API de GeoRef (gobierno argentino)
const API_BASE = 'https://apis.datos.gob.ar/georef/api';

// Obtener todas las provincias
export async function getProvincias() {
  const res = await fetch(`${API_BASE}/provincias`);
  if (!res.ok) throw new Error('Error al obtener provincias');
  const data = await res.json();
  return data.provincias.map((p) => p.nombre).sort();
}

// Obtener localidades por provincia (máx 1000 por defecto)
export async function getLocalidades(provincia, max = 1000) {
  if (!provincia) return [];
  const res = await fetch(`${API_BASE}/localidades?provincia=${encodeURIComponent(provincia)}&max=${max}`);
  if (!res.ok) throw new Error('Error al obtener localidades');
  const data = await res.json();
  // Filtrar nombres únicos
  const nombresUnicos = Array.from(
    new Set(data.localidades.map((l) => l.nombre))
  );
  return nombresUnicos.sort();
}