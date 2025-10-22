# 🔧 OficiosYA - Plataforma de Servicios del Hogar

## 📋 Descripción del Proyecto

**OficiosYA** es una plataforma web innovadora que conecta a solicitantes de servicios del hogar con prestadores especializados en diferentes oficios. Nuestro sistema facilita la búsqueda, cotización y contratación de servicios como plomería, electricidad, pintura, carpintería, gasista, albañilería, refrigeración,herrería, etc.

### 🎯 Objetivo
Crear un ecosistema digital que simplifique el proceso de encontrar y contratar profesionales confiables para servicios del hogar, proporcionando transparencia, seguridad y calidad en cada transacción.

---

## 👥 Equipo de Desarrollo

| Integrante | Rol |
|------------|-----|
| **Camila Kapp** | Integrante 1 |
| **Ivan Rodriguez** | Integrante 2 |
| **Federico Ramirez** | Integrante 3 |
| **Gonzalo Velazquez** | Integrante 4 |

---

## 🏫 Información Académica

- **Universidad:** Universidad Nacional San Antonio de Areco
- **Carrera:** Analista en Sistemas
- **Materia:** Proyecto de Desarrollo
- **Profesor:** Pablo Marolli
- **Período:** 2025

---

## 🚀 Características Principales

### 👤 Para Solicitantes
- ✅ Registro y gestión de perfil personalizado
- 📝 Creación de solicitudes detalladas de servicios
- 🔍 Búsqueda de prestadores por categoría y localidad
- 💰 Recepción y comparación de presupuestos
- ⭐ Sistema de calificación y reseñas
- 📱 Seguimiento en tiempo real del estado de solicitudes

### 🔨 Para Prestadores
- 👷 Perfil profesional con portfolio de trabajos
- 📋 Gestión de solicitudes recibidas
- 💵 Envío de presupuestos personalizados
- 📊 Panel de control con estadísticas
- 🏆 Sistema de reputación y calificaciones
- 📍 Gestión de zonas de trabajo

### 🛡️ Para Administradores
- 👥 Gestión completa de usuarios
- 📈 Análisis y reportes del sistema
- 🔒 Moderación de contenido y calificaciones
- ⚙️ Configuración de parámetros del sistema

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React.js** - Biblioteca de JavaScript para interfaces de usuario
- **Bootstrap 5** - Framework CSS para diseño responsivo
- **React Router** - Navegación entre componentes
- **Bootstrap Icons** - Iconografía moderna

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MySQL** - Base de datos relacional

### Herramientas de Desarrollo
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto
- **VS Code** - Editor de código
- **Postman** - Testing de APIs

---

## 📁 Estructura del Proyecto

```
oficiosya-frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── PanelSolicitante.jsx
│   │   ├── PanelPrestador.jsx
│   │   ├── PanelAdmin.jsx
│   │   ├── SolicitudDetalle.jsx
│   │   └── PerfilPrestador.jsx
│   ├── api/
│   │   └── api.js
│   ├── utils/
│   │   └── RutaProtegidaPrestador.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

---

## ⚙️ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (gestor de paquetes)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/gonzav104/oficiosya-frontend.git
   cd oficiosya-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   REACT_APP_API_URL=http://localhost:3001
   ```

4. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

5. **Acceder a la aplicación**
   - Abrir navegador en: `http://localhost:3000`

---

## 🎮 Uso de la Aplicación

### Estados de Solicitudes

| Estado | Descripción | Acciones Disponibles |
|--------|-------------|---------------------|
| **Iniciada** | Solicitud publicada | Buscar prestadores, solicitar presupuestos |
| **Enviada** | Presupuestos solicitados | Ver prestadores contactados |
| **Cotizada** | Presupuesto recibido | Aceptar/rechazar presupuesto |
| **Pendiente de Calificación** | Trabajo completado | Calificar prestador |
| **Cerrada** | Proceso finalizado | Ver resumen del trabajo |

### Flujo de Trabajo
1. **Solicitante** crea una solicitud de servicio
2. **Sistema** recomienda prestadores según categoría y localidad
3. **Solicitante** envía solicitudes a prestadores seleccionados
4. **Prestadores** envían presupuestos personalizados
5. **Solicitante** acepta presupuesto y coordina trabajo
6. **Ambas partes** se califican mutuamente

---

## 🔧 Scripts Disponibles

### `npm start`
Ejecuta la aplicación en modo desarrollo.
- URL: `http://localhost:3000`
- Recarga automática al hacer cambios

### `npm test`
Ejecuta las pruebas unitarias en modo interactivo.

### `npm run build`
Construye la aplicación para producción en la carpeta `build/`.
- Optimizada para mejor rendimiento
- Archivos minificados con hash

### `npm run eject`

## 🎨 Características de UI/UX

- 📱 **Diseño Responsivo** - Adaptable a móviles, tablets y desktop
- 🎨 **Interfaz Moderna** - Bootstrap 5 con componentes personalizados
- ⚡ **Navegación Intuitiva** - React Router para SPA
- 🔄 **Estados Dinámicos** - Feedback visual en tiempo real
- ✨ **Animaciones Suaves** - Transiciones CSS para mejor experiencia
- 🌈 **Paleta de Colores Profesional** - Verde #1b8a5e como color principal

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- Usar ES6+ y React Hooks
- Componentes funcionales preferentemente
- Nombres descriptivos para variables y funciones
- Comentarios en código complejo
- CSS modular con BEM methodology

---

## 📄 Licencia

Este proyecto es desarrollado por el grupo 3 (OficiosYA) con fines académicos para la Universidad Nacional San Antonio de Areco.

---

## 📞 Contacto

Para consultas sobre el proyecto:

- **Repositorio:** [github.com/gonzav104/oficiosya-frontend](https://github.com/gonzav104/oficiosya-frontend)
- **Universidad:** Universidad Nacional San Antonio de Areco
- **Profesor:** Pablo Marolli

---

## 🙏 Agradecimientos

- Universidad Nacional San Antonio de Areco por brindar el espacio académico
- Profesor Pablo Marolli por la guía y enseñanza
- Comunidad React.js por la documentación y recursos
- Bootstrap team por el framework CSS

---

**Desarrollado con ❤️ por el equipo de OficiosYA - 2025**
