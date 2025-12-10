import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
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
      localStorage.removeItem('user'); // Limpiar datos antiguos

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
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

      //Almacenar solo token
      const token = response.data?.token || response.token;
      localStorage.setItem('token', token);

      // Decodificar para setear usuario
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
      
      return response;
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
      
      // Si el registro devuelve un token, manejarlo igual que en el login
      if (response.token) {
        localStorage.setItem('token', response.token);
        const decoded = jwtDecode(response.token);
        setUser(decoded);
        setIsAuthenticated(true);
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
      // Error en logout, continuar con limpieza local
    } finally {
      // Limpiar estado local
      setUser(null);
      setIsAuthenticated(false);     
      // Limpiar datos del localStorage
      localStorage.removeItem('token');
    }
  };

  // Actualizar datos del usuario
  const updateUser = (newUserData) => {
    setUser(newUserData);
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