// storage.js - Manejo del LocalStorage para juegos y usuarios

// Juegos iniciales
const juegosPorDefecto = [
    {
        id: "JUEGO-1",
        nombre: "Cyberpunk 2099",
        descripcion: "Entra en el distopico mundo de Cyberpunk 2099.",
        precio: 29990,
        imagen: "Assets/juegos/cyberpunk2099.png",
        gameplay: "Assets/juegos/galeria/cyberpunk2099-gameplay.jpg",
        etiquetas: ["Acción", "RPG"],
        enlace: "Sitio-Juegos/Cyberpunk2099.html"
    },
    {
        id: "JUEGO-2",
        nombre: "Pickcraft 2",
        descripcion: "Mas bloques que nunca, la aventura te espera.",
        precio: 14990,
        imagen: "Assets/juegos/pickcraft2.png",
        gameplay: "Assets/juegos/galeria/pickcraft2-gameplay.jpg",
        etiquetas: ["Aventura", "Indie"],
        enlace: "Sitio-Juegos/Pickcraft2.html"
    },
    {
        id: "JUEGO-3",
        nombre: "Resident Good 4",
        descripcion: "Leon nunca fue tan feliz como en Resident Good 4.",
        precio: 39990,
        imagen: "Assets/juegos/residentgood4.png",
        gameplay: "Assets/juegos/galeria/residentgood4-gameplay.jpg",
        etiquetas: ["Horror", "Supervivencia"],
        enlace: "Sitio-Juegos/ResidentGood4.html"
    },
    {
        id: "JUEGO-4",
        nombre: "Fifa 3000",
        descripcion: "El simulador de futbol definitivo de Provoste-Vasquez.",
        precio: 59990,
        imagen: "Assets/juegos/fifa3000.png",
        gameplay: "Assets/juegos/galeria/fifa3000-gameplay.jpg",
        etiquetas: ["Deportes"],
        enlace: "Sitio-Juegos/Fifa3000.html"
    },
    {
        id: "JUEGO-5",
        nombre: "Office Fighter 6",
        descripcion: "El torneo de lucha definitivo entre colegas de oficina.",
        precio: 59990,
        imagen: "Assets/juegos/officefighter6.png",
        gameplay: "Assets/juegos/galeria/officefighter6-gameplay.jpg",
        etiquetas: ["Lucha"],
        enlace: "Sitio-Juegos/OfficeFighter6.html"
    },
    {
        id: "JUEGO-6",
        nombre: "Mariana Sisters 2",
        descripcion: "Aventura de plataformas y saltos de Mariana y sus hermanas.",
        precio: 9990,
        imagen: "Assets/juegos/marianasisters2.png",
        gameplay: "Assets/juegos/galeria/marianasisters2-gameplay.jpg",
        etiquetas: ["Casual"],
        enlace: "Sitio-Juegos/MarianaSisters2.html"
    },
    {
        id: "JUEGO-7",
        nombre: "Tunels",
        descripcion: "Explora laberintos subterraneos y supera desafiantes niveles de plataformas.",
        precio: 29990,
        imagen: "Assets/juegos/tunels.png",
        gameplay: "Assets/juegos/galeria/tunels-gameplay.jpg",
        etiquetas: ["Plataformas"],
        enlace: "Sitio-Juegos/Tunels.html"
    },
    {
        id: "JUEGO-8",
        nombre: "Left 4 Live 2",
        descripcion: "Juego cooperativo para sobrevivir a hordas de personas comunes.",
        precio: 7990,
        imagen: "Assets/juegos/left4live2.png",
        etiquetas: ["Acción", "Cooperativo"]
    },
    {
        id: "JUEGO-9",
        nombre: "Coches Flipantes",
        descripcion: "Carreras alocadas y choques en pistas extremas.",
        precio: 8990,
        imagen: "Assets/juegos/cochesflipantes.png",
        etiquetas: ["Carreras", "Arcade"]
    },
    {
        id: "JUEGO-10",
        nombre: "Enter The FrontRooms",
        descripcion: "Explora habitaciones infinitas y sobrevive a entidades desconocidas.",
        precio: 7990,
        imagen: "Assets/juegos/enterthefrontrooms.png",
        etiquetas: ["Terror", "Misterio"]
    },
    {
        id: "JUEGO-11",
        nombre: "Half Dead 3",
        descripcion: "Sobrevive a salas trampa en un complejo subterráneo.",
        precio: 9990,
        imagen: "Assets/juegos/halfdead3.png",
        etiquetas: ["Acción", "Supervivencia"]
    },
    {
        id: "JUEGO-12",
        nombre: "Age of Kingdom 2",
        descripcion: "Estrategia en tiempo real con batallas de castillos medievales.",
        precio: 14990,
        imagen: "Assets/juegos/ageofkingdom2.png",
        etiquetas: ["Estrategia"]
    }
];

