document.addEventListener("DOMContentLoaded", function () {
    inicializarSesion();
});

function inicializarSesion() {
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    if (nombreUsuario) {
        // Si hay un nombre de usuario, mostrar botón de cerrar sesión
        document.getElementById("botonIniciarSesion").style.display = "none";
        document.getElementById("botonCerrarSesion").style.display = "block";
        document.getElementById("botonCerrarSesion").addEventListener("click", cerrarSesion);
    } else {
        // Si no hay un nombre de usuario, mostrar botón de iniciar sesión
        document.getElementById("botonIniciarSesion").style.display = "block";
        document.getElementById("botonCerrarSesion").style.display = "none";
        document.getElementById("botonIniciarSesion").addEventListener("click", mostrarFormularioIniciarSesion);
    }

    // Agregar el evento submit al formulario de inicio de sesión
    const formulario = document.getElementById("formularioIniciarSesion");
    formulario.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe
        validarFormulario(); // Llamar a la función de validación
    });
}

function mostrarFormularioIniciarSesion() {
    window.location.href = "iniciar-sesion.html";
}

function cerrarSesion() {
    const confirmarCerrarSesion = confirm("¿Estás seguro de cerrar sesión?");
    if (confirmarCerrarSesion) {
        // Eliminar solo el nombre de usuario
        localStorage.removeItem("nombreUsuario");

        // Redirigir a la página de inicio
        window.location.href = "index.html";
    }
}

function validarFormulario() {
    let nombreUsuario = document.getElementById("nombreUsuario").value;
    let contraseña = document.getElementById("contraseña").value;

    fetch("./json/usuario.json")
        .then(response => response.json())
        .then(usuarios => {
            let usuarioValido = usuarios.find(usuario =>
                usuario.nombreUsuario == nombreUsuario && usuario.contraseña == contraseña
            );

            if (usuarioValido) {
                localStorage.setItem("nombreUsuario", nombreUsuario);
                window.location.href = "index.html";
            } else {
                alert("Nombre de usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.");
            }
        })
        .catch(error => console.error("Error al obtener datos del archivo JSON de usuarios:", error));
}