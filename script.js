// Datos iniciales (se cargan desde localStorage)
let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
let productos = JSON.parse(localStorage.getItem('productos')) || [];
let pedido = [];
let total = 0;
let mesas = JSON.parse(localStorage.getItem('mesas')) || Array(10).fill({ pedido: [], total: 0 });

// Guardar datos en localStorage y exportar a JSON
function guardarDatos() {
    localStorage.setItem('categorias', JSON.stringify(categorias));
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('mesas', JSON.stringify(mesas));
    exportarDatosJSON(); // Exportar datos a JSON cada vez que se guardan
}

// Exportar datos a un archivo JSON
function exportarDatosJSON() {
    const datos = {
        categorias: categorias,
        productos: productos,
        mesas: mesas
    };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos_tpv.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Cargar categorías en el select
function cargarCategorias() {
    const categoriaProductoSelect = document.getElementById('categoria-producto');
    if (categoriaProductoSelect) {
        categoriaProductoSelect.innerHTML = '';
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            categoriaProductoSelect.appendChild(option);
        });
    }
}

// Mostrar categorías en la lista
function mostrarCategorias() {
    const gridCategorias = document.getElementById('grid-categorias');
    if (gridCategorias) {
        gridCategorias.innerHTML = '';
        categorias.forEach(categoria => {
            const button = document.createElement('button');
            button.textContent = categoria.nombre;
            button.onclick = () => mostrarProductosCategoria(categoria.id);
            gridCategorias.appendChild(button);
        });
    }
}

// Mostrar productos por categoría (en ventas.html)
function mostrarProductosCategoria(categoriaId) {
    const gridProductos = document.getElementById('grid-productos');
    if (gridProductos) {
        gridProductos.innerHTML = '';
        const productosCategoria = productos.filter(p => p.categoriaId === categoriaId);
        productosCategoria.forEach(producto => {
            const button = document.createElement('button');
            button.textContent = producto.nombre;
            button.onclick = () => agregarAlPedido(producto.id);
            gridProductos.appendChild(button);
        });
    }
}

// Agregar producto al pedido (en ventas.html)
function agregarAlPedido(id) {
    const producto = productos.find(p => p.id === id);
    pedido.push(producto);
    total += producto.precio;
    actualizarPedido();
}

// Actualizar pedido (en ventas.html)
function actualizarPedido() {
    const listaPedido = document.getElementById('lista-pedido');
    const totalElement = document.getElementById('total');
    if (listaPedido && totalElement) {
        listaPedido.innerHTML = '';
        pedido.forEach(producto => {
            const li = document.createElement('li');
            li.innerHTML = `${producto.nombre} - ${producto.precio.toFixed(2)} €`;
            listaPedido.appendChild(li);
        });
        totalElement.textContent = total.toFixed(2);
    }
}

// Finalizar pedido (en ventas.html)
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
if (finalizarPedidoBtn) {
    finalizarPedidoBtn.addEventListener('click', () => {
        const mesa = prompt('Introduce el número de mesa (1-10):');
        if (mesa >= 1 && mesa <= 10) {
            mesas[mesa - 1].pedido.push(...pedido);
            mesas[mesa - 1].total += total;
            guardarDatos(); // Guardar datos y exportar a JSON
            alert(`Pedido de la mesa ${mesa} guardado. Total: ${total.toFixed(2)} €`);
            pedido = [];
            total = 0;
            actualizarPedido();
            mostrarMesas(); // Actualizar el estado de las mesas
        } else {
            alert('Número de mesa no válido.');
        }
    });
}

// Mostrar mesas (en mesas.html)
function mostrarMesas() {
    const gridMesas = document.getElementById('grid-mesas');
    if (gridMesas) {
        gridMesas.innerHTML = '';
        mesas.forEach((mesa, index) => {
            const button = document.createElement('button');
            button.textContent = `Mesa ${index + 1}`;
            button.onclick = () => gestionarMesa(index);
            if (mesa.pedido.length > 0) {
                button.classList.add('rojo'); // Añadir clase rojo si hay pedidos
            }
            const totalMesa = document.createElement('p');
            totalMesa.textContent = `Total: ${mesa.total.toFixed(2)} €`;
            gridMesas.appendChild(button);
            gridMesas.appendChild(totalMesa);
        });
    }
}

// Gestionar mesa (en mesas.html)
function gestionarMesa(index) {
    const mesa = mesas[index];
    const confirmacion = confirm(`Mesa ${index + 1}\nPedido: ${mesa.pedido.map(p => p.nombre).join(', ')}\nTotal: ${mesa.total.toFixed(2)} €\n¿Desea finalizar el pedido de esta mesa?`);
    if (confirmacion) {
        mesas[index] = { pedido: [], total: 0 }; // Reiniciar la mesa
        guardarDatos(); // Guardar datos y exportar a JSON
        mostrarMesas(); // Actualizar el estado de las mesas
    }
}

// Exportar datos manualmente (en mesas.html)
const exportarDatosBtn = document.getElementById('exportar-datos');
if (exportarDatosBtn) {
    exportarDatosBtn.addEventListener('click', () => {
        exportarDatosJSON(); // Exportar datos a JSON manualmente
    });
}

// Inicializar
cargarCategorias();
mostrarCategorias();
mostrarMesas();