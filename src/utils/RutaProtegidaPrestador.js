import React from 'react';
import { Navigate } from 'react-router-dom';

function RutaProtegidaPrestador({ perfilCompleto, children }) {
  // Esto nos mostrará en la consola del navegador si el perfil está completo o no
  console.log("Chequeando ruta protegida. Perfil completo:", perfilCompleto);

  if (!perfilCompleto) {
    // Si el perfil NO está completo, redirige a la página de edición
    return <Navigate to="/editar-perfil" replace />;
  }

  // Si el perfil está completo, muestra el contenido normal (el panel)
  return children;
}

export default RutaProtegidaPrestador;