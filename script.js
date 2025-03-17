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
    const listaCategorias = document.getElementById('lista-categorias');
    if (listaCategorias) {
        listaCategorias.innerHTML = '';
        categorias.forEach(categoria => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${categoria.nombre}
                <button onclick="editarCategoria(${categoria.id})">Editar</button>
                <button onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
            `;
            listaCategorias.appendChild(li);
        });
    }
}

// Agregar categoría
const agregarCategoriaBtn = document.getElementById('agregar-categoria');
if (agregarCategoriaBtn) {
    agregarCategoriaBtn.addEventListener('click', () => {
        const nombre = document.getElementById('nombre-categoria').value.trim();
        if (nombre) {
            const nuevaCategoria = {
                id: Date.now(), // ID único basado en la fecha actual
                nombre: nombre
            };
            categorias.push(nuevaCategoria);
            guardarDatos(); // Guardar datos en localStorage
            document.getElementById('nombre-categoria').value = ''; // Limpiar el campo de entrada
            cargarCategorias(); // Actualizar el select de categorías
            mostrarCategorias(); // Actualizar la lista de categorías
        } else {
            alert('Por favor, introduce un nombre válido para la categoría.');
        }
    });
}

// Editar categoría
function editarCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    const nuevoNombre = prompt('Editar categoría:', categoria.nombre);
    if (nuevoNombre) {
        categoria.nombre = nuevoNombre;
        guardarDatos(); // Guardar datos en localStorage
        mostrarCategorias(); // Actualizar la lista de categorías
    }
}

// Eliminar categoría
function eliminarCategoria(id) {
    categorias = categorias.filter(c => c.id !== id);
    productos = productos.filter(p => p.categoriaId !== id); // Eliminar productos de la categoría eliminada
    guardarDatos(); // Guardar datos en localStorage
    mostrarCategorias(); // Actualizar la lista de categorías
    mostrarProductos(); // Actualizar la lista de productos
}

// Mostrar productos en la lista
function mostrarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    if (listaProductos) {
        listaProductos.innerHTML = '';
        productos.forEach(producto => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${producto.nombre} - ${producto.precio.toFixed(2)} € (${categorias.find(c => c.id === producto.categoriaId).nombre})
                <button onclick="editarProducto(${producto.id})">Editar</button>
                <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
            `;
            listaProductos.appendChild(li);
        });
    }
}

// Agregar producto
const agregarProductoBtn = document.getElementById('agregar-producto');
if (agregarProductoBtn) {
    agregarProductoBtn.addEventListener('click', () => {
        const nombre = document.getElementById('nombre-producto').value.trim();
        const precio = parseFloat(document.getElementById('precio-producto').value);
        const categoriaId = parseInt(document.getElementById('categoria-producto').value);

        if (nombre && !isNaN(precio) && categoriaId) {
            const nuevoProducto = {
                id: Date.now(), // ID único basado en la fecha actual
                nombre: nombre,
                precio: precio,
                categoriaId: categoriaId
            };
            productos.push(nuevoProducto);
            guardarDatos(); // Guardar datos en localStorage
            document.getElementById('nombre-producto').value = ''; // Limpiar el campo de entrada
            document.getElementById('precio-producto').value = ''; // Limpiar el campo de entrada
            mostrarProductos(); // Actualizar la lista de productos
        } else {
            alert('Por favor, introduce datos válidos para el producto.');
        }
    });
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    const nuevoNombre = prompt('Editar nombre:', producto.nombre);
    const nuevoPrecio = parseFloat(prompt('Editar precio:', producto.precio));
    if (nuevoNombre && !isNaN(nuevoPrecio)) {
        producto.nombre = nuevoNombre;
        producto.precio = nuevoPrecio;
        guardarDatos(); // Guardar datos en localStorage
        mostrarProductos(); // Actualizar la lista de productos
    }
}

// Eliminar producto
function eliminarProducto(id) {
    productos = productos.filter(p => p.id !== id);
    guardarDatos(); // Guardar datos en localStorage
    mostrarProductos(); // Actualizar la lista de productos
}

// Inicializar
cargarCategorias();
mostrarCategorias();
mostrarProductos();