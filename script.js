// Global state variables
let cart = [];
let savedItems = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage if needed
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

    // Initialize sidebar for all pages
    initSidebar();

    // Check if we're on the product detail page
    if (window.location.pathname.includes('productDetail.php')) {
        initProductDetailPage();
    } else {
        // Main page initializations
        initCartDisplay();
        initSavesDisplay();
        
        // Check if we need to show cart or saves based on redirect flags
        const showCart = localStorage.getItem('showCart') === 'true';
        const showSaves = localStorage.getItem('showSaves') === 'true';
        
        if (showCart) {
            displayCart();
            localStorage.removeItem('showCart');
        } else if (showSaves) {
            displaySavedProducts();
            localStorage.removeItem('showSaves');
        } else {
            // Get category from URL if present
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category') || 'recommendation';
            loadProducts(category);
            
            // Update active menu item
            const activeMenuItem = document.querySelector(`.sidebar-menu a[data-category="${category}"]`);
            if (activeMenuItem) {
                document.querySelectorAll('.sidebar-menu a').forEach(i => i.classList.remove('active'));
                activeMenuItem.classList.add('active');
                const categoryTitle = document.getElementById('current-category');
                if (categoryTitle) {
                    categoryTitle.textContent = activeMenuItem.textContent.replace(/ \d+$/, '').trim();
                }
            }
        }
    }

    // Initialize UI components and load initial data
    initSearch();
    initAccountDropdown();
    initModals();
    updateCartCount();
    updateSaveCount();

    // Initialize action buttons (saves and cart) for all pages
    initActionButtons();
});

// ==========================
// Sidebar Navigation
// ==========================
function initSidebar() {
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    const categoryTitle = document.getElementById('current-category');

    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const category = this.getAttribute('data-category');
            
            // If we're on the product detail page, we need to navigate to Main.php
            if (window.location.pathname.includes('productDetail.php')) {
                if (category === 'cart' || category === 'saves') {
                    // Set flag to show cart or saves after redirect
                    localStorage.setItem('showCart', category === 'cart');
                    localStorage.setItem('showSaves', category === 'saves');
                }
                window.location.href = `Main.php${category ? `?category=${category}` : ''}`;
                return;
            }

            // Handle active state visually
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            if (categoryTitle) {
                categoryTitle.textContent = this.textContent.replace(/ \d+$/, '').trim(); // Update title, remove badge number if present
            }

            // Load content based on category
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

    const performSearch = () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchProducts(searchTerm);
        } else {
            // Optional: Reload recommendations or show all if search is empty
            loadProducts('recommendation');
        }
    };

    if(searchButton) searchButton.addEventListener('click', performSearch);
    if(searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
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

    console.log("Account button and dropdown found."); // Debugging statement

    // Toggle dropdown when clicking the account button
    accountButton.addEventListener('click', function(e) {
        e.stopPropagation();
        accountDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target) && !accountButton.contains(e.target)) {
            accountDropdown.classList.remove('show');
            console.log("Dropdown closed."); // Debugging statement
        }
    });

    // Prevent dropdown from closing when clicking inside it
    accountDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Handle Add Account button click
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', function() {
            // Show login modal
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.classList.add('active');
            accountDropdown.classList.remove('show');
            }
        });
    }

    // Handle Logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Add your logout logic here
            alert('Logging out...');
            accountDropdown.classList.remove('show');
        });
    }
}

// ==========================
// Modals (Login/Register)
// ==========================
function initModals() {
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // Show Register Modal
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            const registerModal = document.getElementById('register-modal');
            if (loginModal && registerModal) {
                loginModal.classList.remove('active');
                registerModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Show Login Modal
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            const registerModal = document.getElementById('register-modal');
            if (loginModal && registerModal) {
                registerModal.classList.remove('active');
                loginModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close Modal Buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close Modal on Overlay Click
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Password Visibility Toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = "password";
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function showModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) showModal(modal);
}

function hideModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) hideModal(modal);
}

