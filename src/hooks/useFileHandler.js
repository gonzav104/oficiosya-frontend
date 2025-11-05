import { useState, useCallback } from 'react';
import { VALIDATION_LIMITS, ALLOWED_FILE_TYPES, ERROR_MESSAGES } from '../utils/constants';

// Hook personalizado para manejo de archivos e imágenes

export const useFileHandler = (
  maxFiles = VALIDATION_LIMITS.MAX_IMAGES_PRESTADOR,
  maxSizeMB = VALIDATION_LIMITS.MAX_FILE_SIZE_MB,
  allowedTypes = ALLOWED_FILE_TYPES.IMAGES
) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Validar un archivo individual
  const validateFile = useCallback((file) => {
    const errors = [];
    
    // Validar tamaño
    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`${file.name}: ${ERROR_MESSAGES.FILE_TOO_LARGE}`);
    }
    
    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: ${ERROR_MESSAGES.INVALID_FILE_TYPE}`);
    }
    
    return errors;
  }, [maxSizeMB, allowedTypes]);

  // Generar preview para archivos de imagen
  const generatePreview = useCallback((file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file,
            preview: e.target.result,
            name: file.name,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      } else {
        resolve({
          file,
          preview: null,
          name: file.name,
          size: file.size
        });
      }
    });
  }, []);

  // Manejar selección de archivos
  const handleFiles = useCallback(async (selectedFiles) => {
    setIsProcessing(true);
    setErrors([]);
    
    const fileArray = Array.from(selectedFiles);
    const totalFiles = files.length + fileArray.length;
    
    // Validar cantidad total
    if (totalFiles > maxFiles) {
      setErrors([`${ERROR_MESSAGES.TOO_MANY_FILES}. Máximo ${maxFiles} archivos.`]);
      setIsProcessing(false);
      return;
    }
    
    // Validar cada archivo
    const validationErrors = [];
    const validFiles = [];
    
    for (const file of fileArray) {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        validationErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsProcessing(false);
      return;
    }
    
    // Generar previews para archivos válidos
    try {
      const newPreviews = await Promise.all(
        validFiles.map(file => generatePreview(file))
      );
      
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
      setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    } catch (error) {
      console.error('Error generando previews:', error);
      setErrors(['Error al procesar los archivos']);
    }
    
    setIsProcessing(false);
  }, [files, maxFiles, validateFile, generatePreview]);

  // Remover archivo por índice
  const removeFile = useCallback((index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setErrors([]);
  }, []);

  // Remover todos los archivos
  const clearFiles = useCallback(() => {
    setFiles([]);
    setPreviews([]);
    setErrors([]);
  }, []);

  // Reordenar archivos
  const reorderFiles = useCallback((fromIndex, toIndex) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
    
    setPreviews(prevPreviews => {
      const newPreviews = [...prevPreviews];
      const [movedPreview] = newPreviews.splice(fromIndex, 1);
      newPreviews.splice(toIndex, 0, movedPreview);
      return newPreviews;
    });
  }, []);

  // Obtener archivos como FormData
  const getFormData = useCallback((fieldName = 'files') => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });
    return formData;
  }, [files]);

  // Validar si hay archivos válidos
  const hasValidFiles = files.length > 0 && errors.length === 0;

  // Obtener información de archivos
  const getFileInfo = useCallback(() => {
    return {
      count: files.length,
      totalSize: files.reduce((total, file) => total + file.size, 0),
      totalSizeMB: files.reduce((total, file) => total + file.size, 0) / (1024 * 1024),
      hasImages: files.some(file => file.type.startsWith('image/')),
      types: [...new Set(files.map(file => file.type))],
      names: files.map(file => file.name)
    };
  }, [files]);

  // Handler para input de archivos
  const handleInputChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return {
    // Estados
    files,
    previews,
    errors,
    isProcessing,
    
    // Handlers
    handleFiles,
    handleInputChange,
    removeFile,
    clearFiles,
    reorderFiles,
    
    // Utilidades
    getFormData,
    getFileInfo,
    hasValidFiles,
    
    // Información
    fileCount: files.length,
    canAddMore: files.length < maxFiles,
    remainingSlots: maxFiles - files.length,
    hasErrors: errors.length > 0,
    
    // Configuración
    maxFiles,
    maxSizeMB,
    allowedTypes
  };
};

export default useFileHandler;