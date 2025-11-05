import { useState, useCallback } from 'react';

// Hook personalizado para manejo de formularios con validación

export const useForm = (initialValues = {}, validationFunction = null, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Manejar cambios en inputs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files;
    } else {
      newValue = value;
    }

    setValues(prevValues => ({
      ...prevValues,
      [name]: newValue
    }));

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  }, [errors]);

  // Manejar cambios en inputs múltiples
  const handleArrayChange = useCallback((name, newArray) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: newArray
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  }, [errors]);

  // Actualizar valor específico
  const setValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  }, [errors]);

  // Actualizar múltiples valores
  const updateValues = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues
    }));
  }, []);

  // Validar formulario
  const validate = useCallback(() => {
    if (!validationFunction) return true;
    
    const validationErrors = validationFunction(values);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  }, [values, validationFunction]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitted(true);
    
    if (!validate()) {
      return false;
    }

    if (!onSubmit) {
      return true;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit(values);
      return result;
    } catch (error) {
      console.error('Error en envío de formulario:', error);
      setErrors({ submit: error.message || 'Error al enviar el formulario' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [values, validate, onSubmit]);

  // Resetear formulario
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsLoading(false);
    setIsSubmitted(false);
  }, [initialValues]);

  // Resetear solo errores
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Establecer errores manualmente
  const setError = useCallback((field, message) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: message
    }));
  }, []);

  return {
    // Estados
    values,
    errors,
    isLoading,
    isSubmitted,
    
    // Handlers
    handleChange,
    handleArrayChange,
    handleSubmit,
    
    // Métodos de control
    setValue,
    updateValues,
    setError,
    validate,
    reset,
    clearErrors,
    
    // Helpers
    hasError: (field) => Boolean(errors[field]),
    getError: (field) => errors[field] || '',
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0
  };
};

export default useForm;