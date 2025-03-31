// Global state variables
let cart = [];
let savedItems = [];

// ==========================
// INITIALIZATION
// ==========================
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded. Initializing...");

    // 1. Load data from localStorage FIRST
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    console.log("Initial cart:", JSON.stringify(cart));
    console.log("Initial savedItems:", JSON.stringify(savedItems));

    // 2. Initialize UI components common to all pages (or safe to run everywhere)
    initAccountDropdown();
    initModals();
    initActionButtons(); // Handles top-bar cart/save links navigating TO Main.php

    // 3. Update counts based on loaded data (needs to happen on all pages)
    updateCartCount();
    updateSaveCount();

    // 4. Page-specific initializations
    if (document.getElementById('product-container')) { // Check for element unique to Main.php
        console.log("Initializing Main Page specific components...");
        initSidebar();      // Sidebar category navigation
        initSearch();       // Top bar search
        initMainPageProductClicks(); // Add listeners for product cards on main page
        loadProducts('recommendation'); // Load initial products

        // --- Check for redirect flags AFTER main page init ---
        if (localStorage.getItem('showCart') === 'true') {
            console.log("Detected showCart flag, displaying cart.");
            localStorage.removeItem('showCart'); // Clear the flag
            displayCart(); // Show cart view
            const categoryTitle = document.getElementById('current-category');
            if (categoryTitle) categoryTitle.textContent = 'Your Cart';
            document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
        } else if (localStorage.getItem('showSaves') === 'true') {
            console.log("Detected showSaves flag, displaying saved items.");
            localStorage.removeItem('showSaves'); // Clear the flag
            displaySavedProducts(); // Show saved items view
            const categoryTitle = document.getElementById('current-category');
            if (categoryTitle) categoryTitle.textContent = 'Saved Items';
             document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
        }
        // --- End redirect flag check ---

    } else if (document.getElementById('detail-product-name')) { // Check for element unique to productDetail.php
        console.log("Initializing Product Detail Page specific components...");
        initProductDetailPage(); // Initialize detail page elements and listeners

    } else if (document.querySelector('.checkout-container')) { // Check for element unique to checkOut.php
        console.log("Initializing Checkout Page specific components...");
        // CheckOut.php has its own inline script for now, but could be moved here
        // e.g., initCheckoutPage();

    } else {
        console.log("On an unrecognized page or page without specific JS initializers.");
    }

    console.log("Initialization complete.");
});

// ==========================
// Sidebar Navigation (Main Page)
// ==========================
function initSidebar() {
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    const categoryTitle = document.getElementById('current-category');

    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            let titleText = this.textContent.replace(/ \d+$/, '').trim();

            if (category === 'cart') {
                titleText = 'Your Cart'; displayCart();
            } else if (category === 'saves') {
                 titleText = 'Saved Items'; displaySavedProducts();
            } else {
                loadProducts(category); // Reload products for the category
            }
             if (categoryTitle) categoryTitle.textContent = titleText;
        });
    });
}

// ==========================
// Search Functionality (Main Page/Top Bar)
// ==========================
function initSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    const performSearch = () => {
        const searchTerm = searchInput.value.trim();
        if (document.getElementById('product-container')) { // If on Main.php
            if (searchTerm) searchProducts(searchTerm);
            else loadProducts('recommendation');
        } else { // If on another page
            window.location.href = `Main.php?search=${encodeURIComponent(searchTerm)}`;
        }
    };

    if(searchButton) searchButton.addEventListener('click', performSearch);
    if(searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
}

// ==========================
// Account Dropdown (All Pages)
// ==========================
function initAccountDropdown() {
    const accountButton = document.getElementById('account-button');
    const accountDropdown = document.getElementById('account-dropdown');
    const addAccountBtn = document.getElementById('add-account-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (!accountButton || !accountDropdown) return;

    accountButton.addEventListener('click', (e) => { e.stopPropagation(); accountDropdown.classList.toggle('show'); });
    document.addEventListener('click', (e) => { if (!accountDropdown.contains(e.target) && !accountButton.contains(e.target)) accountDropdown.classList.remove('show'); });
    if (addAccountBtn) addAccountBtn.addEventListener('click', (e) => { e.preventDefault(); accountDropdown.classList.remove('show'); showModalById('register-modal'); });
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => {
        e.preventDefault(); accountDropdown.classList.remove('show'); alert('Logged out successfully! (Simulation)');
        const userStatus = document.querySelector('.user-status'); const userAvatar = document.querySelector('.user-avatar');
        if(userStatus) userStatus.textContent = 'Guest'; if(userAvatar) userAvatar.src = 'images/guest-avatar.png';
    });
}

