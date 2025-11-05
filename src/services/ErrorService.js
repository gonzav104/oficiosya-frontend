import { ERROR_MESSAGES } from '../utils/constants';

// Servicio para manejo centralizado de errores

class ErrorService {

  static parseServerError(error) {
    // Si es un error de red
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return {
        type: 'network',
        message: ERROR_MESSAGES.NETWORK_ERROR,
        originalError: error
      };
    }

    // Si es un error HTTP
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return {
            type: 'validation',
            message: data.error || data.message || 'Error en los datos enviados',
            field: data.field || null,
            originalError: error
          };
          
        case 401:
          return {
            type: 'auth',
            message: ERROR_MESSAGES.UNAUTHORIZED,
            originalError: error
          };
          
        case 403:
          return {
            type: 'forbidden',
            message: 'No tenés permisos para realizar esta acción',
            originalError: error
          };
          
        case 404:
          return {
            type: 'not_found',
            message: ERROR_MESSAGES.NOT_FOUND,
            originalError: error
          };
          
        case 409:
          return {
            type: 'conflict',
            message: data.error || 'Ya existe un recurso con estos datos',
            actions: data.actions || null,
            originalError: error
          };
          
        case 422:
          return {
            type: 'validation',
            message: data.error || 'Error de validación',
            errors: data.errors || null,
            originalError: error
          };
          
        case 429:
          return {
            type: 'rate_limit',
            message: 'Demasiadas solicitudes. Intentá nuevamente más tarde.',
            originalError: error
          };
          
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: 'server',
            message: ERROR_MESSAGES.SERVER_ERROR,
            originalError: error
          };
          
        default:
          return {
            type: 'unknown',
            message: data.error || data.message || `Error del servidor (${status})`,
            originalError: error
          };
      }
    }

    // Error genérico
    return {
      type: 'unknown',
      message: error.message || 'Error desconocido',
      originalError: error
    };
  }

  // Maneja errores de validación de formularios
  static handleValidationErrors(validationErrors) {
    const formattedErrors = {};
    
    if (typeof validationErrors === 'string') {
      formattedErrors.general = validationErrors;
      return formattedErrors;
    }
    
    if (Array.isArray(validationErrors)) {
      formattedErrors.general = validationErrors.join(', ');
      return formattedErrors;
    }
    
    if (typeof validationErrors === 'object') {
      Object.keys(validationErrors).forEach(field => {
        const error = validationErrors[field];
        if (Array.isArray(error)) {
          formattedErrors[field] = error[0];
        } else {
          formattedErrors[field] = error;
        }
      });
    }
    
    return formattedErrors;
  }

  // Genera mensajes de error amigables para el usuario
  static getUserFriendlyMessage(error) {
    const { type, message } = this.parseServerError(error);
    
    const friendlyMessages = {
      network: 'Problemas de conexión. Verificá tu internet e intentá nuevamente.',
      auth: 'Tu sesión expiró. Por favor, iniciá sesión nuevamente.',
      forbidden: 'No tenés permisos para realizar esta acción.',
      not_found: 'El recurso que buscás no fue encontrado.',
      conflict: 'Ya existe información con estos datos.',
      validation: message,
      rate_limit: 'Demasiadas solicitudes. Esperá un momento antes de intentar nuevamente.',
      server: 'Problemas técnicos temporales. Intentá nuevamente en unos minutos.',
      unknown: 'Ocurrió un error inesperado. Intentá nuevamente.'
    };
    
    return friendlyMessages[type] || message;
  }

  //Log de errores para desarrollo y debugging
  static logError(error, context = '') {
    const parsedError = this.parseServerError(error);
    
    console.group(`Error${context ? ` en ${context}` : ''}`);
    console.error('Tipo:', parsedError.type);
    console.error('Mensaje:', parsedError.message);
    
    if (parsedError.field) {
      console.error('Campo:', parsedError.field);
    }
    
    if (parsedError.errors) {
      console.error('Errores de validación:', parsedError.errors);
    }
    
    if (parsedError.actions) {
      console.error('Acciones disponibles:', parsedError.actions);
    }
    
    console.error('Error original:', parsedError.originalError);
    console.groupEnd();
  }

  // Determina si un error requiere logout automático
  static requiresLogout(error) {
    const parsedError = this.parseServerError(error);
    return parsedError.type === 'auth';
  }

  // Determina si un error debe mostrarse al usuario
  static shouldShowToUser(error) {
    const parsedError = this.parseServerError(error);
    
    // No mostrar errores de red duplicados
    if (parsedError.type === 'network') {
      return true;
    }
    
    // Mostrar errores de validación
    if (parsedError.type === 'validation') {
      return true;
    }
    
    // Mostrar errores de conflicto
    if (parsedError.type === 'conflict') {
      return true;
    }
    
    // No mostrar errores de auth (se maneja con redirect)
    if (parsedError.type === 'auth') {
      return false;
    }
    
    return true;
  }

  // Genera recomendaciones de acción para el usuario
  static getRecommendedActions(error) {
    const parsedError = this.parseServerError(error);
    const actions = [];
    
    switch (parsedError.type) {
      case 'network':
        actions.push('Verificá tu conexión a internet');
        actions.push('Intentá recargar la página');
        break;
        
      case 'validation':
        actions.push('Revisá los datos ingresados');
        actions.push('Completá todos los campos obligatorios');
        break;
        
      case 'auth':
        actions.push('Iniciá sesión nuevamente');
        break;
        
      case 'rate_limit':
        actions.push('Esperá unos minutos antes de intentar nuevamente');
        break;
        
      case 'server':
        actions.push('Intentá nuevamente en unos minutos');
        actions.push('Si el problema persiste, contactá soporte');
        break;
        
      default:
        actions.push('Intentá nuevamente');
        actions.push('Si el problema persiste, contactá soporte');
    }
    
    return actions;
  }
}

export default ErrorService;