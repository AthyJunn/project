// Global state variables
let cart = [];
let savedItems = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage if needed
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

    // Initialize UI components and load initial data
    initSidebar();
    initSearch();
    initAccountDropdown();
    initModals();
    initCartDisplay(); // Renamed for clarity
    initSavesDisplay(); // Renamed for clarity
    updateCartCount(); // Initial count based on loaded cart
    updateSaveCount(); // Initial count based on loaded saves
    loadProducts('recommendation'); // Load initial products
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

            // Handle active state visually
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
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
// Add this function
function initDarkModeToggle() {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const icon = toggleButton?.querySelector('i'); // Use optional chaining

    if (!toggleButton || !icon) {
        console.warn("Dark mode toggle button or icon not found.");
        return;
    }

    // Function to apply the mode
    const applyMode = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
            console.log("Dark mode enabled");
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
            console.log("Dark mode disabled");
        }
    };

    // Check localStorage on initial load
    const prefersDark = localStorage.getItem('darkMode') === 'enabled';
    applyMode(prefersDark); // Apply initial mode

    // Add click listener
    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyDark = body.classList.contains('dark-mode');
        applyMode(!isCurrentlyDark); // Toggle the mode
    });
}

// Modify the DOMContentLoaded listener to call the new function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage if needed
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

    // Initialize UI components and load initial data
    initSidebar();
    initSearch();
    initAccountDropdown();
    initModals();
    initCartDisplay(); // Renamed for clarity
    initSavesDisplay(); // Renamed for clarity
    initDarkModeToggle(); // <-- Add this call
    updateCartCount(); // Initial count based on loaded cart
    updateSaveCount(); // Initial count based on loaded saves
    loadProducts('recommendation'); // Load initial products
});

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

    // Toggle dropdown visibility when clicking the button
    accountButton.addEventListener('click', function(e) {
        console.log("Account button clicked"); // Debugging statement
        e.stopPropagation();
        accountDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!accountDropdown.contains(e.target) && !accountButton.contains(e.target)) {
            accountDropdown.classList.remove('show');
        }
    });

    // Prevent dropdown from closing when clicking inside it
    accountDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Handle Add Account click
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            accountDropdown.classList.remove('show');
            const registerModal = document.getElementById('register-modal');
            if (registerModal) {
                registerModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Handle Logout click
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

            return `
            <div class="product-card" data-product-id="${id}" data-product-name="${name}" data-product-price="${price}">
                <div class="product-image">
                    <img src="${imageSrc}" alt="${name}" onerror="this.onerror=null; this.src='images/placeholder.jpg';"> <!-- Added placeholder fallback -->
                </div>
                <div class="product-info">
                    <div class="product-title">${name}</div>
                    <div class="product-price">RM ${price}</div>
                    <div class="product-actions">
                        <button class="btn-purple add-to-cart">Add to Cart</button>
                        <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${id}">
                            <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i> ${isSaved ? 'Saved' : 'Save'}
                        </button>
                    </div>
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

// Initialize event listeners related to cart display
function initCartDisplay() {
    const cartLink = document.querySelector('.sidebar-menu a[data-category="cart"]');
    if (cartLink) {
        // The main listener for switching views is in initSidebar
        // This function is mainly a placeholder if other cart-specific init is needed
    }
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
    // const productPrice = parseFloat(productCard.dataset.productPrice); // Not currently used in cart logic below, but available

    if (isNaN(productId)) {
        console.error("Invalid Product ID found:", productCard.dataset.productId);
        return;
    }

    console.log(`--- Animate Add To Cart Start --- ID: ${productId} (${productName})`);

    // --- Animation Setup ---
    const productImage = productCard.querySelector('.product-image img');
    const cartTarget = document.querySelector('.sidebar-menu a[data-category="cart"] i'); // Target the cart icon

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
        imgClone.style.pointerEvents = 'none'; // Prevent interaction
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
        }, { once: true }); // Use { once: true } for cleanup safety
    } else {
        console.warn("Could not find product image or cart target for animation.");
    }

    // --- Actual Cart Update Logic ---
    console.log("Current 'cart' array STATE at start of cart logic:", JSON.stringify(cart)); // CRITICAL LOG

    const productData = getAllMockProducts().find(p => p.id === productId);
    if (!productData) {
        console.error(`Product data not found in mock data for ID: ${productId}`);
        return; // Stop if product details aren't available
    }

    const existingItemIndex = cart.findIndex(item => item.id === productId); // Use findIndex for potential replacement/update

    if (existingItemIndex > -1) {
        // Item exists, increment quantity
        console.log(`FOUND existing item in cart at index ${existingItemIndex} for ID ${productId}. Incrementing quantity.`);
        cart[existingItemIndex].quantity++; // Directly modify the item in the array
        console.log(`Incremented quantity. New quantity: ${cart[existingItemIndex].quantity}`);
    } else {
        // Item does not exist, add new item
        console.log(`Did NOT find existing item for ID ${productId}. Adding new item.`);
        const newItem = { ...productData, quantity: 1 }; // Create new item object
        cart.push(newItem); // Add to the global cart array
        console.log(`Pushed new item: ${JSON.stringify(newItem)}`);
    }

    console.log("Cart array STATE before saveCart:", JSON.stringify(cart));
    saveCart(); // Persist the updated cart to localStorage
    updateCartCount(); // Update the visual counter
    showCartNotification(productName); // Show user feedback

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

    if(categoryTitle) categoryTitle.textContent = 'Your Cart'; // Set title
    if (!cartContainer) {
        console.error("Cart container not found!");
        return;
    }

    console.log("--- Displaying Cart --- Current cart state:", JSON.stringify(cart));

    // Clear previous content
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
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
            const imageSrc = `src/${name.replace(/ /g, '_')}.jpg`;

            return `
            <div class="cart-item-card" data-id="${id}">
                <img src="${imageSrc}" alt="${name}" class="cart-item-image" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                <div class="cart-item-details">
                    <div class="cart-item-name">${name}</div>
                    <div class="cart-item-price">RM ${price}</div>
                    <div class="cart-item-quantity">Quantity: ${quantity}</div>
                    <!-- Add +/- buttons here later if needed -->
                </div>
                <button class="btn-remove-item" data-id="${id}" aria-label="Remove ${name}">×</button>
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
            <h3>Summary</h3>
            <p>Subtotal: RM ${subtotal.toFixed(2)}</p>
            <button class="btn-purple checkout-btn">Proceed to Checkout</button>
        `;

        // Append items and summary to the main container
        cartContainer.appendChild(itemsContainer);
        cartContainer.appendChild(summaryContainer);


        // --- Event Listeners (using delegation on itemsContainer) ---
        itemsContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-remove-item')) {
                const button = event.target;
                const productIdToRemove = parseInt(button.dataset.id);
                console.log(`Remove button clicked for ID: ${productIdToRemove}`);
                if (!isNaN(productIdToRemove)) {
                    // Find the card element associated with this button
                    const cardToRemove = button.closest('.cart-item-card');
                    if (cardToRemove) {
                         removeFromCart(productIdToRemove, cardToRemove); // Pass the element
                    } else {
                        console.error("Could not find parent card element for remove button.");
                    }
                }
            }
            // Add listeners for quantity buttons here if implemented later
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

function updateCartCount() {
    console.log("--- updateCartCount called ---");
    // Ensure cart is an array before reducing
    const currentCart = Array.isArray(cart) ? cart : [];
    console.log("Calculating count based on cart:", JSON.stringify(currentCart));

    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        // Calculate total quantity of all items
        const count = currentCart.reduce((total, item) => total + (item.quantity || 0), 0);
        console.log("Calculated total quantity:", count);
        cartBadge.textContent = count;
        // Show badge only if count > 0
        cartBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    } else {
        console.warn("Cart badge element not found.");
    }
     console.log("--- updateCartCount finished ---");
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

// ==========================
// Save Functionality
// ==========================
function initSavesDisplay() {
    const savesLink = document.querySelector('.sidebar-menu a[data-category="saves"]');
    if (savesLink) {
        // Listener is handled in initSidebar
    }
}

function toggleSave(productId, buttonElement) {
    console.log(`Toggling save for product ID: ${productId}`);
    if (isNaN(productId) || !buttonElement) return;

    const index = savedItems.indexOf(productId);

    if (index === -1) {
        // Item not saved -> Save it
        savedItems.push(productId);
        buttonElement.innerHTML = '<i class="fas fa-heart"></i> Saved';
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

function updateSaveCount() {
    const saveBadge = document.querySelector('.save-badge');
    if (saveBadge) {
        const count = savedItems.length;
        saveBadge.textContent = count;
        saveBadge.style.display = count > 0 ? 'inline-flex' : 'none';
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