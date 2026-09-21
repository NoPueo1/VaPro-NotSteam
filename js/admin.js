// admin.js - Logica del panel de administracion para juegos y usuarios

// Proteger vistas del panel: acceso para Administrador y Vendedor
let usuarioSesion = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
if (!usuarioSesion || (usuarioSesion.rol !== "Administrador" && usuarioSesion.rol !== "Vendedor")) {
    alert("Debes iniciar sesión como Administrador.");
    window.location.href = "Login.html";
}

// Si es Vendedor, restringir acceso a usuarios
if (usuarioSesion && usuarioSesion.rol === "Vendedor") {
    if (window.location.pathname.includes("admin-usuarios.html")) {
        alert("Acceso denegado. Los vendedores solo pueden gestionar productos.");
        window.location.href = "admin-juegos.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Ocultar acceso a usuarios si el rol es Vendedor
    if (usuarioSesion && usuarioSesion.rol === "Vendedor") {
        document.querySelectorAll("a[href='admin-usuarios.html']").forEach(el => {
            el.style.display = "none";
        });
    }

    if (document.getElementById("tabla-juegos-body") || document.getElementById("vista-juegos")) {
        iniciarMantenedorJuegos();
    }
    if (document.getElementById("tabla-usuarios-body") || document.getElementById("vista-usuarios")) {
        iniciarMantenedorUsuarios();
    }
});

// Mantenedor de Juegos
let imagenActualBase64 = "";

function iniciarMantenedorJuegos() {
    dibujarTablaJuegos();

    // Buscador por nombre o código
    let buscar = document.getElementById("buscar-juego");
    if (buscar) {
        buscar.addEventListener("keyup", () => {
            let texto = buscar.value.toLowerCase().trim();
            let lista = getJuegos();
            let filtrados = lista.filter(j => 
                j.nombre.toLowerCase().includes(texto) || 
                (j.codigo && j.codigo.toLowerCase().includes(texto)) ||
                (j.categoria && j.categoria.toLowerCase().includes(texto)) ||
                (j.descripcion && j.descripcion.toLowerCase().includes(texto))
            );
            dibujarTablaJuegos(filtrados);
        });
    }

    // Cargar imagen desde archivo o link
    let inputFile = document.getElementById("juego-file");
    let inputUrl = document.getElementById("juego-url");
    let previewImg = document.getElementById("juego-preview");

    if (inputFile) {
        inputFile.addEventListener("change", function() {
            if (this.files && this.files[0]) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    imagenActualBase64 = e.target.result;
                    if (previewImg) {
                        previewImg.src = imagenActualBase64;
                        previewImg.classList.remove("d-none");
                    }
                    if (inputUrl) inputUrl.value = "";
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    if (inputUrl) {
        inputUrl.addEventListener("input", function() {
            let url = this.value.trim();
            if (url !== "") {
                imagenActualBase64 = url;
                if (previewImg) {
                    previewImg.src = url;
                    previewImg.classList.remove("d-none");
                }
                if (inputFile) inputFile.value = "";
            }
        });
    }

    // Formulario de juego
    let form = document.getElementById("form-juego");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarJuego();
        });
    }
}

