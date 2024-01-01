// Obtener la fecha actual
var fechaActual = new Date();

// Formatear la fecha como "DD/MM/AAAA"
var fechaFormateada = `${formatoDosDigitos(fechaActual.getDate())}
                      /${formatoDosDigitos(fechaActual.getMonth() + 1)}
                      /${fechaActual.getFullYear()}`;

// Mostrar la fecha en el elemento con id "fecha"
document.getElementById("Fecha").textContent = fechaFormateada.replace(/\s/g, '');

// Función para formatear números a dos dígitos (agregando un cero si es necesario)
function formatoDosDigitos(numero) {
  return numero < 10 ? "0" + numero : numero;
}

// Función para mostrar la fecha en el elemento con id "Fecha"
function mostrarFecha() {
  var fechaFormateada = `${formatoDosDigitos(fechaActual.getDate())}
                        /${formatoDosDigitos(fechaActual.getMonth() + 1)}
                        /${fechaActual.getFullYear()}`;
  document.getElementById("Fecha").textContent = fechaFormateada.replace(/\s/g, '');
}

// Manejar el evento de clic en el botón anterior
document.querySelector(".boton-anterior").addEventListener("click", function() {
  // Retroceder un día en la fecha actual
  fechaActual.setDate(fechaActual.getDate() - 1);
  // Mostrar la nueva fecha
  mostrarFecha();
});

// Manejar el evento de clic en el botón anterior
document.querySelector(".boton-siguiente").addEventListener("click", function() {
  // Avanzar un día en la fecha actual
  fechaActual.setDate(fechaActual.getDate() + 1);
  // Mostrar la nueva fecha
  mostrarFecha();
});