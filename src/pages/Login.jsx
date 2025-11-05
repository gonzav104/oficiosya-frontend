import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import { ValidatedInput, PasswordInput, Button, AlertMessage } from '../components/common';
import { ERROR_MESSAGES, USER_ROLES } from '../utils/constants';
import '../styles/pages/Auth.css';
import logo from '../assets/logo_isotipo.png';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();


  // Obtener la ruta a la que debe redirigir después del login
  const from = location.state?.from?.pathname || '/';

  // Validaciones del formulario
  const validateLogin = (data) => {
    const errores = {};
    
    if (!data.email?.trim()) {
      errores.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    }
    if (!data.password?.trim()) {
      errores.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
    }
    
    return errores;
  };

  // Estado para mensajes de éxito
  const [successMessage, setSuccessMessage] = useState('');

  // Lógica de envío del formulario
  const onSubmitLogin = async (data) => {
    try {
      setSuccessMessage('');
      
      const response = await login(data.email, data.password);
      
      // Obtener el usuario de la respuesta
      const user = response.user || response.usuario;
      
      if (!user) {
        throw new Error('No se pudieron obtener los datos del usuario');
      }
      
      // Mostrar mensaje de éxito
      setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // Redirigir según el rol del usuario
      setTimeout(() => {
        const rol = user.rol ? user.rol.toLowerCase() : '';
        
        if (rol === USER_ROLES.CLIENTE_LOWER) {
          navigate('/panel-solicitante');
        } else if (rol === USER_ROLES.PRESTADOR_LOWER) {
          navigate('/panel-prestador');
        } else if (rol === USER_ROLES.ADMIN_LOWER) {
          navigate('/admin');
        } else {
          navigate(from);
        }
      }, 1500);
      
    } catch (error) {
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      // Si es un error de credenciales, mostrar mensaje específico
      if (errorMessage.includes('credenciales') || 
          errorMessage.includes('incorrecta') || 
          errorMessage.includes('contraseña') ||
          errorMessage.includes('email') ||
          errorMessage.includes('usuario no encontrado') ||
          errorMessage.includes('password')) {
        setError('general', 'Email o contraseña incorrectos. Por favor, verificá tus datos e intentá nuevamente.');
      } else {
        setError('general', errorMessage);
      }
      
      // No hacer throw para que el formulario maneje el error correctamente
      return false;
    }
  };

  // Hook de formulario
  const { 
    values, 
    errors, 
    handleChange, 
    handleSubmit, 
    isLoading,
    setError
  } = useForm(
    { email: '', password: '' },
    validateLogin,
    onSubmitLogin
  );

  return (
    <div className="auth-page">
      {/* Botón de volver al home */}
      <Link to="/" className="btn-back-home">
        <i className="bi bi-arrow-left"></i>
        <span className="ms-2">Volver al inicio</span>
      </Link>

      <div className="auth-header">
        <Link to="/" className="auth-logo-link">
          <img src={logo} alt="Logo OficiosYA" className="auth-logo" />
          <h1 className="auth-title">OficiosYA</h1>
          <p className="auth-subtitle">Conectando servicios en Argentina</p>
        </Link>
      </div>

      <div className="auth-card">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        
        {successMessage && (
          <AlertMessage 
            type="success" 
            message={successMessage} 
            icon="check-circle" 
          />
        )}

        {errors.general && (
          <AlertMessage 
            type="error" 
            message={errors.general} 
            icon="exclamation-triangle" 
          />
        )}

        <form onSubmit={handleSubmit}>
          <ValidatedInput
            type="email"
            name="email"
            label="Email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />

          <PasswordInput
            name="password"
            label="Contraseña"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Tu contraseña"
            required
            disabled={isLoading}
          />

          <div className="d-grid">
            <Button 
              type="submit" 
              variant="primary"
              size="large"
              loading={isLoading}
              loadingText="Iniciando sesión..."
              icon="box-arrow-in-right"
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p>
            <Link to="/recuperar-contrasena" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
          <p>
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="auth-link">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
