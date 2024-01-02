// Conexion con la BD en SupaBase
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const supabaseUrl = "https://qmpzbehmfbbtrapbgdby.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtcHpiZWhtZmJidHJhcGJnZGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzE2MDczMSwiZXhwIjoyMDE4NzM2NzMxfQ.Ql3vNr_ppETAIbnUc2vMOlnibUb_u9ypVfYB0d0MgE4";

// Crea una instancia del cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Recuperacion de las Tareas desde la BD
supabase
  .from('Tareas')
  .select('id, fecha_creacion, prioridad, descripcion, fecha, estado')
  .then(({ data }) => {
    const datos = ordenarTareas(data);
    datos.forEach(row => {
        recuperarTareas(row.id, row.prioridad, row.descripcion, row.fecha, row.estado);
    });
});

// Asignacion de elementos HTML
const botonIngresar = document.querySelector('.boton-ingresar');
const contenedorTareas = document.getElementById('contenedor-tareas');
const inputPrioridad = document.querySelector('.prioridad');
const inputDescripcion = document.querySelector('.descripcion');
const inputFecha = document.querySelector('.fecha');

// Funcion para ordenar las tareas por prioridad y extension de la descripcion
function ordenarTareas(data) {
  const prioridadesOrdenadas = ['Urgente', 'Alta', 'Media', 'Baja'];
  data.sort((a, b) => {
    // Ordenar por prioridad
    const prioridadComparison = prioridadesOrdenadas.indexOf(a.prioridad) - prioridadesOrdenadas.indexOf(b.prioridad);
    // Si las prioridades son diferentes, retorna la comparación de prioridades
    if (prioridadComparison !== 0) {
      return prioridadComparison;
    }
    // Si las prioridades son iguales, ordena por la longitud de la descripción de mayor a menor
    return b.descripcion.length - a.descripcion.length;
  });
  return data;
}

// Funcion para mostrar las tareas almacenados en la BD
function recuperarTareas(idBD,prioridadBD,descripcionBD,fechaBD,estadoBD){
        let nuevaTarea = document.createElement('div');
        nuevaTarea.id = 'Tarea';

        let datosNuevaTarea = document.createElement('div');
        datosNuevaTarea.classList.add('Datos');
        nuevaTarea.appendChild(datosNuevaTarea);

        let id = document.createElement('p');
        id.classList.add('oculto');
        id.innerText = idBD;
        datosNuevaTarea.appendChild(id);

        let botonModificar = document.createElement('button');
        botonModificar.classList.add('boton-modificar');
        botonModificar.addEventListener("click", function(event){
            if(this.children[0].classList.contains('bi-pencil-square')){
                modificarTarea(event);
            } else {
                confirmarModificacionTarea(event,idBD);
            }
        });
        datosNuevaTarea.appendChild(botonModificar);
        
        let iconModificar = document.createElement('i');
        iconModificar.classList.add('bi','bi-pencil-square');
        botonModificar.appendChild(iconModificar);

        let prioridad = document.createElement('p');
        prioridad.classList.add('casilla-prioridad');
        prioridad.innerText = prioridadBD;
        datosNuevaTarea.appendChild(prioridad);

        let descripcion = document.createElement('p');
        descripcion.classList.add('casilla-descripcion');
        descripcion.innerText = descripcionBD;
        datosNuevaTarea.appendChild(descripcion);

        let fecha  = document.createElement('p');
        fecha.classList.add('casilla-fecha');
        fecha.innerText = fechaBD;
        datosNuevaTarea.appendChild(fecha);

        let nuevoBotonCompletar = document.createElement('button');
        nuevoBotonCompletar.classList.add('btn', 'btn-primary', 'boton-completar');
        nuevoBotonCompletar.textContent = 'Completar';
        nuevoBotonCompletar.type = 'button';
        nuevoBotonCompletar.addEventListener("click", function() {
            if(nuevoBotonCompletar.textContent === 'Completar'){
                marcarTarea(idBD,nuevoBotonCompletar,prioridad,descripcion,fecha);
            } else {
                desmarcarTarea(idBD,nuevoBotonCompletar,prioridad,descripcion,fecha);
            }
        });
        nuevaTarea.appendChild(nuevoBotonCompletar);

        let nuevoBotonEliminar = document.createElement('button');
        nuevoBotonEliminar.classList.add('btn', 'btn-primary', 'boton-eliminar');
        nuevoBotonEliminar.textContent = 'Eliminar';
        nuevoBotonEliminar.type = 'button';
        nuevoBotonEliminar.addEventListener("click", async function(){
            eliminarTarea(idBD);
            await new Promise(resolve => setTimeout(resolve, 1000));
            location.reload();
        });
        nuevaTarea.appendChild(nuevoBotonEliminar);
        contenedorTareas.appendChild(nuevaTarea);

        if(estadoBD == 'completado'){
            marcarTarea(idBD,nuevoBotonCompletar,prioridad,descripcion,fecha);
        } else {
            desmarcarTarea(idBD,nuevoBotonCompletar,prioridad,descripcion,fecha);
        }
}

