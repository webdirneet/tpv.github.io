// Estado global
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || Array(10).fill([]); // 10 mesas

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Cargar datos en index.html
if (document.getElementById('categoryForm')) {
    const categoryForm = document.getElementById('categoryForm');
    const productForm = document.getElementById('productForm');
    const categoryList = document.getElementById('categoryList');
    const productList = document.getElementById('productList');
    const productCategory = document.getElementById('productCategory');
    const exportBtn = document.getElementById('exportData');

    // Cargar categorías en el select
    function updateCategorySelect() {
        productCategory.innerHTML = '<option value="">Selecciona una categoría</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }

    // Mostrar listas
    function renderLists() {
        categoryList.innerHTML = categories.map(cat => 
            `<li>${cat} <button onclick="deleteCategory('${cat}')">Eliminar</button></li>`).join('');
        productList.innerHTML = products.map(prod => 
            `<li>${prod.name} - ${prod.price}€ (${prod.category}) <button onclick="deleteProduct('${prod.name}')">Eliminar</button></li>`).join('');
        updateCategorySelect();
    }

    // Añadir categoría
    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('categoryName').value.trim();
        if (name && !categories.includes(name)) {
            categories.push(name);
            saveData();
            renderLists();
            categoryForm.reset();
        }
    });

    // Añadir producto
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value;
        if (name && price > 0 && category && !products.find(p => p.name === name)) {
            products.push({ name, price, category });
            saveData();
            renderLists();
            productForm.reset();
        }
    });

    // Eliminar categoría
    window.deleteCategory = function(name) {
        if (products.some(p => p.category === name)) {
            alert('No se puede eliminar una categoría con productos asociados.');
            return;
        }
        categories = categories.filter(c => c !== name);
        saveData();
        renderLists();
    };

    // Eliminar producto
    window.deleteProduct = function(name) {
        products = products.filter(p => p.name !== name);
        saveData();
        renderLists();
    };

    // Exportar datos
    exportBtn.addEventListener('click', () => {
        const data = { categories, products, orders };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tpv_data.json';
        a.click();
    });

    renderLists();
}

// Lógica de ventas.html
if (document.getElementById('categoryButtons')) {
    const categoryButtons = document.getElementById('categoryButtons');
    const productButtons = document.getElementById('productButtons');
    const tablePrompt = document.getElementById('tablePrompt');
    const confirmTable = document.getElementById('confirmTable');
    let selectedCategory = '';

    // Mostrar categorías
    categoryButtons.innerHTML = categories.map(cat => 
        `<button onclick="showProducts('${cat}')">${cat}</button>`).join('');

    // Mostrar productos de la categoría seleccionada
    window.showProducts = function(category) {
        selectedCategory = category;
        productButtons.innerHTML = products.filter(p => p.category === category).map(prod => 
            `<button onclick="addToOrder('${prod.name}')">${prod.name}<br>${prod.price}€</button>`).join('');
    };

    // Añadir producto al pedido
    window.addToOrder = function(productName) {
        tablePrompt.classList.remove('hidden');
    };

    // Confirmar mesa
    confirmTable.addEventListener('click', () => {
        const tableNum = parseInt(document.getElementById('tableNumber').value) - 1;
        if (tableNum >= 0 && tableNum < 10) {
            const product = products.find(p => p.name === productButtons.querySelector('button:hover')?.textContent.split('\n')[0]);
            if (product) {
                orders[tableNum] = orders[tableNum].concat([product]);
                saveData();
                tablePrompt.classList.add('hidden');
            }
        } else {
            alert('Número de mesa inválido (1-10).');
        }
    });
}

// Lógica de mesas.html
if (document.getElementById('tables')) {
    const tablesDiv = document.getElementById('tables');

    // Mostrar mesas
    function renderTables() {
        tablesDiv.innerHTML = orders.map((order, i) => {
            const total = order.reduce((sum, p) => sum + p.price, 0);
            return `<button class="${order.length ? 'pending' : ''}" onclick="manageTable(${i})">
                Mesa ${i + 1}<br>Total: ${total.toFixed(2)}€
            </button>`;
        }).join('');
    }

    // Gestionar mesa
    window.manageTable = function(tableNum) {
        if (orders[tableNum].length) {
            if (confirm('¿Finalizar pedido de la Mesa ' + (tableNum + 1) + '?')) {
                orders[tableNum] = [];
                saveData();
                renderTables();
            } else {
                // Aquí podrías añadir lógica para agregar más productos
                alert('Función para añadir más productos aún no implementada.');
            }
        }
    };

    renderTables();
}