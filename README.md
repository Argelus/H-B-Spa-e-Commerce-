# 💆‍♀️ H&B Spa e-Commerce  

Sitio web de **H&B SPA Jardín Balbuena** — plataforma integral para gestión de **reservas, productos y órdenes en línea**, desarrollada como parte del proyecto final del programa **Full Stack Java Developer (Generation México)**.  
El sistema fue ampliado y optimizado para incluir **autenticación JWT, panel administrativo seguro, gestión de imágenes con Cloudinary y despliegue completo en Railway**.

---

## 👥 Equipo de Desarrollo  

- Aylin Lucero Meléndez Juan  
- Jose Alejandro Rojas Lona  
- Daniel Garduño Palomo  
- Josette Pérez Castillo  
- Arturo Ramírez Tejeda  
- Anghelo Ortiz Oropeza  
- Erick Alberto Romo Rodríguez  
- Ramón Domínguez Solís  
- Juan Pérez Marcelo  

---

## 🧩 Estructura del Proyecto  

El proyecto está dividido en dos módulos principales:  

---

### 🔹 Front-end  
📁 Carpeta: **`/Front-end`**

Desarrollado con:
- **HTML5, CSS3, JavaScript y Bootstrap 5**
- **Diseño responsivo, moderno e intuitivo.**
- Páginas principales:
  - 🏠 **Inicio**
  - 💄 **Productos**
  - 📅 **Reservas**
  - ℹ️ **Acerca de nosotros**
  - ✉️ **Contacto**
- Conexión directa al backend mediante **fetch()**.
- Panel administrativo protegido con autenticación JWT.
- Funcionalidades:
  - Creación, edición y eliminación de productos, servicios y categorías.
  - Subida automática de imágenes a **Cloudinary**.
  - Selector dinámico de categorías desde la base de datos.
  - Alertas automáticas y notificaciones personalizadas.
  - Integración de API externa de reseñas (**Elfsight**).

---

### 🔹 Back-end  
📁 Carpeta: **`/Back-end`**

Desarrollado con:
- **Java 17 + Spring Boot 3**
- **Spring Security + JWT** para autenticación y roles.
- **Spring Data JPA + MySQL** para persistencia de datos.
- **Cloudinary** para gestión automática de imágenes.
- **Railway** para despliegue completo (API REST + base de datos MySQL).

> ⚙️ **Ejecución:**
> La aplicación se ejecuta desde la clase principal  
> `Back-end/src/main/java/com/spa/EmailServiceApplication.java`
>
> Al correr esta clase se levanta el servidor local en:
> ```
> http://localhost:8080
> ```
> Todos los endpoints quedan disponibles bajo la ruta base `/api/`.

---

## ⚙️ Funcionalidades Principales  

### 🔐 Autenticación JWT  
El backend implementa un sistema de seguridad con **tokens JWT** y control de roles:
- **ROLE_ADMIN:** puede crear, editar o eliminar productos, servicios, categorías y usuarios.
- **ROLE_USER:** puede visualizar productos, crear reservas y consultar su historial.

**Endpoints principales:**
```bash
POST /api/auth/login        → Inicia sesión y devuelve un token JWT.
POST /api/auth/register     → Registra un nuevo usuario con contraseña cifrada.
```

**Configuración de seguridad:**
- `SecurityConfig.java` define accesos públicos y protegidos.
- Los endpoints de autenticación (`/api/auth/**`) son públicos.
- Las rutas de gestión de contenido y reservas están protegidas por roles.

---

### 👤 Gestión de Usuarios

Los usuarios se almacenan en la tabla `usuarios` con campos:
- `username`, `email`, `password`, `role`

Controladores y clases relacionadas:
- `UsuarioController`
- `UsuarioService`
- `UsuarioDetailsServiceImpl`
- `JwtUtil` (generación y validación de tokens)

---

### 💅 Gestión de Servicios y Categorías  
Los servicios del spa se organizan por categorías, permitiendo:
- Creación y administración de tratamientos.
- Asignación de precio, duración e imagen.
- Clasificación por tipo (masaje, facial, depilación, etc.).

**Endpoints:**
```bash
GET  /api/services                → Lista de servicios disponibles.
POST /api/services                → Crear servicio (ADMIN).
PUT  /api/services/{id}           → Actualizar servicio (ADMIN).
DELETE /api/services/{id}         → Eliminar servicio (ADMIN).
GET  /api/service-categories      → Categorías de servicios.
```

---

### 🧴 Gestión de Productos y Categorías  
Incluye catálogo de productos (cosméticos, aceites, kits de spa, etc.) con sus respectivas categorías.

**Endpoints:**
```bash
GET  /api/products                → Lista de productos.
POST /api/products                → Crear producto (ADMIN).
PUT  /api/products/{id}           → Editar producto (ADMIN).
DELETE /api/products/{id}         → Eliminar producto (ADMIN).
GET  /api/categories              → Categorías de productos.
```

Cada producto cuenta con:
- Nombre, descripción, precio, stock, imagen y contenido.
- Relación directa con su categoría (`category_id`).

---

### 🧾 Órdenes y Carrito de Compras  
Permite que los usuarios:
- Agreguen productos al carrito.
- Generen órdenes de compra.
- Consulten su historial de pedidos.

