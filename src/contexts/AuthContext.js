import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay token al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          // Verificar que el token sea válido
          await authService.verifyToken();
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          // Si el token no es válido, limpiar datos
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función de login
  const login = async (correo, contrasena) => {
    try {
      setLoading(true);
      const response = await authService.login(correo, contrasena);
      
      // Usar nombres estandarizados de respuesta
      const user = response.data?.user || response.usuario || response.user;
      setUser(user);
      setIsAuthenticated(true);
      
      return {
        ...response,
        user: user  
      };
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (userData, userType) => {
    try {
      setLoading(true);
      
      // Preparar datos con el tipo de usuario
      const dataWithType = {
        ...userData,
        userType: userType
      };
      
      const response = await authService.register(dataWithType);
      
      // Si el registro es exitoso y hay token, actualizar estado automáticamente
      if (response.usuario && response.token) {
        setUser(response.usuario);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.usuario));
        return response;
      }
      
      // Si no hay token pero hay usuario, el registro fue exitoso pero requiere login manual
      if (response.usuario) {
        return response;
      }
      
      return response;
    } catch (error) {
      // Manejar errores específicos
      if (error.error === 'El correo ya está registrado. Inicie sesión o recupere su contraseña.') {
        throw new Error('Este email ya está registrado. ¿Quizás ya tienes una cuenta? Intenta iniciar sesión.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Error en logout - continuar con limpieza local
    } finally {
      // Limpiar estado local
      setUser(null);
      setIsAuthenticated(false);
      
      // Limpiar datos del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Actualizar datos del usuario
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};