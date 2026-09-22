let usuarioSesion = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
if (!usuarioSesion || (usuarioSesion.rol !== "Administrador" && usuarioSesion.rol !== "Vendedor")) {
    alert("Debes iniciar sesión como Administrador.");
    window.location.href = "Login.html";
}

if (usuarioSesion && usuarioSesion.rol === "Vendedor") {
    if (window.location.pathname.includes("admin-usuarios.html")) {
        alert("Acceso denegado. Los vendedores solo pueden gestionar productos.");
        window.location.href = "admin-juegos.html";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    
    if (usuarioSesion && usuarioSesion.rol === "Vendedor") {
        document.querySelectorAll("a[href='admin-usuarios.html']").forEach(function(el) {
            el.style.display = "none";
        });
    }

    if (document.getElementById("tabla-juegos-body")) {
        iniciarMantenedorJuegos();
    }
    if (document.getElementById("tabla-usuarios-body")) {
        iniciarMantenedorUsuarios();
    }
});

function iniciarMantenedorJuegos() {
    dibujarTablaJuegos();

    let buscar = document.getElementById("buscar-juego");
    if (buscar) {
        buscar.addEventListener("keyup", function() {
            let texto = buscar.value.toLowerCase().trim();
            let lista = getJuegos();
            let filtrados = lista.filter(function(j) {
                return j.nombre.toLowerCase().includes(texto) || (j.codigo && j.codigo.toLowerCase().includes(texto));
            });
            dibujarTablaJuegos(filtrados);
        });
    }

    let form = document.getElementById("form-juego");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            guardarJuego();
        });
    }
}

function dibujarTablaJuegos(lista) {
    let juegos = lista || getJuegos();
    let tbody = document.getElementById("tabla-juegos-body");
    let badge = document.getElementById("badge-juegos-count");

    if (badge) badge.textContent = juegos.length + " registrados";
    if (!tbody) return;

    if (juegos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-white-50 py-4">No hay juegos en la lista.</td></tr>';
        return;
    }

    let filas = "";
    for (let i = 0; i < juegos.length; i++) {
        let j = juegos[i];
        let precioFmt = (typeof formatoPesos === "function") ? formatoPesos(j.precio) : "$" + j.precio;
        let codigo = j.codigo || j.id;
        let cat = j.categoria || "General";
        let stock = (j.stock !== undefined) ? j.stock : 10;
        let stockCritico = (j.stockCritico !== undefined) ? j.stockCritico : 0;
        let alertaStock = (stock <= stockCritico) ? '<span class="badge bg-danger ms-1">Crítico</span>' : '';

        filas += '<tr>' +
            '<td style="width: 60px;"><img src="' + j.imagen + '" alt="' + j.nombre + '" class="foto-juego-thumb" onerror="this.src=\'Assets/logo.png\'"></td>' +
            '<td><code class="text-warning bg-black bg-opacity-50 px-2 py-1 rounded">' + codigo + '</code></td>' +
            '<td><strong class="text-white">' + j.nombre + '</strong></td>' +
            '<td><span class="badge bg-secondary">' + cat + '</span></td>' +
            '<td><span class="text-warning fw-bold">' + precioFmt + '</span></td>' +
            '<td><span class="text-light">' + stock + '</span> ' + alertaStock + '</td>' +
            '<td class="text-end">' +
                '<button class="btn btn-sm btn-outline-info me-1" onclick="abrirModalEditarJuego(\'' + j.id + '\')">Editar</button>' +
                '<button class="btn btn-sm btn-outline-danger" onclick="eliminarJuego(\'' + j.id + '\')">Eliminar</button>' +
            '</td>' +
        '</tr>';
    }
    tbody.innerHTML = filas;
}

function abrirModalNuevoJuego() {
    let form = document.getElementById("form-juego");
    if (form) form.reset();
    document.getElementById("juego-id").value = "";
    document.getElementById("modalJuegoTitulo").textContent = "Nuevo Juego";

    let modal = new bootstrap.Modal(document.getElementById("modalJuego"));
    modal.show();
}

function abrirModalEditarJuego(id) {
    let juego = getJuegoById(id);
    if (!juego) return;

    document.getElementById("modalJuegoTitulo").textContent = "Editar Juego";
    document.getElementById("juego-id").value = juego.id;
    document.getElementById("juego-codigo").value = juego.codigo || juego.id;
    document.getElementById("juego-categoria").value = juego.categoria || "";
    document.getElementById("juego-nombre").value = juego.nombre;
    document.getElementById("juego-descripcion").value = juego.descripcion || "";
    document.getElementById("juego-precio").value = juego.precio;
    document.getElementById("juego-stock").value = (juego.stock !== undefined) ? juego.stock : 10;
    document.getElementById("juego-stock-critico").value = (juego.stockCritico !== undefined) ? juego.stockCritico : 3;
    document.getElementById("juego-url").value = juego.imagen || "";

    let modal = new bootstrap.Modal(document.getElementById("modalJuego"));
    modal.show();
}

