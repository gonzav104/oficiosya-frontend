import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import logo from '../assets/logo_isotipo.png';

function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('cliente');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Intento de registro con:', { email, password, role });
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <img src={logo} alt="Logo OficiosYA" className="auth-logo" />
        <h1 className="auth-title">OficiosYA</h1>
        <p className="auth-subtitle">Conectando servicios en Argentina</p>
      </div>

      <div className="auth-card">
        <h2 className="text-center mb-3">Crear Cuenta</h2>
        <p className="text-center text-muted mb-4">
          Únete a la comunidad de OficiosYA
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tipo de cuenta</label>
            <div className="d-flex justify-content-around">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="cliente"
                  value="cliente"
                  checked={role === 'cliente'}
                  onChange={() => setRole('cliente')}
                />
                <label className="form-check-label" htmlFor="cliente">
                  Cliente
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="prestador"
                  value="prestador"
                  checked={role === 'prestador'}
                  onChange={() => setRole('prestador')}
                />
                <label className="form-check-label" htmlFor="prestador">
                  Prestador
                </label>
              </div>
            </div>
          </div>

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

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-auth-primary">
              Crear Cuenta
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registro;