function showModal(modalElement) {
    if (modalElement) {
        modalElement.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function hideModal(modalElement) {
    if (modalElement) {
        modalElement.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }
}

// ==========================
// Product Handling (Loading & Displaying)
// ==========================
function loadProducts(category) {
    console.log(`Loading products for category: ${category}`);
    // Clear existing products before loading new ones
    const container = document.getElementById('product-container');
    if(container) container.innerHTML = '<p>Loading products...</p>'; // Show loading indicator

    // --- MOCK DATA ---
    // Replace this with your actual fetch call if needed
    const products = getMockProducts(category);
    displayProducts(products);
    // --- END MOCK DATA ---

    /* --- Example Fetch Call (Uncomment and adapt if using backend) ---
    fetch('php/get_products.php?category=' + encodeURIComponent(category))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            const container = document.getElementById('product-container');
            if(container) container.innerHTML = '<p>Error loading products. Please try again later.</p>';
             // Optionally display mock data as fallback
             // displayProducts(getMockProducts(category));
        });
    */
}

function searchProducts(searchTerm) {
    console.log(`Searching for: ${searchTerm}`);
    const container = document.getElementById('product-container');
    const categoryTitle = document.getElementById('current-category');

    if(container) container.innerHTML = '<p>Searching...</p>';
    if(categoryTitle) categoryTitle.textContent = 'Search Results';

    // --- MOCK SEARCH ---
    const allProducts = getAllMockProducts();
    const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayProducts(results);
    // --- END MOCK SEARCH ---

    /* --- Example Fetch Call (Uncomment and adapt if using backend) ---
    fetch('php/search_products.php?search=' + encodeURIComponent(searchTerm))
        .then(response => {
             if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error searching products:', error);
            const container = document.getElementById('product-container');
            if(container) container.innerHTML = '<p>Error performing search. Please try again later.</p>';
             // Optionally display mock data as fallback
             // const allProducts = getAllMockProducts();
             // const results = allProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
             // displayProducts(results);
        });
    */
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) {
        console.error("Product container not found!");
        return;
    }

    if (!Array.isArray(products)) {
        console.error("Invalid data received for products:", products);
        container.innerHTML = '<p>Could not display products due to an error.</p>';
        return;
    }

    container.innerHTML = products.length === 0
        ? '<p>No products found.</p>'
        : products.map(product => {
            // Ensure product has necessary properties
            const id = product.id ?? 'unknown';
            const name = product.name ?? 'Unnamed Product';
            const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
            const imageSrc = `src/${name.replace(/ /g, '_')}.jpg`; // Assuming image naming convention

            const isSaved = savedItems.includes(id); // Check if item is in saves
            const isInCart = cart.some(item => item.id === id); // Check if item is in cart

            return `
            <div class="product-card" data-product-id="${id}" data-product-name="${name}" data-product-price="${price}">
                <a href="productDetail.php?id=${id}" class="product-card-link">
                    <div class="product-image">
                        <img src="${imageSrc}" alt="${name}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                    </div>
                <div class="product-info">
                        <div class="product-title">${name}</div>
                        <div class="product-price">RM ${price}</div>
                        ${isInCart ? '<div class="cart-status">In Cart</div>' : ''}
                    </div>
                </a>
                    <div class="product-actions">
                        <button class="btn-purple add-to-cart">
                            Add to Cart
                        </button>
                    <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${id}">
                            <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i> ${isSaved ? 'Unsave' : 'Save'}
                        </button>
                </div>
            </div>`;
        }).join('');

    // --- Event Listeners for dynamic content ---
    // Use event delegation on the container for efficiency
    container.removeEventListener('click', handleProductContainerClick); // Remove old listener if re-rendering
    container.addEventListener('click', handleProductContainerClick);
}

function handleProductContainerClick(event) {
    // Handle "Add to Cart" clicks
    if (event.target.classList.contains('add-to-cart')) {
        const button = event.target;
        animateAddToCart(button); // Call animation function
    }
    // Handle "Save" clicks
    else if (event.target.classList.contains('btn-save') || event.target.closest('.btn-save')) {
        const button = event.target.closest('.btn-save');
        const productId = parseInt(button.dataset.id);
        if (!isNaN(productId)) {
            toggleSave(productId, button);
        }
    }
    // Don't prevent default for product card link clicks
}

// ==========================
// Mock Product Data (Keep for fallback/testing)
// ==========================
function getMockProducts(category) {
    const allProducts = getAllMockProducts(); // Use the single source
    switch(category) {
        case 'butterfly': return allProducts.filter(p => [2, 3, 4].includes(p.id));
        case 'moonstone': return allProducts.filter(p => [5, 6, 7].includes(p.id));
        case 'malachite': return allProducts.filter(p => [8, 9, 10, 11].includes(p.id));
        case 'luxe': return allProducts.filter(p => [12, 13].includes(p.id));
        case 'recommendation':
        default:
            // Return a subset or all for recommendation
            return allProducts.slice(0, 13); // Example: show first 13
    }
}

function getAllMockProducts() {
    // Central place for all product definitions
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
        // Add more products here if needed
    ];
}

