# Guía de Estilos Estandarizados - H&B SPA

## 📋 Estructura de Archivos CSS

Los estilos del proyecto H&B SPA han sido organizados y estandarizados siguiendo la estética del `index.html` para mantener coherencia visual en todas las páginas.

### Archivos Principales

#### 1. **`common.css`** - Estilos Globales
Este archivo contiene todos los estilos compartidos entre las páginas:

- **Variables CSS** (paleta de colores)
  - `--arena-suave: #f5ede4`
  - `--sal-marina: #d7eceb`
  - `--turquesa-pastel: #6ebfc3`
  - `--lila-rosa: #ebd2ec`
  - `--gris-humo: #4a4a4a`

- **Fuentes personalizadas** (Lato y Lora)
- **Reset y estilos base**
- **Navbar unificado** (con efecto scroll)
- **Footer estandarizado**
- **Botones personalizados** (btn-turquesa, btn-outline-turquesa)
- **Utilidades** (text-turquesa, bg-arena-suave, etc.)
- **Animaciones globales** (fadeIn, slideInUp, zoomIn)

#### 2. **`index.css`** - Estilos Específicos de la Página Principal
Contiene estilos únicos para la página de inicio:

- Hero/Carousel principal
- Galería Masonry (3 columnas)
- Modal Lightbox para imágenes
- Carousel 3D del equipo
- Efectos de hover y transiciones especiales

#### 3. **`contact.css`** - Estilos Específicos de la Página de Contacto
Estilos adaptados para la página de contacto siguiendo la estética del index:

- Tarjetas de contacto con efectos hover
- Formulario de contacto estilizado
- Información de contacto
- Alertas de éxito/error
- Mapa integrado
- FAQ y horarios

---

## 🎨 Paleta de Colores

| Color | Variable CSS | Hex | Uso |
|-------|--------------|-----|-----|
| Arena Suave | `--arena-suave` | #f5ede4 | Fondos suaves, secciones |
| Sal Marina | `--sal-marina` | #d7eceb | Fondos alternativos |
| Turquesa Pastel | `--turquesa-pastel` | #6ebfc3 | Acentos, botones, hover |
| Lila Rosa | `--lila-rosa` | #ebd2ec | Gradientes, footer |
| Gris Humo | `--gris-humo` | #4a4a4a | Textos principales |

---

## 📦 Implementación en Nuevas Páginas

### Estructura HTML Recomendada:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Página - H&B SPA</title>
  
  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  
  <!-- Estilos del Proyecto -->
  <link rel="stylesheet" href="../styles/common.css">
  <link rel="stylesheet" href="../styles/tu-pagina.css">
</head>
<body>
  <!-- Tu contenido aquí -->
  
  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  
  <!-- Navbar Scroll Effect -->
  <script>
  document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("scroll", () => {
      const navbar = document.querySelector(".navbar-overlay");
      if (navbar) {
        window.scrollY > 50 ? navbar.classList.add("scrolled") : navbar.classList.remove("scrolled");
      }
    });
  });
  </script>
</body>
</html>
```

---

## 🔧 Componentes Estandarizados

### 1. Navbar
```html
<nav class="navbar navbar-expand-lg fixed-top navbar-dark navbar-overlay py-3">
  <div class="container">
    <a class="navbar-brand fw-bold" href="../index.html">H&B SPA</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
      <ul class="navbar-nav gap-3">
        <li class="nav-item"><a class="nav-link" href="../index.html">Inicio</a></li>
        <!-- Más items -->
      </ul>
    </div>
    <div class="d-none d-lg-flex ms-3">
      <a href="Register.html" class="btn btn-outline-light rounded-pill me-2">Registro</a>
      <a href="Login.html" class="btn btn-light rounded-pill text-turquesa">Log In</a>
    </div>
  </div>
</nav>
```

### 2. Footer
```html
<footer class="bg-light pt-5 pb-3 mt-5">
  <div class="container">
    <!-- Contenido del footer -->
  </div>
</footer>
```

### 3. Botones
```html
<!-- Botón primario -->
<button class="btn btn-turquesa">Acción Principal</button>

<!-- Botón secundario -->
<button class="btn btn-outline-turquesa">Acción Secundaria</button>
```

---

## 🎯 Clases Utilitarias Personalizadas

```css
.text-turquesa          /* Texto color turquesa */
.bg-arena-suave         /* Fondo arena suave */
.bg-sal-marina          /* Fondo sal marina */
.bg-gradient-spa        /* Gradiente del spa */
.fade-in                /* Animación fade in */
.slide-in-up            /* Animación slide up */
```

---

## 📱 Responsividad

Todos los estilos incluyen media queries para:
- Desktop: > 992px
- Tablet: 768px - 992px
- Mobile: < 768px
- Small Mobile: < 576px

---

## ✅ Checklist para Nuevas Páginas

- [ ] Incluir `common.css` antes del CSS específico
- [ ] Usar la estructura de navbar estandarizada
- [ ] Aplicar las variables CSS de colores
- [ ] Incluir el footer con la estructura definida
- [ ] Agregar el script de scroll del navbar
- [ ] Usar las clases de botones personalizadas
- [ ] Verificar responsividad en móvil
- [ ] Mantener la coherencia visual con las transiciones y efectos

---

## 🚀 Beneficios de esta Estructura

1. **Mantenibilidad**: Cambios globales se hacen en un solo lugar
2. **Consistencia**: Todas las páginas comparten la misma estética
3. **Performance**: CSS reutilizable reduce duplicación
4. **Escalabilidad**: Fácil agregar nuevas páginas manteniendo el estilo
5. **Responsive**: Diseño adaptable a todos los dispositivos

---

## 📞 Contacto del Equipo de Desarrollo

Para dudas sobre la implementación de estilos, consultar con el equipo Bug Busters.

---

*Última actualización: Octubre 2025*
*Versión: 1.0*

