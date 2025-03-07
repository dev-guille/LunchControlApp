document.addEventListener("DOMContentLoaded", async () => {
    const formPedido = document.getElementById("formPedido");
    const listaPedidosCliente = document.getElementById("listaPedidosCliente");
    const tablaPedidos = document.getElementById("tablaPedidos");
    const totalPedidos = document.getElementById("totalPedidos");
    const btnLimpiar = document.getElementById("btnLimpiar");

    // Verificar en qué vista estamos
    const esAdmin = !!document.querySelector("table");

    // 📌 Función para obtener pedidos
    async function obtenerPedidos() {
        try {
            /* const res = await fetch("http://localhost:3000/pedidos"); *//* localmente */
            const res = await fetch("https://lunchcontrolapp.onrender.com/pedidos");/* Remotamente */
            const pedidos = await res.json();

            if (esAdmin) {
                renderPedidosAdmin(pedidos);
            } else {
                renderPedidosCliente(pedidos);
            }
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
        }
    }

    // 📌 Función para renderizar pedidos en la vista de cliente
    function renderPedidosCliente(pedidos) {
        listaPedidosCliente.innerHTML = "";
        pedidos.forEach(pedido => {
            const li = document.createElement("li");
            li.innerHTML = `${pedido.nombre} - ${pedido.tipoComida} ${pedido.pagado ? "✅" : "❌"} ${pedido.entregado ? "✅" : "❌"}`;
            listaPedidosCliente.appendChild(li);
        });
    }

    // 📌 Función para renderizar pedidos en la vista de administrador
    function renderPedidosAdmin(pedidos) {
        tablaPedidos.innerHTML = "";
        totalPedidos.textContent = pedidos.length;

        pedidos.forEach(pedido => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${pedido.nombre}</td>
                <td>${pedido.tipoComida}</td>
                <td>
                    <span data-id="${pedido._id}" class="toggle-pagado" style="cursor: pointer;">
                        ${pedido.pagado ? "✅" : "❌"}
                    </span>
                </td>
                <td>
                    <span data-id="${pedido._id}" class="toggle-entregado" style="cursor: pointer;">
                        ${pedido.entregado ? "✅" : "❌"}
                    </span>
                </td>
                <td>
                    <button data-id="${pedido._id}" class="btn-eliminar">🗑️</button>
                </td>
            `;
            tablaPedidos.appendChild(tr);
        });

        document.querySelectorAll(".toggle-pagado").forEach(span => {
            span.addEventListener("click", async (e) => {
                const nuevoEstado = e.target.textContent === "✅" ? false : true;
                await actualizarPedido(e.target.dataset.id, { pagado: nuevoEstado });
            });
        });

        document.querySelectorAll(".toggle-entregado").forEach(span => {
            span.addEventListener("click", async (e) => {
                const nuevoEstado = e.target.textContent === "✅" ? false : true;
                await actualizarPedido(e.target.dataset.id, { entregado: nuevoEstado });
            });
        });

        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                await eliminarPedido(e.target.dataset.id);
            });
        });
    }


    // 📌 Función para enviar un nuevo pedido
    formPedido?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre")?.value;
        const tipoComida = document.getElementById("tipoComida")?.value;

        if (!nombre || !tipoComida) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            await fetch("https://lunchcontrolapp.onrender.com/pedidos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, tipoComida })
            });

            formPedido.reset();
            obtenerPedidos();
        } catch (error) {
            console.error("Error al enviar pedido:", error);
        }
    });

    // 📌 Función para actualizar un pedido (pago/entrega)
    async function actualizarPedido(id, datos) {
        try {
            await fetch(`https://lunchcontrolapp.onrender.com/pedidos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            obtenerPedidos();
        } catch (error) {
            console.error("Error al actualizar pedido:", error);
        }
    }

    // 📌 Función para eliminar un pedido
    async function eliminarPedido(id) {
        if (!confirm("¿Estás seguro de eliminar este pedido?")) return;

        try {
            await fetch(`https://lunchcontrolapp.onrender.com/pedidos/${id}`, { method: "DELETE" });
            obtenerPedidos();
        } catch (error) {
            console.error("Error al eliminar pedido:", error);
        }
    }

    // 📌 Función para limpiar todos los pedidos
    btnLimpiar?.addEventListener("click", async () => {
        if (!confirm("¿Quieres eliminar todos los pedidos?")) return;

        try {
            await fetch("https://lunchcontrolapp.onrender.com/pedidos", { method: "DELETE" });
            obtenerPedidos();
        } catch (error) {
            console.error("Error al limpiar pedidos:", error);
        }
    });

    // Cargar los pedidos al iniciar la página
    obtenerPedidos();
});
