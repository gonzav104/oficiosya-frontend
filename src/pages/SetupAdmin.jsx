import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ValidatedInput, PasswordInput, AlertMessage, LoadingSpinner } from '../components/common';
import api from '../api/api';
import { validarContrasena } from '../utils/validaciones';

const SetupAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ correo: '', contrasena: '', confirmar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones frontend
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(formData.correo.trim())) {
      return setError('Correo electrónico inválido.');
    }
    if (validarContrasena(formData.contrasena).length > 0) {
      return setError('La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.');
    }
    if (formData.contrasena !== formData.confirmar) {
      return setError('Las contraseñas no coinciden.');
    }

    setLoading(true);
    try {
      await api.post('/auth/setup-admin', {
        correo: formData.correo,
        contrasena: formData.contrasena
      });
      
      setSuccess(true);
      // Login automático y redirigir al panel admin
      try {
        const loginRes = await api.post('/auth/login', { correo: formData.correo, contrasena: formData.contrasena });
        const token = loginRes.data.data.token;
        localStorage.setItem('token', token);
        navigate('/admin');
      } catch (loginError) {
        console.error('Error en login automático:', loginError);
        navigate('/login'); // Fallback al login
      }
    } catch (err) {
      // Si ya existe, el backend devuelve 403 Forbidden
      const msg = err.response?.data?.message || 'Error al crear administrador';
      if (err.response?.status === 403) {
        setError('El sistema ya tiene un administrador inicializado. Ve al login.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page" style={{ background: 'none', minHeight: 'calc(100vh - 80px)' }}>
        <Card className="auth-card text-center p-5">
          <h2 className="text-success"><i className="bi bi-check-circle-fill"></i></h2>
          <h3>¡Administrador Creado!</h3>
          <p>El sistema ha sido inicializado correctamente.</p>
          <p className="text-muted">Redirigiendo al panel de administración...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ background: 'none', minHeight: 'calc(100vh - 80px)' }}>
      <Card className="auth-card">
        <div className="text-center mb-4">
          <h2 className="text-danger"><i className="bi bi-shield-lock-fill"></i></h2>
          <h3>Setup Inicial</h3>
          <p className="text-muted small">Creación del usuario Administrador Maestro</p>
        </div>

        {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <ValidatedInput
            name="correo"
            label="Correo Electrónico Admin"
            type="email"
            value={formData.correo}
            onChange={(e) => setFormData({...formData, correo: e.target.value})}
            required
          />
          <PasswordInput
            name="contrasena"
            label="Contraseña"
            value={formData.contrasena}
            onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
            helpText="Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo."
            required
          />
          <PasswordInput
            name="confirmar"
            label="Confirmar Contraseña"
            value={formData.confirmar}
            onChange={(e) => setFormData({...formData, confirmar: e.target.value})}
            required
          />

          <div className="d-grid gap-2 mt-4">
            <Button type="submit" variant="danger" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'INICIALIZAR SISTEMA'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Ir al Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SetupAdmin;