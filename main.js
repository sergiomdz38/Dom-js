
class Movimiento {
    constructor(id, tipo, monto, fecha, descripcion) {
        this.id = id;
        this.tipo = tipo;
        this.monto = monto;
        this.fecha = fecha;
        this.descripcion = descripcion;
    }
}

const iniciales = [
    new Movimiento(1, "Depósito", 150000, "01/09/2025", "Acreditación de sueldo"),
    new Movimiento(2, "Extracción", 1500, "26/10/2026", "Por cajero sucursal 2032"),
    new Movimiento(3, "Pago de servicio", 500, "26/10/2026", "Pago de luz, octubre"),
];


const dataGuardada = JSON.parse(localStorage.getItem("movimientos")) ?? [];

const movimientos = dataGuardada?.length ? dataGuardada : iniciales;


let proximoId = movimientos.reduce((max, mov) => (mov.id > max ? mov.id : max), 0) + 1;


const inputTipo = document.getElementById("input-tipo");
const inputMonto = document.getElementById("input-monto");
const inputDescripcion = document.getElementById("input-descripcion");
const botonAgregar = document.getElementById("boton-agregar");
const inputBuscador = document.getElementById("input-buscador");
const contenedorItems = document.getElementById("contenedor-items");
const mensajeFeedback = document.getElementById("mensaje-feedback");


function guardarStorage() {
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
}


function mostrarMensaje(texto, tipo) {
    mensajeFeedback.textContent = texto;
    mensajeFeedback.className = tipo;
}


function renderizarMovimientos(lista) {
    contenedorItems.innerHTML = "";

  
    for (const { id, tipo, monto, fecha, descripcion } of lista) {
        contenedorItems.innerHTML += `
            <div class="item-movimiento">
                <div>
                    <h3>${tipo} — $${monto}</h3>       <!-- Huecos A6 y A7: SIN punto, ya no hace falta -->
                    <p>${fecha} · ${descripcion}</p>          <!-- Huecos A8 y A9 -->
                </div>
                <button class="boton-eliminar" onclick="eliminarMovimiento(${id})">Eliminar</button>  <!-- Hueco A10 -->
            </div>
        `;
    }
}

renderizarMovimientos(movimientos);
guardarStorage();  

botonAgregar.addEventListener("click", () => {
    const tipo = inputTipo.value;
    const monto = inputMonto.value;
    const descripcion = inputDescripcion.value;

    const camposCompletos = tipo !== "" && monto !== "" && descripcion !== "";

   
    camposCompletos ? agregarMovimiento(tipo, monto, descripcion) : mostrarMensaje("Completa todos los campos", "error");
});

function agregarMovimiento(tipo, monto, descripcion) {
    const nuevo = new Movimiento(proximoId, tipo, Number(monto), new Date().toLocaleDateString(), descripcion);

    movimientos.push(nuevo);   
    proximoId++;             
    guardarStorage();          
    renderizarMovimientos(movimientos);
    mostrarMensaje("✓ Movimiento agregado", "exito");

    inputTipo.value = "";
    inputMonto.value = "";
    inputDescripcion.value = "";
}

function eliminarMovimiento(idRecibido) {
    const encontrado = movimientos.find(mov => mov.id === idRecibido);
    const posicion = movimientos.indexOf(encontrado);

    if (posicion !== -1) {
        movimientos.splice(posicion, 1);
        guardarStorage();          
        renderizarMovimientos(movimientos);
        mostrarMensaje("✓ Movimiento eliminado", "exito");
    }
}

inputBuscador.addEventListener("input", () => {
    const texto = inputBuscador.value.toLowerCase();

    const filtrados = movimientos.filter(mov =>
        mov.tipo.toLowerCase().includes(texto) || mov.descripcion.toLowerCase().includes(texto)
    );

    renderizarMovimientos(filtrados);

    
    filtrados.length === 0 ? mostrarMensaje("No se encontraron movimientos", "error") : mostrarMensaje("", "");
});