import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import logo from '../assets/logo_isotipo.png'; // ruta a tu logo

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Intento de login con:', { email, password });
  };

  return (


    <div className="auth-page">
      <div className="auth-header">
        <img src={logo} alt="Logo OficiosYA" className="auth-logo" />
        <h1 className="auth-title">OficiosYA</h1>
        <p className="auth-subtitle">Conectando servicios en Argentina</p>
      </div>

      <div className="auth-card">
        <h2 className="text-center mb-3">Iniciar Sesión</h2>
        <p className="text-center text-muted mb-4">
          Accede a tu cuenta de OficiosYA
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-end mb-3">
            <Link to="/recuperar-contrasena" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-auth-primary">
              Iniciar Sesión
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="auth-link">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