function guardarJuego() {
    let id = document.getElementById("juego-id").value;
    let codigo = document.getElementById("juego-codigo").value.trim().toUpperCase();
    let categoria = document.getElementById("juego-categoria").value;
    let nombre = document.getElementById("juego-nombre").value.trim();
    let descripcion = document.getElementById("juego-descripcion").value.trim();
    let precio = document.getElementById("juego-precio").value;
    let stock = document.getElementById("juego-stock").value;
    let stockCritico = document.getElementById("juego-stock-critico").value;
    let imagen = document.getElementById("juego-url").value.trim() || "Assets/logo.png";

    if (codigo.length < 3) {
        alert("El código del producto debe tener al menos 3 caracteres.");
        return;
    }
    if (!categoria) {
        alert("Debes seleccionar una categoría.");
        return;
    }
    if (!nombre) {
        alert("Debes ingresar el nombre del juego.");
        return;
    }
    if (precio === "" || Number(precio) < 0) {
        alert("El precio debe ser mayor o igual a 0.");
        return;
    }
    if (stock === "" || Number(stock) < 0) {
        alert("El stock debe ser un número entero mayor o igual a 0.");
        return;
    }

    let juego = {
        id: id || undefined,
        codigo: codigo,
        categoria: categoria,
        nombre: nombre,
        descripcion: descripcion,
        precio: Number(precio),
        stock: parseInt(stock, 10),
        stockCritico: stockCritico ? parseInt(stockCritico, 10) : 0,
        imagen: imagen
    };

    saveJuego(juego);

    let modalEl = document.getElementById("modalJuego");
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    dibujarTablaJuegos();
    alert("Juego guardado correctamente.");
}

function eliminarJuego(id) {
    let juego = getJuegoById(id);
    if (!juego) return;

    if (confirm("¿Seguro que deseas eliminar el juego \"" + juego.nombre + "\"?")) {
        deleteJuego(id);
        dibujarTablaJuegos();
    }
}

function iniciarMantenedorUsuarios() {
    dibujarTablaUsuarios();
    cargarSelectRegiones();

    let buscar = document.getElementById("buscar-usuario");
    if (buscar) {
        buscar.addEventListener("keyup", function() {
            let texto = buscar.value.toLowerCase().trim();
            let lista = getUsuarios();
            let filtrados = lista.filter(function(u) {
                return u.run.toLowerCase().includes(texto) || u.nombre.toLowerCase().includes(texto) || u.apellidos.toLowerCase().includes(texto);
            });
            dibujarTablaUsuarios(filtrados);
        });
    }

    let regionSelect = document.getElementById("usuario-region");
    if (regionSelect) {
        regionSelect.addEventListener("change", function(e) {
            cargarSelectComunas(e.target.value);
        });
    }

    let form = document.getElementById("form-usuario");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            guardarUsuario();
        });
    }
}

function cargarSelectRegiones() {
    let sel = document.getElementById("usuario-region");
    if (!sel || typeof REGIONES_CHILE === "undefined") return;

    let opciones = '<option value="">Selecciona una región...</option>';
    for (let i = 0; i < REGIONES_CHILE.length; i++) {
        let r = REGIONES_CHILE[i];
        opciones += '<option value="' + r.id + '">' + r.nombre + '</option>';
    }
    sel.innerHTML = opciones;
}

function cargarSelectComunas(regionId, comunaSeleccionada) {
    let sel = document.getElementById("usuario-comuna");
    if (!sel || typeof REGIONES_CHILE === "undefined") return;

    if (!regionId) {
        sel.innerHTML = '<option value="">Primero selecciona una región</option>';
        sel.disabled = true;
        return;
    }

    let region = REGIONES_CHILE.find(function(r) { return r.id === regionId; });
    if (!region) return;

    sel.disabled = false;
    let opciones = '<option value="">Selecciona una comuna...</option>';
    for (let i = 0; i < region.comunas.length; i++) {
        let c = region.comunas[i];
        let selAttr = (c === comunaSeleccionada) ? " selected" : "";
        opciones += '<option value="' + c + '"' + selAttr + '>' + c + '</option>';
    }
    sel.innerHTML = opciones;
}

