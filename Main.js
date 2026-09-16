// Main.js - Catalogo de juegos en la pagina principal
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('galeria-juegos');
    if (!contenedor) return;

    let listaJuegos = (typeof getJuegos === "function") ? getJuegos() : [];

    contenedor.innerHTML = '';
    listaJuegos.forEach(juego => {
        let precioTexto = (typeof formatoPesos === "function") ? formatoPesos(juego.precio) : "$" + juego.precio;
        let img = juego.imagen || 'Assets/logo.png';
        let titulo = juego.nombre || 'Juego';
        let desc = juego.descripcion || '';

        let badgesHTML = '';
        if (Array.isArray(juego.etiquetas)) {
            juego.etiquetas.forEach(tag => {
                badgesHTML += `<span class="badge bg-secondary me-1">${tag}</span>`;
            });
        }

        let enlaceDetalle = juego.enlace || `detalle-juego.html?id=${juego.id}`;

        const tarjeta = `
            <div class="col">
                <div class="card h-100 game-card bg-dark text-white border-0">
                    <a href="${enlaceDetalle}">
                        <img src="${img}" class="card-img-top" alt="${titulo}" style="height: 160px; object-fit: cover;" onerror="this.src='Assets/logo.png'">
                    </a>
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title fw-bold text-truncate mb-1">${titulo}</h6>
                        <div class="mb-2">
                            ${badgesHTML}
                        </div>
                        <p class="small text-white-50 text-truncate mb-2">${desc}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                            <span class="fs-6 fw-semibold text-light">${precioTexto}</span>
                            <div>
                                <a href="${enlaceDetalle}" class="btn btn-sm btn-outline-light me-1">
                                    Ver Detalle
                                </a>
                                <button class="btn btn-sm btn-morado" onclick="agregarAlCarrito('${juego.id}', 1)">
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });
});