// ==========================
// Modals (Login/Register - All Pages)
// ==========================
function initModals() {
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); hideModalById('login-modal'); showModalById('register-modal'); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); hideModalById('register-modal'); showModalById('login-modal'); });
    closeModalButtons.forEach(button => button.addEventListener('click', function () { const modal = this.closest('.modal-overlay'); if(modal) hideModal(modal); }));
    modalOverlays.forEach(overlay => overlay.addEventListener('click', function (e) { if (e.target === this) hideModal(this); }));
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling; const icon = this.querySelector('i');
            if (passwordInput.type === "password") { passwordInput.type = "text"; icon.classList.replace('fa-eye', 'fa-eye-slash'); this.setAttribute('aria-label', 'Hide password'); }
            else { passwordInput.type = "password"; icon.classList.replace('fa-eye-slash', 'fa-eye'); this.setAttribute('aria-label', 'Show password'); }
        });
    });
}

function showModalById(modalId) { const modal = document.getElementById(modalId); if (modal) showModal(modal); }
function hideModalById(modalId) { const modal = document.getElementById(modalId); if (modal) hideModal(modal); }
function showModal(modalElement) { if (modalElement) { modalElement.classList.add('active'); document.body.style.overflow = 'hidden'; } }
function hideModal(modalElement) { if (modalElement) { modalElement.classList.remove('active'); document.body.style.overflow = ''; } }

// ==========================
// Product Handling (Main Page)
// ==========================
function loadProducts(category) {
    console.log(`Loading products for category: ${category}`);
    const container = document.getElementById('product-container');
    if(!container) return;
    container.innerHTML = '<p>Loading products...</p>';
    const products = getMockProducts(category);
    displayProducts(products);
}

function searchProducts(searchTerm) {
    console.log(`Searching for: ${searchTerm}`);
    const container = document.getElementById('product-container');
    const categoryTitle = document.getElementById('current-category');
    if(!container) return;
    container.innerHTML = '<p>Searching...</p>';
    if(categoryTitle) categoryTitle.textContent = `Search Results for "${searchTerm}"`;
    const allProducts = getAllMockProducts();
    const results = allProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())));
    displayProducts(results);
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return;
    if (!Array.isArray(products)) { container.innerHTML = '<p>Error loading products.</p>'; return; }

    if (products.length === 0) {
        const categoryTitle = document.getElementById('current-category')?.textContent || 'this category';
        if(categoryTitle.toLowerCase().includes('search results')) container.innerHTML = '<p>No products found matching your search.</p>';
        else if (categoryTitle === 'Saved Items') container.innerHTML = '<p>No saved items yet.</p>';
        else container.innerHTML = `<p>No products found in ${categoryTitle}.</p>`;
        return;
    }

    container.innerHTML = products.map(product => {
        const id = product.id ?? `unknown-${Math.random()}`;
        const name = product.name ?? 'Unnamed Product';
        const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
        const imageName = name.replace(/ /g, '_');
        const imageSrc = `src/${imageName}.jpg`; // *** ADJUST PATH AS NEEDED ***
        const isSaved = savedItems.includes(id);
        const isInCart = cart.some(item => item.id === id);

            return `
        <div class="product-card" data-product-id="${id}">
             <a href="productDetail.php?id=${id}" class="product-card-link" aria-label="View details for ${name}">
                <div class="product-image"> <img src="${imageSrc}" alt="${name}" loading="lazy" onerror="this.onerror=null; this.src='images/placeholder.jpg';"> </div>
                <div class="product-info">
                    <div class="product-title">${name}</div>
                    <div class="product-price">RM ${price}</div>
                    <div class="in-cart-status ${isInCart ? 'active' : ''}" data-status-for="${id}"> <i class="fas fa-check-circle"></i> In Cart </div>
                </div>
            </a>
                    <div class="product-actions">
                <button class="btn-purple add-to-cart" data-id="${id}" aria-label="Add ${name} to cart">Add to Cart</button>
                <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${id}" aria-label="${isSaved ? 'Unsave' : 'Save'} ${name}"> <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i> ${isSaved ? 'Saved' : 'Save'} </button>
                </div>
            </div>`;
        }).join('');
}

