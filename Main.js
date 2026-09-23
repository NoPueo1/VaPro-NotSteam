// Carga del catalogo: espera que el documento este listo para mostrar los productos
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('galeria-juegos');
    if (!contenedor) return;

    // Obtencion de datos: lee los juegos guardados en el almacenamiento local
    let listaJuegos = (typeof getJuegos === "function") ? getJuegos() : [];

    // Renderizado: limpia el contenedor y genera la tarjeta html de cada juego
    contenedor.innerHTML = '';
    listaJuegos.forEach(juego => {
        let precioTexto = (typeof formatoPesos === "function") ? formatoPesos(juego.precio) : "$" + juego.precio;
        let img = juego.imagen || 'Assets/logo.png';
        let titulo = juego.nombre || 'Juego';
        let desc = juego.descripcion || '';

        // Etiquetas: crea las insignias de categorias del juego
        let badgesHTML = '';
        if (Array.isArray(juego.etiquetas)) {
            juego.etiquetas.forEach(tag => {
                badgesHTML += `<span class="badge bg-secondary me-1">${tag}</span>`;
            });
        }

        let enlaceDetalle = juego.enlace || `detalle-juego.html?id=${juego.id}`;

        // Tarjeta html: estructura con imagen titulo precio y boton de compra
        const tarjeta = `
            <div class="col">
                <div class="card h-100 game-card bg-dark text-white border-0">
                    <a href="${enlaceDetalle}">
                        <img src="${img}" class="card-img-top" alt="${titulo}" style="height: 160px; object-fit: cover; width: 100%;" onerror="this.src='Assets/logo.png'">
                    </a>
                    <div class="card-body d-flex flex-column p-3">
                        <h6 class="card-title fw-bold text-truncate mb-2">
                            <a href="${enlaceDetalle}" class="text-white text-decoration-none">${titulo}</a>
                        </h6>
                        <div class="mb-2">
                            ${badgesHTML}
                        </div>
                        <p class="small text-white-50 text-truncate mb-3">${desc}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                            <span class="fs-6 fw-bold text-light">${precioTexto}</span>
                            <button class="btn btn-sm btn-morado px-3" onclick="agregarAlCarrito('${juego.id}', 1)">
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });
});
