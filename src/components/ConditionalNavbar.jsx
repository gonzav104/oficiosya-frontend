import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import NavbarAuth from './NavbarAuth';

function ConditionalNavbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Rutas donde no se muestra el navbar (páginas de autenticación)
  const authPages = ['/login', '/registro', '/recuperar-contrasena'];
  
  // Verificar si es una página de autenticación
  const isAuthPage = authPages.some(page => location.pathname.startsWith(page));
  
  // Si es página de autenticación, no mostrar navbar
  if (isAuthPage) {
    return null;
  }
  
  // Si el usuario está autenticado, mostrar navbar de usuario
  if (isAuthenticated) {
    return <NavbarAuth />;
  }
  
  // Si no está autenticado y no es página de auth, mostrar navbar público
  return <Navbar />;
}

export default ConditionalNavbar;