function initMainPageProductClicks() {
    const container = document.getElementById('product-container');
    if (!container) return;
    container.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('add-to-cart')) {
            event.preventDefault();
            const button = target; const productId = parseInt(button.dataset.id);
            const productCard = button.closest('.product-card');
            const productName = productCard?.querySelector('.product-title')?.textContent || 'Product';
            const productImage = productCard?.querySelector('.product-image img');
            if (!isNaN(productId) && productCard) {
                const productData = getProductById(productId);
                if (productData) { addToCartLogic(productData); if (productImage) animateFlyToCart(productImage); showCartNotification(productName); }
                else { alert("Error: Could not find product details."); }
            }
        } else if (target.classList.contains('btn-save') || target.closest('.btn-save')) {
            event.preventDefault();
            const button = target.closest('.btn-save'); const productId = parseInt(button.dataset.id);
            if (!isNaN(productId)) toggleSave(productId, button);
        }
    });
}

// ==========================
// Mock Product Data
// ==========================
function getMockProducts(category) {
    const allProducts = getAllMockProducts(); category = category.toLowerCase();
    switch(category) {
        case 'butterfly': case 'butterfly series': return allProducts.filter(p => [2, 3, 4].includes(p.id));
        case 'moonstone': case 'moonstone series': return allProducts.filter(p => [5, 6, 7].includes(p.id));
        case 'malachite': case 'mystical malachite series': return allProducts.filter(p => [8, 9, 10, 11].includes(p.id));
        case 'luxe': case 'luxe series': return allProducts.filter(p => [12, 13].includes(p.id));
        case 'recommendation': default: return allProducts.slice(0, 13);
    }
}

function getAllMockProducts() {
    return [ /* Same product objects as before, including descriptions */
        { id: 1, name: 'Healing Soul', price: 110, description: 'This Bracelet was curated with clear Quartz, the master healer crystal.\n\nClear Quartz : 8mm\n\n1¾k gold plated charms with Zircon. (Moon, Ribbon and Filiqree Heart)' },
        { id: 2, name: 'Calm Butterfly', price: 160, description: 'Features calming stones like Amethyst and Lepidolite combined with elegant butterfly charms. Perfect for easing anxiety and promoting peace.' },
        { id: 3, name: 'Ethereal Butterfly', price: 170, description: 'A delicate design featuring high-grade Moonstone and Aquamarine, evoking grace, intuition, and transformation. Accented with silver butterfly charms.' },
        { id: 4, name: 'Sweet Butterfly', price: 90, description: 'A charming and affordable bracelet with Rose Quartz and colorful beads, accented with a sweet butterfly charm. Promotes love and joy.' },
        { id: 5, name: 'Moon Candies', price: 110, description: 'A playful mix of colorful moonstone beads resembling sweet candies. conects with lunar energy and enhances intuition.' },
        { id: 6, name: 'Moon Phase', price: 160, description: 'Represents the waxing and waning phases of the moon using carefully selected Labradorite and Moonstone beads. Enhances psychic abilities and inner knowing.' },
        { id: 7, name: 'Ethereal Moon', price: 170, description: 'Showcases high-quality Rainbow Moonstones with a mystical blue flash. A powerful stone for new beginnings and emotional balance.' },
        { id: 8, name: 'Healing Transformation', price: 70, description: 'Deep green Malachite paired with Smoky Quartz promotes healing, absorbs negativity, and encourages positive transformation.' },
        { id: 9, name: 'Breezy Transformation', price: 75, description: 'A lighter take on the malachite transformation theme, incorporating Chrysocolla for communication and calm change.' },
        { id: 10, name: 'Wealthy Transformation', price: 70, description: 'Malachite combined with Citrine and Pyrite to attract abundance while navigating personal growth and transformation.' },
        { id: 11, name: 'Amplified Transformation', price: 75, description: 'Combines the transformative power of Malachite with the amplifying energy of Clear Quartz for focused change.' },
        { id: 12, name: 'Angel Self Love Edition', price: 140, description: 'A LUXE series bracelet featuring premium Rose Quartz, Kunzite, and Angelite beads. Fosters self-love, compassion, and angelic conections.' },
        { id: 13, name: 'Chunk of Abundance', price: 180, description: 'A statement LUXE piece featuring large, high-quality Green Aventurine, Citrine, and Pyrite nuggets designed to be a powerful magnet for abundance and prosperity.' }
    ];
}

// ==========================
// Cart Functionality (Shared Logic)
// ==========================
function addToCartLogic(productData) {
    if (!productData || typeof productData.id === 'undefined') { console.error("Invalid product data:", productData); return; }
    const productId = productData.id;
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    if (existingItemIndex > -1) cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    else { const price = typeof productData.price === 'number' ? productData.price : 0; cart.push({ ...productData, price: price, quantity: 1 }); }
    console.log("Cart state after update:", JSON.stringify(cart));
    saveCart(); updateCartCount(); updateInCartStatus(productId, true); // Update status
}

