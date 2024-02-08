let datos;

document.addEventListener("DOMContentLoaded", function () {
  const url = "./json/coches.json";

  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      datos = jsonData;
      const contenedorProductos = document.getElementById("productos");
      jsonData.coches.forEach((coche) => {
        const columna = crearTarjetaProducto(coche);
        contenedorProductos.appendChild(columna);
      });

      filtrarProductosPorBusqueda(datos);

      // Agregar funcionalidad de reconocimiento de voz al botón
      const botonBusquedaVoz = document.getElementById("botonBusquedaVoz");
      botonBusquedaVoz.addEventListener("click", iniciarReconocimientoVoz);
    })
    .catch((error) =>
      console.error("Error al obtener datos del JSON de coches:", error)
    );
});

function iniciarReconocimientoVoz() {
  // Comienza el reconocimiento de voz
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = "es-ES";

  recognition.onresult = function (event) {
    const resultado = event.results[0][0].transcript;
    console.log("Texto reconocido:", resultado);

    // Verificar si hay resultados y tomar acción en consecuencia
    if (resultado) {
      // Realizar la búsqueda utilizando el texto reconocido
      buscarProducto(resultado);
    } else {
      console.log("No se ha detectado ningún resultado.");
    }
  };

  // Manejar el evento de finalización del reconocimiento
  recognition.onend = function() {
    console.log("Reconocimiento de voz finalizado.");
  };

  // Iniciar el reconocimiento de voz
  recognition.start();
}
function buscarProducto(terminoBusqueda) {
  // Convertir el término de búsqueda a minúsculas para que la búsqueda sea insensible a mayúsculas y minúsculas
  const terminoMinusc = terminoBusqueda.toLowerCase();

  // Filtrar los productos que contengan el término de búsqueda en el modelo o la marca del coche
  const productosFiltrados = datos.coches.filter(coche =>
    coche.modelo.toLowerCase().includes(terminoMinusc) || // Buscar coincidencias parciales en el modelo
    coche.marca.toLowerCase().includes(terminoMinusc) // Buscar coincidencias parciales en la marca
  );

  // Mostrar los productos filtrados
  mostrarProductos(productosFiltrados);
}

function filtrarProductosPorBusqueda(datos) {
  const entradaBusqueda = document.getElementById("searchInput");
  if (entradaBusqueda) {
    entradaBusqueda.addEventListener("input", function () {
      const términoBusqueda = this.value.trim().toLowerCase();
      if (términoBusqueda.length > 0) {
        const productosFiltrados = filtrarProductosPorTérmino(
          datos.coches,
          términoBusqueda
        );
        mostrarProductos(productosFiltrados);
      } else {
        mostrarProductos(datos.coches);
      }
    });
  }
}

function filtrarProductosPorTérmino(productos, término) {
  return productos.filter(
    (coche) =>
      coche.marca.toLowerCase().includes(término) ||
      coche.modelo.toLowerCase().includes(término)
  );
}

function mostrarProductos(productos) {
  const contenedorProductos = document.getElementById("productos");
  contenedorProductos.innerHTML = "";
  productos.forEach((coche) => {
    const columna = crearTarjetaProducto(coche);
    contenedorProductos.appendChild(columna);
  });
}

function crearTarjetaProducto(coche) {
  const columna = document.createElement("div");
  columna.className = "col-md-4 mb-4";

  const tarjeta = document.createElement("div");
  tarjeta.className =
    "card h-100 bg-secondary text-white bg-opacity-90 border-danger";

  const imagen = document.createElement("img");
  imagen.className = "card-img-top";
  imagen.src = coche.imagen;
  imagen.alt = coche.modelo;

  const cuerpoTarjeta = document.createElement("div");
  cuerpoTarjeta.className = "card-body d-flex flex-column";

  const título = document.createElement("h5");
  título.className = "card-title";
  título.textContent = coche.modelo;

  const precio = document.createElement("p");
  precio.className = "card-text flex-grow-1";
  precio.textContent = `Precio: ${coche.precio}`;

  const btnAgregarCesta = document.createElement("button");
  btnAgregarCesta.className = "btn btn-primary mt-2";
  btnAgregarCesta.textContent = "Añadir a la cesta";
  btnAgregarCesta.dataset.cocheId = coche.id;
  btnAgregarCesta.addEventListener("click", function () {
    agregarACesta(coche.id);
  });

  const enlaceDetalles = document.createElement("a");
  enlaceDetalles.className = "btn btn-info mt-2";
  enlaceDetalles.href = `detalle.html?id=${coche.id}`;
  enlaceDetalles.textContent = "Ver más";

  cuerpoTarjeta.appendChild(título);
  cuerpoTarjeta.appendChild(precio);
  cuerpoTarjeta.appendChild(btnAgregarCesta);
  cuerpoTarjeta.appendChild(enlaceDetalles);

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(cuerpoTarjeta);

  columna.appendChild(tarjeta);

  return columna;
}

function agregarACesta(cocheId) {
  const productosEnCesta = obtenerProductosEnCesta();
  const producto = datos.coches.find((coche) => coche.id === cocheId);
  if (producto) {
    productosEnCesta.push(producto);
    guardarProductosEnCesta(productosEnCesta);
    notificarAñadido(producto.modelo);

    // Llamar a la función para mostrar los productos en la cesta después de agregar uno nuevo
    mostrarProductosEnCesta(
      productosEnCesta,
      document.getElementById("productosEnCesta")
    );
  } else {
    console.error("No se encontró el producto con el ID especificado");
  }
}

function eliminarDeLaCesta(cocheId) {
  let productosEnCesta = obtenerProductosEnCesta();
  productosEnCesta = productosEnCesta.filter(
    (producto) => producto.id !== cocheId
  );
  guardarProductosEnCesta(productosEnCesta);
  mostrarProductosEnCesta(
    productosEnCesta,
    document.getElementById("productosEnCesta")
  );
}

function mostrarProductosEnCesta(productosEnCesta, contenedor) {
  if (contenedor) {
    contenedor.innerHTML = "";
    productosEnCesta.forEach((producto) => {
      const elementoProducto = crearElementoProducto(
        producto,
        eliminarDeLaCesta
      );
      contenedor.appendChild(elementoProducto);
    });
  } else {
    console.error("El contenedor de la cesta no se encontró en el HTML.");
  }
}

function notificarAñadido(nombreProducto) {
  let textoNotificación = nombreProducto + " se ha añadido a tu carrito.";

  if (Notification.permission == "granted") {
    new Notification("Notificación", {
      body: textoNotificación,
    });
  }
}

function obtenerProductosEnCesta() {
  return JSON.parse(localStorage.getItem("productosEnCesta")) || [];
}

function guardarProductosEnCesta(productosEnCesta) {
  localStorage.setItem(
    "productosEnCesta",
    JSON.stringify(productosEnCesta)
  );
}