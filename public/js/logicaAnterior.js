// Funciones para manejar LocalStorage
function obtenerPedidos() {
    return JSON.parse(localStorage.getItem('pedidos')) || [];
}

function guardarPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Obtener referencias a elementos del DOM
const formPedido = document.getElementById('formPedido');
const tablaPedidos = document.getElementById('tablaPedidos');
const btnLimpiar = document.getElementById('btnLimpiar');

// 📌 Función para agregar un pedido (Cliente)
if (formPedido) {
    formPedido.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombreInput = document.getElementById('nombre');
        const tipoComidaInput = document.getElementById('tipoComida');

        if (!nombreInput || !tipoComidaInput) return;

        const nombre = nombreInput.value.trim();
        const tipoComida = tipoComidaInput.value;

        if (nombre === "") {
            alert("Por favor ingrese su nombre");
            return;
        }

        const pedidos = obtenerPedidos();
        const nuevoPedido = {
            id: pedidos.length + 1,
            nombre,
            tipoComida,
            pagado: false,
            entregado: false
        };

        pedidos.push(nuevoPedido);
        guardarPedidos(pedidos);
        formPedido.reset();
        actualizarVistas();
    });
}

// 📌 Función para mostrar pedidos en la vista del cliente
function mostrarPedidosCliente() {
    const pedidos = obtenerPedidos();
    const lista = document.getElementById('listaPedidosCliente');
    if (!lista) return;

    lista.innerHTML = '';

    pedidos.forEach(pedido => {
        const li = document.createElement('li');
        li.textContent = `${pedido.nombre} - ${pedido.tipoComida} - ${pedido.pagado ? '✅ Pagado' : '❌ No Pagado'} - ${pedido.entregado ? '✅ Ticket Entregado' : '❌ Ticket No Entregado'}`;
        lista.appendChild(li);
    });
}

// 📌 Función para mostrar pedidos en la vista del cajero
function mostrarPedidosCajero() {
    const pedidos = obtenerPedidos();
    if (!tablaPedidos) return;

    tablaPedidos.innerHTML = '';

    pedidos.forEach((pedido, index) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${pedido.nombre}</td>
            <td>${pedido.tipoComida}</td>
            <td>${pedido.pagado ? '✅ Sí' : '❌ No'}</td>
            <td>${pedido.entregado ? '✅ Sí' : '❌ No'}</td>
            <td>
                <button onclick="marcarPagado(${index})" ${pedido.pagado ? 'disabled' : ''}>💵 Marcar Pagado</button>
                <button onclick="marcarEntregado(${index})" ${pedido.entregado ? 'disabled' : ''}>🎟 Marcar Entregado</button>
                <button class="btn-delete" data-id="${pedido.id}">❌ Eliminar</button>
            </td>
        `;

        tablaPedidos.appendChild(fila);
    });
}

// 📌 Función para marcar pedido como pagado
function marcarPagado(index) {
    const pedidos = obtenerPedidos();
    pedidos[index].pagado = true;
    guardarPedidos(pedidos);
    actualizarVistas();
}

// 📌 Función para marcar pedido como entregado
function marcarEntregado(index) {
    const pedidos = obtenerPedidos();
    pedidos[index].entregado = true;
    guardarPedidos(pedidos);
    actualizarVistas();
}

// 📌 Actualizar ambas vistas (cliente y cajero)
function actualizarVistas() {
    if (document.getElementById('listaPedidosCliente')) {
        mostrarPedidosCliente();
    }
    if (document.getElementById('tablaPedidos')) {
        mostrarPedidosCajero();
    }
    actualizarTotalPedidos();
}

// 📌 Función para mostrar el total de pedidos
function actualizarTotalPedidos() {
    const pedidos = obtenerPedidos();
    const totalPedidosElemento = document.getElementById('totalPedidos');
    if (totalPedidosElemento) {
        totalPedidosElemento.textContent = pedidos.length;
    }
}

// 📌 Evento para eliminar un pedido (Cajero)
if (tablaPedidos) {
    tablaPedidos.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-delete")) {
            const index = e.target.getAttribute("data-index");
            const pedidos = obtenerPedidos();
            pedidos.splice(index, 1);
            guardarPedidos(pedidos);
            actualizarVistas();
        }
    });
}

// 📌 Evento para limpiar todos los pedidos (Cajero)
if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
        if (confirm("¿Seguro que quieres borrar todos los pedidos del día?")) {
            localStorage.removeItem("pedidos");
            actualizarVistas();
        }
    });
}

// 🔄 Cargar los pedidos al iniciar
actualizarVistas();
