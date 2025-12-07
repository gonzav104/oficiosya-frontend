// Constantes globales

// Roles de usuario (coinciden con la DB)
export const USER_ROLES = {
  CLIENTE: 'Cliente',
  PRESTADOR: 'Prestador', 
  ADMINISTRADOR: 'Administrador',
  // Versiones en minúsculas para comparaciones
  CLIENTE_LOWER: 'cliente',
  PRESTADOR_LOWER: 'prestador',
  ADMIN_LOWER: 'administrador'
};


// Estados de solicitudes
export const SOLICITUD_ESTADOS = {
  PENDIENTE: 'Pendiente',
  COTIZADA: 'Cotizada',
  EN_PROGRESO: 'En Progreso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada'
};

// Estados de reportes
export const REPORTE_ESTADOS = {
  PENDIENTE: 'pendiente',
  RESUELTO: 'resuelto',
  DESESTIMADO: 'desestimado'
};

// Categorías de servicios
export const CATEGORIAS_SERVICIOS = [
  'Plomería',
  'Electricidad',
  'Pintura',
  'Carpintería',
  'Albañilería',
  'Gasista',
  'Herrería',
  'Jardinería',
  'Techista',
  'Limpieza',
  'Refrigeración',
  'Aire Acondicionado'
];

// Provincias de Argentina
export const PROVINCIAS_ARGENTINA = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán'
];

// Límites y validaciones
export const VALIDATION_LIMITS = {
  // Archivos e imágenes
  MAX_IMAGES_PRESTADOR: 5,
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB en bytes
  
  // Textos
  MIN_DESCRIPCION_LENGTH: 20,
  MAX_DESCRIPCION_LENGTH: 500,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  
  // Teléfonos
  MIN_PHONE_LENGTH: 8,
  MAX_PHONE_LENGTH: 15,
  
  // Categorías
  MAX_CATEGORIAS_PRESTADOR: 5,
  MIN_CATEGORIAS_PRESTADOR: 1,
  
  // Edad
  MIN_AGE: 18,
  MAX_AGE: 100,
  
  // Experiencia (años)
  MIN_EXPERIENCE_YEARS: 0,
  MAX_EXPERIENCE_YEARS: 50
};

// Tipos de archivos permitidos
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png'],
  IMAGES_EXTENSIONS: ['.jpg', '.jpeg', '.png']
};

// Configuración de la API
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 segundos
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify',
      ME: '/auth/me',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VALIDATE_RESET_TOKEN: '/auth/validate-reset-token'
    },
    CATEGORIAS: '/categorias',
    UBICACIONES: {
      PROVINCIAS: '/ubicaciones/provincias',
      LOCALIDADES: '/ubicaciones/localidades'
    },
    PRESTADORES: '/prestadores',
    CLIENTES: '/clientes'
  }
};

// Rutas de la aplicación
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  RECOVER_PASSWORD: '/recuperar-contrasena',
  PRIVACY_POLICY: '/politica-privacidad',
  TERMS_OF_USE: '/terminos-uso',
  
  // Paneles de usuario
  PANEL_SOLICITANTE: '/panel-solicitante',
  PANEL_PRESTADOR: '/panel-prestador',
  PANEL_ADMIN: '/admin',
  
  // Perfiles y detalles
  PERFIL_PRESTADOR: '/perfil/:id',
  EDITAR_PERFIL_PRESTADOR: '/editar-perfil-prestador',
  SOLICITUD_DETALLE: '/solicitud/:id',
  SOLICITAR_PRESUPUESTO: '/solicitud/:solicitudId/prestador/:prestadorId/solicitar-presupuesto'
};

