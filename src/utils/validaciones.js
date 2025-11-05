// Validaciones para formularios de registro y perfil
import { 
  PROVINCIAS_ARGENTINA, 
  CATEGORIAS_SERVICIOS, 
  VALIDATION_LIMITS, 
  ERROR_MESSAGES, 
  REGEX_PATTERNS,
  ALLOWED_FILE_TYPES 
} from './constants';

export const provinciasArgentinas = PROVINCIAS_ARGENTINA;
export const categoriasDisponibles = CATEGORIAS_SERVICIOS;

// Función para generar enlace de WhatsApp automáticamente
export const generarEnlaceWhatsApp = (telefono) => {
  if (!telefono || telefono.trim() === '') return '';
  
  // Limpiar el número (solo dígitos)
  let numeroLimpio = telefono.replace(/\D/g, '');
  
  // Validar que tenga al menos 8 dígitos
  if (numeroLimpio.length < 8) return '';
  
  // Procesar número argentino
  if (numeroLimpio.length >= 8 && numeroLimpio.length <= 15) {
    // Si no empieza con código de país, asumir que es argentino
    if (!numeroLimpio.startsWith('54')) {
      // Remover el 15 inicial si está presente (formato celular argentino viejo)
      if (numeroLimpio.startsWith('15')) {
        numeroLimpio = numeroLimpio.substring(2);
      }
      
      // Agregar 9 antes del número si no está presente (WhatsApp Argentina)
      if (!numeroLimpio.startsWith('9') && numeroLimpio.length >= 8) {
        numeroLimpio = '9' + numeroLimpio;
      }
      
      // Agregar código de país de Argentina
      numeroLimpio = '54' + numeroLimpio;
    }
  }
  
  return `https://wa.me/${numeroLimpio}`;
};

// Política de seguridad para contraseñas
export const politicaContrasena = [
  'Mínimo 8 caracteres',
  'Al menos una letra mayúscula (A-Z)',
  'Al menos una letra minúscula (a-z)',
  'Al menos un número (0-9)',
  'Al menos un carácter especial (!@#$%^&*)'
];

// Validar contraseña según política de seguridad
export const validarContrasena = (contrasena) => {
  const errores = [];

  if (!contrasena) {
    return [ERROR_MESSAGES.PASSWORD_REQUIRED];
  }

  // Usar regex pattern desde constantes
  if (!REGEX_PATTERNS.PASSWORD_STRONG.test(contrasena)) {
    return [ERROR_MESSAGES.PASSWORD_POLICY];
  }

  return errores;
};

// Validaciones comunes (para ambos tipos de usuario)
export const validarDatosComunes = (datosComunes) => {
  const errores = {};

  // Email
  if (!datosComunes.email?.trim()) {
    errores.email = ERROR_MESSAGES.EMAIL_REQUIRED;
  } else if (!REGEX_PATTERNS.EMAIL.test(datosComunes.email)) {
    errores.email = ERROR_MESSAGES.INVALID_EMAIL;
  }
 
  const erroresContrasena = validarContrasena(datosComunes.contrasena || datosComunes.password);
  if (erroresContrasena.length > 0) {
    errores.contrasena = erroresContrasena[0];
    errores.password = erroresContrasena[0];
  }

  // Confirmar contraseña
  const contrasena = datosComunes.contrasena || datosComunes.password;
  const confirmarContrasena = datosComunes.confirmarContrasena || datosComunes.confirmPassword;
  
  if (!confirmarContrasena) {
    errores.confirmarContrasena = 'Confirmá tu contraseña';
    errores.confirmPassword = 'Confirmá tu contraseña';
  } else if (contrasena !== confirmarContrasena) {
    errores.confirmarContrasena = ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
    errores.confirmPassword = ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
  }

  // Edad
  const edad = parseInt(datosComunes.edad);
  if (!datosComunes.edad) {
    errores.edad = 'La edad es obligatoria';
  } else if (isNaN(edad) || edad < VALIDATION_LIMITS.MIN_AGE) {
    errores.edad = ERROR_MESSAGES.AGE_MIN;
  } else if (edad > VALIDATION_LIMITS.MAX_AGE) {
    errores.edad = ERROR_MESSAGES.AGE_MAX;
  }

  // Ubicación
  if (!datosComunes.provincia) {
    errores.provincia = 'La provincia es obligatoria';
  }
  if (!datosComunes.localidad?.trim()) {
    errores.localidad = 'La localidad es obligatoria';
  }

  return errores;
};

