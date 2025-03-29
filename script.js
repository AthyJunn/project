document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initSearch();
    initAccountDropdown();
    initModals();
    initCart();
    initSaves();
    loadCart();
    updateCartCount();
    loadProducts('recommendation');
    updateSaveCount();
});

// ==========================
// Sidebar Navigation
// ==========================
function initSidebar() {
    const menuItems = document.querySelectorAll('.sidebar-menu a');

    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            document.getElementById('current-category').textContent = this.textContent;

            if (category === 'cart') {
                displayCart();
            } else if (category === 'saves') {
                displaySavedProducts();
            } else {
                loadProducts(category);
            }
        });
    });
}

// ==========================
// Search Functionality
// ==========================
function initSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function () {
        handleSearch();
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchProducts(searchTerm);
        }
    }
}

// ==========================
// Account Dropdown
// ==========================
function initAccountDropdown() {
    const accountButton = document.getElementById('account-button');
    const accountDropdown = document.getElementById('account-dropdown');
    const addAccountBtn = document.getElementById('add-account-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (!accountButton || !accountDropdown) {
        console.error("Account button or dropdown not found!");
        return;
    }

    accountButton.addEventListener('click', function(e) {
        e.stopPropagation();
        accountDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target) && !accountButton.contains(e.target)) {
            accountDropdown.classList.remove('show');
        }
    });

    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            accountDropdown.classList.remove('show');
            const registerModal = document.getElementById('register-modal');
            if (registerModal) {
                registerModal.classList.add('active');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            accountDropdown.classList.remove('show');
            alert('Logged out successfully!');
        });
    }
}

// ==========================
// Modals (Login/Register)
// ==========================
function initModals() {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    function showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (showRegister) {
        showRegister.addEventListener('click', function (e) {
            e.preventDefault();
            hideModal(loginModal);
            showModal(registerModal);
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', function (e) {
            e.preventDefault();
            hideModal(registerModal);
            showModal(loginModal);
        });
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            hideModal(this.closest('.modal-overlay'));
        });
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-overlay')) {
            hideModal(e.target);
        }
    });
}

// ==========================
// Product Handling
// ==========================
function loadProducts(category) {
    fetch('php/get_products.php?category=' + category)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(displayProducts)
        .catch(() => displayProducts(getMockProducts(category)));
}

function searchProducts(searchTerm) {
    fetch('php/search_products.php?search=' + encodeURIComponent(searchTerm))
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(products => {
            document.getElementById('current-category').textContent = 'Search Results';
            displayProducts(products);
        })
        .catch(() => {
            document.getElementById('current-category').textContent = 'Search Results';
            displayProducts(getAllMockProducts().filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())));
        });
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = products.length === 0
        ? '<p>No products found.</p>'
        : products.map(product => {
            const isSaved = savedItems.includes(product.id);
            return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image"><img src="images/products/${product.id}.jpg" alt="${product.name}"></div>
                <div class="product-info">
                    <div class="product-title">${product.name}</div>
                    <div class="product-price">RM ${product.price}</div>
                    <div class="product-actions">
                        <button class="btn-purple add-to-cart">Add to Cart</button>
                        <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${product.id}" onclick="toggleSave(${product.id}, this)">
                            <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i> ${isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            addToCart(parseInt(this.closest('.product-card').dataset.productId));
        });
    });
}

// ==========================
// Mock Product Data
// ==========================
function getMockProducts(category) {
    const allProducts = {
        recommendation: [
            { id: 1, name: 'Healing Soul', price: 110 },
            { id: 2, name: 'Calm Butterfly', price: 160 },
            { id: 3, name: 'Ethereal Butterfly', price: 170 },
            { id: 4, name: 'Sweet Butterfly', price: 90 },
            { id: 5, name: 'Moon Candies', price: 110 },
            { id: 6, name: 'Moon Phase', price: 160 },
            { id: 7, name: 'Ethereal Moon', price: 170 },
            { id: 8, name: 'Healing Transformation', price: 70 },
            { id: 9, name: 'Breezy Transformation', price: 75 },
            { id: 10, name: 'Wealthy Transformation', price: 70 },
            { id: 11, name: 'Amplified Transformation', price: 75 },
            { id: 12, name: 'Angel Self Love Edition', price: 140 },
            { id: 13, name: 'Chunk of Abundance', price: 180 }
        ],
        butterfly: [
            { id: 2, name: 'Calm Butterfly', price: 160 },
            { id: 3, name: 'Ethereal Butterfly', price: 170 },
            { id: 4, name: 'Sweet Butterfly', price: 90 }
        ],
        moonstone: [
            { id: 5, name: 'Moon Candies', price: 110 },
            { id: 6, name: 'Moon Phase', price: 160 },
            { id: 7, name: 'Ethereal Moon', price: 170 }
        ],
        malachite: [
            { id: 8, name: 'Healing Transformation', price: 70 },
            { id: 9, name: 'Breezy Transformation', price: 75 },
            { id: 10, name: 'Wealthy Transformation', price: 70 },
            { id: 11, name: 'Amplified Transformation', price: 75 }
        ],
        luxe: [
            { id: 12, name: 'Angel Self Love Edition', price: 140 },
            { id: 13, name: 'Chunk of Abundance', price: 180 }
        ]
    };
    return allProducts[category] || [];
}