// Datos iniciales de usuarios de prueba
const usuariosPorDefecto = [
    {
        run: "111111111",
        nombre: "Administrador",
        apellidos: "Principal",
        correo: "admin@duoc.cl",
        fechaNacimiento: "1995-05-15",
        rol: "Administrador",
        region: "RM",
        comuna: "Santiago",
        direccion: "Av. España 8"
    },
    {
        run: "222222222",
        nombre: "Carlos",
        apellidos: "Vargas",
        correo: "carlos.vargas@profesor.duoc.cl",
        fechaNacimiento: "1997-08-20",
        rol: "Vendedor",
        region: "RM",
        comuna: "Providencia",
        direccion: "Av. Providencia 1200"
    },
    {
        run: "19011022K",
        nombre: "Matias",
        apellidos: "Perez",
        correo: "matias.perez@gmail.com",
        fechaNacimiento: "2001-11-03",
        rol: "Cliente",
        region: "VA",
        comuna: "Viña del Mar",
        direccion: "Calle Valparaíso 320"
    }
];

// Cargar datos al storage si es primera vez
function cargarDatosIniciales() {
    let guardados = localStorage.getItem("lista_juegos");
    if (!guardados || !guardados.includes("Age of Kingdom 2")) {
        localStorage.setItem("lista_juegos", JSON.stringify(juegosPorDefecto));
    }
    if (!localStorage.getItem("lista_usuarios")) {
        localStorage.setItem("lista_usuarios", JSON.stringify(usuariosPorDefecto));
    }
}
cargarDatosIniciales();

// Funciones para Juegos
function getJuegos() {
    cargarDatosIniciales();
    let datos = localStorage.getItem("lista_juegos");
    return datos ? JSON.parse(datos) : [];
}

function saveJuego(juego) {
    let juegos = getJuegos();
    if (juego.id) {
        let pos = juegos.findIndex(j => j.id === juego.id);
        if (pos !== -1) {
            juegos[pos] = juego;
        }
    } else {
        juego.id = "JUEGO-" + (juegos.length + 1);
        juegos.unshift(juego);
    }
    localStorage.setItem("lista_juegos", JSON.stringify(juegos));
    return juego;
}

function deleteJuego(id) {
    let juegos = getJuegos();
    juegos = juegos.filter(j => j.id !== id);
    localStorage.setItem("lista_juegos", JSON.stringify(juegos));
}

function getJuegoById(id) {
    let juegos = getJuegos();
    return juegos.find(j => j.id === id) || null;
}

// Funciones para Usuarios
function getUsuarios() {
    cargarDatosIniciales();
    let datos = localStorage.getItem("lista_usuarios");
    return datos ? JSON.parse(datos) : [];
}

function saveUsuario(usuario) {
    let usuarios = getUsuarios();
    let runLimpio = usuario.run ? usuario.run.replace(/[^0-9kK]/g, '').toUpperCase() : "";
    if (!runLimpio) {
        runLimpio = "CLI" + Date.now().toString().slice(-6);
    }
    usuario.run = runLimpio;
    
    let pos = usuarios.findIndex(u => u.run === runLimpio || (u.correo && usuario.correo && u.correo.toLowerCase() === usuario.correo.toLowerCase()));
    if (pos !== -1) {
        usuarios[pos] = usuario;
    } else {
        usuarios.unshift(usuario);
    }
    localStorage.setItem("lista_usuarios", JSON.stringify(usuarios));
    return usuario;
}