// Funcion que marca una tarea como completada
function marcarTarea(idBD,boton,prioridad,descripcion,fecha){
    prioridad.classList.add('completada');
    descripcion.classList.add('completada');
    fecha.classList.add('completada');
    boton.textContent = 'Desmarcar';
    supabase
        .from('Tareas')
        .update({ estado: 'completado' })
        .eq('id', idBD)
        .then(({ error }) => {
            if (error) {
                alert('Error al marcar ', error);
            }
        });
}

// Funcion que marca una tarea como pendiente
function desmarcarTarea(idBD,boton,prioridad,descripcion,fecha){
    prioridad.classList.remove('completada');
    descripcion.classList.remove('completada');
    fecha.classList.remove('completada');
    boton.textContent = 'Completar';
    supabase
        .from('Tareas')
        .update({ estado: 'pendiente' })
        .eq('id', idBD)
        .then(({ error }) => {
            if (error) {
                alert('Error al desmarcar ', error);
            }
        });
}

// Funcion para modificar los elementos de una Tarea
function modificarTarea(e){
    let contenedor = e.target.parentNode.parentNode;
    let boton = contenedor.children[1];
    boton.children[0].classList.remove('bi-pencil-square');
    boton.children[0].classList.add('bi-check-lg');
    console.log(boton.children[0]);
    let viejaPrioridad = contenedor.children[2];
    let viejaDescripcion = contenedor.children[3];
    let viejaFecha = contenedor.children[4];

    let tmp = document.getElementById('ingresar-tarea');

    let casillaPrioridad = tmp.childNodes[1].cloneNode(true);
    casillaPrioridad.classList.add('modificar')
    casillaPrioridad.value= viejaPrioridad.textContent;

    let casillaDescripcion = tmp.childNodes[3].cloneNode(true);
    casillaDescripcion.classList.add('modificar')
    casillaDescripcion.value= viejaDescripcion.textContent;

    let casillaFecha = tmp.childNodes[5].cloneNode(true);
    casillaFecha.classList.add('modificar')
    casillaFecha.value= viejaFecha.textContent;

    viejaPrioridad.replaceWith(casillaPrioridad);
    viejaDescripcion.replaceWith(casillaDescripcion);
    viejaFecha.replaceWith(casillaFecha);
}

// Funcion que actualiza los datos de una tarea en la BD
function confirmarModificacionTarea(e,idBD){
    let contenedor = e.target.parentNode.parentNode;
    let boton = contenedor.children[1];
    boton.children[0].classList.remove('bi-check-lg');
    boton.children[0].classList.add('bi-pencil-square');

    let nuevaPrioridad = contenedor.children[2].value;
    let nuevaDescripcion = contenedor.children[3].value;
    let nuevaFecha = contenedor.children[4].value;

    supabase
    .from('Tareas')
    .update({ prioridad: nuevaPrioridad, descripcion: nuevaDescripcion, fecha: nuevaFecha })
    .eq('id', idBD)
    .then(({ error }) => {
        if (error) {
        console.log('Error al actualizar tarea: ', error.message);
        }
    });

    location.reload();
}

//Realiza un Delete de la tarea seleccionada en la tabla 'Tareas' mediante su id
function eliminarTarea(idBD){
    supabase
        .from('Tareas')
        .delete()
        .eq('id', idBD)
        .then(({ error }) => {
            if (error) {
                alert('Error al eliminar tarea ', error);
            }
        });
}

//Verifica que una tarea cuenta con toda la información necesaria para ingresarla, si cuenta con la información ingresa la tarea en la tabla 'Tareas' de la BD
function agregarTarea(){
    if(inputPrioridad.value && inputDescripcion.value && inputFecha.value){
        
        const nuevaTareaData = {
            prioridad: inputPrioridad.value,
            descripcion: inputDescripcion.value,
            fecha: inputFecha.value,
            estado: 'pendiente'
        };
        
        supabase
            .from('Tareas')
            .insert([nuevaTareaData])
            .then(({ error }) => {
                if (error) {
                    alert('Error al agregar tarea ', error);
                }
            });
    } else {
        alert('Por favor ingresa todos los datos');
    }
}

// delimita la fecha limite el dia actual
function setMinDate() {
    // Obtén la fecha y hora actual en la zona horaria local
    const today = new Date();
    
    // Ajusta la fecha y hora a la zona horaria local
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);

    // Formatea la fecha como YYYY-MM-DD
    const formattedDate = localDate.toISOString().split('T')[0];
    
    // Establece el valor mínimo del input de fecha
    document.querySelector('.fecha').min = formattedDate;
}
setMinDate();

//Funcionamiento del boton "Ingresar" para agregar una tarea
botonIngresar.addEventListener("click", async function(){
    agregarTarea();
    if(inputPrioridad.value && inputDescripcion.value && inputFecha.value){
        inputPrioridad.value = '';
        inputDescripcion.value = '';
        inputFecha.value = '';
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    location.reload();
});