// ==========================
// Cart Functionality
// ==========================

function initCartDisplay() {
    // This function is now mainly for initialization
    // The click handler is in the DOMContentLoaded event
    updateCartCount();
}

function updateCartCount() {
    const cartBadges = document.querySelectorAll('.cart-badge');
    const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    
    cartBadges.forEach(badge => {
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    });
}

// ==========================
// Save Functionality
// ==========================

function initSavesDisplay() {
    // This function is now mainly for initialization
    // The click handler is in the DOMContentLoaded event
    updateSaveCount();
}

function updateSaveCount() {
    const saveBadges = document.querySelectorAll('.save-badge');
    const count = savedItems.length;
    
    saveBadges.forEach(badge => {
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    });
}

// --- Core Cart Logic within Animation Function ---
function animateAddToCart(button) {
    const productCard = button.closest('.product-card');
    if (!productCard) {
        console.error("Could not find product card for button:", button);
        return;
    }

    const productId = parseInt(productCard.dataset.productId);
    const productName = productCard.dataset.productName;

    if (isNaN(productId)) {
        console.error("Invalid Product ID found:", productCard.dataset.productId);
        return;
    }

    console.log(`--- Animate Add To Cart Start --- ID: ${productId} (${productName})`);

    // --- Animation Setup ---
    const productImage = productCard.querySelector('.product-image img');
    const cartTarget = document.querySelector('.sidebar-menu a[data-category="cart"] i');

    if (productImage && cartTarget) {
        const imgClone = productImage.cloneNode(true);
        const imgRect = productImage.getBoundingClientRect();
        const cartRect = cartTarget.getBoundingClientRect();

        imgClone.classList.add('product-image-fly');
        document.body.appendChild(imgClone);

        // Set initial position (fixed relative to viewport)
        imgClone.style.position = 'fixed';
        imgClone.style.top = `${imgRect.top}px`;
        imgClone.style.left = `${imgRect.left}px`;
        imgClone.style.width = `${imgRect.width}px`;
        imgClone.style.height = `${imgRect.height}px`;
        imgClone.style.opacity = '1';
        imgClone.style.pointerEvents = 'none';
        imgClone.style.zIndex = '1001';

        requestAnimationFrame(() => {
            // Calculate target position (center of cart icon, adjusted for final scale)
            const targetX = cartRect.left + (cartRect.width / 2) - (imgRect.width / 2 * 0.1);
            const targetY = cartRect.top + (cartRect.height / 2) - (imgRect.height / 2 * 0.1);

            // Apply final animation styles
            imgClone.style.transform = `translate(${targetX - imgRect.left}px, ${targetY - imgRect.top}px) scale(0.1)`;
            imgClone.style.opacity = '0';
        });

        imgClone.addEventListener('transitionend', () => {
            imgClone.remove();
            console.log("Animation clone removed.");
        }, { once: true });
    } else {
        console.warn("Could not find product image or cart target for animation.");
    }

    // --- Actual Cart Update Logic ---
    console.log("Current 'cart' array STATE at start of cart logic:", JSON.stringify(cart));

    const productData = getAllMockProducts().find(p => p.id === productId);
    if (!productData) {
        console.error(`Product data not found in mock data for ID: ${productId}`);
        return;
    }

    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        console.log(`FOUND existing item in cart at index ${existingItemIndex} for ID ${productId}. Incrementing quantity.`);
        cart[existingItemIndex].quantity++;
        console.log(`Incremented quantity. New quantity: ${cart[existingItemIndex].quantity}`);
    } else {
        console.log(`Did NOT find existing item for ID ${productId}. Adding new item.`);
        const newItem = { ...productData, quantity: 1 };
        cart.push(newItem);
        console.log(`Pushed new item: ${JSON.stringify(newItem)}`);
    }

    console.log("Cart array STATE before saveCart:", JSON.stringify(cart));
    saveCart();
    updateCartCount();
    showCartNotification(productName);

    console.log(`--- Animate Add To Cart End --- ID: ${productId}`);
}


