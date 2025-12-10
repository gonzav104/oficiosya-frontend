import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../utils/constants';
import imagenComoFunciona from '../assets/diseno-de-collage-de-personas.jpg';
import videoHeroBackground from '../assets/video-trabajo.mp4';
import { categoriasDisponibles } from '../utils/validaciones.js';
import { Button } from '../components/common';
import Footer from '../components/Footer';
import '../styles/pages/Home.css';

function Home() {

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al panel correspondiente
  if (isAuthenticated && user) {
    const rol = user.rol ? user.rol.toLowerCase() : '';

    if (rol === USER_ROLES.CLIENTE_LOWER) {
      return <Navigate to="/panel-solicitante" replace />;
    }

    if (rol === USER_ROLES.PRESTADOR_LOWER) {
      return <Navigate to="/panel-prestador" replace />;
    }

    if (rol === USER_ROLES.ADMIN_LOWER) {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  const handleNavigate = (path) => {
    navigate(path);
  };

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
    },
    {
      icon: '🌟',
      titulo: 'Calificaciones transparentes',
      descripcion: 'Sistema de reseñas y puntuaciones para que tomes la mejor decisión'
    },
    {
      icon: '📍',
      titulo: 'Cobertura nacional',
      descripcion: 'Encontrá profesionales en tu zona, sin importar dónde te encuentres'
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

  // Mapeo de iconos para cada categoría
  const iconosCategorias = {
    'Plomería': '🔧',
    'Electricidad': '⚡',
    'Pintura': '🎨',
    'Carpintería': '🪚',
    'Albañilería': '🧱',
    'Gasista': '🔥',
    'Herrería': '⚒️',
    'Jardinería': '🌱',
    'Techista': '🏠',
    'Limpieza': '🧽',
    'Refrigeración': '❄️',
    'Aire Acondicionado': '🌨️'
  };

  // Obtener categorías con sus iconos
  const categoriasConIconos = categoriasDisponibles.map(categoria => ({
    nombre: categoria,
    icono: iconosCategorias[categoria] || '🔨',
    descripcion: getDescripcionCategoria(categoria)
  }));

  // Función para obtener descripción de cada categoría
  function getDescripcionCategoria(categoria) {
    const descripciones = {
      'Plomería': 'Instalación y reparación de cañerías, grifos y sistemas de agua',
      'Electricidad': 'Instalaciones eléctricas, reparaciones y mantenimiento',
      'Pintura': 'Pintura de interiores y exteriores, empapelado y decoración',
      'Carpintería': 'Muebles a medida, reparaciones y trabajos en madera',
      'Albañilería': 'Construcción, reformas y trabajos de mampostería',
      'Gasista': 'Instalación y mantenimiento de sistemas de gas',
      'Herrería': 'Trabajos en metal, rejas, portones y estructuras',
      'Jardinería': 'Diseño, mantenimiento y cuidado de espacios verdes',
      'Techista': 'Reparación e instalación de techos y cubiertas',
      'Limpieza': 'Servicios de limpieza doméstica y comercial',
      'Refrigeración': 'Reparación y mantenimiento de heladeras y freezers',
      'Aire Acondicionado': 'Instalación y service de equipos de climatización'
    };
    return descripciones[categoria] || 'Servicios profesionales especializados';
  }

  return (
    <div className="home-container">

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
            <Button 
              className="btn-hero-primary" 
              onClick={() => handleNavigate('/registro')}
            >
              Crear cuenta gratis
              <span>→</span>
            </Button>
            <Button 
              className="btn-hero-secondary" 
              onClick={() => handleNavigate('/login')}
            >
              Iniciar sesión
              <span>↗</span>
            </Button>
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

      {/* CATEGORÍAS DISPONIBLES */}
      <section className="categorias-section">
        <div className="section-header">
          <h2 className="section-title">Servicios disponibles</h2>
          <p className="section-subtitle">
            Encontrá el profesional perfecto para tu necesidad
          </p>
        </div>
        <div className="categorias-grid">
          {categoriasConIconos.map((categoria, index) => (
            <div key={index} className="categoria-card" onClick={() => handleNavigate('/registro')}>
              <div className="categoria-icono">{categoria.icono}</div>
              <h3 className="categoria-nombre">{categoria.nombre}</h3>
              <p className="categoria-descripcion">{categoria.descripcion}</p>
              <div className="categoria-cta">
                <Button className="categoria-btn">
                  Solicitar servicio
                </Button>
              </div>
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
            <Button 
              className="btn-cta-final" 
              onClick={() => handleNavigate('/registro')}
            >
              Registrarme ahora
              <span>✨</span>
            </Button>
            <Button 
              className="btn-cta-secondary" 
              onClick={() => handleNavigate('/login')}
            >
              Ya tengo cuenta
              <span>→</span>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;