function deleteUsuario(run) {
    let usuarios = getUsuarios();
    let runLimpio = run.replace(/[^0-9kK]/g, '').toUpperCase();
    usuarios = usuarios.filter(u => u.run !== runLimpio);
    localStorage.setItem("lista_usuarios", JSON.stringify(usuarios));
}

function getUsuarioByRun(run) {
    let usuarios = getUsuarios();
    let runLimpio = run.replace(/[^0-9kK]/g, '').toUpperCase();
    return usuarios.find(u => u.run === runLimpio) || null;
}

// Sesion de usuario actual
function getCurrentUser() {
    let u = sessionStorage.getItem("usuario_logeado");
    return u ? JSON.parse(u) : null;
}

function setCurrentUser(usuario) {
    sessionStorage.setItem("usuario_logeado", JSON.stringify(usuario));
}

function logoutUser() {
    sessionStorage.removeItem("usuario_logeado");
}

// Manejo del Carrito de Compras
function getCarrito() {
    let datos = localStorage.getItem("vapro_carrito");
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("vapro_carrito", JSON.stringify(carrito));
    actualizarBadgeCarrito();
}

function agregarAlCarrito(idJuego, cantidad = 1) {
    let juego = getJuegoById(idJuego);
    if (!juego) return false;

    let carrito = getCarrito();
    let pos = carrito.findIndex(item => item.id === idJuego);

    if (pos !== -1) {
        carrito[pos].cantidad += cantidad;
    } else {
        carrito.push({
            id: juego.id,
            nombre: juego.nombre,
            precio: juego.precio,
            imagen: juego.imagen,
            cantidad: cantidad
        });
    }

    guardarCarrito(carrito);
    return true;
}

function eliminarDelCarrito(idJuego) {
    let carrito = getCarrito();
    carrito = carrito.filter(item => item.id !== idJuego);
    guardarCarrito(carrito);
}

function cambiarCantidadCarrito(idJuego, nuevaCantidad) {
    let carrito = getCarrito();
    let pos = carrito.findIndex(item => item.id === idJuego);
    if (pos !== -1) {
        if (nuevaCantidad <= 0) {
            carrito.splice(pos, 1);
        } else {
            carrito[pos].cantidad = Number(nuevaCantidad);
        }
        guardarCarrito(carrito);
    }
}

function vaciarCarrito() {
    localStorage.removeItem("vapro_carrito");
    actualizarBadgeCarrito();
}

function totalCarrito() {
    let carrito = getCarrito();
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}

function cantidadTotalCarrito() {
    let carrito = getCarrito();
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}

function actualizarBadgeCarrito() {
    let badges = document.querySelectorAll(".badge-carrito-total");
    let totalItems = cantidadTotalCarrito();
    badges.forEach(b => {
        b.textContent = totalItems;
        if (totalItems > 0) {
            b.classList.remove("d-none");
        } else {
            b.classList.add("d-none");
        }
    });
}

// Barra superior con estado del usuario
function actualizarHeaderUsuario() {
    let contenedor = document.getElementById("header-user-area");
    if (!contenedor) return;

    let usuario = getCurrentUser();
    let esSitioJuegos = window.location.pathname.includes("Sitio-Juegos");
    let ruta = esSitioJuegos ? "../" : "";

    if (!usuario) {
        contenedor.innerHTML = `
            <a href="${ruta}Login.html" class="btn btn-outline-light me-2">Iniciar Sesión</a>
            <a href="${ruta}Sign-up.html" class="btn btn-morado">Registrarse</a>
        `;
        return;
    }

    let botonAdmin = "";
    if (usuario.rol === "Administrador" || usuario.rol === "Vendedor") {
        botonAdmin = `<a href="${ruta}admin.html" class="btn btn-sm btn-outline-info me-2 fw-bold">Panel Admin</a>`;
    }

    contenedor.innerHTML = `
        <span class="text-light me-2 small">Hola, <strong>${usuario.nombre}</strong></span>
        ${botonAdmin}
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="cerrarSesion('${ruta}')">Cerrar Sesión</button>
    `;
}

function cerrarSesion(ruta = "") {
    logoutUser();
    window.location.href = ruta + "Index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarBadgeCarrito();
    actualizarHeaderUsuario();
});

