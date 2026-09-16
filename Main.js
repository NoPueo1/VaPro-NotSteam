const juegos = [
    { titulo: "Cyberpunk 2099", img: "Assets/juegos/cyberpunk2099.png", precio: "$29.99", etiquetas: ["Acción", "RPG"] },
    { titulo: "Pickcraft 2", img: "Assets/juegos/pickcraft2.png", precio: "$14.99", etiquetas: ["Aventura", "Indie"] },
    { titulo: "Resident Good 4", img: "Assets/juegos/residentgood4.png", precio: "$39.99", etiquetas: ["Horror", "Supervivencia"] },
    { titulo: "Fifa 3000", img: "Assets/juegos/fifa3000.png", precio: "$59.99", etiquetas: ["Deportes"] },
    { titulo: "Juego 5", img: "Assets/juegos/placeholder.jpg", precio: "Gratis", etiquetas: ["Estrategia"] },
    { titulo: "Juego 6", img: "Assets/juegos/placeholder.jpg", precio: "$9.99", etiquetas: ["Casual"] },
    { titulo: "Juego 7", img: "Assets/juegos/placeholder.jpg", precio: "$19.99", etiquetas: ["Acción"] },
    { titulo: "Juego 8", img: "Assets/juegos/placeholder.jpg", precio: "$4.99", etiquetas: ["Indie"] },
    { titulo: "Juego 9", img: "Assets/juegos/placeholder.jpg", precio: "$29.99", etiquetas: "RPG" },
    { titulo: "Juego 10", img: "Assets/juegos/placeholder.jpg", precio: "$14.99", etiquetas: ["Aventura"] },
    { titulo: "Juego 11", img: "Assets/juegos/placeholder.jpg", precio: "$39.99", etiquetas: ["Horror"] },
    { titulo: "Juego 12", img: "Assets/juegos/placeholder.jpg", precio: "$59.99", etiquetas: ["Deportes"] }
];

const contenedor = document.getElementById('galeria-juegos');

juegos.forEach(juego => {
    let badgesHTML = '';
    
    if (juego.etiquetas) {
        juego.etiquetas.forEach(etiqueta => {
            badgesHTML += `<span class="badge bg-secondary me-1">${etiqueta}</span>`;
        });
    }

    const tarjeta = `
        <div class="col">
            <div class="card h-100 game-card bg-dark text-white border-0">
                <img src="${juego.img}" class="card-img-top" alt="${juego.titulo}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title fw-bold text-truncate">${juego.titulo}</h6>
                    <div class="mb-2">
                        ${badgesHTML}
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="fs-5 fw-semibold">${juego.precio}</span>
                        <button class="btn btn-sm btn-outline-light">Comprar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    contenedor.innerHTML += tarjeta;
});