// Validaciones específicas para solicitante
export const validarDatosSolicitante = (datosSolicitante) => {
  const errores = {};

  // Nombre completo
  if (!datosSolicitante.nombreCompleto?.trim()) {
    errores.nombreCompleto = ERROR_MESSAGES.NAME_REQUIRED;
  } else if (!REGEX_PATTERNS.ONLY_LETTERS.test(datosSolicitante.nombreCompleto)) {
    errores.nombreCompleto = 'El nombre solo puede contener letras y espacios';
  } else if (datosSolicitante.nombreCompleto.trim().length < VALIDATION_LIMITS.MIN_NAME_LENGTH) {
    errores.nombreCompleto = `El nombre debe tener al menos ${VALIDATION_LIMITS.MIN_NAME_LENGTH} caracteres`;
  }

  return errores;
};

// Validaciones específicas para prestador
export const validarDatosPrestador = (datosPrestador) => {
  const errores = {};

  // Nombre completo
  const erroresNombre = validarDatosSolicitante({ nombreCompleto: datosPrestador.nombreCompleto });
  if (erroresNombre.nombreCompleto) {
    errores.nombreCompleto = erroresNombre.nombreCompleto;
  }

  // Teléfono
  const telefonoLimpio = datosPrestador.telefono?.replace(/\D/g, '') || '';
  if (!telefonoLimpio) {
    errores.telefono = ERROR_MESSAGES.PHONE_REQUIRED;
  } else if (telefonoLimpio.length < VALIDATION_LIMITS.MIN_PHONE_LENGTH || 
             telefonoLimpio.length > VALIDATION_LIMITS.MAX_PHONE_LENGTH) {
    errores.telefono = ERROR_MESSAGES.PHONE_LENGTH;
  }

  // WhatsApp
  if (!datosPrestador.whatsapp || !REGEX_PATTERNS.WHATSAPP_URL.test(datosPrestador.whatsapp)) {
    errores.whatsapp = 'Ingresá un enlace válido de WhatsApp (ej: https://wa.me/5491123456789)';
  }

  // Categorías
  if (!datosPrestador.categorias || datosPrestador.categorias.length === 0) {
    errores.categorias = ERROR_MESSAGES.NO_CATEGORIES_SELECTED;
  } else if (datosPrestador.categorias.length > VALIDATION_LIMITS.MAX_CATEGORIAS_PRESTADOR) {
    errores.categorias = ERROR_MESSAGES.TOO_MANY_CATEGORIES;
  }

  // Años de experiencia
  if (datosPrestador.experienciaAnios === '' || 
      datosPrestador.experienciaAnios === undefined || 
      datosPrestador.experienciaAnios === null) {
    errores.experienciaAnios = 'Debés seleccionar tu nivel de experiencia';
  }

  // Descripción
  if (datosPrestador.descripcion?.trim()) {
    if (datosPrestador.descripcion.trim().length < VALIDATION_LIMITS.MIN_DESCRIPCION_LENGTH) {
      errores.descripcion = ERROR_MESSAGES.DESCRIPCION_MIN;
    } else if (datosPrestador.descripcion.trim().length > VALIDATION_LIMITS.MAX_DESCRIPCION_LENGTH) {
      errores.descripcion = ERROR_MESSAGES.DESCRIPCION_MAX;
    }
  }

  return errores;
};

// Validar imágenes para prestador
export const validarImagenes = (archivos, maxFiles = VALIDATION_LIMITS.MAX_IMAGES_PRESTADOR) => {
  const errores = {};
  const archivosArray = Array.isArray(archivos) ? archivos : Array.from(archivos || []);

  if (archivosArray.length > maxFiles) {
    errores.imagenes = `Máximo ${maxFiles} imágenes permitidas`;
    return errores;
  }

  for (let archivo of archivosArray) {
    // Validar tamaño usando constantes
    if (archivo.size > VALIDATION_LIMITS.MAX_FILE_SIZE_BYTES) {
      errores.imagenes = ERROR_MESSAGES.FILE_TOO_LARGE;
      break;
    }
    
    // Validar tipo usando constantes
    if (!ALLOWED_FILE_TYPES.IMAGES.includes(archivo.type)) {
      errores.imagenes = ERROR_MESSAGES.INVALID_FILE_TYPE;
      break;
    }
  }

  return errores;
};

// Función principal para validar registro completo
export const validarRegistroCompleto = (tipoUsuario, datosComunes, datosEspecificos) => {
  const erroresComunes = validarDatosComunes(datosComunes);
  
  let erroresEspecificos = {};
  if (tipoUsuario === 'solicitante') {
    erroresEspecificos = validarDatosSolicitante(datosEspecificos);
  } else if (tipoUsuario === 'prestador') {
    erroresEspecificos = validarDatosPrestador(datosEspecificos);
  }

  return {
    ...erroresComunes,
    ...erroresEspecificos
  };
};