// Modified to handle animation *before* data update
async function removeFromCart(productId, cardElement) { // Accept cardElement
    console.log(`--- removeFromCart called for ID: ${productId} ---`);
    if (isNaN(productId) || !cardElement) {
        console.error("Invalid arguments passed to removeFromCart:", productId, cardElement);
        return;
    }

    // 1. Trigger the explosion animation and wait for it to finish
    try {
        console.log("Triggering explosion effect...");
        await explodeEffect(cardElement); // Wait for the animation Promise
        console.log("Explosion effect finished.");
    } catch (error) {
        console.error("Explosion animation failed:", error);
        // Decide if you still want to remove the item even if animation fails
        // For now, we'll continue to remove the item data.
        // As a fallback, ensure the card is hidden/removed visually:
         cardElement.style.display = 'none';
    }


    // 2. Update the actual cart data *after* animation
    console.log("Updating cart data...");
    console.log("Cart BEFORE data removal:", JSON.stringify(cart));

    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId); // Update global cart array

    if (cart.length < initialLength) {
        console.log(`Item with ID ${productId} successfully filtered from data array.`);
    } else {
        console.warn(`Item with ID ${productId} was NOT found in the data array during filtering.`);
    }
    console.log("Cart AFTER data removal:", JSON.stringify(cart));

    // 3. Persist changes and update UI count
    saveCart();
    updateCartCount();

    // 4. Optional: Re-render the entire cart view *if necessary*.
    // Since the card is visually gone, you might not need a full re-render
    // immediately, unless the summary needs updating based on other factors.
    // If the summary *only* depends on the cart array, just updating the
    // subtotal in the summary might be more efficient than full re-render.
    // For simplicity now, we will re-render fully to ensure consistency.
    console.log("Re-rendering cart display...");
    displayCart(); // Re-draw the cart view

    console.log(`--- removeFromCart finished for ID: ${productId} ---`);
}

function saveCart() {
    try {
    localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Cart saved to localStorage:", JSON.stringify(cart));
    } catch (e) {
        console.error("Error saving cart to localStorage:", e);
}
}

// NOTE: loadCart is only called once on initial page load now.
// Subsequent updates rely on modifying the global 'cart' array directly.

function displayCart() {
    const cartContainer = document.getElementById('product-container');
    const categoryTitle = document.getElementById('current-category');

    if(categoryTitle) categoryTitle.textContent = 'Shopping Cart';
    if (!cartContainer) {
        console.error("Cart container not found!");
        return;
    }

    console.log("--- Displaying Cart --- Current cart state:", JSON.stringify(cart));

    // Clear previous content
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty-message">
                <i class="fas fa-shopping-cart" style="font-size: 2.5em; color: var(--primary-color);"></i>
                <p style="margin: 0;">Your shopping cart is empty</p>
                <button class="btn-purple" onclick="window.location.href='Main.php'" style="margin-top: 15px; padding: 12px 25px;">
                    Continue Shopping
                </button>
            </div>`;
    } else {
        // Create a container for the items themselves
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'cart-items-container';

        itemsContainer.innerHTML = cart.map(item => {
            // Validate item data minimally
            const id = item.id ?? 'unknown';
            const name = item.name ?? 'Unnamed Product';
            const price = typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A';
            const quantity = item.quantity ?? 1;
            const totalPrice = (item.price * quantity).toFixed(2);
            const imageSrc = `src/${name.replace(/ /g, '_')}.jpg`;

            return `
            <div class="cart-item-card" data-id="${id}">
                <img src="${imageSrc}" alt="${name}" class="cart-item-image" 
                    onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                <div class="cart-item-details">
                    <div class="cart-item-name">${name}</div>
                    <div class="cart-item-price">RM ${totalPrice}</div>
                    <div class="cart-item-quantity">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-id="${id}">-</button>
                            <span class="quantity-value">${quantity}</span>
                            <button class="quantity-btn plus" data-id="${id}">+</button>
                        </div>
                    </div>
                </div>
                <button class="btn-remove-item" data-id="${id}" aria-label="Remove ${name}">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        }).join('');

        // Calculate Subtotal
        let subtotal = cart.reduce((sum, item) => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
            return sum + (price * quantity);
        }, 0);

        // Create Summary Section
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'cart-summary';
        summaryContainer.innerHTML = `
            <h3>Order Summary</h3>
            <p>
                <span>Subtotal (${cart.reduce((total, item) => total + (item.quantity || 0), 0)} items)</span>
                <span>RM ${subtotal.toFixed(2)}</span>
            </p>
            <p>
                <span>Total</span>
                <span>RM ${subtotal.toFixed(2)}</span>
            </p>
            <button class="checkout-btn">
                Proceed to Checkout
            </button>
        `;

        // Append items and summary to the main container
        cartContainer.appendChild(itemsContainer);
        cartContainer.appendChild(summaryContainer);

        // --- Event Listeners (using delegation on itemsContainer) ---
        itemsContainer.addEventListener('click', function(event) {
            const button = event.target.closest('.btn-remove-item');
            if (button) {
                const productIdToRemove = parseInt(button.dataset.id);
                console.log(`Remove button clicked for ID: ${productIdToRemove}`);
                if (!isNaN(productIdToRemove)) {
                    const cardToRemove = button.closest('.cart-item-card');
                    if (cardToRemove) {
                        removeFromCart(productIdToRemove, cardToRemove);
                    } else {
                        console.error("Could not find parent card element for remove button.");
                    }
                }
            }

            // Handle quantity controls
            const quantityBtn = event.target.closest('.quantity-btn');
            if (quantityBtn) {
                const productId = parseInt(quantityBtn.dataset.id);
                const isPlus = quantityBtn.classList.contains('plus');
                updateCartQuantity(productId, isPlus);
            }
        });

        // Add listener for checkout button
        const checkoutBtn = summaryContainer.querySelector('.checkout-btn');
        if(checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'CheckOut.php';
            });
        }
    }
}

