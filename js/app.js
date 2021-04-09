const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

/* Variables Paginación */
let iterador;
let totalPaginas;
let paginaActual = 1;
const registroPorPagina = 40;

window.onload = () => {
    document.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    // const termino = document.querySelector('#termino').value;

    if (termino === '') {
        mostrarAlerta('Agrega Un Termino De Búsqueda');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.bg-red-100');

    if (!existeAlerta) {
        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">${mensaje}</span>
    `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

/* Pasar De Promesas A Async-Await */
async function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const APIkey = '18562936-1593d8d7fae666a52a1df73d9';
    const url = `https://pixabay.com/api/?key=${APIkey}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

    /*     fetch(url)
            .then(resp => resp.json())
            .then(data => {
                totalPaginas = calcularPaginas(data.totalHits);
                mostrarImagenes(data.hits);
            }); */

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        totalPaginas = calcularPaginas(data.totalHits);
        mostrarImagenes(data.hits);
    } catch (e) {
        console.log(e);
    }
}

/* Generador Que Va A Registrar(SOLO VA A REGISTRAR) La Cantidad De Paginas Necesarias De Acuerdo A La Operación Del Total De Elementos Entregados Por La Petición De La Api Y El Registro Por Pagina, En conclusión Va Registrar La Cantidad De Páginas De Forma Dinamica */
function* crearPaginador(totalPaginas) {
    for (let index = 1; index <= totalPaginas; index++) {
        yield index;
    }
}

/* Tecnica De Paginación Dinámica */
/* Siempre Se Debe Redondear Hacia Arriba (Math.ceil)*/
function calcularPaginas(totalElementosReq) {
    return parseInt(Math.ceil(totalElementosReq / registroPorPagina));
}

function mostrarImagenes(imagenes) {
    limpiarHTML();

    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
          <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
              <img class="w-full"  src="${previewURL}" />

              <div class="p-4">
                <p class="font-bold"> ${likes} <span class="font-light"> Me Gusta </span></p>
                <p class="font-bold"> ${views} <span class="font-light"> Veces Vista </span></p>

                <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center     rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> 
                  Ver Imagen 
                </a>
              </div>
            </div>
          </div>
        `;
    });

    /* Limpiar Paginado Previo */
    limpiarPaginador();

    /* Generamos Nuevo Paginador */
    imprimirPaginador();
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next();

        if (done) return;

        /* Caso Contrario Genera Un Boton Por Cada Elemento En El Generador */
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function limpiarPaginador() {
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
}