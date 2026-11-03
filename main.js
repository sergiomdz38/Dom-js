const movimientos = [
    { id: 1, tipo: 'Depósito', monto: 150000, fecha: '01/09/2025', descripcion: 'Acreditación de sueldo' },
    { id: 2, tipo: 'Extracción', monto: 1500, fecha: '26/10/2026', descripcion: 'Por cajero sucursal 2032' },
    { id: 3, tipo: 'Pago de servicio', monto: 500, fecha: '26/10/2026', descripcion: 'Pago de luz, octubre' }
];

let proximoId = 4;

const inputTipo = document.getElementById('input-tipo');
const inputMonto = document.getElementById('input-monto');
const inputDescripcion = document.getElementById('input-descripcion');
const botonAgregar = document.getElementById('boton-agregar');
const inputBuscador = document.getElementById('input-buscador');
const contenedorItems = document.getElementById('contenedor-items');
const mensajeFeedback = document.getElementById('mensaje-feedback');

if (!inputTipo || !inputMonto || !inputDescripcion || !botonAgregar || !inputBuscador || !contenedorItems || !mensajeFeedback) {
    console.error('Faltan elementos del DOM. Revisa los ids del HTML.');
} else {
    function formatearMonto(monto) {
        return `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }

    function mostrarMensaje(texto, tipo) {
        mensajeFeedback.textContent = texto;
        mensajeFeedback.className = tipo;
    }

    function renderizarMovimientos() {
        const texto = inputBuscador.value.trim().toLowerCase();
        const lista = movimientos.filter((movimiento) => {
            if (!texto) return true;
            return (
                movimiento.tipo.toLowerCase().includes(texto) ||
                movimiento.descripcion.toLowerCase().includes(texto)
            );
        });

        contenedorItems.innerHTML = '';

        if (lista.length === 0) {
            contenedorItems.innerHTML = '<p class="vacio">No hay movimientos para mostrar.</p>';
            return;
        }

        lista.forEach((movimiento) => {
            const item = document.createElement('div');
            item.className = 'item-movimiento';

            item.innerHTML = `
                <div>
                    <h3>${movimiento.tipo} — ${formatearMonto(movimiento.monto)}</h3>
                    <p>${movimiento.fecha} · ${movimiento.descripcion}</p>
                </div>
                <button type="button" class="boton-eliminar" data-id="${movimiento.id}">Eliminar</button>
            `;

            contenedorItems.appendChild(item);
        });
    }

    function agregarMovimiento() {
        const tipo = inputTipo.value.trim();
        const monto = Number(inputMonto.value);
        const descripcion = inputDescripcion.value.trim() || 'Sin descripción';

        if (!tipo) {
            mostrarMensaje('Escribe el tipo de movimiento.', 'error');
            inputTipo.focus();
            return;
        }

        if (!inputMonto.value || Number.isNaN(monto) || monto <= 0) {
            mostrarMensaje('Ingresa un monto válido.', 'error');
            inputMonto.focus();
            return;
        }

        movimientos.unshift({
            id: proximoId,
            tipo,
            monto,
            fecha: new Date().toLocaleDateString('es-ES'),
            descripcion
        });

        proximoId += 1;
        renderizarMovimientos();

        inputTipo.value = '';
        inputMonto.value = '';
        inputDescripcion.value = '';
        mostrarMensaje('Movimiento agregado.', 'exito');
        inputTipo.focus();
    }

    function eliminarMovimiento(id) {
        const index = movimientos.findIndex((movimiento) => movimiento.id === id);

        if (index !== -1) {
            movimientos.splice(index, 1);
            renderizarMovimientos();
            mostrarMensaje('Movimiento eliminado.', 'exito');
        }
    }

    botonAgregar.addEventListener('click', agregarMovimiento);
    inputBuscador.addEventListener('input', renderizarMovimientos);

    contenedorItems.addEventListener('click', (event) => {
        const boton = event.target.closest('.boton-eliminar');
        if (!boton) return;

        const id = Number(boton.dataset.id);
        eliminarMovimiento(id);
    });

    inputTipo.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') agregarMovimiento();
    });

    inputMonto.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') agregarMovimiento();
    });

    inputDescripcion.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') agregarMovimiento();
    });

    renderizarMovimientos();
}