function showCartNotification(productName) {
    // Simple alert for now, can replace with fancier notification
    // alert(`${productName} added to cart!`);

    // Or use the existing notification element logic:
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `${productName} added to cart!`; // Use textContent for safety
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        setTimeout(() => { notification.classList.add('show'); }, 10); // Add slight delay
    });

    // Remove notification after duration
    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        }, { once: true });
    }, 3000); // Notification visible for 3 seconds
}

function toggleSave(productId, buttonElement) {
    console.log(`Toggling save for product ID: ${productId}`);
    if (isNaN(productId) || !buttonElement) return;

    const index = savedItems.indexOf(productId);

    if (index === -1) {
        // Item not saved -> Save it
        savedItems.push(productId);
        buttonElement.innerHTML = '<i class="fas fa-heart"></i> Unsave';
        buttonElement.classList.add('saved');
        console.log("Item saved.");
    } else {
        // Item saved -> Unsave it
        savedItems.splice(index, 1);
        buttonElement.innerHTML = '<i class="far fa-heart"></i> Save';
        buttonElement.classList.remove('saved');
        console.log("Item unsaved.");

        // If currently viewing the saved items list, remove the card visually
        const currentCategoryTitle = document.getElementById('current-category')?.textContent;
        if (currentCategoryTitle === 'Saved Items' || currentCategoryTitle === 'Saves') {
             const productCard = buttonElement.closest('.product-card');
            if (productCard) {
                 console.log("Removing product card from Saved Items view.");
                productCard.remove();
                 // Check if saves list is now empty
                 if(savedItems.length === 0) {
                    const container = document.getElementById('product-container');
                    if(container) container.innerHTML = '<p>No saved items yet.</p>';
                 }
             }
        }
    }

    saveSavedItems(); // Persist changes
    updateSaveCount(); // Update visual counter
}

function saveSavedItems() {
    try {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
         console.log("Saved items saved to localStorage:", JSON.stringify(savedItems));
    } catch (e) {
        console.error("Error saving savedItems to localStorage:", e);
    }
}

function displaySavedProducts() {
    const container = document.getElementById('product-container');
    const categoryTitle = document.getElementById('current-category');

    if(categoryTitle) categoryTitle.textContent = 'Saved Items';
    if (!container) return;

    console.log("--- Displaying Saved Products --- Current saved items:", JSON.stringify(savedItems));

    const allProducts = getAllMockProducts(); // Get all available product details
    // Filter all products to get only the ones whose IDs are in the savedItems array
    const savedProductsDetails = allProducts.filter(product =>
        savedItems.includes(product.id)
    );

    if (savedProductsDetails.length === 0) {
        container.innerHTML = '<p>No saved items yet.</p>';
    } else {
         // Display using the same displayProducts function for consistency
         // It will correctly mark items as saved based on the global savedItems array
         displayProducts(savedProductsDetails);
    }
}

