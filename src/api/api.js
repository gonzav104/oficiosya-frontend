import axios from "axios";

const API_BASE_URL =  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token expiró, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registro unificado de usuarios
  register: async (userData) => {
    try {
      // Determinar el ID de rol basado en el tipo de usuario seleccionado
      let id_rol;
      if (userData.userType === 'solicitante' || userData.userType === 'cliente') {
        id_rol = 2; // Cliente en la DB
      } else if (userData.userType === 'prestador') {
        id_rol = 3; // Prestador en la DB
      } else {
        throw new Error('Tipo de usuario no válido');
      }
      
      // Usar nombres de campos de DB directamente - frontend debería enviar datos con nombres correctos
      const registerData = {
        correo: userData.correo || userData.email,
        contrasena: userData.contrasena || userData.password,
        confirmar_contrasena: userData.confirmar_contrasena || userData.password,
        nombre_completo: userData.nombre_completo || userData.nombreCompleto,
        telefono: userData.telefono || null,
        id_ubicacion: userData.id_ubicacion || userData.ubicacionId || 1,
        id_rol: id_rol,
        descripcion: userData.descripcion || null,
        experiencia: userData.experiencia || userData.experienciaAnios || null,
        categorias: userData.categorias || []
      };
      
      const response = await api.post('/auth/register', registerData);
      
      // Guardar token y datos del usuario si se proporcionan
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error en el registro' };
    }
  },



  // Login de usuario
  login: async (correo, contrasena) => {
    try {
      const response = await api.post('/auth/login', { 
        correo, 
        contrasena 
      });
      
      // Manejo estandarizado de respuestas
      const responseData = response.data;
      const token = responseData.data?.token || responseData.token;
      const user = responseData.data?.user || responseData.usuario;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return responseData;
    } catch (error) {
      throw error.response?.data || { error: 'Error en el login' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Error en logout - continuar con limpieza local
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Recuperación de contraseña - Solicitar reset
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { 
        correo: email  // El backend espera 'correo', no 'email'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al solicitar recuperación de contraseña' };
    }
  },

  // Recuperación de contraseña - Validar token
  validateResetToken: async (token) => {
    try {
      const response = await api.post('/auth/validate-reset-token', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al validar token' };
    }
  },

  // Recuperación de contraseña - Restablecer contraseña
  resetPassword: async (token, nuevaContrasena, confirmarContrasena) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        nueva_contrasena: nuevaContrasena,
        confirmar_contrasena: confirmarContrasena
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al restablecer contraseña' };
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token inválido' };
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener perfil' };
    }
  }
};

// Servicios de categorías
export const categoriaService = {
  // Obtener todas las categorías
  getAll: async () => {
    try {
      const response = await api.get('/categorias');
      
      // Manejar diferentes formatos de respuesta del backend
      if (response.data.success && response.data.data) {
        // Si tiene estructura ResponseService con success
        const data = response.data.data;
        if (data.categorias) {
          // Si tiene el array de nombres
          return { data: data.categorias };
        } else if (data.categoriasCompletas) {
          // Si tiene objetos completos, extraer nombres
          const categorias = data.categoriasCompletas.map(cat => cat.nombre);
          return { data: categorias };
        } else if (Array.isArray(data)) {
          // Si data es un array directo
          const categorias = data.map(cat => 
            typeof cat === 'string' ? cat : cat.nombre || cat
          );
          return { data: categorias };
        }
      } else if (Array.isArray(response.data)) {
        // Si devuelve array directo, extraer nombres
        const categorias = response.data.map(cat => 
          typeof cat === 'string' ? cat : cat.nombre || cat
        );
        return { data: categorias };
      } else if (response.data.categorias) {
        // Si tiene la propiedad categorias directamente
        return { data: response.data.categorias };
      }
      
      // Fallback
      return { data: [] };
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener categorías' };
    }
  }
};

// Servicios de ubicación
export const ubicacionService = {
  // Obtener todas las provincias
  getProvincias: async () => {
    try {
      const response = await api.get('/ubicaciones/provincias');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener provincias' };
    }
  },

  // Obtener localidades por provincia
  getLocalidades: async (provinciaId) => {
    try {
      const response = await api.get(`/ubicaciones/localidades/${provinciaId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener localidades' };
    }
  }
};

// Servicios de prestadores
export const prestadorService = {
  // Crear perfil de prestador
  createProfile: async (prestadorData) => {
    try {
      const response = await api.post('/prestadores', prestadorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear perfil de prestador' };
    }
  },

  // Actualizar perfil de prestador
  updateProfile: async (prestadorId, prestadorData) => {
    try {
      const response = await api.put(`/prestadores/${prestadorId}`, prestadorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar perfil' };
    }
  },

  // Obtener perfil de prestador
  getProfile: async (prestadorId) => {
    try {
      const response = await api.get(`/prestadores/${prestadorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener perfil' };
    }
  },

  // Subir imágenes
  uploadImages: async (prestadorId, formData) => {
    try {
      const response = await api.post(`/prestadores/${prestadorId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al subir imágenes' };
    }
  }
};

// Servicios de clientes
export const clienteService = {
  // Crear perfil de cliente
  createProfile: async (clienteData) => {
    try {
      const response = await api.post('/clientes', clienteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear perfil de cliente' };
    }
  },

  // Actualizar perfil de cliente
  updateProfile: async (clienteId, clienteData) => {
    try {
      const response = await api.put(`/clientes/${clienteId}`, clienteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar perfil' };
    }
  }
};

export default api;