function dibujarTablaUsuarios(lista) {
    let usuarios = lista || getUsuarios();
    let tbody = document.getElementById("tabla-usuarios-body");
    let badge = document.getElementById("badge-usuarios-count");

    if (badge) badge.textContent = usuarios.length + " registrados";
    if (!tbody) return;

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-white-50 py-4">No hay usuarios registrados.</td></tr>';
        return;
    }

    let filas = "";
    for (let i = 0; i < usuarios.length; i++) {
        let u = usuarios[i];
        let rolBadge = "bg-primary";
        if (u.rol === "Administrador") rolBadge = "bg-danger";
        else if (u.rol === "Vendedor") rolBadge = "bg-warning text-dark";

        filas += '<tr>' +
            '<td><code class="text-warning bg-black bg-opacity-50 px-2 py-1 rounded">' + u.run + '</code></td>' +
            '<td><strong class="text-white">' + u.nombre + ' ' + u.apellidos + '</strong><br><small class="text-white-50">' + (u.direccion || "") + '</small></td>' +
            '<td class="text-light">' + u.correo + '</td>' +
            '<td><span class="badge ' + rolBadge + '">' + u.rol + '</span></td>' +
            '<td>' + (u.comuna || "N/A") + '</td>' +
            '<td class="text-end">' +
                '<button class="btn btn-sm btn-outline-info me-1" onclick="abrirModalEditarUsuario(\'' + u.run + '\')">Editar</button>' +
                '<button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(\'' + u.run + '\')">Eliminar</button>' +
            '</td>' +
        '</tr>';
    }
    tbody.innerHTML = filas;
}

function abrirModalNuevoUsuario() {
    let form = document.getElementById("form-usuario");
    if (form) form.reset();

    document.getElementById("modalUsuarioTitulo").textContent = "Nuevo Usuario";
    document.getElementById("usuario-es-edicion").value = "0";
    document.getElementById("usuario-run").disabled = false;
    cargarSelectComunas("");

    let modal = new bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
}

function abrirModalEditarUsuario(run) {
    let u = getUsuarioByRun(run);
    if (!u) return;

    document.getElementById("modalUsuarioTitulo").textContent = "Editar Usuario";
    document.getElementById("usuario-es-edicion").value = "1";

    let runInput = document.getElementById("usuario-run");
    runInput.value = u.run;
    runInput.disabled = true;

    document.getElementById("usuario-nombre").value = u.nombre;
    document.getElementById("usuario-apellidos").value = u.apellidos;
    document.getElementById("usuario-correo").value = u.correo;
    document.getElementById("usuario-fecha").value = u.fechaNacimiento || "";
    document.getElementById("usuario-rol").value = u.rol;
    document.getElementById("usuario-region").value = u.region || "";
    cargarSelectComunas(u.region || "", u.comuna || "");
    document.getElementById("usuario-direccion").value = u.direccion || "";

    let modal = new bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
}

function guardarUsuario() {
    let esEdicion = document.getElementById("usuario-es-edicion").value === "1";
    let run = document.getElementById("usuario-run").value.trim().toUpperCase();
    let rol = document.getElementById("usuario-rol").value;
    let nombre = document.getElementById("usuario-nombre").value.trim();
    let apellidos = document.getElementById("usuario-apellidos").value.trim();
    let correo = document.getElementById("usuario-correo").value.trim();
    let fecha = document.getElementById("usuario-fecha").value;
    let region = document.getElementById("usuario-region").value;
    let comuna = document.getElementById("usuario-comuna").value;
    let direccion = document.getElementById("usuario-direccion").value.trim();

    if (!esEdicion) {
        if (!validarRut(run)) {
            alert("El RUN no es válido. Debe ser sin puntos ni guión (ej: 19011022K).");
            return;
        }
        if (getUsuarioByRun(run)) {
            alert("Este RUN ya está registrado.");
            return;
        }
    }
    if (!rol) {
        alert("Debes seleccionar un rol.");
        return;
    }
    if (!nombre) {
        alert("Debes ingresar el nombre.");
        return;
    }
    if (!apellidos) {
        alert("Debes ingresar los apellidos.");
        return;
    }
    if (!validarCorreo(correo)) {
        alert("El correo debe ser institucional (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
        return;
    }
    if (!region) {
        alert("Debes seleccionar una región.");
        return;
    }
    if (!comuna) {
        alert("Debes seleccionar una comuna.");
        return;
    }
    if (!direccion) {
        alert("Debes ingresar una dirección.");
        return;
    }

    let usuario = {
        run: run,
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        fechaNacimiento: fecha,
        rol: rol,
        region: region,
        comuna: comuna,
        direccion: direccion
    };

    saveUsuario(usuario);

    let modalEl = document.getElementById("modalUsuario");
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    dibujarTablaUsuarios();
    alert("Usuario guardado con éxito.");
}

function eliminarUsuario(run) {
    let u = getUsuarioByRun(run);
    if (!u) return;

    if (confirm("¿Seguro que deseas eliminar al usuario " + u.nombre + " " + u.apellidos + "?")) {
        deleteUsuario(run);
        dibujarTablaUsuarios();
    }
}
