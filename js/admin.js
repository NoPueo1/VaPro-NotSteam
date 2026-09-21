// admin.js - Logica del panel de administracion para juegos y usuarios

// Proteger vistas del panel: solo acceso para Administrador
let usuarioSesion = (typeof getCurrentUser === "function") ? getCurrentUser() : null;
if (!usuarioSesion || usuarioSesion.rol !== "Administrador") {
    alert("Debes iniciar sesión como Administrador.");
    window.location.href = "Login.html";
}

document.addEventListener("DOMContentLoaded", () => {
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

    // Buscador por nombre
    let buscar = document.getElementById("buscar-juego");
    if (buscar) {
        buscar.addEventListener("keyup", () => {
            let texto = buscar.value.toLowerCase().trim();
            let lista = getJuegos();
            let filtrados = lista.filter(j => 
                j.nombre.toLowerCase().includes(texto) || 
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
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-white-50 py-4">No hay juegos en la lista.</td></tr>`;
        return;
    }

    let filas = "";
    for (let i = 0; i < juegos.length; i++) {
        let j = juegos[i];
        let precioFmt = (typeof formatoPesos === "function") ? formatoPesos(j.precio) : "$" + j.precio;
        let desc = j.descripcion || "Sin descripción";

        filas += `
            <tr>
                <td style="width: 60px;">
                    <img src="${j.imagen}" alt="${j.nombre}" class="foto-juego-thumb" onerror="this.src='Assets/logo.png'">
                </td>
                <td>
                    <strong class="text-white">${j.nombre}</strong><br>
                    <small class="text-white-50">${j.id}</small>
                </td>
                <td>
                    <span class="text-light">${desc}</span>
                </td>
                <td>
                    <span class="text-warning fw-bold">${precioFmt}</span>
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

    document.querySelectorAll("#form-juego .form-control").forEach(el => {
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
    document.getElementById("juego-nombre").value = juego.nombre;
    document.getElementById("juego-descripcion").value = juego.descripcion || "";
    document.getElementById("juego-precio").value = juego.precio;

    imagenActualBase64 = juego.imagen || "";
    let preview = document.getElementById("juego-preview");
    if (preview && imagenActualBase64) {
        preview.src = imagenActualBase64;
        preview.classList.remove("d-none");
    }

    document.querySelectorAll("#form-juego .form-control").forEach(el => {
        el.classList.remove("is-valid", "is-invalid");
    });

    let modal = new bootstrap.Modal(document.getElementById("modalJuego"));
    modal.show();
}

function guardarJuego() {
    let id = document.getElementById("juego-id").value;
    let nombreInput = document.getElementById("juego-nombre");
    let descInput = document.getElementById("juego-descripcion");
    let precioInput = document.getElementById("juego-precio");

    let vNombre = validarTexto(nombreInput.value, "Nombre del juego", 100, true);
    marcarCampo(nombreInput, vNombre);

    let vDesc = validarTexto(descInput.value, "Descripción", 500, false);
    marcarCampo(descInput, vDesc);

    let vPrecio = validarPrecio(precioInput.value);
    marcarCampo(precioInput, vPrecio);

    if (!imagenActualBase64) {
        imagenActualBase64 = "Assets/logo.png";
    }

    if (!vNombre.valido || !vDesc.valido || !vPrecio.valido) {
        return;
    }

    let juego = {
        id: id || undefined,
        nombre: nombreInput.value.trim(),
        descripcion: descInput.value.trim(),
        precio: Number(precioInput.value),
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
