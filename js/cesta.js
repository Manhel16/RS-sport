function inicializarSesion() {
  const nombreUsuario = localStorage.getItem("nombreUsuario");

  const contenedorCesta = document.getElementById("contenedorCesta");

  if (nombreUsuario) {
      // Si hay un nombre de usuario, mostrar botón de cerrar sesión
      document.getElementById("botonIniciarSesion").style.display = "none";
      document.getElementById("botonCerrarSesion").style.display = "block";
      document.getElementById("botonCerrarSesion").addEventListener("click", cerrarSesion);

      // Mostrar el contenedor de la cesta
      contenedorCesta.style.visibility = "visible";
  } else {
      // Si no hay un nombre de usuario, mostrar botón de iniciar sesión
      document.getElementById("botonIniciarSesion").style.display = "block";
      document.getElementById("botonCerrarSesion").style.display = "none";
      document.getElementById("botonIniciarSesion").addEventListener("click", mostrarFormularioIniciarSesion);

      // Ocultar el contenedor de la cesta
      contenedorCesta.style.visibility = "hidden";
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const cestaContenedor = document.getElementById('productosEnCesta');
  const productosEnCesta = obtenerProductosEnCesta();
  mostrarProductosEnCesta(productosEnCesta, cestaContenedor);
});

function mostrarProductosEnCesta(productosEnCesta, contenedor) {
  if (contenedor) {
    contenedor.innerHTML = '';
    productosEnCesta.forEach(producto => {
      const productoElemento = crearProductoElemento(producto);
      contenedor.appendChild(productoElemento);
    });
  } else {
    console.error('El contenedor de la cesta no se encontró en el HTML.');
  }
}


function crearProductoElemento(producto) {
  const productoDiv = document.createElement('div');
  productoDiv.classList.add('producto-en-cesta');
  
  const nombreProducto = document.createElement('h3');
  nombreProducto.textContent = producto.modelo;
  nombreProducto.classList.add('nombre-producto');

  const precioProducto = document.createElement('p');
  precioProducto.textContent = `Precio: ${producto.precio}`;
  precioProducto.classList.add('precio-producto');

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-eliminar');
  btnEliminar.addEventListener('click', () => eliminarDeLaCesta(producto.id));

  productoDiv.appendChild(nombreProducto);
  productoDiv.appendChild(precioProducto);
  productoDiv.appendChild(btnEliminar);

  return productoDiv;
}

function eliminarDeLaCesta(cocheId) {
  let productosEnCesta = obtenerProductosEnCesta();
  productosEnCesta = productosEnCesta.filter(producto => producto.id !== cocheId);
  guardarProductosEnCesta(productosEnCesta);
  mostrarProductosEnCesta(productosEnCesta, document.getElementById('productosEnCesta'));
}

function obtenerProductosEnCesta() {
  return JSON.parse(localStorage.getItem('productosEnCesta')) || [];
}