// Make functions globally accessible if called directly via HTML onclick (like original toggleSave)
// Although event delegation is preferred, keep this for compatibility if needed.
window.toggleSave = toggleSave;

// Add CSS for cart item display if needed (add to style.css)
/*
.cart-items-container { margin-bottom: 20px; }
.cart-item-card { display: flex; align-items: center; background: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 10px; position: relative; }
.cart-item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
.cart-item-details { flex-grow: 1; }
.cart-item-name { font-weight: bold; margin-bottom: 5px; }
.cart-item-price { font-size: 0.9em; color: #555; margin-bottom: 3px; }
.cart-item-quantity { font-size: 0.9em; color: #555; }
.btn-remove-item { background: transparent; border: none; color: #dc3545; font-size: 1.2em; cursor: pointer; position: absolute; top: 10px; right: 10px; padding: 5px; line-height: 1; }
.btn-remove-item:hover { color: #a71d2a; }
.cart-summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: right; }
.checkout-btn { margin-top: 10px; }
*/
// ==========================
// Explosion Animation Effect
// ==========================
function explodeEffect(element) {
    return new Promise((resolve) => { // Return a promise to signal completion
        const rect = element.getBoundingClientRect(); // Get position relative to viewport
        const particleCount = 15; // Number of particles
        const particles = [];
        const container = document.body; // Add particles to body

        // Hide the original element smoothly or abruptly
        element.style.transition = 'opacity 0.1s ease-out';
        element.style.opacity = '0';
        element.style.pointerEvents = 'none'; // Prevent further interaction

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Randomize color slightly (optional)
            // particle.style.backgroundColor = `hsl(${Math.random() * 60 + 260}, 70%, 60%)`; // Shades of purple/pink

            // Start particles from within the element's bounds
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height;

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            container.appendChild(particle);
            particles.push(particle);

            // Calculate random trajectory
            const angle = Math.random() * Math.PI * 2; // Random angle
            const distance = Math.random() * 100 + 50; // Random distance (50-150px)
            const rotation = Math.random() * 720 - 360; // Random rotation (-360 to 360 deg)

            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance;

            // Trigger reflow before applying final animation state
            // This ensures the transition starts correctly
            void particle.offsetWidth;

            // Apply final animation state (move, rotate, fade out)
             particle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(0.5)`; // Shrink particles too
            particle.style.opacity = '0';
        }

        // Clean up after the longest transition (opacity or transform)
        // Assuming transition duration is 0.6s (600ms) from CSS
        setTimeout(() => {
            particles.forEach(p => p.remove());
            // Optionally remove the original element completely from DOM if needed,
            // but displayCart() will handle this if it re-renders fully.
            // element.remove();
            resolve(); // Resolve the promise indicating animation is done
        }, 600); // Match the CSS transition duration
    });
}

// ==========================
// Action Buttons (Saves & Cart)
// ==========================
function initActionButtons() {
    // Initialize saves button
    const savesButton = document.querySelector('.action-link[data-category="saves"]');
    if (savesButton) {
        savesButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.location.pathname.includes('Main.php')) {
                displaySavedProducts();
                const categoryTitle = document.getElementById('current-category');
                if (categoryTitle) categoryTitle.textContent = 'Saved Items';
                // Remove active class from sidebar menu items
                document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
            } else {
                window.location.href = 'Main.php';
                localStorage.setItem('showSaves', 'true');
            }
        });
    }

    // Initialize cart button
    const cartButton = document.querySelector('.action-link[data-category="cart"]');
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.location.pathname.includes('Main.php')) {
                displayCart();
                const categoryTitle = document.getElementById('current-category');
                if (categoryTitle) categoryTitle.textContent = 'Shopping Cart';
                // Remove active class from sidebar menu items
                document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
            } else {
                window.location.href = 'Main.php';
                localStorage.setItem('showCart', 'true');
            }
        });
    }
}

// ==========================
// Product Detail Page
// ==========================
function initProductDetailPage() {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        console.error('No product ID found in URL');
        return;
    }

    // Initialize cart and saved items from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

    // Update cart and save badges in both the top bar and sidebar
    updateCartCount();
    updateSaveCount();

    // Get product data
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Update product details in the UI
    document.getElementById('detail-product-name').textContent = product.name;
    document.getElementById('detail-product-price').textContent = `RM ${product.price.toFixed(2)}`;
    document.getElementById('detail-product-image').src = `src/${product.name.replace(/ /g, '_')}.jpg`;
    document.getElementById('detail-product-image').alt = product.name;

    // Add cart status indicator
    const isInCart = cart.some(item => item.id === productId);
    const cartStatusDiv = document.createElement('div');
    cartStatusDiv.className = 'cart-status';
    cartStatusDiv.textContent = isInCart ? 'In Cart' : '';
    document.querySelector('.product-detail-info').insertBefore(cartStatusDiv, document.querySelector('.product-detail-actions'));

    // Initialize save button
    const saveButton = document.getElementById('save-product-btn');
    if (saveButton) {
        saveButton.dataset.id = productId;
        const isSaved = savedItems.includes(productId);
        updateSaveButtonState(saveButton, isSaved);
        
        saveButton.addEventListener('click', function() {
            const isCurrentlySaved = savedItems.includes(productId);
            toggleSave(productId, this);
            updateSaveButtonState(this, !isCurrentlySaved);
            // Update both top bar and sidebar badges
            updateSaveCount();
        });
    }

    // Initialize add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // Create a mock button element for the animation
            const mockButton = document.createElement('button');
            mockButton.classList.add('add-to-cart');
            document.body.appendChild(mockButton);
            
            // Add the product to cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            // Save cart and update UI
            saveCart();
            // Update both top bar and sidebar badges
            updateCartCount();
            
            // Animate and show notification
            animateAddToCart(mockButton);
            setTimeout(() => {
                mockButton.remove();
            }, 1000);
            
            showCartNotification(product.name);
        });
    }

    // Initialize write review button
    const writeReviewBtn = document.getElementById('write-review-btn');
    if (writeReviewBtn) {
        writeReviewBtn.addEventListener('click', function() {
            const reviewModal = document.getElementById('review-modal');
            if (reviewModal) {
                reviewModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Initialize review form
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('review-name').value;
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;
            
            // Create review HTML
            const reviewHTML = `
                <div class="review-item">
                    <div class="review-author">${name}</div>
                    <div class="review-rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
                    <div class="review-date">${new Date().toLocaleDateString()}</div>
                    <div class="review-content">${comment}</div>
                </div>
            `;
            
            // Add review to the page
            const reviewsContainer = document.getElementById('detail-product-reviews');
            if (reviewsContainer.textContent === 'No reviews at the moment') {
                reviewsContainer.innerHTML = reviewHTML;
            } else {
                reviewsContainer.insertAdjacentHTML('afterbegin', reviewHTML);
            }
            
            // Close modal and reset form
            const reviewModal = document.getElementById('review-modal');
            if (reviewModal) {
                reviewModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            this.reset();
            
            // Show success message
            alert('Thank you for your review!');
        });
    }

    // Initialize back button
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Main.php';
        });
    }
}

// Helper function to update save button state
function updateSaveButtonState(button, isSaved) {
    if (!button) return;
    
    const icon = button.querySelector('i');
    if (icon) {
        icon.className = isSaved ? 'fas fa-heart' : 'far fa-heart';
    }
    button.textContent = isSaved ? 'Unsave' : 'Save';
    button.classList.toggle('saved', isSaved);
    
    // Re-append the icon since textContent overwrote it
    if (icon) {
        button.insertBefore(icon, button.firstChild);
        // Add a space after the icon
        button.insertBefore(document.createTextNode(' '), button.lastChild);
    }
}

// Add new function to handle quantity updates
function updateCartQuantity(productId, isPlus) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    if (isPlus) {
        cart[itemIndex].quantity++;
    } else {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            // If quantity would go below 1, remove the item
            const cardElement = document.querySelector(`.cart-item-card[data-id="${productId}"]`);
            if (cardElement) {
                removeFromCart(productId, cardElement);
            }
        }
    }

    // Update localStorage and UI
    saveCart();
    displayCart(); // Re-render the entire cart to update all values
}

