let datos; // Variable global para almacenar los datos de coches

document.addEventListener('DOMContentLoaded', function () {
  const url = '../json/coches.json';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      datos = data; // Almacenar los datos en la variable global

      // Llamar a las funciones que dependen de los datos después de que se hayan cargado
      inicializarPagina();
      inicializarBannerCookies(); // Agregamos la inicialización del banner de cookies aquí
    })
    .catch(error => console.error('Error al obtener datos del JSON de coches:', error));

  var denegarBoton = document.querySelector(".denegar-cookies");
  var aceptarBoton = document.querySelector(".aceptar-cookies");

  denegarBoton.addEventListener("click", ocultarBannerCookies);
  aceptarBoton.addEventListener("click", ocultarBannerCookies);
});

// Funciones para el banner de cookies
function mostrarBannerCookies() {
  var bannerCookies = document.getElementById("banner-cookies");
  bannerCookies.style.display = "block";
}

function ocultarBannerCookies() {
  var bannerCookies = document.getElementById("banner-cookies");
  bannerCookies.style.display = "none";

  var fechaExpiracion = new Date();
  fechaExpiracion.setTime(fechaExpiracion.getTime() + 3 * 60 * 60 * 1000); // 3 horas en milisegundos
  document.cookie =
    "cookiesAceptadas=true; expires=" +
    fechaExpiracion.toUTCString() +
    "; path=/";
}

function inicializarBannerCookies() {
  if (document.cookie.indexOf("cookiesAceptadas=true") === -1) {
    mostrarBannerCookies();
  }
}

// Función para inicializar la página después de cargar los datos
function inicializarPagina() {
  // Carrusel con 3 coches
  const carruselInner = document.getElementById('carouselInner');
  const indicesCarrusel = obtenerIndicesAleatorios(datos.coches.length, 3);

  indicesCarrusel.forEach(indice => {
    const coche = datos.coches[indice];
    const elementoCarrusel = crearElementoCarrusel(coche);
    carruselInner.appendChild(elementoCarrusel);
  });

  const primerElementoCarrusel = carruselInner.querySelector('.carousel-item');
  if (primerElementoCarrusel) {
    primerElementoCarrusel.classList.add('active');
  }

  // Catálogo con 9 coches
  const catalogo = document.getElementById('catalogo');
  const indicesCatalogo = obtenerIndicesAleatorios(datos.coches.length, 9);

  indicesCatalogo.forEach(indice => {
    const coche = datos.coches[indice];
    const col = crearTarjetaCatalogo(coche);
    catalogo.appendChild(col);
  });

  // Barra de búsqueda
  const inputBusqueda = document.getElementById('inputBusqueda');
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function () {
      const terminoBusqueda = this.value.trim().toLowerCase();
      if (terminoBusqueda.length > 0) {
        const productosFiltrados = filtrarProductosPorTermino(datos.coches, terminoBusqueda);
        mostrarProductos(productosFiltrados);
      } else {
        // Si la barra de búsqueda está vacía, mostrar todos los productos
        mostrarProductos(datos.coches);
      }
    });
  }

  // Agregar funcionalidad de reconocimiento de voz al botón
  const botonBusquedaVoz = document.getElementById("botonBusquedaVoz");
  botonBusquedaVoz.addEventListener("click", iniciarReconocimientoVoz);
}

// Función para iniciar el reconocimiento de voz
function iniciarReconocimientoVoz() {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = "es-ES";

  recognition.onresult = function (event) {
    const resultado = event.results[0][0].transcript;
    console.log("Texto reconocido:", resultado);

    if (resultado) {
      buscarProducto(resultado);
    } else {
      console.log("No se ha detectado ningún resultado.");
    }
  };

  recognition.onend = function() {
    console.log("Reconocimiento de voz finalizado.");
  };

  recognition.start();
}
function buscarProducto(terminoBusqueda) {
  // Convertir el término de búsqueda a minúsculas para que la búsqueda sea insensible a mayúsculas y minúsculas
  const terminoMinusc = terminoBusqueda.toLowerCase();

  // Filtrar los productos que contengan el término de búsqueda en el modelo o la marca del coche
  const productosFiltrados = datos.coches.filter(
    (coche) =>
      coche.modelo.toLowerCase().includes(terminoMinusc) || // Buscar coincidencias parciales en el modelo
      coche.marca.toLowerCase().includes(terminoMinusc) // Buscar coincidencias parciales en la marca
  );

  // Mostrar los productos filtrados
  mostrarProductos(productosFiltrados);
}

