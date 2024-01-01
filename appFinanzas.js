// Conexion con la BD en SupaBase
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const supabaseUrl = "https://qmpzbehmfbbtrapbgdby.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtcHpiZWhtZmJidHJhcGJnZGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzE2MDczMSwiZXhwIjoyMDE4NzM2NzMxfQ.Ql3vNr_ppETAIbnUc2vMOlnibUb_u9ypVfYB0d0MgE4";

// Crea una instancia del cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

supabase
  .from('Ingresos')  // Reemplaza 'Ingresos' con el nombre de tu tabla
  .select('id_ingreso,Descripción,Categoría,Cantidad,Fecha,Repeticion')
  .then(({ data, error }) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
    } else {
        // const datos = ordenarTareas(data);
        data.forEach(row => {
            recuperarIngresos(row.id_ingreso, row.Descripción, row.Categoría, row.Cantidad, row.Fecha,row.Repeticion);
        });
    }
  });

// -------------------------------------------------------------------------------------------

// Asignacion de elementos HTML
let botonAgregarIngreso = document.querySelector('.Lista-Ingresos .add');
let botonAgregarGasto = document.querySelector('.Lista-Gastos .add');
let botonAgregarSuscripcion = document.querySelector('.Suscripciones .add');

// -------------------------------------------------------------------------------------------

// funcion para ingresar los datos de un nuevo Ingreso
function agregarIngreso(tuElemento){
    let contenedorIngreso = document.getElementById('Contenedor-Ingresos');

    let contenedor = document.createElement('div');
    contenedor.classList.add('Ingreso');
    contenedorIngreso.appendChild(contenedor);

    let butonCheck = document.createElement('button');
    butonCheck.classList.add('btn','btn-outline-success');
    butonCheck.addEventListener('click',function(event){
        ConfirmarIngreso(event);
    })
    contenedor.appendChild(butonCheck);

    let iconCheck = document.createElement('i');
    iconCheck.classList.add('bi','bi-send-fill','no-click');
    butonCheck.appendChild(iconCheck);

    let butonLess = document.createElement('button');
    butonLess.classList.add('btn','btn-outline-success','less');
    butonLess.addEventListener('click', function(event){
        cancelarIngreso(event);
    })
    contenedor.appendChild(butonLess);

    let iconLess = document.createElement('i');
    iconLess.classList.add('bi','bi-dash-circle','no-click');
    butonLess.appendChild(iconLess);

    let descripcion = document.createElement('input');
    descripcion.classList.add('descripcion');
    descripcion.placeholder = 'Descripcion';
    contenedor.appendChild(descripcion);

    let categoria = document.createElement('select'); //agregar mas categorias
    categoria.classList.add('categoria');
    contenedor.appendChild(categoria);

    let categoria_0 = document.createElement('option');
    categoria_0.appendChild(document.createTextNode('Categoria'));
    categoria_0.value="";
    categoria_0.disabled=true;
    categoria_0.selected=true;
    categoria_0.hidden=true;
    categoria.appendChild(categoria_0);

    let categoria_1 = document.createElement('option');
    categoria_1.appendChild(document.createTextNode('Trabajo'));
    categoria_1.value="Trabajo";
    categoria.appendChild(categoria_1);

    let cantidad = document.createElement('input');
    cantidad.classList.add('cantidad');
    cantidad.placeholder = 'Cantidad';
    cantidad.type = 'number';
    cantidad.step = 'any';
    cantidad.pattern = '[0-9,.]+';
    contenedor.appendChild(cantidad);

    var fecha = document.createElement('input');
    fecha.classList.add('fecha');
    fecha.id = 'fecha';
    fecha.type = 'date';
    fecha.name = 'fecha';
    fecha.min = setMinDate();
    contenedor.appendChild(fecha);

    BajarScroll(tuElemento);

}

// funcion para mandar los datos de un nuevo ingreso a la BD
async function ConfirmarIngreso(e){
    let contenedor = e.target.parentNode;
    let descripcion = contenedor.children[2].value;
    let categoria = contenedor.children[3].value;
    let valor = parseFloat(contenedor.children[4].value);
    let fecha = contenedor.children[5].value;

    if(descripcion && categoria && !isNaN(valor) && valor>0.0 && fecha){
        const nuevoIngreso = {
            Descripción: descripcion,
            Categoría: categoria,
            Cantidad: valor,
            Fecha: fecha,
            Repeticion: 1
        };

        supabase
        .from('Ingresos')
        .insert([nuevoIngreso])
        .then(({ error }) => {
            contenedor.parentNode.removeChild(contenedor);
                
            if (error) {
                alert('Error al agregar', error.message);
            }
        });
    await new Promise(resolve => setTimeout(resolve, 1000));
    location.reload();
        
    } else {
        alert('Por favor ingresa correctamente los datos');
    }
}

// Obtiene los ingresos almacenados en la BD y los muestra
function recuperarIngresos(id_ingreso,Descripción,Categoría,Cantidad,Fecha,Repeticion){
    let contenedorIngreso = document.getElementById('Contenedor-Ingresos');

    let contenedor = document.createElement('div');
    contenedor.classList.add('Ingreso');
    contenedorIngreso.appendChild(contenedor);

    let idIngreso = document.createElement('p');
    idIngreso.classList.add('oculto');
    idIngreso.innerText = id_ingreso;
    contenedor.appendChild(idIngreso);

    let butonModify = document.createElement('button');
    butonModify.classList.add('btn','btn-outline-success','modify');
    butonModify.addEventListener('click',function(event){
        modificarIngreso(event);
    })
    contenedor.appendChild(butonModify);

    let iconModify = document.createElement('i');
    iconModify.classList.add('bi','bi-pencil-square','no-click');
    butonModify.appendChild(iconModify);

    let butonLess = document.createElement('button');
    butonLess.classList.add('btn','btn-outline-success','less');
    butonLess.addEventListener('click', function(event){
        borrarIngreso(event);
    })
    contenedor.appendChild(butonLess);

    let iconLess = document.createElement('i');
    iconLess.classList.add('bi','bi-dash-circle','no-click');
    butonLess.appendChild(iconLess);

    let descripcion = document.createElement('p');
    descripcion.classList.add('descripcion');
    descripcion.textContent = Descripción;
    contenedor.appendChild(descripcion);

    let categoria = document.createElement('p');
    categoria.classList.add('categoria');
    categoria.textContent = Categoría;
    contenedor.appendChild(categoria);

    let cantidad = document.createElement('p');
    cantidad.classList.add('cantidad');
    cantidad.textContent = Cantidad;
    contenedor.appendChild(cantidad);

    let fecha = document.createElement('p');
    fecha.classList.add('fecha');
    fecha.textContent = Fecha;
    contenedor.appendChild(fecha);

    let repeticion = document.createElement('h1');
    repeticion.classList.add('repeticion');
    repeticion.textContent = Repeticion;
    contenedor.appendChild(repeticion);

}

