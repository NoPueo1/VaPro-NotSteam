# Vapro - Tienda de Videojuegos

Proyecto de tienda web desarrollado para la Evaluación 1 del ramo Desarrollo Web / Fullstack de Duoc UC.

## Integrantes
- Vicente Provoste
- Agustín Vásquez

## Descripción
Sitio web frontend para una tienda digital de videojuegos ("Vapro"). Incluye catálogo de juegos, vitrina con carrusel, páginas individuales por título, carrito de compras y un panel de administración con mantenedor de juegos y mantenedor de usuarios con validaciones de formularios y persistencia mediante LocalStorage.

## Estructura del Proyecto
- `Index.html`: Página principal con el carrusel de destacados y la galería de juegos.
- `Nosotros.html`: Información sobre la empresa y el equipo.
- `Blog.html`, `Noticia1.html`, `Noticia2.html`: Sección de noticias y novedades de videojuegos.
- `Contacto.html`: Formulario de contacto y soporte.
- `Login.html`: Inicio de sesión para usuarios y administradores.
- `Sign-up.html`: Registro de nuevos clientes con validaciones.
- `carrito.html`: Carrito de compras con cálculo de subtotales, totales y simulación de compra.
- `admin.html`: Vista principal del panel de administración (protegida para administradores).
- `admin-juegos.html`: Mantenedor CRUD de juegos (nombre, precio, descripción, imagen).
- `admin-usuarios.html`: Mantenedor CRUD de usuarios con validación de RUN chileno y regiones/comunas.
- `detalle-juego.html`: Vista de detalle dinámico para juegos.
- `Sitio-Juegos/`: Páginas individuales de los juegos destacados.
- `js/`: Scripts de soporte (`storage.js`, `validations.js`, `admin.js`, `chile-data.js`).
- `Assets/`: Imágenes y logos utilizados en el sitio.
- `style.css`: Estilos visuales del proyecto.

## Cómo ejecutar
1. Clonar o descargar el repositorio.
2. Abrir el archivo `Index.html` en cualquier navegador web moderno (Google Chrome, Firefox, Edge).

## Credenciales de prueba
- **Administrador:** `admin@duoc.cl` | Contraseña: `1234`
- **Vendedor:** `carlos.vargas@profesor.duoc.cl` | Contraseña: `1234`
- **Cliente:** `matias.perez@gmail.com` | Contraseña: `1234`
