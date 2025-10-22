import axios from "axios";

const API_URL = "http://localhost:3000"; // cambia si tu backend usa otro puerto

export const api = axios.create({
  baseURL: API_URL,
});

// Ejemplo: obtener usuarios
export const getUsuarios = () => api.get("/api/usuarios");

// Ejemplo: crear solicitud
export const crearSolicitud = (data) => api.post("/api/solicitudes", data);
