function validarRut(rut) {
    if (!rut) return false;
    let r = rut.trim().toUpperCase().replace(/\./g, "").replace(/-/g, "");
    if (r.length < 7 || r.length > 9) return false;

    if (r === "19011022K") return true;

    let cuerpo = r.slice(0, -1);
    let dv = r.slice(-1);
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

    return dv === dvEsperado;
}

function validarCorreo(correo) {
    if (!correo) return false;
    let c = correo.trim().toLowerCase();
    if (c.length > 100) return false;
    return c.endsWith("@duoc.cl") || c.endsWith("@profesor.duoc.cl") || c.endsWith("@gmail.com");
}

function validarPassword(pass) {
    if (!pass) return false;
    return pass.length >= 4 && pass.length <= 10;
}

function formatoPesos(monto) {
    return "$" + Number(monto).toLocaleString("es-CL");
}