// Función para filtrar productos según el término de búsqueda
function filtrarProductosPorTermino(productos, terminoBusqueda) {
  return productos.filter(
    (coche) =>
      coche.marca.toLowerCase().includes(terminoBusqueda) ||
      coche.modelo.toLowerCase().includes(terminoBusqueda)
  );
}

// Función para mostrar productos en la página (puedes personalizarla según tu estructura HTML)
function mostrarProductos(productos) {
  const catalogo = document.getElementById("catalogo");
  catalogo.innerHTML = ""; // Limpiar catálogo antes de mostrar productos filtrados

  productos.forEach((coche) => {
    const col = crearTarjetaCatalogo(coche);
    catalogo.appendChild(col);
  });
}

// Función para generar índices aleatorios únicos
function obtenerIndicesAleatorios(longitudMaxima, cantidad) {
  const indices = Array.from({ length: longitudMaxima }, (_, indice) => indice);
  return barajarArray(indices).slice(0, cantidad);
}

// Función para barajar un array de forma aleatoria
function barajarArray(array) {
  const arrayBarajado = [...array];
  for (let i = arrayBarajado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayBarajado[i], arrayBarajado[j]] = [arrayBarajado[j], arrayBarajado[i]];
  }
  return arrayBarajado;
}

// Función para crear un item de carrusel
function crearElementoCarrusel(coche) {
  const elementoCarrusel = document.createElement("div");
  elementoCarrusel.className = "carousel-item";

  const img = document.createElement("img");
  img.src = coche.imagen;
  img.alt = coche.modelo;
  img.className = "d-block w-100";
  elementoCarrusel.appendChild(img);

  const captionCarrusel = document.createElement("div");
  captionCarrusel.className = "carousel-caption d-none d-md-block";
  captionCarrusel.innerHTML = `
    <h5>${coche.modelo}</h5>
    <p>Marca: ${coche.marca}</p>
    <p>Precio: ${coche.precio}</p>
  `;
  elementoCarrusel.appendChild(captionCarrusel);

  return elementoCarrusel;
}

// Función para crear una tarjeta de catálogo
function crearTarjetaCatalogo(coche) {
  const col = document.createElement("div");
  col.className = "col-md-4 mb-4";

  const card = document.createElement("div");
  card.className = "card bg-secondary text-white bg-opacity-90 border-danger";
  card.style.height = "100%";

  const img = document.createElement("img");
  img.className = "card-img-top";
  img.src = coche.imagen;
  img.alt = coche.modelo;
  img.style.height = "100%";
  img.style.objectFit = "contain";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const titulo = document.createElement("h5");
  titulo.className = "card-title";
  titulo.textContent = coche.modelo;

  const marca = document.createElement("p");
  marca.className = "card-text";
  marca.textContent = `Marca: ${coche.marca}`;

  const descripcion = document.createElement("p");
  descripcion.className = "card-text";
  descripcion.textContent = `Descripción: ${coche.descripcion}`;

  const potencia = document.createElement("p");
  potencia.className = "card-text";
  potencia.textContent = `Potencia: ${coche.potencia}`;

  const precio = document.createElement("p");
  precio.className = "card-text";
  precio.textContent = `Precio: ${coche.precio}`;

  cardBody.appendChild(titulo);
  cardBody.appendChild(marca);
  cardBody.appendChild(descripcion);
  cardBody.appendChild(potencia);
  cardBody.appendChild(precio);

  card.appendChild(img);
  card.appendChild(cardBody);

  col.appendChild(card);

  return col;
}

