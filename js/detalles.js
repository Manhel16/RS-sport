document.addEventListener('DOMContentLoaded', function () {
  // Obtener el ID del coche desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const cocheId = urlParams.get('id');

  if (cocheId) {
    // Hacer la solicitud a la API para obtener todos los datos
    fetch('./json/coches.json') // Ajusta la ruta según tu estructura de carpetas
      .then(response => response.json())
      .then(data => {
        // Filtrar los detalles del coche por ID
        const coche = data.coches.find(item => item.id === cocheId);

        if (coche) {
          mostrarDetalles(coche);
        } else {
          console.error('No se encontraron detalles para el ID del coche especificado.');
        }
      })
      .catch(error => console.error('Error al obtener datos del JSON de coches:', error));
  } else {
    console.error('ID del coche no especificado en la URL.');
  }
});

// Función para mostrar los detalles del coche
function mostrarDetalles(coche) {
  const detalleCoche = document.getElementById('detalleProducto');

  const card = document.createElement('div');
  card.className = 'card mx-auto mb-4 p-5';
  card.style.maxWidth = '400px';

  const img = document.createElement('img');
  img.className = 'card-img-top';
  img.src = coche.imagen;
  img.alt = coche.modelo;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = coche.modelo;

  const marca = document.createElement('p');
  marca.className = 'card-text';
  marca.textContent = `Marca: ${coche.marca}`;

  const precio = document.createElement('p');
  precio.className = 'card-text';
  precio.textContent = `Precio: ${coche.precio}`;

  const descripcion = document.createElement('p');
  descripcion.className = 'card-text';
  descripcion.textContent = `Descripción: ${coche.descripcion}`;

  const potencia = document.createElement('p');
  potencia.className = 'card-text';
  potencia.textContent = `Potencia: ${coche.potencia}`;

  const btnAgregar = document.createElement('button');
  btnAgregar.className = 'btn btn-primary';
  btnAgregar.textContent = 'Añadir a la cesta';
  btnAgregar.addEventListener('click', function () {
    agregarALaCesta(coche);
  });

  cardBody.appendChild(title);
  cardBody.appendChild(marca);
  cardBody.appendChild(precio);
  cardBody.appendChild(descripcion);
  cardBody.appendChild(potencia);
  cardBody.appendChild(btnAgregar);

  card.appendChild(img);
  card.appendChild(cardBody);

  detalleCoche.appendChild(card);
}

// Función para agregar el coche a la cesta
function agregarALaCesta(coche) {
  const productosEnCesta = obtenerProductosEnCesta();
  productosEnCesta.push(coche);
  guardarProductosEnCesta(productosEnCesta);
  notificarAñadido(coche.modelo);
}

// Función para notificar que se ha añadido un coche a la cesta
function notificarAñadido(nombreCoche) {
  let textoNotificación = nombreCoche + " se ha añadido a tu carrito.";

  if (Notification.permission == "granted") {
    new Notification("Notificación", {
      body: textoNotificación,
    });
  }
}

// Funciones auxiliares para manejar la cesta
function obtenerProductosEnCesta() {
  return JSON.parse(localStorage.getItem("productosEnCesta")) || [];
}

function guardarProductosEnCesta(productosEnCesta) {
  localStorage.setItem(
    "productosEnCesta",
    JSON.stringify(productosEnCesta)
  );
}