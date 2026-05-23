/* ==============================================================================
   CONFIGURACIÓN DE TU GOOGLE SHEETS
   ============================================================================== */
// 1. Pega aquí el ID largo que extrajiste de tu documento en el Paso 3:
const SPREADSHEET_ID = "TU_ID_DE_GOOGLE_SHEETS_AQUÍ";

// 2. Escribe el nombre exacto de la pestaña (ej. "Hoja1" o "Sheet1"):
const SHEET_NAME = "Hoja1"; 

/* ==============================================================================
   LÓGICA AUTOMÁTICA: NO NECESITAS TOCAR NADA HACIA ABAJO
   ============================================================================== */
let CATALOGO = []; // Aquí se guardarán los mangas que vienen de Google

// URL para consultar la hoja en formato CSV de manera pública y eficiente
const GOOGLE_SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

// Función para descargar los datos desde Google Sheets al cargar la web
async function obtenerDatosDeGoogle() {
    try {
        const respuesta = await fetch(GOOGLE_SHEETS_URL);
        const textoCSV = await respuesta.text();
        
        // Convertir el CSV de Google en un Arreglo de Objetos JavaScript
        CATALOGO = procesarCSV(textoCSV);
        
        // Una vez descargados, cargamos el catálogo en la pantalla
        cargarCatalogo(CATALOGO);
    } catch (error) {
        console.error("Error cargando los datos de Google Sheets:", error);
        document.getElementById('catalogoContainer').innerHTML = 
            `<p style="grid-column: 1/-1; text-align:center; padding: 2rem; color:red;">
                Error al conectar con el inventario. Revisa la configuración de tu Google Sheet.
             </p>`;
    }
}

// Procesador básico de formato CSV a objetos utilizables por la web
function procesarCSV(csvText) {
    const lineas = csvText.split('\n');
    const resultado = [];
    
    // Leer los encabezados de la fila 1 eliminando comillas dobles basura de Google
    const encabezados = lineas[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    
    // Recorrer las filas de productos
    for (let i = 1; i < lineas.length; i++) {
        if (!lineas[i].trim()) continue; // Saltar filas vacías
        
        const celdas = lineas[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
        const objetoManga = {};
        
        encabezados.forEach((encabezado, indice) => {
            let valor = celdas[indice];
            // Si la columna es 'id' o 'precio', convertir a número
            if (encabezado === 'id' || encabezado === 'precio') {
                valor = parseInt(valor) || 0;
            }
            objetoManga[encabezado] = valor;
        });
        
        resultado.push(objetoManga);
    }
    return resultado;
}

// Renderizar el catálogo en la interfaz móvil
function cargarCatalogo(productos) {
    const container = document.getElementById('catalogoContainer');
    container.innerHTML = ""; 

    if(productos.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 2rem; color:var(--texto-secundario);">No se encontraron mangas.</p>`;
        return;
    }

    productos.forEach(manga => {
        const card = document.createElement('article');
        card.className = 'manga-card';
        
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

// Lógica del filtro por género
function filtrarProductos() {
    const filtro = document.getElementById('filtroGenero').value;
    if (filtro === 'todos') {
        cargarCatalogo(CATALOGO);
    } else {
        const filtrados = CATALOGO.filter(m => m.genero.toLowerCase() === filtro.toLowerCase());
        cargarCatalogo(filtrados);
    }
}

// Auto-rellenar formulario al presionar un botón
function seleccionarManga(titulo) {
    const inputPedido = document.getElementById('mangaSeleccionado');
    const seccionPedido = document.getElementById('pedido-seccion');

    if (inputPedido.value === "") {
        inputPedido.value = titulo;
    } else if (!inputPedido.value.includes(titulo)) {
        inputPedido.value += `, ${titulo}`;
    }
    seccionPedido.scrollIntoView({ behavior: 'smooth' });
}

// Cambio de tema (Claro / Oscuro)
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

themeBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
});

// Enviar el pedido coordinando por Instagram
function enviarPedido(e) {
    e.preventDefault();
    const manga = document.getElementById('mangaSeleccionado').value;
    const hora = document.getElementById('horaEntrega').value;
    const lugar = document.getElementById('lugarEntrega').value;
    const notas = document.getElementById('notas').value;

    const mensaje = `¡Nuevo Pedido desde la Web MangaBros!\n-----------------------------------------\n📚 Manga(s): ${manga}\n⏰ Hora encuentro: ${hora}\n📍 Lugar en S.A.: ${lugar}\n📝 Notas/Contacto: ${notas}`;
    
    alert(`Pedido preparado:\n\n${mensaje}\n\nTe redirigiremos a nuestro Instagram para concretar el pedido por mensaje directo.`);
    window.open("https://www.instagram.com/mangabros.cl_?igsh=YTR1Y3hmcXNyMzZk", "_blank");
}

// COMENZAR: En lugar de cargar una lista fija, mandamos a buscar los datos a Google de inmediato
obtenerDatosDeGoogle();
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
