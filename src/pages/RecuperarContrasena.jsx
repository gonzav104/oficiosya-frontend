import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RecuperarContrasena() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Solicitud de recuperación para:', email);
    // Aquí irá la lógica para enviar el correo de recuperación
    alert('Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.');
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card w-100" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="card-title">Recuperar Contraseña</h2>
            <p className="card-text text-muted">Te enviaremos un enlace para restablecer tu contraseña.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success">Enviar enlace de recuperación</button>
            </div>
          </form>
          <div className="text-center mt-3">
            <Link to="/login">Volver a inicio de sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarContrasena;