Arbol de directorios
tengo una organizacion en la que todos los ficheros js estan dentro de la carpeta js, el css dentro de la carpeta css y el json dentro de la carpeta json, por ultimo los ficheros html que estan dentro de la carpeta principal directamente, el fichero principal es index.html

Logeo y registro de usuarios:
para el logeo uso un fichero json donde tengo unos usuarios con su contraseñas que serian los usuarios que pueden acceder 
[
    { "nombreUsuario": "usuario1", 
      "contraseña": "contraseña1" },
    { "nombreUsuario": "usuario2", 
      "contraseña": "contraseña2" },
    { "nombreUsuario": "usuario3", 
      "contraseña": "contraseña3" },
    { "nombreUsuario": "angel", 
      "contraseña": "123456" }
  ]
despues tenemos un formulario con unos id para el nombre y la contraseña para desde js sacar el value para posteriormente poder comprobar que los usuarios son identicos y permitir acceder con la sesion, he usado una expresion regular para la contraseña pattern=".{5,}\d" en la que al menos tendra 5 caracteres la contraseña.

Cookies y webstorage:
para las cookies he hecho que al iniciar la pagina web salga un desplegable donde se pide permiso para usar las cookies y al darle que aceptas creas una cookie que se llama cookiesAceptadas que tiene una duracion de 3 horas despues de ese tiempo te pedira de nuevo que confirmes las cookies(lo puse asi para poder comprobar que funcionaba se puede poner otro tiempo en cualquier momento) y use el webstorage para guardar el nombre de usuario cuando se inicia sesion de esta forma la cesta solo se puede visualizar cuando detecta que el localstorage tiene un nombre de usuario registrado, al cerrar la pagina lo que hago es borrar el item que es el nombre de usuario de esta forma se inicia sesion de cero sin tener varios usuarios almacenados, tambien uso el localstorage para guardar los productos en un array que se mostrara en la cesta.

Elementos multimedia:
como elementos multimedia tengo las imagenes de los propios productos extraidas de google y de las propias paginas de los fabricantes y un gif de una pagina gratuita de coches generico ademas el logo de la tienda esta generado por una ia de imagenes dentro del propio bing que tiene a dia de hoy copilot.

Notificaciones:
para añadir las notificaciones en el proyecto decidi que cada producto que añadas a la cesta te mande una notificacion diciendo el nombre del producto 
function notificarAñadido(nombreProducto) {
  let textoNotificación = nombreProducto + " se ha añadido a tu carrito.";

  if (Notification.permission == "granted") {
    new Notification("Notificación", {
      body: textoNotificación,
    });
  }
}