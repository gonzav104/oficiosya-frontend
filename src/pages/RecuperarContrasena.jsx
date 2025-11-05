import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../api/api';
import { validarContrasena } from '../utils/validaciones';
import { Button, ValidatedInput } from '../components/common';

function RecuperarContrasena() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  // Estados para el formulario de solicitud
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  
  // Estados para el formulario de reset
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [validandoToken, setValidandoToken] = useState(false);
  const [correoToken, setCorreoToken] = useState('');
  
  // Validar token si existe en la URL
  useEffect(() => {
    if (token) {
      setValidandoToken(true);
      authService.validateResetToken(token)
        .then((response) => {
          // La respuesta viene en response.data por ResponseService.success
          const data = response.data || response;
          
          if (data.valid) {
            setTokenValido(true);
            setCorreoToken(data.correo);
          } else {
            setError(response.message || data.error || 'Token inválido');
          }
        })
        .catch((error) => {
          setError(error.message || error.error || 'Token inválido o expirado');
        })
        .finally(() => {
          setValidandoToken(false);
        });
    }
  }, [token]);

  // Manejar solicitud de recuperación de contraseña
  const handleSolicitudRecuperacion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMensaje('');

    try {
      const response = await authService.forgotPassword(email);
      setMensaje(response.message);
      
      // En desarrollo, mostrar el token si está disponible
      if (response.dev_token) {
        console.log('Token de desarrollo:', response.dev_token);
        setMensaje(
          response.message + 
          '\n\nPara desarrollo - Token: ' + response.dev_token +
          '\n\nEn producción recibirías este enlace por email.'
        );
      }
      
      setEmail('');
    } catch (error) {
      setError(error.error || 'Error al enviar correo de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar reset de contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validar contraseñas
    const erroresContrasena = validarContrasena(nuevaContrasena);
    if (erroresContrasena.length > 0) {
      setError('La contraseña no cumple con los requisitos: ' + erroresContrasena.join(', '));
      setIsLoading(false);
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword(token, nuevaContrasena, confirmarContrasena);
      setMensaje(response.message);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setError(error.error || 'Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si se está validando el token
  if (token && validandoToken) {
    return (
      <div className="auth-page">
        <Link to="/" className="btn-back-home">
          <i className="bi bi-arrow-left"></i>
          <span className="ms-2">Volver al inicio</span>
        </Link>
        
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="card w-100" style={{ maxWidth: '400px' }}>
            <div className="card-body text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Validando...</span>
              </div>
              <p className="mt-3">Validando enlace de recuperación...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar formulario de reset si hay token válido
  if (token && tokenValido) {
    return (
      <div className="auth-page">
        <Link to="/" className="btn-back-home">
          <i className="bi bi-arrow-left"></i>
          <span className="ms-2">Volver al inicio</span>
        </Link>
        
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="card w-100" style={{ maxWidth: '400px' }}>
            <div className="card-body">
              <div className="text-center mb-4">
                <h2 className="card-title">Nueva Contraseña</h2>
                <p className="card-text text-muted">
                  Ingresa tu nueva contraseña para: <strong>{correoToken}</strong>
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {mensaje && (
                <div className="alert alert-success" role="alert">
                  {mensaje}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <ValidatedInput
                  type="password"
                  label="Nueva Contraseña"
                  name="nuevaContrasena"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  helperText="Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos"
                  required
                />
              </div>

              <div className="mb-3">
                <ValidatedInput
                  type="password"
                  label="Confirmar Contraseña"
                  name="confirmarContrasena"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
              </div>

              <div className="d-grid">
                <Button 
                  type="submit" 
                  variant="success"
                  disabled={isLoading}
                  loading={isLoading}
                  loadingText="Restableciendo..."
                >
                  Restablecer Contraseña
                </Button>
              </div>
              </form>

              <div className="text-center mt-3">
                <Link to="/login">Volver a inicio de sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si el token es inválido
  if (token && !tokenValido) {
    return (
      <div className="auth-page">
        <Link to="/" className="btn-back-home">
          <i className="bi bi-arrow-left"></i>
          <span className="ms-2">Volver al inicio</span>
        </Link>
        
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="card w-100" style={{ maxWidth: '400px' }}>
            <div className="card-body">
              <div className="text-center mb-4">
                <h2 className="card-title text-danger">Enlace Inválido</h2>
              </div>

              <div className="alert alert-danger" role="alert">
                {error}
              </div>

              <div className="text-center">
                <Button as={Link} to="/recuperar-contrasena" variant="primary">
                  Solicitar nuevo enlace
                </Button>
              </div>

              <div className="text-center mt-3">
                <Link to="/login">Volver a inicio de sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar formulario de solicitud de recuperación
  return (
    <div className="auth-page">
      <Link to="/" className="btn-back-home">
        <i className="bi bi-arrow-left"></i>
        <span className="ms-2">Volver al inicio</span>
      </Link>
      
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="card w-100" style={{ maxWidth: '400px' }}>
          <div className="card-body">
            <div className="text-center mb-4">
              <h2 className="card-title">Recuperar Contraseña</h2>
              <p className="card-text text-muted">
                Te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {mensaje && (
              <div className="alert alert-success" role="alert" style={{ whiteSpace: 'pre-line' }}>
                {mensaje}
              </div>
            )}

            <form onSubmit={handleSolicitudRecuperacion}>
            <div className="mb-3">
              <ValidatedInput
                type="email"
                label="Email"
                name="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <Button 
                type="submit" 
                variant="success"
                disabled={isLoading}
                loading={isLoading}
                loadingText="Enviando..."
              >
                Enviar enlace de recuperación
              </Button>
            </div>
            </form>

            <div className="text-center mt-3">
              <Link to="/login">Volver a inicio de sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarContrasena;