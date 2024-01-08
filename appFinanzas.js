// Conexion con la BD en SupaBase
import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const supabaseUrl = "https://qmpzbehmfbbtrapbgdby.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtcHpiZWhtZmJidHJhcGJnZGJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzE2MDczMSwiZXhwIjoyMDE4NzM2NzMxfQ.Ql3vNr_ppETAIbnUc2vMOlnibUb_u9ypVfYB0d0MgE4";

// Crea una instancia del cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Ingresos
supabase
  .from('Ingresos')
  .select('id_ingreso,Descripción,Categoría,Cantidad,Fecha,Tipo')
  .then(({ data, error }) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
    } else {
        const datos = ordenarElementos(data);
        datos.forEach(row => {
            recuperarIngresos(row.id_ingreso, row.Descripción, row.Categoría, row.Cantidad, row.Fecha,row.Tipo);
        });
    }
});

// Gastos
supabase
  .from('Gastos')
  .select('id_Gasto,Descripción,Categoría,Cantidad,Fecha,Tipo')
  .then(({ data, error }) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
    } else {
        const datos = ordenarElementos(data);
        datos.forEach(row => {
            recuperarGastos(row.id_Gasto, row.Descripción, row.Categoría, row.Cantidad, row.Fecha,row.Tipo);
        });
    }
});

// Suscripciones
supabase
  .from('Suscripciones')
  .select('id_Suscripcion,Descripción,Categoría,Cantidad,Periodo_Pago,fecha_inicio')
  .then(({ data, error }) => {
    if (error) {
      console.error('Error al realizar la consulta:', error);
    } else {
        data.forEach(row => {
            recuperarSuscripciones(row.id_Suscripcion,row.Descripción,row.Categoría,row.Cantidad,row.Periodo_Pago,row.fecha_inicio);
        });
    }
});


// -----------------------------------------------------------------------------------

// Asignacion de elementos HTML
let botonAgregarIngreso = document.querySelector('.Lista-Ingresos .add');
let botonAgregarGasto = document.querySelector('.Lista-Gastos .add');
let botonAgregarSuscripcion = document.querySelector('.Suscripciones .add');

// -----------------------------------------------------------------------------------

// funcion para ingresar los datos de un nuevo Ingreso
function agregarIngreso(tuElemento){
    let contenedorIngreso = document.getElementById(tuElemento);

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
    butonLess.classList.add('btn','btn-outline-success');
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

    let categoria = document.createElement('select');
    categoria.classList.add('categoria');
    contenedor.appendChild(categoria);

    let categoria_0 = document.createElement('option');
    categoria_0.appendChild(document.createTextNode('Categoria'));
    categoria_0.value="";
    categoria_0.disabled=true;
    categoria_0.selected=true;
    categoria_0.hidden=true;
    categoria.appendChild(categoria_0);

    agregarOpciones(categoria,'Ingreso');

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
    contenedor.appendChild(fecha);

    var botonTipo = document.createElement('button');
    botonTipo.classList.add('btn','btn-outline-success','tipo');
    botonTipo.addEventListener('click',function(){
        if(this.children[0].classList.contains('bi-bank')){
            this.children[0].classList.add('bi-coin');
            this.children[0].classList.remove('bi-bank');
        } else {
            this.children[0].classList.add('bi-bank');
            this.children[0].classList.remove('bi-coin');
        }
    })
    contenedor.appendChild(botonTipo);

    var iconBotonTipo = document.createElement('i');
    iconBotonTipo.classList.add('bi','bi-bank','no-click');
    botonTipo.appendChild(iconBotonTipo);

    BajarScroll(tuElemento);

}

// Si el usuario agrega un nuevo ingreso puede cancelarlo
function cancelarIngreso(e){
    let contenedor = e.target.parentNode;
    contenedor.parentNode.removeChild(contenedor);
}

// funcion para mandar los datos de un nuevo ingreso a la BD
async function ConfirmarIngreso(e){
    let contenedor = e.target.parentNode;
    let descripcion = contenedor.children[2].value;
    let categoria = contenedor.children[3].value;
    let valor = parseFloat(contenedor.children[4].value);
    let fecha = contenedor.children[5].value;
    let tipo = '';

    if(contenedor.children[6].children[0].classList.contains('bi-bank')){
        tipo = 'Banco';
    } else {
        tipo = 'Efectivo';
    }

    if(descripcion && categoria && !isNaN(valor) && valor>0.0 && fecha){
        const nuevoIngreso = {
            Descripción: descripcion,
            Categoría: categoria,
            Cantidad: valor,
            Fecha: fecha,
            Tipo: tipo
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
function recuperarIngresos(id_ingreso,Descripción,Categoría,Cantidad,Fecha,Tipo){
    let contenedorIngreso = document.getElementById('Contenedor-Ingresos');

    let contenedor = document.createElement('div');
    contenedor.classList.add('Ingreso');
    contenedorIngreso.appendChild(contenedor);

    let idIngreso = document.createElement('p');
    idIngreso.classList.add('oculto');
    idIngreso.innerText = id_ingreso;
    contenedor.appendChild(idIngreso);

    let butonModify = document.createElement('button');
    butonModify.classList.add('btn','btn-outline-success');
    butonModify.addEventListener('click',function(event){
        modificarIngreso(event);
    })
    contenedor.appendChild(butonModify);

    let iconModify = document.createElement('i');
    iconModify.classList.add('bi','bi-pencil-square','no-click');
    butonModify.appendChild(iconModify);

    let butonLess = document.createElement('button');
    butonLess.classList.add('btn','btn-outline-success');
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
    cantidad.textContent = '$'+Cantidad;
    contenedor.appendChild(cantidad);

    let fecha = document.createElement('p');
    fecha.classList.add('fecha');
    fecha.textContent = Fecha;
    contenedor.appendChild(fecha);

    let tipo = document.createElement('i');
    tipo.classList.add('bi','tipo');
    if(Tipo === 'Banco'){
        tipo.classList.add('bi-bank');
    } else {
        tipo.classList.add('bi-coin');
    }
    contenedor.appendChild(tipo);

}

// Modifica valores de un Ingreso en la BD
async function modificarIngreso(e){
    let ingreso = e.target.parentNode;
    let id = ingreso.children[0].innerText;
    let descripcion = ingreso.children[3].innerText;
    let categoria = ingreso.children[4].innerText;
    let cantidad = ingreso.children[5].innerText;
    let fecha = ingreso.children[6].innerText;

    ingreso.removeChild(ingreso.children[1]);

    let butonCheck = document.createElement('button');
    butonCheck.classList.add('btn','btn-outline-success');
    butonCheck.addEventListener('click',function(event){
        actualizarIngreso(event,id);
    })

    let iconCheck = document.createElement('i');
    iconCheck.classList.add('bi','bi-send-fill','no-click');
    butonCheck.appendChild(iconCheck);
    ingreso.children[1].replaceWith(butonCheck);

    let Nuevadescripcion = document.createElement('input');
    Nuevadescripcion.classList.add('descripcion');
    Nuevadescripcion.placeholder = 'Descripcion';
    Nuevadescripcion.value = descripcion;
    ingreso.children[2].replaceWith(Nuevadescripcion);

    let Nuevacategoria = document.createElement('select');
    Nuevacategoria.classList.add('categoria');
    Nuevacategoria.value = categoria.innerText;
    ingreso.children[3].replaceWith(Nuevacategoria);

    let categoria_0 = document.createElement('option');
    categoria_0.appendChild(document.createTextNode(categoria));
    categoria_0.value= categoria;
    categoria_0.disabled=true;
    categoria_0.selected=true;
    categoria_0.hidden=true;
    Nuevacategoria.appendChild(categoria_0);

    agregarOpciones(Nuevacategoria,'Ingreso');

    let Nuevacantidad = document.createElement('input');
    Nuevacantidad.classList.add('cantidad');
    Nuevacantidad.value = cantidad.replace(/\$/g, '');;
    Nuevacantidad.placeholder = 'Cantidad';
    Nuevacantidad.type = 'number';
    Nuevacantidad.step = 'any';
    Nuevacantidad.pattern = '[0-9,.]+';
    ingreso.children[4].replaceWith(Nuevacantidad);

    var Nuevafecha = document.createElement('input');
    Nuevafecha.classList.add('fecha');
    Nuevafecha.value = fecha;
    Nuevafecha.id = 'fecha';
    Nuevafecha.type = 'date';
    Nuevafecha.name = 'fecha';
    ingreso.children[5].replaceWith(Nuevafecha);

    var Nuevotipo = document.createElement('button');
    Nuevotipo.classList.add('btn','btn-outline-success');
    Nuevotipo.addEventListener('click',function(){
        if(this.children[0].classList.contains('bi-bank')){
            this.children[0].classList.add('bi-coin');
            this.children[0].classList.remove('bi-bank');
        } else {
            this.children[0].classList.add('bi-bank');
            this.children[0].classList.remove('bi-coin');
        }
    })

    var iconNuevotipo = document.createElement('i');
    if(ingreso.children[6].classList.contains('bi-bank')){
        iconNuevotipo.classList.add('bi','bi-bank','no-click');
    } else{
        iconNuevotipo.classList.add('bi','bi-coin','no-click');
    }
    Nuevotipo.appendChild(iconNuevotipo);
    ingreso.children[6].replaceWith(Nuevotipo);

}

// Actualiza en la BD los datos del ingreso
async function actualizarIngreso(e,id){
    let contenedor = e.target.parentNode;
    let descripcion = contenedor.children[2].value;
    let categoria = contenedor.children[3].value;
    let cantidad = parseFloat(contenedor.children[4].value);
    let fecha = contenedor.children[5].value;
    let tipo = '';

    if(contenedor.children[6].children[0].classList.contains('bi-bank')){
        tipo = 'Banco';
    } else {
        tipo = 'Efectivo';
    }

    if(descripcion && categoria && !isNaN(cantidad) && (cantidad>0.0) && fecha ){
        const ingresoActualizado = {
            Descripción: descripcion,
            Categoría: categoria,
            Cantidad: cantidad,
            Fecha: fecha,
            Tipo: tipo
        };

        supabase
        .from('Ingresos')
        .update([ingresoActualizado])
        .eq('id_ingreso', id)
        .then(({ error }) => {                
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

async function reflejarIngresos() {
    let cantidadEfectivo = 0;
    let cantidadBanco = 0;

    const { data } = await supabase.from('Ingresos').select('Cantidad, Tipo');
    data.forEach(row => {
        if (row.Tipo === 'Efectivo') {
            cantidadEfectivo += row.Cantidad;
        } else if (row.Tipo === 'Banco') {
            cantidadBanco += row.Cantidad;
        }
    });
    return [cantidadEfectivo, cantidadBanco];
}

// -----------------------------------------------------------------------------------

// funcion para ingresar los datos de un nuevo Gasto
function AgregarGasto(tuElemento){
    let contenedorGasto = document.getElementById(tuElemento);

    let contenedor = document.createElement('div');
    contenedor.classList.add('Gasto');
    contenedorGasto.appendChild(contenedor);

    let butonCheck = document.createElement('button');
    butonCheck.classList.add('btn','btn-outline-success');
    butonCheck.addEventListener('click',function(event){
        ConfirmarGasto(event);
    })
    contenedor.appendChild(butonCheck);

    let iconCheck = document.createElement('i');
    iconCheck.classList.add('bi','bi-send-fill','no-click');
    butonCheck.appendChild(iconCheck);

    let butonLess = document.createElement('button');
    butonLess.classList.add('btn','btn-outline-success');
    butonLess.addEventListener('click', function(event){
        cancelarGasto(event);
    })
    contenedor.appendChild(butonLess);

    let iconLess = document.createElement('i');
    iconLess.classList.add('bi','bi-dash-circle','no-click');
    butonLess.appendChild(iconLess);

    let descripcion = document.createElement('input');
    descripcion.classList.add('descripcion');
    descripcion.placeholder = 'Descripcion';
    contenedor.appendChild(descripcion);

    let categoria = document.createElement('select');
    categoria.classList.add('categoria');
    contenedor.appendChild(categoria);

    let categoria_0 = document.createElement('option');
    categoria_0.appendChild(document.createTextNode('Categoria'));
    categoria_0.value="";
    categoria_0.disabled=true;
    categoria_0.selected=true;
    categoria_0.hidden=true;
    categoria.appendChild(categoria_0);

    agregarOpciones(categoria,'Gasto');

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
    contenedor.appendChild(fecha);

    var botonTipo = document.createElement('button');
    botonTipo.classList.add('btn','btn-outline-success','tipo');
    botonTipo.addEventListener('click',function(){
        console.log(this.children[0].classList);
        if(this.children[0].classList.contains('bi-bank')){
            this.children[0].classList.add('bi-coin');
            this.children[0].classList.remove('bi-bank');
        } else {
            this.children[0].classList.add('bi-bank');
            this.children[0].classList.remove('bi-coin');
        }
    })
    contenedor.appendChild(botonTipo);

    var iconBotonTipo = document.createElement('i');
    iconBotonTipo.classList.add('bi','bi-bank','no-click');
    botonTipo.appendChild(iconBotonTipo);
    
    BajarScroll(tuElemento);
}

// Si el usuario agrega un nuevo Gasto puede cancelarlo
function cancelarGasto(e){
    let contenedor = e.target.parentNode;
    contenedor.parentNode.removeChild(contenedor);
}

// funcion para mandar los datos de un nuevo ingreso a la BD
async function ConfirmarGasto(e){
    let contenedor = e.target.parentNode;
    let descripcion = contenedor.children[2].value;
    let categoria = contenedor.children[3].value;
    let valor = parseFloat(contenedor.children[4].value);
    let fecha = contenedor.children[5].value;
    let tipo = '';

    if(contenedor.children[6].children[0].classList.contains('bi-bank')){
        tipo = 'Banco';
    } else {
        tipo = 'Efectivo';
    }

    if(descripcion && categoria && !isNaN(valor) && valor>0.0 && fecha){
        const nuevoGasto = {
            Descripción: descripcion,
            Categoría: categoria,
            Cantidad: valor,
            Fecha: fecha,
            Tipo: tipo
        };

        supabase
        .from('Gastos')
        .insert([nuevoGasto])
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

// Obtiene los gastos almacenados en la BD y los muestra
function recuperarGastos(id_Gasto,Descripción,Categoría,Cantidad,Fecha,Tipo){
    let contenedorGasto = document.getElementById('Contenedor-Gastos');

    let contenedor = document.createElement('div');
    contenedor.classList.add('Gasto');
    contenedorGasto.appendChild(contenedor);

    let idGasto = document.createElement('p');
    idGasto.classList.add('oculto');
    idGasto.innerText = id_Gasto;
    contenedor.appendChild(idGasto);

    let butonModify = document.createElement('button');
    butonModify.classList.add('btn','btn-outline-success');
    butonModify.addEventListener('click',function(event){
        modificarGasto(event);
    })
    contenedor.appendChild(butonModify);

    let iconModify = document.createElement('i');
    iconModify.classList.add('bi','bi-pencil-square','no-click');
    butonModify.appendChild(iconModify);

    let butonLess = document.createElement('button');
    butonLess.classList.add('btn','btn-outline-success');
    butonLess.addEventListener('click', function(event){
        borrarGasto(event);
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
    cantidad.textContent = '$'+Cantidad;
    contenedor.appendChild(cantidad);

    let fecha = document.createElement('p');
    fecha.classList.add('fecha');
    fecha.textContent = Fecha;
    contenedor.appendChild(fecha);

    let tipo = document.createElement('i');
    tipo.classList.add('bi','tipo');
    if(Tipo === 'Banco'){
        tipo.classList.add('bi-bank');
    } else {
        tipo.classList.add('bi-coin');
    }
    contenedor.appendChild(tipo);
}

// Modifica valores de un Ingreso en la BD
async function modificarGasto(e){
    let gasto = e.target.parentNode;
    let id = gasto.children[0].innerText;
    let descripcion = gasto.children[3].innerText;
    let categoria = gasto.children[4].innerText;
    let cantidad = gasto.children[5].innerText;
    let fecha = gasto.children[6].innerText;

    gasto.removeChild(gasto.children[1]);

    let butonCheck = document.createElement('button');
    butonCheck.classList.add('btn','btn-outline-success');
    butonCheck.addEventListener('click',function(event){
        actualizarGasto(event,id);
    })

    let iconCheck = document.createElement('i');
    iconCheck.classList.add('bi','bi-send-fill','no-click');
    butonCheck.appendChild(iconCheck);

    gasto.children[1].replaceWith(butonCheck);

    let Nuevadescripcion = document.createElement('input');
    Nuevadescripcion.classList.add('descripcion');
    Nuevadescripcion.placeholder = 'Descripcion';
    Nuevadescripcion.value = descripcion;
    gasto.children[2].replaceWith(Nuevadescripcion);

    let Nuevacategoria = document.createElement('select');
    Nuevacategoria.classList.add('categoria');
    Nuevacategoria.value = categoria.innerText;
    gasto.children[3].replaceWith(Nuevacategoria);

    let categoria_0 = document.createElement('option');
    categoria_0.appendChild(document.createTextNode(categoria));
    categoria_0.value= categoria;
    categoria_0.disabled=true;
    categoria_0.selected=true;
    categoria_0.hidden=true;
    Nuevacategoria.appendChild(categoria_0);

    agregarOpciones(Nuevacategoria,'Gasto');

    let Nuevacantidad = document.createElement('input');
    Nuevacantidad.classList.add('cantidad');
    Nuevacantidad.value = cantidad.replace(/\$/g, '');
    Nuevacantidad.placeholder = 'Cantidad';
    Nuevacantidad.type = 'number';
    Nuevacantidad.step = 'any';
    Nuevacantidad.pattern = '[0-9,.]+';
    gasto.children[4].replaceWith(Nuevacantidad);

    var Nuevafecha = document.createElement('input');
    Nuevafecha.classList.add('fecha');
    Nuevafecha.value = fecha;
    Nuevafecha.id = 'fecha';
    Nuevafecha.type = 'date';
    Nuevafecha.name = 'fecha';
    gasto.children[5].replaceWith(Nuevafecha);

    var Nuevotipo = document.createElement('button');
    Nuevotipo.classList.add('btn','btn-outline-success');
    Nuevotipo.addEventListener('click',function(){
        if(this.children[0].classList.contains('bi-bank')){
            this.children[0].classList.add('bi-coin');
            this.children[0].classList.remove('bi-bank');
        } else {
            this.children[0].classList.add('bi-bank');
            this.children[0].classList.remove('bi-coin');
        }
    })

    var iconNuevotipo = document.createElement('i');
    if(gasto.children[6].classList.contains('bi-bank')){
        iconNuevotipo.classList.add('bi','bi-bank','no-click');
    } else{
        iconNuevotipo.classList.add('bi','bi-coin','no-click');
    }
    Nuevotipo.appendChild(iconNuevotipo);
    gasto.children[6].replaceWith(Nuevotipo);
}

// Actualiza en la BD los datos del gasto
async function actualizarGasto(e,id){
    let contenedor = e.target.parentNode;
    let descripcion = contenedor.children[2].value;
    let categoria = contenedor.children[3].value;
    let cantidad = parseFloat(contenedor.children[4].value);
    let fecha = contenedor.children[5].value;
    let tipo = '';

    if(contenedor.children[6].children[0].classList.contains('bi-bank')){
        tipo = 'Banco';
    } else {
        tipo = 'Efectivo';
    }

    if(descripcion && categoria && !isNaN(cantidad) && (cantidad>0.0) && fecha){
        const GastoActualizado = {
            Descripción: descripcion,
            Categoría: categoria,
            Cantidad: cantidad,
            Fecha: fecha,
            Tipo: tipo
        };

        supabase
        .from('Gastos')
        .update([GastoActualizado])
        .eq('id_Gasto', id)
        .then(({ error }) => {                
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

// Elimina un Gasto de la BD
async function borrarGasto(e){
    let ingreso = e.target.parentNode;
    let id = ingreso.children[0].textContent;

    supabase
    .from('Gastos')
    .delete()
    .eq('id_Gasto', id)
    .then(({ error }) => {                
            if (error) {
                alert('Error al eliminar', error.message);
            }
        });

    await new Promise(resolve => setTimeout(resolve, 1000));
    location.reload();
}

async function reflejarGastos(ingresoEfectivo,ingresoBanco) {
    let Efectivo = document.querySelector('.efectivo');
    let Banco = document.querySelector('.banco');
    let gastoEfectivo = parseFloat(Efectivo.children[1].innerText.replace(/\$/g, ''));
    let gastoBanco = parseFloat(Banco.children[1].innerText.replace(/\$/g, ''));

    const { data } = await supabase.from('Gastos').select('Cantidad, Tipo');
    data.forEach(row => {
        if (row.Tipo === 'Efectivo') {
            gastoEfectivo += row.Cantidad;
        } else if (row.Tipo === 'Banco') {
            gastoBanco += row.Cantidad;
        }
    });
    return [ingresoEfectivo-gastoEfectivo, ingresoBanco-gastoBanco];
}

// -----------------------------------------------------------------------------------

// funcion para ingresar los datos de una nueva Suscripcion
function AgregarSuscripcion(tuElemento){
    let contenedorSuscripcion = document.getElementById(tuElemento);

    let contenedor = document.createElement('div');
    contenedor.classList.add('Suscripcion');
    contenedorSuscripcion.appendChild(contenedor);

    let butonCheck = document.createElement('button');
    butonCheck.classList.add('btn','btn-outline-success');
    butonCheck.addEventListener('click',function(event){
        ConfirmarSuscripcion(event);
    })
    contenedor.appendChild(butonCheck);

    let iconCheck = document.createElement('i');
    iconCheck.classList.add('bi','bi-send-fill','no-click');
    butonCheck.appendChild(iconCheck);

    let butonLess = document.createElement('button');
    butonLess.classList.add('btn','btn-outline-success');
    butonLess.addEventListener('click', function(event){
        cancelarSuscripcion(event);
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

    agregarOpciones(categoria,'Suscripcion-Categoria');

    let cantidad = document.createElement('input');
    cantidad.classList.add('cantidad');
    cantidad.placeholder = 'Cantidad';
    cantidad.type = 'number';
    cantidad.step = 'any';
    cantidad.pattern = '[0-9,.]+';
    contenedor.appendChild(cantidad);

    let periodo = document.createElement('select');
    periodo.classList.add('periodo');
    contenedor.appendChild(periodo);

    let periodo_0 = document.createElement('option');
    periodo_0.appendChild(document.createTextNode('Periodo'));
    periodo_0.value="";
    periodo_0.disabled=true;
    periodo_0.selected=true;
    periodo_0.hidden=true;
    periodo.appendChild(periodo_0);

    agregarOpciones(periodo,'Suscripcion-Periodo');

    var fecha = document.createElement('input');
    fecha.classList.add('fecha');
    fecha.id = 'fecha';
    fecha.type = 'date';
    fecha.name = 'fecha';
    contenedor.appendChild(fecha);

    BajarScroll(tuElemento);
}

// Si el usuario agrega una nueva Suscripcion puede cancelarlo
function cancelarSuscripcion(e){
    let contenedor = e.target.parentNode;
    contenedor.parentNode.removeChild(contenedor);
}

// funcion para mandar los datos de una nueva Suscripcion a la BD
async function ConfirmarSuscripcion(e){
    let contenedor = e.target.parentNode;
    let descripcion = contenedor.children[2].value;
    let categoria = contenedor.children[3].value;
    let cantidad = parseFloat(contenedor.children[4].value);
    let periodo = contenedor.children[5].value;
    let fecha = contenedor.children[6].value;

    if(descripcion && categoria && !isNaN(cantidad) && cantidad>0.0 && periodo && fecha){
        const nuevaSuscripcion = {
            Descripción: descripcion,
            Categoría: categoria,
            Cantidad: cantidad,
            Periodo_Pago: periodo,
            fecha_inicio: fecha
        };

        supabase
        .from('Suscripciones')
        .insert([nuevaSuscripcion])
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

// Obtiene las Suscripciones almacenadas en la BD y las muestra
function recuperarSuscripciones(id_suscripcion,Descripción,Categoría,Cantidad,Periodo_Pago,fecha_creacion){
    let contenedorSuscripciones = document.getElementById('Contenedor-Suscripciones');

    let contenedor = document.createElement('div');
    contenedor.classList.add('Suscripcion');
    contenedorSuscripciones.appendChild(contenedor);

    let idSuscripcion = document.createElement('p');
    idSuscripcion.classList.add('oculto');
    idSuscripcion.innerText = id_suscripcion;
    contenedor.appendChild(idSuscripcion);

    let butonModify = document.createElement('button');
    butonModify.classList.add('btn','btn-outline-success');
    butonModify.addEventListener('click',function(event){
        modificarSuscripcion(event);
    })
    contenedor.appendChild(butonModify);

    let iconModify = document.createElement('i');
    iconModify.classList.add('bi','bi-pencil-square','no-click');
    butonModify.appendChild(iconModify);

    let butonLess = document.createElement('button');
    butonLess.classList.add('btn','btn-outline-success');
    butonLess.addEventListener('click', function(event){
        borrarSuscripcion(event);
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
    cantidad.textContent = '$'+Cantidad;
    contenedor.appendChild(cantidad);

    let Periodo = document.createElement('p');
    Periodo.classList.add('periodo');
    Periodo.textContent = Periodo_Pago;
    contenedor.appendChild(Periodo);

    let repeticion = document.createElement('h1');
    repeticion.classList.add('repeticion');
    if(Periodo_Pago === 'Semanal'){
        repeticion.textContent = calcularDistanciaSemanas(fecha_creacion);
    } else if(Periodo_Pago === 'Mensual'){
        repeticion.textContent = calcularDistanciaMeses(fecha_creacion);
    } else {
        repeticion.textContent = calcularDistanciaAnos(fecha_creacion);
    }

    contenedor.appendChild(repeticion);
}

// Modifica valores de una Suscripcion en la BD
async function modificarSuscripcion(e){
    let suscripcion = e.target.parentNode;
    let id = parseInt(suscripcion.children[0].innerText);
    let descripcion = suscripcion.children[3].innerText;
    let categoria = suscripcion.children[4].innerText;
    let cantidad = suscripcion.children[5].innerText;
    let periodo = suscripcion.children[6].innerText;
    
    suscripcion.removeChild(suscripcion.children[1]);

    let butonCheck = document.createElement('button');
    butonCheck.classList.add('btn','btn-outline-success');
    butonCheck.addEventListener('click',function(event){
        actualizarSuscripcion(event,id);
    })

    let iconCheck = document.createElement('i');
    iconCheck.classList.add('bi','bi-send-fill','no-click');
    butonCheck.appendChild(iconCheck);

    suscripcion.children[1].replaceWith(butonCheck);

    let Nuevadescripcion = document.createElement('input');
    Nuevadescripcion.classList.add('descripcion');
    Nuevadescripcion.placeholder = 'Descripcion';
    Nuevadescripcion.value = descripcion;
    suscripcion.children[2].replaceWith(Nuevadescripcion);

    let Nuevacategoria = document.createElement('select');
    Nuevacategoria.classList.add('categoria');
    Nuevacategoria.value = categoria.innerText;
    suscripcion.children[3].replaceWith(Nuevacategoria);

    let categoria_0 = document.createElement('option');
    categoria_0.appendChild(document.createTextNode(categoria));
    categoria_0.value= categoria;
    categoria_0.disabled=true;
    categoria_0.selected=true;
    categoria_0.hidden=true;
    Nuevacategoria.appendChild(categoria_0);

    agregarOpciones(Nuevacategoria,'Suscripcion-Categoria');

    let Nuevacantidad = document.createElement('input');
    Nuevacantidad.classList.add('cantidad');
    Nuevacantidad.value = cantidad.replace(/\$/g, '');
    Nuevacantidad.placeholder = 'Cantidad';
    Nuevacantidad.type = 'number';
    Nuevacantidad.step = 'any';
    Nuevacantidad.pattern = '[0-9,.]+';
    suscripcion.children[4].replaceWith(Nuevacantidad);

    let NuevoPeriodo = document.createElement('select');
    NuevoPeriodo.classList.add('periodo');
    NuevoPeriodo.value = periodo.innerText;
    suscripcion.children[5].replaceWith(NuevoPeriodo);

    let periodo_0 = document.createElement('option');
    periodo_0.appendChild(document.createTextNode(periodo));
    periodo_0.value= periodo;
    periodo_0.disabled=true;
    periodo_0.selected=true;
    periodo_0.hidden=true;
    NuevoPeriodo.appendChild(periodo_0);

    agregarOpciones(NuevoPeriodo,'Suscripcion-Periodo');

    const { data } = await supabase
            .from('Suscripciones')
            .select('fecha_inicio')
            .eq('id_Suscripcion', id);
    
    var Nuevafecha = document.createElement('input');
    Nuevafecha.classList.add('fecha');
    Nuevafecha.value = data[0].fecha_inicio;
    Nuevafecha.id = 'fecha';
    Nuevafecha.type = 'date';
    Nuevafecha.name = 'fecha';
    suscripcion.children[6].replaceWith(Nuevafecha);

}

// Actualiza en la BD los datos de la Suscripcion
async function actualizarSuscripcion(e,id){
    let contenedor = e.target.parentNode;
    let descripcion = contenedor.children[2].value;
    let categoria = contenedor.children[3].value;
    let cantidad = parseFloat(contenedor.children[4].value);
    let periodo = contenedor.children[5].value;
    let fecha = contenedor.children[6].value;

    if(descripcion && categoria && !isNaN(cantidad) && (cantidad>0.0) && periodo && fecha){
         const SuscripcionActualizada = {
            Descripción: descripcion,
            Categoría: categoria,
            Cantidad: cantidad,
            Periodo_Pago: periodo,
            fecha_inicio: fecha
        };

        supabase
        .from('Suscripciones')
        .update([SuscripcionActualizada])
        .eq('id_Suscripcion', id)
        .then(({ error }) => {                
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

// Elimina una Suscripcion de la BD
async function borrarSuscripcion(e){
    let ingreso = e.target.parentNode;
    let id = ingreso.children[0].textContent;

    supabase
    .from('Suscripciones')
    .delete()
    .eq('id_Suscripcion', id)
    .then(({ error }) => {                
            if (error) {
                alert('Error al eliminar', error.message);
            }
        });

    await new Promise(resolve => setTimeout(resolve, 1000));
    location.reload();
}

async function reflejarSuscripciones(cantidadBanco) {
    let Banco = document.querySelector('.banco');
    let cantidad = parseFloat(Banco.children[1].innerText.replace(/\$/g, ''));

    const { data } = await supabase.from('Suscripciones').select('Cantidad,Periodo_Pago,fecha_inicio');
    data.forEach(row => {
        let años = calcularDistanciaAnos(row.fecha_inicio)
        let meses = calcularDistanciaMeses(row.fecha_inicio);
        let semanas = calcularDistanciaSemanas(row.fecha_inicio);

        if(row.Periodo_Pago === 'Anual'){
            cantidad += row.Cantidad*años;
        } else if (row.Periodo_Pago === 'Semanal'){
            cantidad += row.Cantidad*semanas;
        } else{
            cantidad += row.Cantidad*meses;
        }
    });
    return cantidadBanco-cantidad
}

async function SuscripcionesMes() {
    let cantidad = 0;

    const { data } = await supabase.from('Suscripciones').select('Cantidad,Periodo_Pago,fecha_inicio');
    data.forEach(row => {
        if(row.Periodo_Pago === 'Semanal'){
            let semanas = calcularDistanciaSemanas(row.fecha_inicio);
            cantidad += row.Cantidad*(4-semanas);
        } else if(row.Periodo_Pago === 'Mensual'){
            cantidad += (row.Cantidad*1);
        } 
    });
    return cantidad;
}

// -----------------------------------------------------------------------------------

//Ordena Elementos por fecha
function ordenarElementos(data) {
  return data.sort((a, b) => {
    const fechaA = new Date(a.Fecha);
    const fechaB = new Date(b.Fecha);
    return fechaB - fechaA;
  });
}

//Agrega las opciones de categoria en ingresos, gastos o suscripciones
function agregarOpciones(elemento,seccion){
    supabase
    .from('Categorias')
    .select('seccion,categoria')
    .then(({ data }) => {
        data.forEach(row => {
            if(row.seccion === seccion){
                let categoria = document.createElement('option');
                categoria.appendChild(document.createTextNode(row.categoria));
                categoria.value=row.categoria;
                elemento.appendChild(categoria);
            }
        });
    });
}

// Baja el scroll en el contenedor indicado
function BajarScroll(tuElemento) {
  // Hacer que el scroll vaya al final después de procesar datos
  let elementoScroll = document.getElementById(tuElemento);
  elementoScroll.scrollTop = elementoScroll.scrollHeight;
}

function calcularDistanciaAnos(fechaInicio) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(); // Si no se proporciona fechaFin, utiliza la fecha actual

    const diferenciaAnios = fin.getUTCFullYear() - inicio.getUTCFullYear();

    return diferenciaAnios;
}

function calcularDistanciaMeses(fechaInicio) {
    const inicio = new Date(fechaInicio);
    const fin =  new Date(); // Si no se proporciona fechaFin, utiliza la fecha actual

    const diferenciaAnios = fin.getUTCFullYear() - inicio.getUTCFullYear();
    const diferenciaMeses = fin.getUTCMonth() - inicio.getUTCMonth();

    const distanciaMeses = diferenciaAnios * 12 + diferenciaMeses;

    return distanciaMeses;
}

function calcularDistanciaSemanas(fechaInicio) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(); // Si no se proporciona fechaFin, utiliza la fecha actual

    const milisegundosEnSemana = 7 * 24 * 60 * 60 * 1000; // 7 días por semana
    const diferenciaEnMilisegundos = fin - inicio;

    const distanciaSemanas = Math.floor(diferenciaEnMilisegundos / milisegundosEnSemana);

    return distanciaSemanas;
}

function reflejaDineroDisponible() {
    let Efectivo = document.querySelector('.efectivo');
    let Banco = document.querySelector('.banco');
    let Total = document.querySelector('.total');
    let Disponible = document.querySelector('.disponible');

    reflejarIngresos()
    .then(([ingresoEfectivo, ingresoBanco]) => {
        reflejarGastos(ingresoEfectivo,ingresoBanco)
        .then(([cantidadEfectivo, gastoBanco]) => {
            Efectivo.children[1].innerText = '$'+cantidadEfectivo.toFixed(2);
            reflejarSuscripciones(gastoBanco)
            .then((cantidadBanco) => {
                Banco.children[1].innerText = '$'+cantidadBanco.toFixed(2);
                Total.children[1].innerText = '$'+(cantidadEfectivo+cantidadBanco).toFixed(2);
                SuscripcionesMes()
                .then((disponible) => {
                    Disponible.children[1].innerText = '$'+((cantidadEfectivo+cantidadBanco)-disponible).toFixed(2);
                })
            })
        })
    })
} reflejaDineroDisponible();

// -----------------------------------------------------------------------------------

// Eventos de botones
botonAgregarIngreso.addEventListener('click', function(){
    agregarIngreso('Contenedor-Ingresos');
});

botonAgregarGasto.addEventListener('click', function(){
    AgregarGasto('Contenedor-Gastos');
});

botonAgregarSuscripcion.addEventListener('click', function(){
    AgregarSuscripcion('Contenedor-Suscripciones');
});