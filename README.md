# 💆‍♀️ H-B-Spa-e-Commerce  

Sitio web de **H&B SPA Jardín Balbuena**.  
Se diseñó un sitio completo para el salón spa de H&B como parte del **proyecto final de Generation México**.  

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
- Contiene las páginas principales del sitio: Inicio, Productos, Reserva, Acerca de Nosotros y Contacto.  
- El formulario de contacto envía los datos al backend mediante **fetch()**.  

### 🔹 Back-end  
📁 Carpeta: **`/Back-end`**  
Desarrollado con:
- **Java 17 + Spring Boot 3**  
- Gestiona el **envío de correos electrónicos** desde el formulario del sitio.  
- Endpoint principal:
  ```bash
  POST http://localhost:8080/api/email/enviar