function getAllMockProducts() {
    return [
        { id: 1, name: 'Healing Soul', price: 110 },
        { id: 2, name: 'Calm Butterfly', price: 160 },
        { id: 3, name: 'Ethereal Butterfly', price: 170 },
        { id: 4, name: 'Sweet Butterfly', price: 90 },
        { id: 5, name: 'Moon Candies', price: 110 },
        { id: 6, name: 'Moon Phase', price: 160 },
        { id: 7, name: 'Ethereal Moon', price: 170 },
        { id: 8, name: 'Healing Transformation', price: 70 },
        { id: 9, name: 'Breezy Transformation', price: 75 },
        { id: 10, name: 'Wealthy Transformation', price: 70 },
        { id: 11, name: 'Amplified Transformation', price: 75 },
        { id: 12, name: 'Angel Self Love Edition', price: 140 },
        { id: 13, name: 'Chunk of Abundance', price: 180 }
    ];
}

// ==========================
// Cart Functionality
// ==========================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initCart() {
    const cartLink = document.querySelector('[data-category="cart"]');
    if (cartLink) {
        cartLink.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('current-category').textContent = 'Your Cart';
            displayCart();
        });
    }
}

function addToCart(productId) {
    const product = getAllMockProducts().find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    existingItem ? existingItem.quantity++ : cart.push({ ...product, quantity: 1 });

    saveCart();
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

function displayCart() {
    const cartContainer = document.getElementById('product-container');
    if (!cartContainer) return;

    cartContainer.innerHTML = cart.length === 0
        ? '<p>Your cart is empty.</p>'
        : cart.map(item => `
            <div class="product-card">
                <div class="product-info">
                    <div class="product-title">${item.name}</div>
                    <div class="product-price">RM ${item.price} x ${item.quantity}</div>
                    <button class="btn-purple remove-from-cart" data-id="${item.id}">Remove</button>
                </div>
            </div>`).join('');

    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', function () {
            removeFromCart(parseInt(this.dataset.id));
        });
    });
}

function updateCartCount() {
<<<<<<< HEAD
    const cartBadge = document.querySelector('cart-badge');
=======
    const cartBadge = document.querySelector('[data-category="cart"] .cart-badge');
>>>>>>> c48e37210ed339c4c8e4bef0cc852d397d7184ff
    if (cartBadge) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span>${productName} added to cart!</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ==========================
// Save Functionality
// ==========================
let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

function toggleSave(productId, button) {
    const index = savedItems.indexOf(productId);
    if (index === -1) {
        savedItems.push(productId);
        button.innerHTML = '<i class="fas fa-heart"></i> Saved';
        button.classList.add('saved');
    } else {
        savedItems.splice(index, 1);
        button.innerHTML = '<i class="far fa-heart"></i> Save';
        button.classList.remove('saved');
        
        if (document.getElementById('current-category')?.textContent === 'Saved Items') {
            const productCard = button.closest('.product-card');
            if (productCard) {
                productCard.remove();
            }
        }
    }
    
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    updateSaveCount();
}

function updateSaveCount() {
    const saveBadge = document.querySelector('.save-badge');
    if (saveBadge) {
        saveBadge.textContent = savedItems.length;
        saveBadge.style.display = savedItems.length > 0 ? 'inline-block' : 'none';
    }
}

function displaySavedProducts() {
    const allProducts = getAllMockProducts();
    const savedProducts = allProducts.filter(product => 
        savedItems.includes(product.id)
    );
    
    const container = document.getElementById('product-container');
    if (!container) return;

    document.getElementById('current-category').textContent = 'Saved Items';
    
    if (savedProducts.length === 0) {
        container.innerHTML = '<p>No saved items yet.</p>';
        return;
    }

    container.innerHTML = savedProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image"><img src="images/products/${product.id}.jpg" alt="${product.name}"></div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">RM ${product.price}</div>
                <div class="product-actions">
                    <button class="btn-purple add-to-cart">Add to Cart</button>
                    <button class="btn-save saved" data-id="${product.id}">
                        <i class="fas fa-heart"></i> Saved
                    </button>
                </div>
            </div>
        </div>`).join('');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.product-card').dataset.productId);
            addToCart(productId);
        });
    });

    document.querySelectorAll('.btn-save').forEach(button => {
        button.addEventListener('click', function() {
            toggleSave(parseInt(this.dataset.id), this);
        });
    });
}

function initSaves() {
    const savesLink = document.querySelector('[data-category="saves"]');
    if (savesLink) {
        savesLink.addEventListener('click', function(e) {
            e.preventDefault();
            displaySavedProducts();
        });
    }
}

// Make functions available globally
window.toggleSave = toggleSave;