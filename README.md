# 💆‍♀️ H-B-Spa-e-Commerce  

Sitio web de **H&B SPA Jardín Balbuena**.  
Proyecto final del programa **Full Stack Java Developer (Generation México)**.  
El sistema fue ampliado y mejorado para incluir un **panel administrativo seguro con autenticación JWT, subida automática de imágenes a Cloudinary y despliegue completo en Railway**.  

---

## 👥 Equipo  

- Aylin Lucero Meléndez Juan  
- Jose Alejandro Rojas Lona  
- Daniel Garduño Palomo  
- Josette Pérez Castillo  
- Arturo Ramirez Tejeda  
- Anghelo Ortiz Oropeza  
- Erick Alberto Romo Rodríguez  
- Ramón Domínguez Solís  
- Juan Pérez Marcelo  

---

## 🧩 Estructura del Proyecto  

El proyecto está dividido en dos módulos principales:  

### 🔹 Front-end  
📁 Carpeta: **`/Front-end`**  

Desarrollado con:
- **HTML5, CSS3, JavaScript y Bootstrap 5**
- Diseño responsivo, moderno y profesional.  
- Incluye las páginas principales:  
  - 🏠 **Inicio**  
  - 💄 **Productos**  
  - 📅 **Reservas**  
  - ℹ️ **Acerca de nosotros**  
  - ✉️ **Contacto**  
- El formulario de contacto envía datos al backend mediante **fetch()**.  
- Panel administrativo con autenticación y gestión de productos:  
  - Listado dinámico de productos.  
  - Creación, edición y eliminación.  
  - Subida automática de imágenes a **Cloudinary**.  
  - Selector dinámico de categorías desde la base de datos (sin IDs manuales).  
  - Alertas automáticas de confirmación y mensajes temporales.  

---

### 🔹 Back-end  
📁 Carpeta: **`/Back-end`**  

Desarrollado con:
- **Java 17 + Spring Boot 3**  
- **Spring Security + JWT** para autenticación.  
- **JPA + MySQL** para persistencia de datos.  
- **Railway** como servidor de despliegue (Base de datos y API REST).  
- **Cloudinary** para la gestión automática de imágenes.  

---

## ⚙️ Funcionalidades Principales

### 🔐 Autenticación JWT  
El backend implementa un sistema de seguridad basado en **tokens JWT** con control de roles:  
- **ROLE_ADMIN:** puede crear, editar o eliminar productos y categorías.  
- **ROLE_USER:** puede visualizar productos, realizar búsquedas o reservas.  

Endpoints principales:  
```bash
POST /api/auth/login      → Inicia sesión y devuelve un token JWT.  
POST /api/auth/register   → Registra un nuevo usuario con contraseña cifrada.  