function dibujarTablaJuegos(lista = null) {
    let juegos = lista || getJuegos();
    let tbody = document.getElementById("tabla-juegos-body");
    let badge = document.getElementById("badge-juegos-count");

    if (badge) badge.textContent = `${juegos.length} registrados`;
    if (!tbody) return;

    if (juegos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-white-50 py-4">No hay juegos en la lista.</td></tr>`;
        return;
    }

    let filas = "";
    for (let i = 0; i < juegos.length; i++) {
        let j = juegos[i];
        let precioFmt = (typeof formatoPesos === "function") ? formatoPesos(j.precio) : "$" + j.precio;
        let codigo = j.codigo || j.id;
        let cat = j.categoria || (j.etiquetas ? j.etiquetas[0] : "General");
        let stock = (j.stock !== undefined) ? j.stock : 10;
        let stockCritico = (j.stockCritico !== undefined) ? j.stockCritico : 0;
        let alertaStock = (stock <= stockCritico) ? `<span class="badge bg-danger ms-1">Crítico</span>` : "";

        filas += `
            <tr>
                <td style="width: 60px;">
                    <img src="${j.imagen}" alt="${j.nombre}" class="foto-juego-thumb" onerror="this.src='Assets/logo.png'">
                </td>
                <td><code class="text-warning bg-black bg-opacity-50 px-2 py-1 rounded">${codigo}</code></td>
                <td>
                    <strong class="text-white">${j.nombre}</strong>
                </td>
                <td>
                    <span class="badge bg-secondary">${cat}</span>
                </td>
                <td>
                    <span class="text-warning fw-bold">${precioFmt}</span>
                </td>
                <td>
                    <span class="text-light">${stock}</span> ${alertaStock}
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info me-1" onclick="abrirModalEditarJuego('${j.id}')">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarJuego('${j.id}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }
    tbody.innerHTML = filas;
}

function abrirModalNuevoJuego() {
    let form = document.getElementById("form-juego");
    if (form) form.reset();

    document.getElementById("juego-id").value = "";
    document.getElementById("modalJuegoTitulo").textContent = "Nuevo Juego";
    imagenActualBase64 = "";

    let preview = document.getElementById("juego-preview");
    if (preview) {
        preview.src = "";
        preview.classList.add("d-none");
    }

    document.querySelectorAll("#form-juego .form-control, #form-juego .form-select").forEach(el => {
        el.classList.remove("is-valid", "is-invalid");
    });

    let modal = new bootstrap.Modal(document.getElementById("modalJuego"));
    modal.show();
}

function abrirModalEditarJuego(id) {
    let juego = getJuegoById(id);
    if (!juego) return;

    document.getElementById("modalJuegoTitulo").textContent = "Editar Juego";
    document.getElementById("juego-id").value = juego.id;
    document.getElementById("juego-codigo").value = juego.codigo || juego.id;
    document.getElementById("juego-categoria").value = juego.categoria || (juego.etiquetas ? juego.etiquetas[0] : "");
    document.getElementById("juego-nombre").value = juego.nombre;
    document.getElementById("juego-descripcion").value = juego.descripcion || "";
    document.getElementById("juego-precio").value = juego.precio;
    document.getElementById("juego-stock").value = (juego.stock !== undefined) ? juego.stock : 10;
    document.getElementById("juego-stock-critico").value = (juego.stockCritico !== undefined) ? juego.stockCritico : 3;

    imagenActualBase64 = juego.imagen || "";
    let preview = document.getElementById("juego-preview");
    if (preview && imagenActualBase64) {
        preview.src = imagenActualBase64;
        preview.classList.remove("d-none");
    }

    document.querySelectorAll("#form-juego .form-control, #form-juego .form-select").forEach(el => {
        el.classList.remove("is-valid", "is-invalid");
    });

    let modal = new bootstrap.Modal(document.getElementById("modalJuego"));
    modal.show();
}

function guardarJuego() {
    let id = document.getElementById("juego-id").value;
    let codigoInput = document.getElementById("juego-codigo");
    let categoriaSelect = document.getElementById("juego-categoria");
    let nombreInput = document.getElementById("juego-nombre");
    let descInput = document.getElementById("juego-descripcion");
    let precioInput = document.getElementById("juego-precio");
    let stockInput = document.getElementById("juego-stock");
    let stockCriticoInput = document.getElementById("juego-stock-critico");

    let vCodigo = { valido: true, mensaje: "" };
    if (!codigoInput.value || codigoInput.value.trim().length < 3) {
        vCodigo = { valido: false, mensaje: "El código debe tener al menos 3 caracteres." };
    }
    marcarCampo(codigoInput, vCodigo);

    let vCategoria = { valido: !!categoriaSelect.value, mensaje: "Selecciona una categoría." };
    marcarCampo(categoriaSelect, vCategoria);

    let vNombre = validarTexto(nombreInput.value, "Nombre del juego", 100, true);
    marcarCampo(nombreInput, vNombre);

    let vDesc = validarTexto(descInput.value, "Descripción", 500, false);
    marcarCampo(descInput, vDesc);

    let vPrecio = validarPrecio(precioInput.value);
    marcarCampo(precioInput, vPrecio);

    let vStock = { valido: true, mensaje: "" };
    let stockVal = Number(stockInput.value);
    if (stockInput.value === "" || isNaN(stockVal) || stockVal < 0 || !Number.isInteger(stockVal)) {
        vStock = { valido: false, mensaje: "El stock debe ser un número entero mayor o igual a 0." };
    }
    marcarCampo(stockInput, vStock);

    let vStockCritico = { valido: true, mensaje: "" };
    if (stockCriticoInput.value !== "") {
        let scVal = Number(stockCriticoInput.value);
        if (isNaN(scVal) || scVal < 0 || !Number.isInteger(scVal)) {
            vStockCritico = { valido: false, mensaje: "El stock crítico debe ser un número entero mayor o igual a 0." };
        }
    }
    marcarCampo(stockCriticoInput, vStockCritico);

    if (!imagenActualBase64) {
        imagenActualBase64 = "Assets/logo.png";
    }

    if (!vCodigo.valido || !vCategoria.valido || !vNombre.valido || !vDesc.valido || !vPrecio.valido || !vStock.valido || !vStockCritico.valido) {
        return;
    }

    let juego = {
        id: id || undefined,
        codigo: codigoInput.value.trim().toUpperCase(),
        categoria: categoriaSelect.value,
        nombre: nombreInput.value.trim(),
        descripcion: descInput.value.trim(),
        precio: Number(precioInput.value),
        stock: parseInt(stockInput.value, 10),
        stockCritico: stockCriticoInput.value !== "" ? parseInt(stockCriticoInput.value, 10) : 0,
        imagen: imagenActualBase64
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

    if (confirm(`¿Seguro que deseas eliminar el juego "${juego.nombre}"?`)) {
        deleteJuego(id);
        dibujarTablaJuegos();
    }
}

// Mantenedor de Usuarios
function iniciarMantenedorUsuarios() {
    dibujarTablaUsuarios();
    cargarSelectRegiones();

    let buscar = document.getElementById("buscar-usuario");
    if (buscar) {
        buscar.addEventListener("keyup", () => {
            let texto = buscar.value.toLowerCase().trim();
            let lista = getUsuarios();
            let filtrados = lista.filter(u => 
                u.run.toLowerCase().includes(texto) || 
                u.nombre.toLowerCase().includes(texto) ||
                u.apellidos.toLowerCase().includes(texto) ||
                u.correo.toLowerCase().includes(texto)
            );
            dibujarTablaUsuarios(filtrados);
        });
    }

    let regionSelect = document.getElementById("usuario-region");
    if (regionSelect) {
        regionSelect.addEventListener("change", (e) => {
            cargarSelectComunas(e.target.value);
        });
    }

    let form = document.getElementById("form-usuario");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarUsuario();
        });
    }
}

function cargarSelectRegiones() {
    let sel = document.getElementById("usuario-region");
    if (!sel || typeof REGIONES_CHILE === "undefined") return;

    let opciones = `<option value="">Selecciona una región...</option>`;
    for (let i = 0; i < REGIONES_CHILE.length; i++) {
        let r = REGIONES_CHILE[i];
        opciones += `<option value="${r.id}">${r.nombre}</option>`;
    }
    sel.innerHTML = opciones;
}

function cargarSelectComunas(regionId, comunaSeleccionada = "") {
    let sel = document.getElementById("usuario-comuna");
    if (!sel || typeof REGIONES_CHILE === "undefined") return;

    if (!regionId) {
        sel.innerHTML = `<option value="">Primero selecciona una región</option>`;
        sel.disabled = true;
        return;
    }

    let region = REGIONES_CHILE.find(r => r.id === regionId);
    if (!region) return;

    sel.disabled = false;
    let opciones = `<option value="">Selecciona una comuna...</option>`;
    for (let i = 0; i < region.comunas.length; i++) {
        let c = region.comunas[i];
        let selAttr = (c === comunaSeleccionada) ? "selected" : "";
        opciones += `<option value="${c}" ${selAttr}>${c}</option>`;
    }
    sel.innerHTML = opciones;
}

function dibujarTablaUsuarios(lista = null) {
    let usuarios = lista || getUsuarios();
    let tbody = document.getElementById("tabla-usuarios-body");
    let badge = document.getElementById("badge-usuarios-count");

    if (badge) badge.textContent = `${usuarios.length} registrados`;
    if (!tbody) return;

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-white-50 py-4">No hay usuarios registrados.</td></tr>`;
        return;
    }

    let filas = "";
    for (let i = 0; i < usuarios.length; i++) {
        let u = usuarios[i];
        let rolBadge = "bg-primary";
        if (u.rol === "Administrador") rolBadge = "bg-danger";
        else if (u.rol === "Vendedor") rolBadge = "bg-warning text-dark";

        filas += `
            <tr>
                <td><code class="text-warning bg-black bg-opacity-50 px-2 py-1 rounded">${u.run}</code></td>
                <td>
                    <strong class="text-white">${u.nombre} ${u.apellidos}</strong><br>
                    <small class="text-white-50">${u.direccion || ""}</small>
                </td>
                <td class="text-light">${u.correo}</td>
                <td>
                    <span class="badge ${rolBadge}">${u.rol}</span>
                </td>
                <td class="text-light">${u.comuna || "N/A"}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info me-1" onclick="abrirModalEditarUsuario('${u.run}')">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${u.run}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
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

    document.querySelectorAll("#form-usuario .form-control, #form-usuario .form-select").forEach(el => {
        el.classList.remove("is-valid", "is-invalid");
    });

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

    document.querySelectorAll("#form-usuario .form-control, #form-usuario .form-select").forEach(el => {
        el.classList.remove("is-valid", "is-invalid");
    });

    let modal = new bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
}

function guardarUsuario() {
    let esEdicion = document.getElementById("usuario-es-edicion").value === "1";
    let runInput = document.getElementById("usuario-run");
    let nombreInput = document.getElementById("usuario-nombre");
    let apellidosInput = document.getElementById("usuario-apellidos");
    let correoInput = document.getElementById("usuario-correo");
    let rolSelect = document.getElementById("usuario-rol");
    let regionSelect = document.getElementById("usuario-region");
    let comunaSelect = document.getElementById("usuario-comuna");
    let direccionInput = document.getElementById("usuario-direccion");
    let fechaInput = document.getElementById("usuario-fecha");

    let vRun = { valido: true, mensaje: "" };
    if (!esEdicion) {
        vRun = validarRut(runInput.value);
        if (vRun.valido && getUsuarioByRun(runInput.value)) {
            vRun = { valido: false, mensaje: "Este RUN ya está registrado." };
        }
        marcarCampo(runInput, vRun);
    }

    let vNombre = validarTexto(nombreInput.value, "Nombre", 50, true);
    marcarCampo(nombreInput, vNombre);

    let vApellidos = validarTexto(apellidosInput.value, "Apellidos", 100, true);
    marcarCampo(apellidosInput, vApellidos);

    let vCorreo = validarCorreo(correoInput.value);
    marcarCampo(correoInput, vCorreo);

    let vRol = { valido: !!rolSelect.value, mensaje: "Selecciona un rol." };
    marcarCampo(rolSelect, vRol);

    let vRegion = { valido: !!regionSelect.value, mensaje: "Selecciona una región." };
    marcarCampo(regionSelect, vRegion);

    let vComuna = { valido: !!comunaSelect.value, mensaje: "Selecciona una comuna." };
    marcarCampo(comunaSelect, vComuna);

    let vDireccion = validarTexto(direccionInput.value, "Dirección", 300, true);
    marcarCampo(direccionInput, vDireccion);

    if (!vRun.valido || !vNombre.valido || !vApellidos.valido || 
        !vCorreo.valido || !vRol.valido || !vRegion.valido || 
        !vComuna.valido || !vDireccion.valido) {
        return;
    }

    let usuario = {
        run: runInput.value.trim().toUpperCase(),
        nombre: nombreInput.value.trim(),
        apellidos: apellidosInput.value.trim(),
        correo: correoInput.value.trim(),
        fechaNacimiento: fechaInput.value || "",
        rol: rolSelect.value,
        region: regionSelect.value,
        comuna: comunaSelect.value,
        direccion: direccionInput.value.trim()
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

    if (confirm(`¿Seguro que deseas eliminar al usuario ${u.nombre} ${u.apellidos}?`)) {
        deleteUsuario(run);
        dibujarTablaUsuarios();
    }
}