async function removeFromCart(productId, cardElement) {
    if (isNaN(productId)) { console.error("Invalid productId:", productId); return; }
    console.log(`Removing item ${productId}`);
    if (cardElement) { try { await explodeEffect(cardElement); } catch (error) { console.error("Explosion failed:", error); cardElement.style.display = 'none'; } }
    else console.warn("No cardElement for animation.");
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId);
    if (cart.length < initialLength) { console.log(`Item ${productId} filtered out.`); updateInCartStatus(productId, false); } // Update status
    else console.warn(`Item ${productId} not found during filter.`);
    console.log("Cart AFTER removal:", JSON.stringify(cart));
    saveCart(); updateCartCount();
    const cartContainer = document.getElementById('product-container');
    const currentCategory = document.getElementById('current-category')?.textContent;
    if (cartContainer && (currentCategory === 'Your Cart' || currentCategory === 'Shopping Cart')) displayCart(); // Re-render if viewing cart
}

function saveCart() { try { localStorage.setItem('cart', JSON.stringify(cart)); console.log("Cart saved"); } catch (e) { console.error("Error saving cart:", e); } }

function displayCart() {
    const cartContainer = document.getElementById('product-container');
    const categoryTitle = document.getElementById('current-category');
    if(categoryTitle) categoryTitle.textContent = 'Your Cart';
    if (!cartContainer) return;
    console.log("Displaying Cart:", JSON.stringify(cart));
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="cart-empty-message"> <i class="fas fa-shopping-cart" style="font-size: 3em; color: #ccc;"></i> <p>Your cart is empty.</p> <button class="btn-purple" onclick="loadProducts('recommendation'); document.getElementById('current-category').textContent='Recommendation'; document.querySelector('.sidebar-menu a[data-category=recommendation]')?.classList.add('active');">Continue Shopping</button> </div>`;
    } else {
        const itemsHtml = cart.map(item => { /* ... Same item card HTML as before ... */
            const id = item.id ?? 'unknown'; const name = item.name ?? 'Unnamed Product';
            const price = typeof item.price === 'number' ? item.price : 0; const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
            const itemTotal = (price * quantity).toFixed(2); const imageName = name.replace(/ /g, '_'); const imageSrc = `src/${imageName}.jpg`;
            return `<div class="cart-item-card" data-id="${id}"> <img src="${imageSrc}" alt="${name}" class="cart-item-image" onerror="this.onerror=null; this.src='images/placeholder.jpg';"> <div class="cart-item-details"> <div class="cart-item-name"><a href="productDetail.php?id=${id}" style="color: inherit; text-decoration: none;">${name}</a></div> <div class="cart-item-price">RM ${price.toFixed(2)}</div> <div class="cart-item-quantity-controls"> <span>Qty:</span> <button class="quantity-btn decrease-qty" data-id="${id}" aria-label="Decrease quantity of ${name}">-</button> <span class="quantity-value">${quantity}</span> <button class="quantity-btn increase-qty" data-id="${id}" aria-label="Increase quantity of ${name}">+</button> </div> <div class="cart-item-total">Subtotal: RM ${itemTotal}</div> </div> <button class="btn-remove-item" data-id="${id}" aria-label="Remove ${name} from cart">×</button> </div>`;
        }).join('');
        let subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        cartContainer.innerHTML = `<div class="cart-page-layout"> <div class="cart-items-list"> ${itemsHtml} </div> <div class="cart-summary-sidebar"> <h3>Order Summary</h3> <div class="summary-row"> <span>Subtotal (${cart.reduce((n, i) => n + (i.quantity || 1), 0)} items)</span> <span id="cart-subtotal">RM ${subtotal.toFixed(2)}</span> </div> <div class="summary-row total"> <span>Total</span> <span id="cart-total">RM ${subtotal.toFixed(2)}</span> </div> <button class="btn-purple checkout-btn" id="proceed-checkout-btn"> <i class="fas fa-lock"></i> Proceed to Checkout </button> </div> </div>`;
        const itemsList = cartContainer.querySelector('.cart-items-list');
        if (itemsList) itemsList.addEventListener('click', function(event) { /* ... Same quantity/remove listeners as before ... */
            const target = event.target; const productId = parseInt(target.dataset.id); if (isNaN(productId)) return;
            if (target.classList.contains('btn-remove-item')) { const cardToRemove = target.closest('.cart-item-card'); removeFromCart(productId, cardToRemove); }
            else if (target.classList.contains('increase-qty')) updateCartQuantity(productId, 1);
            else if (target.classList.contains('decrease-qty')) updateCartQuantity(productId, -1);
        });
        const checkoutBtn = cartContainer.querySelector('#proceed-checkout-btn');
        if(checkoutBtn) checkoutBtn.addEventListener('click', () => window.location.href = 'checkOut.php');
    }
    addCartPageStyles();
}

function updateCartQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const newQuantity = (cart[itemIndex].quantity || 1) + change;
        if (newQuantity <= 0) { const cardToRemove = document.querySelector(`.cart-item-card[data-id="${productId}"]`); removeFromCart(productId, cardToRemove); }
        else { cart[itemIndex].quantity = newQuantity; saveCart(); updateCartCount(); updateInCartStatus(productId, true); // Ensure status is shown
               const currentCategory = document.getElementById('current-category')?.textContent; if (currentCategory === 'Your Cart' || currentCategory === 'Shopping Cart') displayCart(); // Re-render cart view if shown
        }
    } else console.warn(`Item ${productId} not found for quantity update.`);
}

function addCartPageStyles() { const styleId = 'cart-page-dynamic-styles'; if (document.getElementById(styleId)) return; const css = ` .cart-page-layout { display: flex; gap: 30px; align-items: flex-start; } .cart-items-list { flex: 2; display: flex; flex-direction: column; gap: 15px; } .cart-summary-sidebar { flex: 1; background: var(--content-bg, #fff); padding: 25px; border-radius: 8px; border: 1px solid var(--border-color, #ddd); box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: sticky; top: 80px; } .cart-summary-sidebar h3 { margin-top: 0; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color, #eee); font-size: 1.4em; font-weight: 600; } .cart-summary-sidebar .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 1em; color: var(--text-secondary, #555); } .cart-summary-sidebar .summary-row span:last-child { font-weight: 500; color: var(--text-color, #333); } .cart-summary-sidebar .summary-row.total { margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color, #eee); font-size: 1.2em; font-weight: bold; } .cart-summary-sidebar .checkout-btn { width: 100%; margin-top: 25px; padding: 14px; font-size: 1.1em; } .cart-item-card { display: flex; align-items: center; padding: 15px; background: var(--content-bg, #fff); border: 1px solid var(--border-color, #ddd); border-radius: 8px; position: relative; } .cart-item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px; } .cart-item-details { flex-grow: 1; } .cart-item-name { font-weight: 600; margin-bottom: 5px; font-size: 1.1em; } .cart-item-name a:hover { text-decoration: underline; } .cart-item-price { font-size: 1em; color: var(--primary-color); margin-bottom: 10px; font-weight: 500;} .cart-item-quantity-controls { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; } .quantity-btn { width: 28px; height: 28px; border: 1px solid #ccc; background: #f7f7f7; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2em; line-height: 1; } .quantity-btn:hover { background: #eee; } .quantity-value { min-width: 25px; text-align: center; font-weight: 500; } .cart-item-total { font-size: 0.95em; color: var(--text-secondary); font-weight: 500; } .btn-remove-item { position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #dc3545; font-size: 1.4em; cursor: pointer; padding: 5px; line-height: 1; } .btn-remove-item:hover { color: #a71d2a; } .cart-empty-message { text-align: center; padding: 40px; background: var(--content-bg); border-radius: 8px; border: 1px solid var(--border-color); } .cart-empty-message p { font-size: 1.2em; margin-top: 15px; margin-bottom: 20px; color: var(--text-secondary); } .cart-empty-message button { padding: 10px 20px; font-size: 1em; } @media (max-width: 992px) { .cart-page-layout { flex-direction: column; } .cart-summary-sidebar { position: static; width: 100%; margin-top: 20px; } } @media (max-width: 576px) { .cart-item-card { flex-direction: column; align-items: flex-start; } .cart-item-image { width: 100%; height: 150px; margin-right: 0; margin-bottom: 10px; } .btn-remove-item { top: 5px; right: 5px; font-size: 1.2em; } .cart-item-details { width: 100%; } } `; const styleSheet = document.createElement("style"); styleSheet.id = styleId; styleSheet.type = "text/css"; styleSheet.innerText = css; document.head.appendChild(styleSheet); }

function updateCartCount() {
    const count = (Array.isArray(cart) ? cart : []).reduce((total, item) => total + (item.quantity || 0), 0);
    console.log("Updating cart count:", count);
    document.querySelectorAll('.cart-badge').forEach(badge => { badge.textContent = count; badge.style.display = count > 0 ? 'inline-flex' : 'none'; });
}

function showCartNotification(productName) { const notification = document.createElement('div'); notification.className = 'cart-notification'; notification.textContent = `${productName} added to cart!`; document.body.appendChild(notification); void notification.offsetWidth; notification.classList.add('show'); setTimeout(() => { notification.classList.remove('show'); notification.addEventListener('transitionend', () => { if (notification.parentNode) notification.remove(); }, { once: true }); }, 3000); }

// ==========================
// Save Functionality (Shared Logic)
// ==========================
function toggleSave(productId, buttonElement) {
    if (isNaN(productId)) { console.error("Invalid productId:", productId); return; }
    const index = savedItems.indexOf(productId); let isNowSaved;
    if (index === -1) { savedItems.push(productId); isNowSaved = true; console.log(`Item ${productId} saved.`); }
    else { savedItems.splice(index, 1); isNowSaved = false; console.log(`Item ${productId} unsaved.`);
        const currentCategoryTitle = document.getElementById('current-category')?.textContent;
        if (document.getElementById('product-container') && (currentCategoryTitle === 'Saved Items' || currentCategoryTitle === 'Saves') && buttonElement) {
            const productCard = buttonElement.closest('.product-card'); if (productCard) { explodeEffect(productCard).then(() => { if(savedItems.length === 0) { const container = document.getElementById('product-container'); if(container) container.innerHTML = '<p>No saved items yet.</p>'; } }); }
        }
    }
    saveSavedItems();
    if (buttonElement) updateSaveButtonState(buttonElement, isNowSaved);
    else { const buttonOnPage = document.querySelector(`.btn-save[data-id="${productId}"]`); if(buttonOnPage) updateSaveButtonState(buttonOnPage, isNowSaved); }
    updateSaveCount();
}

function saveSavedItems() { try { localStorage.setItem('savedItems', JSON.stringify(savedItems)); console.log("Saved items saved"); } catch (e) { console.error("Error saving savedItems:", e); } }

function updateSaveCount() { const count = savedItems.length; console.log("Updating save count:", count); document.querySelectorAll('.save-badge').forEach(badge => { badge.textContent = count; badge.style.display = count > 0 ? 'inline-flex' : 'none'; }); }

function displaySavedProducts() { const container = document.getElementById('product-container'); const categoryTitle = document.getElementById('current-category'); if(categoryTitle) categoryTitle.textContent = 'Saved Items'; if (!container) return; console.log("Displaying Saved Products:", JSON.stringify(savedItems)); const savedProductsDetails = getAllMockProducts().filter(product => savedItems.includes(product.id)); displayProducts(savedProductsDetails); }

function updateSaveButtonState(button, isSaved) { if (!button) return; const iconClass = isSaved ? 'fas fa-heart' : 'far fa-heart'; const text = isSaved ? ' Saved' : ' Save'; const ariaLabel = isSaved ? 'Unsave' : 'Save'; const productName = getProductById(parseInt(button.dataset.id))?.name || 'this item'; button.innerHTML = `<i class="${iconClass}"></i>${text}`; button.classList.toggle('saved', isSaved); button.setAttribute('aria-label', `${ariaLabel} ${productName}`); }

// ==========================
// Product Detail Page Initialization
// ==========================
function initProductDetailPage() {
    console.log("Running initProductDetailPage...");
    const urlParams = new URLSearchParams(window.location.search); const productId = parseInt(urlParams.get('id'));
    const container = document.querySelector('.main-content');
    if (!productId || isNaN(productId)) { console.error('Invalid product ID'); if (container) container.innerHTML = '<h2>Error</h2><p>Product not found.</p>'; return; }
    console.log(`Product ID: ${productId}`);
    const product = getProductById(productId);
    if (!product) { console.error('Product data not found'); if (container) container.innerHTML = '<h2>Error</h2><p>Product details could not load.</p>'; return; }
    console.log("Product data:", product);

    const nameEl = document.getElementById('detail-product-name'); const priceEl = document.getElementById('detail-product-price'); const imageEl = document.getElementById('detail-product-image'); const descriptionEl = document.getElementById('detail-product-description'); const saveButton = document.getElementById('save-product-btn'); const addToCartBtn = document.getElementById('add-to-cart-btn'); const writeReviewBtn = document.getElementById('write-review-btn'); const reviewModal = document.getElementById('review-modal'); const reviewForm = document.getElementById('review-form'); const cartStatusEl = document.getElementById('detail-cart-status'); // Get status el

    if (nameEl) nameEl.textContent = product.name; if (priceEl) priceEl.textContent = `RM ${product.price.toFixed(2)}`;
    if (imageEl) { const imageName = product.name.replace(/ /g, '_'); imageEl.src = `src/${imageName}.jpg`; imageEl.alt = product.name; imageEl.onerror = function() { this.onerror = null; this.src = 'images/placeholder.jpg'; }; }
    if (descriptionEl) descriptionEl.textContent = product.description || "No description available.";
    if (cartStatusEl) { const isDetailPageItemInCart = cart.some(item => item.id === productId); cartStatusEl.classList.toggle('active', isDetailPageItemInCart); } // Set initial cart status

    if (saveButton) { saveButton.dataset.id = productId; let isSaved = savedItems.includes(productId); updateSaveButtonState(saveButton, isSaved); saveButton.addEventListener('click', function() { toggleSave(productId, this); }); }
    if (addToCartBtn) { addToCartBtn.addEventListener('click', function() { console.log(`Detail Add to cart: ${productId}`); addToCartLogic(product); const productImage = document.getElementById('detail-product-image'); if (productImage) animateFlyToCart(productImage); showCartNotification(product.name); }); }
    if (writeReviewBtn && reviewModal) writeReviewBtn.addEventListener('click', () => showModal(reviewModal));
    if (reviewForm && reviewModal) {
        reviewForm.addEventListener('submit', function(e) { /* ... Same review form submit logic ... */
            e.preventDefault(); const nameInput = document.getElementById('review-name'); let reviewerName = 'Anonymous'; if (nameInput && nameInput.value.trim()) reviewerName = nameInput.value.trim();
            const rating = document.getElementById('review-rating').value; const comment = document.getElementById('review-comment').value; if (!rating || !comment || !reviewerName) { alert("Please fill all review fields."); return; }
            const reviewHTML = `<div class="review-item"> <div class="review-author">${escapeHTML(reviewerName)}</div> <div class="review-rating">${'★'.repeat(parseInt(rating))}${'☆'.repeat(5 - parseInt(rating))}</div> <div class="review-date">${new Date().toLocaleDateString()}</div> <div class="review-content">${escapeHTML(comment)}</div> </div>`;
            const reviewsContainer = document.getElementById('detail-product-reviews'); if (reviewsContainer) { const noReviewsMsg = reviewsContainer.querySelector('p, span'); if (reviewsContainer.textContent.trim().toLowerCase() === 'no reviews at the moment' || (noReviewsMsg && noReviewsMsg.textContent.toLowerCase().includes('no reviews'))) reviewsContainer.innerHTML = reviewHTML; else reviewsContainer.insertAdjacentHTML('afterbegin', reviewHTML); }
            hideModal(reviewModal); this.reset(); alert('Thank you for your review!');
        });
    }
    console.log("initProductDetailPage finished.");
}

// ==========================
// HELPER FUNCTIONS
// ==========================
function updateInCartStatus(productId, isInCart) {
    const cardStatusEl = document.querySelector(`.in-cart-status[data-status-for="${productId}"]`); if (cardStatusEl) cardStatusEl.classList.toggle('active', isInCart);
    const urlParams = new URLSearchParams(window.location.search); const currentDetailId = parseInt(urlParams.get('id'));
    if (currentDetailId === productId) { const detailStatusEl = document.getElementById('detail-cart-status'); if (detailStatusEl) detailStatusEl.classList.toggle('active', isInCart); }
}

function getProductById(id) { const numericId = parseInt(id); if (isNaN(numericId)) return null; return getAllMockProducts().find(product => product.id === numericId); }
function escapeHTML(str) { if (!str) return ''; const div = document.createElement('div'); div.appendChild(document.createTextNode(str)); return div.innerHTML; }

function animateFlyToCart(sourceElement) {
    const cartTarget = document.querySelector('.action-link[data-category="cart"] i'); if (!sourceElement || !cartTarget) return;
    const sourceRect = sourceElement.getBoundingClientRect(); if (sourceRect.width === 0 || sourceRect.height === 0) { console.warn("Fly source not visible"); return; }
    const imgClone = sourceElement.cloneNode(true); const imgRect = sourceElement.getBoundingClientRect(); const cartRect = cartTarget.getBoundingClientRect();
    imgClone.style.cssText = `position:fixed; top:${imgRect.top}px; left:${imgRect.left}px; width:${imgRect.width}px; height:${imgRect.height}px; max-width:${imgRect.width}px; max-height:${imgRect.height}px; object-fit:${sourceElement.style.objectFit || 'contain'}; margin:0; padding:0; border:none; border-radius:5px; opacity:0.9; z-index:1001; pointer-events:none; transition:all 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045);`;
    document.body.appendChild(imgClone);
    requestAnimationFrame(() => { const finalScale = 0.1; const targetX = cartRect.left + cartRect.width/2 - imgRect.width/2 * finalScale; const targetY = cartRect.top + cartRect.height/2 - imgRect.height/2 * finalScale; imgClone.style.left = `${targetX}px`; imgClone.style.top = `${targetY}px`; imgClone.style.transform = `scale(${finalScale})`; imgClone.style.opacity = '0'; });
    imgClone.addEventListener('transitionend', () => { if (imgClone.parentNode) imgClone.remove(); }, { once: true });
}

function explodeEffect(element) {
    return new Promise((resolve) => {
        if (!element) return resolve(); const rect = element.getBoundingClientRect(); if (rect.width === 0 || rect.height === 0) { if(element.parentNode) element.remove(); return resolve(); }
        const particleCount = 15; const particles = []; const container = document.body; element.style.transition = 'opacity 0.1s ease-out, transform 0.1s ease-out'; element.style.opacity = '0'; element.style.transform = 'scale(0.8)'; element.style.pointerEvents = 'none';
        for (let i = 0; i < particleCount; i++) { const particle = document.createElement('div'); particle.classList.add('particle'); particle.style.cssText = `position:fixed; width:${Math.random()*5+3}px; height:${particle.style.width}; border-radius:50%; left:${rect.left + Math.random() * rect.width}px; top:${rect.top + Math.random() * rect.height}px; opacity:1; background-color:hsl(${Math.random()*40+280}, 70%, 60%); z-index:1002; transition:transform 0.6s ease-out, opacity 0.6s ease-out;`; container.appendChild(particle); particles.push(particle); const angle = Math.random() * Math.PI * 2; const distance = Math.random() * 100 + 50; const rotation = Math.random() * 720 - 360; const translateX = Math.cos(angle) * distance; const translateY = Math.sin(angle) * distance; requestAnimationFrame(() => { requestAnimationFrame(() => { particle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(0.3)`; particle.style.opacity = '0'; }); }); }
        setTimeout(() => { particles.forEach(p => { if (p.parentNode) p.remove(); }); if(element.parentNode) element.remove(); resolve(); }, 650);
    });
}

// ==========================
// Top Bar Action Buttons (Navigation Handling)
// ==========================
function initActionButtons() {
    const savesLink = document.querySelector('.action-link[data-category="saves"]'); const cartLink = document.querySelector('.action-link[data-category="cart"]');
    const navigateToMainAndShow = (flagName) => {
         if (document.getElementById('product-container')) { // If on Main.php
             const categoryTitle = document.getElementById('current-category');
             document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active')); // Clear active sidebar item
             if (flagName === 'showCart') { displayCart(); if (categoryTitle) categoryTitle.textContent = 'Your Cart'; }
             else if (flagName === 'showSaves') { displaySavedProducts(); if (categoryTitle) categoryTitle.textContent = 'Saved Items'; }
         } else { localStorage.setItem(flagName, 'true'); window.location.href = 'Main.php'; } // Redirect if not on Main.php
    };
    if (savesLink) savesLink.addEventListener('click', (e) => { e.preventDefault(); navigateToMainAndShow('showSaves'); });
    if (cartLink) cartLink.addEventListener('click', (e) => { e.preventDefault(); navigateToMainAndShow('showCart'); });
}

// ==========================
// CSS (Add particle style if not in style.css)
// ==========================
function addParticleStyle() { const styleId = 'particle-dynamic-styles'; if (document.getElementById(styleId)) return; const css = `.particle { position: fixed; pointer-events: none; border-radius: 50%; }`; const styleSheet = document.createElement("style"); styleSheet.id = styleId; styleSheet.type = "text/css"; styleSheet.innerText = css; document.head.appendChild(styleSheet); }
addParticleStyle();

// Registration form handling
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        // Submit form
        try {
            const formData = new FormData(registerForm);
            const response = await fetch('config/hbRegister.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                alert('Registration successful! Please login.');
                hideModalById('register-modal');
                showModalById('login-modal');
                registerForm.reset();
            } else {
                alert(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Login form handling
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const formData = new FormData(loginForm);
            const response = await fetch('config/hbLogin.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                // Update UI for logged-in user
                const userStatus = document.querySelector('.user-status');
                const userAvatar = document.querySelector('.user-avatar');
                if (userStatus) userStatus.textContent = result.user.username;
                if (userAvatar) userAvatar.src = 'images/user-avatar.png'; // You can customize this
                
                // Hide login modal
                hideModalById('login-modal');
                
                // Clear form
                loginForm.reset();
                
                // Show success message
                alert('Login successful!');
                
                // Update account dropdown buttons
                const addAccountBtn = document.getElementById('add-account-btn');
                if (addAccountBtn) addAccountBtn.style.display = 'none';
                
                // Optional: Refresh page or update necessary components
                // location.reload();
            } else {
                alert(result.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}