**Tablas relacionadas:**
- `cart_items`
- `orders`
- `products`
- `usuarios`

**Endpoints:**
```bash
GET  /api/orders                  → Obtener órdenes del usuario.
POST /api/orders                  → Crear nueva orden.
GET  /api/cart                    → Consultar items del carrito.
POST /api/cart/add                → Agregar producto al carrito.
DELETE /api/cart/remove/{id}      → Eliminar producto del carrito.
```

---

### 📅 Sistema de Reservas  
Los usuarios pueden agendar citas seleccionando:
- Fecha, hora, servicio y notas opcionales.

El backend valida la disponibilidad y crea la reserva en la base de datos.

**Endpoints:**
```bash
GET  /api/reservas                → Lista reservas del usuario (ROLE_USER/ADMIN).
POST /api/reservas                → Crear nueva reserva.
PUT  /api/reservas/{id}           → Actualizar estado (ADMIN o usuario).
DELETE /api/reservas/{id}         → Cancelar reserva.
```

**Campos principales:**
- `estado`, `fecha_reserva`, `hora_reserva`, `nota`, `telefono`, `metodo_confirmacion`, `usuario_id`, `spa_service_id`, `creado_en`

---

### ☁️ Subida de Imágenes a Cloudinary  
Cada vez que un administrador crea o actualiza un producto o servicio con imagen, esta se envía automáticamente a **Cloudinary**, almacenando:
- `secure_url` → guardado en la base de datos.
- Gestión centralizada desde `CloudinaryService.java`.

---

### 💌 Notificaciones por Correo y WhatsApp  
El backend está preparado para enviar notificaciones automáticas:
- **Correo electrónico:** Confirmación de registro o reserva.
- **WhatsApp (vía API Meta Cloud):** Mensajes de confirmación al usuario (pendiente de activación).

---

## 🗃️ Modelo de Base de Datos (MySQL)

### Tablas Principales:
- `usuarios`
- `categories`
- `products`
- `orders`
- `cart_items`
- `services`
- `service_categories`
- `reservas`

**Relaciones clave:**
```plaintext
usuarios (1) ───< orders (N)
usuarios (1) ───< reservas (N)
services (1) ───< reservas (N)
service_categories (1) ───< services (N)
categories (1) ───< products (N)
products (1) ───< cart_items (N)
orders (1) ───< cart_items (N)
```

**Base de datos desplegada en:**  
`Railway (MySQL 8.x)`  
con `spring.jpa.hibernate.ddl-auto=update`.

---

## 🚀 Despliegue  

El backend está desplegado en **Railway**, con:
- API REST en producción.  
- Base de datos MySQL persistente.  
- Variables de entorno configuradas para Cloudinary y credenciales JWT.  

---

## 🧱 Tecnologías Utilizadas  

| Categoría | Tecnologías |
|------------|-------------|
| **Frontend** | HTML5, CSS3, Bootstrap 5, JavaScript (fetch API) |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA, Spring Security |
| **Autenticación** | JWT (JSON Web Token) |
| **Base de datos** | MySQL (Railway) |
| **Imágenes** | Cloudinary |
| **Despliegue** | Railway |
| **Notificaciones** | JavaMailSender, API de WhatsApp Cloud (pendiente de integración) |

---

## 🧪 Testing  

Se utilizaron pruebas con **JUnit 5** para validar:
- Validación de contraseñas (`PasswordValidatorTest`).
- Lógica de autenticación JWT.
- Reglas de negocio en servicios y reservas.

---

## 🧭 Estructura del Código (Backend)

```
com.spa
├── controller
│   ├── AuthController.java
│   ├── UsuarioController.java
│   ├── ProductController.java
│   ├── CategoryController.java
│   ├── ServiceController.java
│   ├── ReservaController.java
│   └── OrderController.java
│
├── dto
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   └── JwtResponse.java
│
├── entity
│   ├── Usuario.java
│   ├── Product.java
│   ├── Category.java
│   ├── Service.java
│   ├── ServiceCategory.java
│   ├── Reserva.java
│   ├── Order.java
│   └── CartItem.java
│
├── repository
│   ├── UsuarioRepository.java
│   ├── ProductRepository.java
│   ├── CategoryRepository.java
│   ├── ServiceRepository.java
│   ├── ServiceCategoryRepository.java
│   ├── ReservaRepository.java
│   ├── OrderRepository.java
│   └── CartItemRepository.java
│
├── security
│   ├── config
│   │   └── SecurityConfig.java
│   ├── jwt
│   │   └── JwtUtil.java
│   ├── filter
│   │   └── JwtRequestFilter.java
│   └── service
│       └── UsuarioDetailsServiceImpl.java
│
├── service
│   ├── CloudinaryService.java
│   ├── EmailService.java
│   ├── ProductService.java
│   ├── ServiceService.java
│   ├── ReservaService.java
│   └── OrderService.java
│
└── EmailServiceApplication.java
```

---

## 🧾 Licencia  

Este proyecto es de uso académico, desarrollado con fines educativos y demostrativos.  
Cualquier uso comercial debe contar con autorización expresa del equipo desarrollador.

---
