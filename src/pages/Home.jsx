import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagenComoFunciona from '../assets/diseno-de-collage-de-personas.jpg';
import videoHeroBackground from '../assets/video-trabajo.mp4';

function Home() {

  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    
  };
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const beneficios = [
    {
      icon: '🎯',
      titulo: 'Encuentra al profesional ideal',
      descripcion: 'Accedé a perfiles verificados con calificaciones reales de otros usuarios'
    },
    {
      icon: '💰',
      titulo: 'Compará presupuestos',
      descripcion: 'Recibí múltiples cotizaciones y elegí la que mejor se ajuste a tu presupuesto'
    },
    {
      icon: '⚡',
      titulo: 'Respuesta rápida',
      descripcion: 'Los prestadores responden en tiempo real a tus solicitudes de servicio'
    },
    {
      icon: '🛡️',
      titulo: 'Seguridad garantizada',
      descripcion: 'Todos los profesionales están registrados y pueden ser calificados'
    }
  ];

  const pasos = [
    {
      numero: '01',
      titulo: 'Publicá tu solicitud',
      descripcion: 'Describí el servicio que necesitás con detalles y fotos',
      icon: '📝'
    },
    {
      numero: '02',
      titulo: 'Recibí presupuestos',
      descripcion: 'Soliicitá un presupuesto a varios profesionales en tu zona',
      icon: '💼'
    },
    {
      numero: '03',
      titulo: 'Elegí y contratá',
      descripcion: 'Compará, elegí la mejor opción, y contactá al profesional',
      icon: '✓'
    }
  ];

  const testimonios = [
    {
      nombre: 'María González',
      rol: 'Solicitante',
      comentario: 'Encontré un electricista en menos de 2 horas. Excelente servicio y precio justo.',
      rating: 5,
      avatar: '👩'
    },
    {
      nombre: 'Carlos Pérez',
      rol: 'Prestador - Plomero',
      comentario: 'Desde que uso OficiosYA conseguí más del doble de clientes. Muy recomendable.',
      rating: 5,
      avatar: '👨'
    },
    {
      nombre: 'Laura Martínez',
      rol: 'Solicitante',
      comentario: 'Pude comparar 4 presupuestos diferentes y elegir el mejor. Super práctico.',
      rating: 5,
      avatar: '👩‍🦰'
    }
  ];

  return (
    <div className="home-container">
      <style>{`
        /* ===== RESET Y BASE ===== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .home-container {
          background: #0f1419;
          min-height: 100vh;
          color: #ffffff;
          overflow-x: hidden;
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw;
          margin-left: calc(-50vw + 50%) !important;
        }

        /* ===== HERO SECTION CON VIDEO ===== */
        .hero-section {
          position: relative;
          min-height: 95vh;
          display: flex;
          align-items: center;
          padding: 100px 20px 80px;
          overflow: hidden;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .video-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(15, 20, 25, 0.92) 0%,
            rgba(34, 40, 49, 0.85) 50%,
            rgba(27, 138, 94, 0.3) 100%
          );
          z-index: 1;
        }

        .video-background video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Placeholder para el video */
        .video-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1f2e 0%, #222831 50%, #1b8a5e15 100%);
          position: relative;
        }

        .video-placeholder::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            repeating-linear-gradient(90deg, rgba(27, 138, 94, 0.03) 0px, transparent 1px, transparent 40px, rgba(27, 138, 94, 0.03) 41px),
            repeating-linear-gradient(0deg, rgba(27, 138, 94, 0.03) 0px, transparent 1px, transparent 40px, rgba(27, 138, 94, 0.03) 41px);
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(27, 138, 94, 0.25);
          border: 2px solid rgba(27, 138, 94, 0.5);
          border-radius: 50px;
          padding: 10px 24px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1b8a5e;
          margin-bottom: 30px;
          animation: fadeInDown 0.8s ease;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 30px;
          animation: fadeInUp 1s ease;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .hero-title .brand {
          background: linear-gradient(135deg, #1b8a5e 0%, #2dd4a5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 2.8vw, 1.6rem);
          color: rgba(255, 255, 255, 0.9);
          max-width: 700px;
          margin-bottom: 45px;
          line-height: 1.8;
          animation: fadeInUp 1.2s ease;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-cta-group {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          animation: fadeInUp 1.4s ease;
        }

        .btn-hero-primary {
          background: linear-gradient(135deg, #1b8a5e 0%, #17734f 100%);
          color: white;
          padding: 18px 45px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: none;
          box-shadow: 0 10px 30px rgba(27, 138, 94, 0.5);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .btn-hero-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }

        .btn-hero-primary:hover::before {
          left: 100%;
        }

        .btn-hero-primary:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(27, 138, 94, 0.6);
        }

        .btn-hero-secondary {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          padding: 18px 45px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(27, 138, 94, 0.6);
          transform: translateY(-4px);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== SECCIÓN BENEFICIOS ===== */
        .beneficios-section {
          padding: 100px 20px;
          background: linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%);
          position: relative;
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 70px;
        }

        .section-title {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 900;
          margin-bottom: 20px;
          color: #ffffff;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }

        .beneficios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 35px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .beneficio-card {
          background: rgba(27, 138, 94, 0.06);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(27, 138, 94, 0.15);
          border-radius: 25px;
          padding: 40px 30px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .beneficio-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          height: 5px;
          background: linear-gradient(90deg, #1b8a5e, #2dd4a5);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 25px 25px 0 0;
        }

        .beneficio-card:hover::before {
          opacity: 1;
        }

        .beneficio-card:hover {
          transform: translateY(-12px);
          background: rgba(27, 138, 94, 0.12);
          border-color: rgba(27, 138, 94, 0.4);
          box-shadow: 0 20px 50px rgba(27, 138, 94, 0.2);
        }

        .beneficio-icon {
          font-size: 4rem;
          margin-bottom: 25px;
          display: inline-block;
          transition: transform 0.4s ease;
        }

        .beneficio-card:hover .beneficio-icon {
          transform: scale(1.2) rotate(-8deg);
        }

        .beneficio-titulo {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 15px;
        }

        .beneficio-descripcion {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
        }

        /* ===== SECCIÓN CÓMO FUNCIONA CON IMAGEN ===== */
        .pasos-section {
          padding: 100px 20px;
          background: linear-gradient(135deg, #1a1f2e 0%, #222831 100%);
          position: relative;
        }

        .pasos-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .pasos-imagen {
          position: relative;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
        }

        .pasos-imagen img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 30px;
        }

        /* Placeholder para imagen */
        .imagen-placeholder {
          width: 100%;
          height: 500px;
          background: linear-gradient(135deg, rgba(27, 138, 94, 0.2) 0%, rgba(27, 138, 94, 0.05) 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: rgba(27, 138, 94, 0.4);
          border: 3px dashed rgba(27, 138, 94, 0.3);
        }

        .pasos-content {
          padding: 20px 0;
        }

        .pasos-lista {
          display: flex;
          flex-direction: column;
          gap: 35px;
          margin-top: 50px;
        }

        .paso-item {
          display: flex;
          gap: 25px;
          align-items: flex-start;
          padding: 30px;
          background: rgba(27, 138, 94, 0.06);
          border: 2px solid rgba(27, 138, 94, 0.2);
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .paso-item:hover {
          background: rgba(27, 138, 94, 0.12);
          border-color: rgba(27, 138, 94, 0.4);
          transform: translateX(10px);
        }

        .paso-numero-circle {
          min-width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #1b8a5e, #17734f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 900;
          color: white;
          box-shadow: 0 8px 25px rgba(27, 138, 94, 0.4);
        }

        .paso-texto {
          flex: 1;
        }

        .paso-titulo {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .paso-descripcion {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
        }

        /* ===== TESTIMONIOS ===== */
        .testimonios-section {
          padding: 100px 20px;
          background: linear-gradient(180deg, #222831 0%, #1a1f2e 100%);
        }

        .testimonios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 60px auto 0;
        }

        .testimonio-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          padding: 35px;
          transition: all 0.3s ease;
        }

        .testimonio-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(27, 138, 94, 0.4);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .testimonio-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .testimonio-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1b8a5e, #2dd4a5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .testimonio-info h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 5px;
        }

        .testimonio-info p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .testimonio-rating {
          color: #FFD700;
          font-size: 1.1rem;
          margin-bottom: 15px;
        }

        .testimonio-comentario {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          font-style: italic;
        }

        /* ===== CTA FINAL ===== */
        .cta-final-section {
          padding: 120px 20px;
          background: linear-gradient(135deg, #1b8a5e 0%, #17734f 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-final-section::before {
          content: '';
          position: absolute;
          top: -30%;
          right: -15%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }

        .cta-final-section::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -15%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .cta-final-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .cta-final-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          margin-bottom: 30px;
          color: #ffffff;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-final-text {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 45px;
          line-height: 1.8;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta-final {
          background: white;
          color: #1b8a5e;
          padding: 20px 55px;
          border-radius: 50px;
          font-weight: 900;
          font-size: 1.2rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: none;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-cta-final:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
        }

        .btn-cta-secondary {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: white;
          padding: 20px 55px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.2rem;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-5px);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 968px) {
          .pasos-wrapper {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .pasos-imagen {
            order: 2;
          }

          .pasos-content {
            order: 1;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 80vh;
            padding: 80px 20px 60px;
          }

          .hero-cta-group {
            flex-direction: column;
          }

          .btn-hero-primary,
          .btn-hero-secondary {
            width: 100%;
            justify-content: center;
          }

          .beneficios-grid {
            grid-template-columns: 1fr;
          }

          .paso-item {
            flex-direction: column;
            text-align: center;
          }

          .paso-item:hover {
            transform: translateY(-5px);
          }

          .testimonios-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .btn-cta-final,
          .btn-cta-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* HERO SECTION CON VIDEO */}
      <section className="hero-section">
        <div className="video-background">
          {
          <video autoPlay loop muted playsInline>
            <source src={videoHeroBackground} type="video/mp4" />
          </video>
          }
          <div className="video-placeholder"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            🚀 La plataforma #1 de Argentina
          </div>
          <h1 className="hero-title">
            Bienvenido a <span className="brand">OficiosYA</span>
          </h1>
          <p className="hero-subtitle">
            Conectamos a quienes necesitan servicios con los mejores profesionales de tu zona. Simple, rápido y confiable.
          </p>
          <div className="hero-cta-group">
            <button className="btn-hero-primary" onClick={() => handleNavigate('/registro')}>
              Crear cuenta gratis
              <span>→</span>
            </button>
            <button className="btn-hero-secondary" onClick={() => handleNavigate('/login')}>
              Iniciar sesión
              <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="beneficios-section">
        <div className="section-header">
          <h2 className="section-title">¿Por qué elegir OficiosYA?</h2>
          <p className="section-subtitle">
            La forma más inteligente de encontrar profesionales o conseguir nuevos clientes
          </p>
        </div>
        <div className="beneficios-grid">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="beneficio-card">
              <div className="beneficio-icon">{beneficio.icon}</div>
              <h3 className="beneficio-titulo">{beneficio.titulo}</h3>
              <p className="beneficio-descripcion">{beneficio.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="pasos-section">
        <div className="pasos-wrapper">
          <div className="pasos-imagen">
            <img src={imagenComoFunciona} alt="¿Cómo funciona?" />
          </div>
          <div className="pasos-content">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: 0 }}>
              <h2 className="section-title">¿Cómo funciona?</h2>
              <p className="section-subtitle">
                Tres pasos simples para empezar
              </p>
            </div>
            <div className="pasos-lista">
              {pasos.map((paso, index) => (
                <div key={index} className="paso-item">
                  <div className="paso-numero-circle">{paso.numero}</div>
                  <div className="paso-texto">
                    <h3 className="paso-titulo">{paso.titulo}</h3>
                    <p className="paso-descripcion">{paso.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="testimonios-section">
        <div className="section-header">
          <h2 className="section-title">Lo que dicen nuestros usuarios</h2>
          <p className="section-subtitle">
            Miles de personas ya confían en OficiosYA
          </p>
        </div>
        <div className="testimonios-grid">
          {testimonios.map((testimonio, index) => (
            <div key={index} className="testimonio-card">
              <div className="testimonio-header">
                <div className="testimonio-avatar">{testimonio.avatar}</div>
                <div className="testimonio-info">
                  <h4>{testimonio.nombre}</h4>
                  <p>{testimonio.rol}</p>
                </div>
              </div>
              <div className="testimonio-rating">
                {'⭐'.repeat(testimonio.rating)}
              </div>
              <p className="testimonio-comentario">"{testimonio.comentario}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final-section">
        <div className="cta-final-content">
          <h2 className="cta-final-title">
            ¿Listo para empezar?
          </h2>
          <p className="cta-final-text">
            Unite a miles de usuarios que ya están conectando oficios con oportunidades en OficiosYA
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-final" onClick={() => handleNavigate('/registro')}>
              Registrarme ahora
              <span>✨</span>
            </button>
            <button className="btn-cta-secondary" onClick={() => handleNavigate('/login')}>
              Ya tengo cuenta
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;