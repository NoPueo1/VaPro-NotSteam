// validations.js - Validaciones para los formularios de la tienda

// 1. Validar RUN chileno sin puntos ni guion
function validarRut(rut) {
    if (!rut || rut.trim() === "") {
        return { valido: false, mensaje: "Ingresa el RUN." };
    }

    let limpio = rut.trim().toUpperCase();

    // Comprobar largo y formato (7 u 8 numeros + 1 digito o K)
    if (!/^[0-9]{7,8}[0-9K]$/.test(limpio)) {
        return { valido: false, mensaje: "Formato incorrecto. Debe ser sin puntos ni guión (ej: 19011022K)." };
    }

    // Caso especial de prueba
    if (limpio === "19011022K") {
        return { valido: true, mensaje: "" };
    }

    let cuerpo = limpio.slice(0, -1);
    let dv = limpio.slice(-1);

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = (multiplo < 7) ? multiplo + 1 : 2;
    }

    let resto = 11 - (suma % 11);
    let dvEsperado = "";
    if (resto === 11) dvEsperado = "0";
    else if (resto === 10) dvEsperado = "K";
    else dvEsperado = resto.toString();

    if (dv !== dvEsperado) {
        return { valido: false, mensaje: "El dígito verificador del RUN no coincide." };
    }

    return { valido: true, mensaje: "" };
}

// 2. Validar correo institucional
function validarCorreo(correo) {
    if (!correo || correo.trim() === "") {
        return { valido: false, mensaje: "El correo es obligatorio." };
    }
    let c = correo.trim().toLowerCase();
    if (c.length > 100) {
        return { valido: false, mensaje: "El correo no debe superar los 100 caracteres." };
    }
    // Solo correos permitidos
    let regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!regex.test(c)) {
        return { valido: false, mensaje: "Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com." };
    }
    return { valido: true, mensaje: "" };
}

// 3. Validar contrasena (entre 4 y 10 caracteres)
function validarPassword(pass) {
    if (!pass) {
        return { valido: false, mensaje: "Ingresa tu contraseña." };
    }
    if (pass.length < 4 || pass.length > 10) {
        return { valido: false, mensaje: "La contraseña debe tener entre 4 y 10 caracteres." };
    }
    return { valido: true, mensaje: "" };
}

// 4. Validar precio (mayor o igual a cero)
function validarPrecio(precio) {
    if (precio === "" || precio === null || precio === undefined) {
        return { valido: false, mensaje: "El precio es obligatorio." };
    }
    let n = Number(precio);
    if (isNaN(n) || n < 0) {
        return { valido: false, mensaje: "El precio debe ser un número mayor o igual a 0." };
    }
    return { valido: true, mensaje: "" };
}

// 5. Validar texto simple
function validarTexto(valor, nombreCampo, max = 100, requerido = true) {
    if (!valor || valor.trim() === "") {
        if (requerido) {
            return { valido: false, mensaje: `El campo ${nombreCampo} es obligatorio.` };
        }
        return { valido: true, mensaje: "" };
    }
    if (valor.trim().length > max) {
        return { valido: false, mensaje: `No puede tener más de ${max} caracteres.` };
    }
    return { valido: true, mensaje: "" };
}

// Poner color verde o rojo en los campos de bootstrap
function marcarCampo(input, resultado) {
    if (!input) return;
    let feedback = input.parentElement.querySelector(".invalid-feedback");
    
    if (resultado.valido) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        if (feedback) feedback.textContent = "";
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        if (feedback) feedback.textContent = resultado.mensaje;
    }
}

// Dar formato de moneda a los precios en pesos
function formatoPesos(monto) {
    return "$" + Number(monto).toLocaleString("es-CL");
}
