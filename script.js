/* ==============================================================================
   FÁCIL EDICIÓN DE CATÁLOGO: MODIFICA ESTA SECCIÓN CUANDO QUIERAS
   - Copia una sección encerrada entre '{' y '},' y pégala para añadir uno nuevo.
   - Asegúrate de que las URL de imagen terminen en .jpg, .png, etc.
   - Usa géneros en minúsculas (shonen, seinen, isekai, romance) para el filtro.
   ============================================================================== */
   const CATALOGO = [
    {
        id: 1,
        titulo: "Jujutsu Kaisen - Vol. 1",
        genero: "shonen",
        precio: 8990,
        imagen: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/b/b5/Volume_1.png/revision/latest?cb=20180703131751&path-prefix=es" // Reemplaza por URL real si esta falla
    },
    {
        id: 2,
        titulo: "Shield Hero - Vol. 1",
        genero: "isekai",
        precio: 9990,
        imagen: "https://m.media-amazon.com/images/I/91r65A3mKLL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        id: 3,
        titulo: "Chainsaw Man - Vol. 1",
        genero: "shonen",
        precio: 8990,
        imagen: "https://m.media-amazon.com/images/I/81I2j6OOpML._AC_UF1000,1000_QL80_.jpg"
    },
    {
        id: 4,
        titulo: "Berserk Maximum Vol. 1",
        genero: "seinen",
        precio: 15990,
        imagen: "https://m.media-amazon.com/images/I/91rU8S+pPmL._AC_UF1000,1000_QL80_.jpg"
    }
];
/* ==============================================================================
   FIN DE LA SECCIÓN DE EDICIÓN FÁCIL
   ============================================================================== */


// Lógica principal para renderizar el catálogo en la grilla
function cargarCatalogo(productos) {
    const container = document.getElementById('catalogoContainer');
    container.innerHTML = ""; // Limpiar contenido previo

    if(productos.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 2rem; color:var(--texto-secundario);">No se encontraron mangas en este género.</p>`;
        return;
    }

    productos.forEach(manga => {
        const card = document.createElement('article');
        card.className = 'manga-card';
        
        // Formatear precio a moneda chilena ($10.000)
        const precioFormateado = `$${manga.precio.toLocaleString('es-CL')}`;
        
        card.innerHTML = `
            <div class="manga-img-container">
                <img src="${manga.imagen}" alt="Portada de ${manga.titulo}" class="manga-img">
            </div>
            <div class="manga-info">
                <div>
                    <h3 class="manga-titulo">${manga.titulo}</h3>
                    <span class="manga-genero">${manga.genero}</span>
                </div>
                <div class="manga-precio-row">
                    <div class="manga-precio">${precioFormateado}</div>
                    <button class="btn-pedido-card" onclick="seleccionarManga('${manga.titulo}')">Seleccionar</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Lógica del filtro de género
function filtrarProductos() {
    const filtro = document.getElementById('filtroGenero').value;
    if (filtro === 'todos') {
        cargarCatalogo(CATALOGO);
    } else {
        const filtrados = CATALOGO.filter(m => m.genero === filtro);
        cargarCatalogo(filtrados);
    }
}

// Auto-rellenar el formulario al hacer clic en un manga
function seleccionarManga(titulo) {
    const inputPedido = document.getElementById('mangaSeleccionado');
    const seccionPedido = document.getElementById('pedido-seccion');

    // Añadir el nuevo manga al pedido (separado por comas si ya había uno)
    if (inputPedido.value === "") {
        inputPedido.value = titulo;
    } else if (!inputPedido.value.includes(titulo)) {
        inputPedido.value += `, ${titulo}`;
    }
    
    // Scroll suave hasta el formulario
    seccionPedido.scrollIntoView({ behavior: 'smooth' });
}

// Manejo del cambio de tema (Claro / Oscuro Neón)
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

themeBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        themeBtn.title = 'Cambiar a Modo Oscuro Neón';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeBtn.title = 'Cambiar a Modo Claro';
    }
});

// Procesar pedido y redirigir a Instagram
function enviarPedido(e) {
    e.preventDefault(); // Prevenir que la página se recargue
    const manga = document.getElementById('mangaSeleccionado').value;
    const hora = document.getElementById('horaEntrega').value;
    const lugar = document.getElementById('lugarEntrega').value;
    const notas = document.getElementById('notas').value;

    // Crear mensaje formateado
    const mensaje = `¡Nuevo Pedido desde la Web MangaBros!\n-----------------------------------------\n📚 Manga(s): ${manga}\n⏰ Hora encuentro: ${hora}\n📍 Lugar en S.A.: ${lugar}\n📝 Notas/Contacto: ${notas}`;
    
    // Alerta de confirmación
    alert(`Pedido preparado:\n\n${mensaje}\n\nTe redirigiremos a nuestro Instagram para concretar el pedido por mensaje directo.`);
    
    // Redirigir a Instagram (Mismo link de siempre)
    window.open("https://www.instagram.com/mangabros.cl_?igsh=YTR1Y3hmcXNyMzZk", "_blank");
}

// Inicializar la página cargando todo el catálogo al cargar
cargarCatalogo(CATALOGO);