// Mensajes de error
export const ERROR_MESSAGES = {
  // Campos obligatorios
  REQUIRED_FIELD: 'Este campo es obligatorio',
  EMAIL_REQUIRED: 'El email es obligatorio',
  PASSWORD_REQUIRED: 'La contraseña es obligatoria',
  NAME_REQUIRED: 'El nombre es obligatorio',
  PHONE_REQUIRED: 'El teléfono es obligatorio',
  
  // Formatos
  INVALID_EMAIL: 'Ingresá un email válido',
  INVALID_PHONE: 'Ingresá un número de teléfono válido',
  INVALID_AGE: 'La edad debe ser un número válido',
  
  // Validaciones específicas
  AGE_MIN: `Debés ser mayor de ${VALIDATION_LIMITS.MIN_AGE} años`,
  AGE_MAX: `Ingresá una edad válida (máximo ${VALIDATION_LIMITS.MAX_AGE} años)`,
  PHONE_LENGTH: `El teléfono debe tener entre ${VALIDATION_LIMITS.MIN_PHONE_LENGTH} y ${VALIDATION_LIMITS.MAX_PHONE_LENGTH} dígitos`,
  DESCRIPCION_MIN: `La descripción debe tener al menos ${VALIDATION_LIMITS.MIN_DESCRIPCION_LENGTH} caracteres`,
  DESCRIPCION_MAX: `La descripción no puede superar los ${VALIDATION_LIMITS.MAX_DESCRIPCION_LENGTH} caracteres`,
  
  // Contraseñas
  PASSWORDS_NOT_MATCH: 'Las contraseñas no coinciden',
  PASSWORD_POLICY: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  
  // Archivos
  FILE_TOO_LARGE: `Cada archivo debe pesar menos de ${VALIDATION_LIMITS.MAX_FILE_SIZE_MB}MB`,
  INVALID_FILE_TYPE: 'Solo se permiten archivos JPG, JPEG y PNG',
  TOO_MANY_FILES: 'Se superó el límite máximo de archivos',
  
  // Categorías
  NO_CATEGORIES_SELECTED: 'Debés seleccionar al menos una categoría',
  TOO_MANY_CATEGORIES: `Máximo ${VALIDATION_LIMITS.MAX_CATEGORIAS_PRESTADOR} categorías permitidas`,
  
  // Red y servidor
  NETWORK_ERROR: 'Error de conexión. Verificá tu conexión a internet.',
  SERVER_ERROR: 'Error interno del servidor. Intentá nuevamente más tarde.',
  UNAUTHORIZED: 'No tenés autorización para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
  SOLICITUD_CREATED: 'Solicitud creada correctamente',
  PRESUPUESTO_SENT: 'Presupuesto enviado exitosamente',
  PASSWORD_RESET_SENT: 'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña',
  PASSWORD_RESET_SUCCESS: 'Contraseña restablecida correctamente',
  REGISTRATION_SUCCESS: 'Cuenta creada correctamente',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso'
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  AVAILABLE_PAGE_SIZES: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100
};

// Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  COUNTRY_CODE_ARGENTINA: '54',
  MOBILE_PREFIX: '9',
  BASE_URL: 'https://wa.me/'
};

// Colores de la aplicación
export const THEME_COLORS = {
  PRIMARY: '#1b8a5e',
  SECONDARY: '#6c757d',
  SUCCESS: '#198754',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#0dcaf0',
  LIGHT: '#f8f9fa',
  DARK: '#212529'
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  TYPES: {
    PRESUPUESTO: 'presupuesto',
    ACEPTACION: 'aceptacion',
    CALIFICACION: 'calificacion',
    MENSAJE: 'mensaje',
    SISTEMA: 'sistema'
  },
  AUTO_HIDE_DELAY: 5000,
  MAX_NOTIFICATIONS_DISPLAY: 5
};

// Configuración de fechas
export const DATE_CONFIG = {
  DEFAULT_LOCALE: 'es-AR',
  FORMATS: {
    SHORT_DATE: 'dd/MM/yyyy',
    LONG_DATE: 'dd/MM/yyyy HH:mm',
    TIME_ONLY: 'HH:mm'
  }
};

// Expresiones regulares
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_ARGENTINA: /^(\+54|54)?[\s-]?(9)?[\s-]?[0-9]{8,10}$/,
  ONLY_LETTERS: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  ONLY_NUMBERS: /^\d+$/,
  WHATSAPP_URL: /^https:\/\/wa\.me\/\d+$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
};

// Configuración de Google Analytics
export const ANALYTICS_CONFIG = {
  TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID || '',
  EVENTS: {
    REGISTER: 'user_register',
    LOGIN: 'user_login',
    SOLICITUD_CREATE: 'solicitud_create',
    PRESUPUESTO_SEND: 'presupuesto_send',
    PROFILE_UPDATE: 'profile_update'
  }
};

const Constants = {
  USER_ROLES,
  SOLICITUD_ESTADOS,
  REPORTE_ESTADOS,
  CATEGORIAS_SERVICIOS,
  PROVINCIAS_ARGENTINA,
  VALIDATION_LIMITS,
  ALLOWED_FILE_TYPES,
  API_CONFIG,
  APP_ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION_CONFIG,
  WHATSAPP_CONFIG,
  THEME_COLORS,
  NOTIFICATION_CONFIG,
  DATE_CONFIG,
  REGEX_PATTERNS,
  ANALYTICS_CONFIG
};

export default Constants;