// Modifica valores de un Ingreso en la BD
async function modificarIngreso(e){
    let contenedorIngreso = document.getElementById('Contenedor-Ingresos');
    let ingreso = e.target.parentNode;
    let descripcion = ingreso.children[3].innerText;
    let categoria = ingreso.children[4].innerText;
    let cantidad = ingreso.children[5].innerText;
    let fecha = ingreso.children[6].innerText;
    let repeticion = ingreso.children[7].innerText;

    ingreso.parentNode.removeChild(ingreso)

    let contenedor = document.createElement('div');
    contenedor.classList.add('Ingreso');
    contenedorIngreso.appendChild(contenedor);

    let butonCheck = document.createElement('button');
    butonCheck.classList.add('btn','btn-outline-success');
    butonCheck.addEventListener('click',function(event){
        ConfirmarIngreso(event);
    })
    contenedor.appendChild(butonCheck);

    let iconCheck = document.createElement('i');
    iconCheck.classList.add('bi','bi-send-fill','no-click');
    butonCheck.appendChild(iconCheck);

    let Nuevadescripcion = document.createElement('input');
    Nuevadescripcion.classList.add('descripcion');
    Nuevadescripcion.placeholder = 'Descripcion';
    Nuevadescripcion.value = descripcion;
    contenedor.appendChild(Nuevadescripcion);

    let Nuevacategoria = document.createElement('select');
    Nuevacategoria.classList.add('categoria');
    Nuevacategoria.value = categoria.innerText;
    contenedor.appendChild(Nuevacategoria);

    let categoria_0 = document.createElement('option');
    categoria_0.appendChild(document.createTextNode(categoria));
    categoria_0.value= categoria;
    categoria_0.disabled=true;
    categoria_0.selected=true;
    categoria_0.hidden=true;
    Nuevacategoria.appendChild(categoria_0);

    let categoria_1 = document.createElement('option');
    categoria_1.appendChild(document.createTextNode('Trabajo'));
    categoria_1.value="Trabajo";
    Nuevacategoria.appendChild(categoria_1);

    let Nuevacantidad = document.createElement('input');
    Nuevacantidad.classList.add('cantidad');
    Nuevacantidad.value = cantidad;
    Nuevacantidad.placeholder = 'Cantidad';
    Nuevacantidad.type = 'number';
    Nuevacantidad.step = 'any';
    Nuevacantidad.pattern = '[0-9,.]+';
    contenedor.appendChild(Nuevacantidad);

    var Nuevafecha = document.createElement('input');
    Nuevafecha.classList.add('fecha');
    Nuevafecha.value = fecha;
    Nuevafecha.id = 'fecha';
    Nuevafecha.type = 'date';
    Nuevafecha.name = 'fecha';
    Nuevafecha.min = setMinDate();
    contenedor.appendChild(Nuevafecha);

    let contenedorBotones = document.createElement('div');
    contenedorBotones.classList.add('más-menos');
    contenedor.appendChild(contenedorBotones);

    // let botonMas = document.createElement('button');
    // contenedorBotones.appendChild(botonMas);

    // let iconbotonMas = document.createElement('i');
    // iconbotonMas.classList.add('bi', 'bi-caret-up');
    // botonMas.appendChild(iconbotonMas);

    // let botonMenos = document.createElement('button');
    // contenedorBotones.appendChild(botonMenos);

    // let iconbotonMenos = document.createElement('i');
    // iconbotonMenos.classList.add('bi', 'bi-caret-down');
    // botonMenos.appendChild(iconbotonMenos);

}

// Elimina un Ingreso de la BD
async function borrarIngreso(e){
    let ingreso = e.target.parentNode;
    let id = ingreso.children[0].textContent;

    supabase
    .from('Ingresos')
    .delete()
    .eq('id_ingreso', id)
    .then(({ error }) => {                
            if (error) {
                alert('Error al eliminar', error.message);
            }
        });

    await new Promise(resolve => setTimeout(resolve, 1000));
    location.reload();
}

function cancelarIngreso(e){
    let contenedor = e.target.parentNode;
    contenedor.parentNode.removeChild(contenedor);
}

// -------------------------------------------------------------------------------------------

// delimita la fecha limite el dia actual
function setMinDate() {
    // Obtén la fecha y hora actual en la zona horaria local
    const today = new Date();
    
    // Ajusta la fecha y hora a la zona horaria local
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);

    // Formatea la fecha como YYYY-MM-DD
    const formattedDate = localDate.toISOString().split('T')[0];

    // Establece el valor mínimo del input de fecha
    return formattedDate;
}

// Baja el scroll en el contenedor indicado
function BajarScroll(tuElemento) {
  // Hacer que el scroll vaya al final después de procesar datos
  let elementoScroll = document.getElementById(tuElemento);
  elementoScroll.scrollTop = elementoScroll.scrollHeight;
}

// -------------------------------------------------------------------------------------------

// Eventos de botones
botonAgregarIngreso.addEventListener('click', async function(){
    agregarIngreso('Contenedor-Ingresos');
});
