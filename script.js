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
            // Explicitly update title and deactivate sidebar links
            const categoryTitle = document.getElementById('current-category');
            if (categoryTitle) categoryTitle.textContent = 'Your Cart';
            document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
        } else if (localStorage.getItem('showSaves') === 'true') {
            console.log("Detected showSaves flag, displaying saved items.");
            localStorage.removeItem('showSaves'); // Clear the flag
            displaySavedProducts(); // Show saved items view
            // Explicitly update title and deactivate sidebar links
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
        // Call checkout specific initializations if needed later
        // e.g., loadCheckoutCartSummary(); // Hypothetical function

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

            // Handle active state visually
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            let titleText = this.textContent.replace(/ \d+$/, '').trim(); // Update title, remove badge number

            // Load content based on category
            if (category === 'cart') {
                titleText = 'Your Cart';
                displayCart();
            } else if (category === 'saves') {
                 titleText = 'Saved Items';
                displaySavedProducts();
            } else {
                loadProducts(category);
            }
             if (categoryTitle) {
                categoryTitle.textContent = titleText;
            }
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
        // If on Main.php, perform search and display results there
        if (document.getElementById('product-container')) {
            if (searchTerm) {
                searchProducts(searchTerm);
            } else {
                loadProducts('recommendation'); // Load default if search is cleared
            }
        } else {
            // If on another page, redirect to Main.php with search term
            window.location.href = `Main.php?search=${encodeURIComponent(searchTerm)}`;
            // Note: Main.php would need logic to read this URL param on load
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
// Account Dropdown (All Pages)
// ==========================
function initAccountDropdown() {
    const accountButton = document.getElementById('account-button');
    const accountDropdown = document.getElementById('account-dropdown');
    const addAccountBtn = document.getElementById('add-account-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (!accountButton || !accountDropdown) return;

    accountButton.addEventListener('click', (e) => {
        e.stopPropagation();
        accountDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!accountDropdown.contains(e.target) && !accountButton.contains(e.target)) {
            accountDropdown.classList.remove('show');
        }
    });

    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            accountDropdown.classList.remove('show');
            showModalById('register-modal'); // Use helper
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            accountDropdown.classList.remove('show');
            // Add actual logout logic here (e.g., redirect to logout script)
            alert('Logged out successfully! (Simulation)');
            // Update UI to guest state if needed
            const userStatus = document.querySelector('.user-status');
            const userAvatar = document.querySelector('.user-avatar');
            if(userStatus) userStatus.textContent = 'Guest';
            if(userAvatar) userAvatar.src = 'images/guest-avatar.png';
        });
    }
}

// ==========================
// Modals (Login/Register - All Pages)
// ==========================
function initModals() {
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideModalById('login-modal');
            showModalById('register-modal');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            hideModalById('register-modal');
            showModalById('login-modal');
        });
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal-overlay');
            if(modal) hideModal(modal);
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                hideModal(this);
            }
        });
    });

    // Password visibility toggles
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = "password";
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Show password');
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
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalElement) {
    if (modalElement) {
        modalElement.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================
// Product Handling (Main Page)
// ==========================
function loadProducts(category) {
    console.log(`Loading products for category: ${category}`);
    const container = document.getElementById('product-container');
    if(!container) return; // Only run on Main.php

    container.innerHTML = '<p>Loading products...</p>';

    // --- MOCK DATA ---
    // In a real app, fetch from backend: fetch('api/products?category=' + category)
    const products = getMockProducts(category);
    displayProducts(products);
    // --- END MOCK DATA ---
}

function searchProducts(searchTerm) {
    console.log(`Searching for: ${searchTerm}`);
    const container = document.getElementById('product-container');
    const categoryTitle = document.getElementById('current-category');
    if(!container) return; // Only run on Main.php

    container.innerHTML = '<p>Searching...</p>';
    if(categoryTitle) categoryTitle.textContent = `Search Results for "${searchTerm}"`;

    // --- MOCK SEARCH ---
    // In a real app, fetch from backend: fetch('api/products?search=' + searchTerm)
    const allProducts = getAllMockProducts();
    const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) // Optional: search description too
    );
    displayProducts(results);
    // --- END MOCK SEARCH ---
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return; // Safety check

    if (!Array.isArray(products)) {
        console.error("Invalid data received for products:", products);
        container.innerHTML = '<p>Could not display products due to an error.</p>';
        return;
    }

    if (products.length === 0) {
        // Get current category/search context for a better message
        const categoryTitle = document.getElementById('current-category')?.textContent || 'this category';
         if(categoryTitle.toLowerCase().includes('search results')) {
             container.innerHTML = '<p>No products found matching your search.</p>';
         } else if (categoryTitle === 'Saved Items') {
              container.innerHTML = '<p>No saved items yet.</p>';
         }
         else {
            container.innerHTML = `<p>No products found in ${categoryTitle}.</p>`;
         }
        return;
    }

    container.innerHTML = products.map(product => {
        // Validate product data
        const id = product.id ?? `unknown-${Math.random()}`;
        const name = product.name ?? 'Unnamed Product';
        const price = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
        // Correct image path assumption, use placeholder on error
        const imageName = name.replace(/ /g, '_'); // Replace spaces for filename consistency
        const imageSrc = `src/${imageName}.jpg`; // *** ADJUST PATH AS NEEDED *** e.g., 'images/products/'
        const isSaved = savedItems.includes(id); // Check if item is in global savedItems array

        return `
        <div class="product-card" data-product-id="${id}">
             <a href="productDetail.php?id=${id}" class="product-card-link" aria-label="View details for ${name}">
                <div class="product-image">
                    <img src="${imageSrc}" alt="${name}" loading="lazy" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                </div>
                <div class="product-info">
                    <div class="product-title">${name}</div>
                    <div class="product-price">RM ${price}</div>
                </div>
            </a>
            <div class="product-actions">
                <button class="btn-purple add-to-cart" data-id="${id}" aria-label="Add ${name} to cart">Add to Cart</button>
                <button class="btn-save ${isSaved ? 'saved' : ''}" data-id="${id}" aria-label="${isSaved ? 'Unsave' : 'Save'} ${name}">
                    <i class="${isSaved ? 'fas' : 'far'} fa-heart"></i> ${isSaved ? 'Saved' : 'Save'}
                </button>
            </div>
        </div>`;
    }).join('');

     // Note: Event listeners for buttons within these cards are added in initMainPageProductClicks
}

// Add event listeners specifically for product cards on the main page
function initMainPageProductClicks() {
    const container = document.getElementById('product-container');
    if (!container) return;

    // Use event delegation on the container
    container.addEventListener('click', function(event) {
        const target = event.target;

        // Handle "Add to Cart" clicks
        if (target.classList.contains('add-to-cart')) {
            event.preventDefault(); // Prevent link navigation if button is inside <a>
            const button = target;
            const productId = parseInt(button.dataset.id);
             const productCard = button.closest('.product-card');
             const productName = productCard?.querySelector('.product-title')?.textContent || 'Product';
             const productImage = productCard?.querySelector('.product-image img');

            if (!isNaN(productId) && productCard) {
                console.log(`Main page Add to Cart clicked for ID: ${productId}`);
                 const productData = getProductById(productId);
                 if (productData) {
                     addToCartLogic(productData); // Use shared logic function
                     if (productImage) {
                         animateFlyToCart(productImage); // Use shared animation
                     }
                     showCartNotification(productName); // Use shared notification
                 } else {
                    console.error(`Product data not found for ID ${productId} on main page click.`);
                    alert("Error: Could not find product details.");
                 }
            }
        }
        // Handle "Save" clicks
        else if (target.classList.contains('btn-save') || target.closest('.btn-save')) {
            event.preventDefault(); // Prevent link navigation if button is inside <a>
            const button = target.closest('.btn-save');
            const productId = parseInt(button.dataset.id);
            if (!isNaN(productId)) {
                 console.log(`Main page Save button clicked for ID: ${productId}`);
                toggleSave(productId, button); // Use global toggleSave function
            }
        }
        // Note: Clicking the card itself is handled by the <a> tag navigating to productDetail.php
    });
}


// ==========================
// Mock Product Data (Keep for fallback/testing)
// ==========================
function getMockProducts(category) {
    const allProducts = getAllMockProducts();
    // Normalize category name if needed
    category = category.toLowerCase();

    switch(category) {
        case 'butterfly':
        case 'butterfly series': // Allow for variations
             return allProducts.filter(p => [2, 3, 4].includes(p.id));
        case 'moonstone':
        case 'moonstone series':
             return allProducts.filter(p => [5, 6, 7].includes(p.id));
        case 'malachite':
        case 'mystical malachite series':
             return allProducts.filter(p => [8, 9, 10, 11].includes(p.id));
        case 'luxe':
        case 'luxe series':
             return allProducts.filter(p => [12, 13].includes(p.id));
        case 'recommendation':
        default:
            // Return a subset or all for recommendation/default
            return allProducts.slice(0, 13); // Example: show first 13
    }
}

function getAllMockProducts() {
    // Central place for all product definitions, including descriptions
    return [
        { id: 1, name: 'Healing Soul', price: 110, description: 'This Bracelet was curated with clear Quartz, the master healer crystal.\n\nClear Quartz : 8mm\n\n1¾k gold plated charms with Zircon. (Moon, Ribbon and Filiqree Heart)' },
        { id: 2, name: 'Calm Butterfly', price: 160, description: 'Features calming stones like Amethyst and Lepidolite combined with elegant butterfly charms. Perfect for easing anxiety and promoting peace.' },
        { id: 3, name: 'Ethereal Butterfly', price: 170, description: 'A delicate design featuring high-grade Moonstone and Aquamarine, evoking grace, intuition, and transformation. Accented with silver butterfly charms.' },
        { id: 4, name: 'Sweet Butterfly', price: 90, description: 'A charming and affordable bracelet with Rose Quartz and colorful beads, accented with a sweet butterfly charm. Promotes love and joy.' },
        { id: 5, name: 'Moon Candies', price: 110, description: 'A playful mix of colorful moonstone beads resembling sweet candies. Connects with lunar energy and enhances intuition.' },
        { id: 6, name: 'Moon Phase', price: 160, description: 'Represents the waxing and waning phases of the moon using carefully selected Labradorite and Moonstone beads. Enhances psychic abilities and inner knowing.' },
        { id: 7, name: 'Ethereal Moon', price: 170, description: 'Showcases high-quality Rainbow Moonstones with a mystical blue flash. A powerful stone for new beginnings and emotional balance.' },
        { id: 8, name: 'Healing Transformation', price: 70, description: 'Deep green Malachite paired with Smoky Quartz promotes healing, absorbs negativity, and encourages positive transformation.' },
        { id: 9, name: 'Breezy Transformation', price: 75, description: 'A lighter take on the malachite transformation theme, incorporating Chrysocolla for communication and calm change.' },
        { id: 10, name: 'Wealthy Transformation', price: 70, description: 'Malachite combined with Citrine and Pyrite to attract abundance while navigating personal growth and transformation.' },
        { id: 11, name: 'Amplified Transformation', price: 75, description: 'Combines the transformative power of Malachite with the amplifying energy of Clear Quartz for focused change.' },
        { id: 12, name: 'Angel Self Love Edition', price: 140, description: 'A LUXE series bracelet featuring premium Rose Quartz, Kunzite, and Angelite beads. Fosters self-love, compassion, and angelic connections.' },
        { id: 13, name: 'Chunk of Abundance', price: 180, description: 'A statement LUXE piece featuring large, high-quality Green Aventurine, Citrine, and Pyrite nuggets designed to be a powerful magnet for abundance and prosperity.' }
    ];
}

// ==========================
// Cart Functionality (Shared Logic)
// ==========================

// Shared logic to add/update item in the global cart array
function addToCartLogic(productData) {
    if (!productData || typeof productData.id === 'undefined') {
        console.error("addToCartLogic received invalid product data:", productData);
        return;
    }
    const productId = productData.id;
    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        // Item exists, increment quantity
        console.log(`Item ${productId} exists, incrementing quantity.`);
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1; // Ensure quantity is a number
    } else {
        // Item does not exist, add new item
        console.log(`Item ${productId} not found, adding new.`);
        // Ensure price is numeric before adding
         const price = typeof productData.price === 'number' ? productData.price : 0;
         const newItem = { ...productData, price: price, quantity: 1 }; // Clone product data and add quantity
        cart.push(newItem);
    }
    console.log("Cart state after update:", JSON.stringify(cart));
    saveCart(); // Persist changes
    updateCartCount(); // Update UI badges
}

// Modified removeFromCart to use animation and handle data update
async function removeFromCart(productId, cardElement) {
    console.log(`--- removeFromCart called for ID: ${productId} ---`);
    if (isNaN(productId)) {
        console.error("Invalid productId passed to removeFromCart:", productId);
        return;
    }

    // 1. Trigger animation if cardElement is provided
    if (cardElement) {
        try {
            console.log("Triggering explosion effect...");
            await explodeEffect(cardElement); // Wait for the animation Promise
            console.log("Explosion effect finished.");
        } catch (error) {
            console.error("Explosion animation failed:", error);
            // Fallback: ensure the card is hidden/removed visually if animation fails
             cardElement.style.display = 'none';
        }
    } else {
        console.warn("removeFromCart called without cardElement, skipping animation.");
    }

    // 2. Update the actual cart data array
    console.log("Updating cart data...");
    console.log("Cart BEFORE data removal:", JSON.stringify(cart));
    const initialLength = cart.length;
    cart = cart.filter(item => item.id !== productId); // Filter out the item

    if (cart.length < initialLength) {
        console.log(`Item with ID ${productId} successfully filtered from data array.`);
    } else {
        console.warn(`Item with ID ${productId} was NOT found in the data array during filtering.`);
    }
    console.log("Cart AFTER data removal:", JSON.stringify(cart));

    // 3. Persist changes and update UI count
    saveCart();
    updateCartCount();

    // 4. Re-render the cart view to reflect changes (e.g., update subtotal)
    // This assumes displayCart() is the function to show the cart page content
    // Check if the cart container is currently visible or if the active category is cart
    const cartContainer = document.getElementById('product-container'); // Assuming this is where cart items are shown
    const currentCategory = document.getElementById('current-category')?.textContent;
    if (cartContainer && (currentCategory === 'Your Cart' || currentCategory === 'Shopping Cart')) { // Check if we are viewing the cart
        console.log("Re-rendering cart display after removal...");
        displayCart(); // Re-draw the cart view if it's currently displayed
    }

    console.log(`--- removeFromCart finished for ID: ${productId} ---`);
}


function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Cart saved to localStorage:", JSON.stringify(cart));
    } catch (e) {
        console.error("Error saving cart to localStorage:", e);
        // Optionally inform the user or try a different storage method
    }
}

// Display cart contents (typically on Main.php when 'Cart' is selected)
function displayCart() {
    const cartContainer = document.getElementById('product-container'); // Target main content area
    const categoryTitle = document.getElementById('current-category');

    if(categoryTitle) categoryTitle.textContent = 'Your Cart'; // Set title
    if (!cartContainer) {
        console.error("Main product container not found for displaying cart!");
        return;
    }

    console.log("--- Displaying Cart --- Current cart state:", JSON.stringify(cart));
    cartContainer.innerHTML = ''; // Clear previous content (like products)

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty-message">
                 <i class="fas fa-shopping-cart" style="font-size: 3em; color: #ccc;"></i>
                <p>Your cart is empty.</p>
                <button class="btn-purple" onclick="loadProducts('recommendation'); document.getElementById('current-category').textContent='Recommendation';">Continue Shopping</button>
            </div>`;
    } else {
        const itemsHtml = cart.map(item => {
            const id = item.id ?? 'unknown';
            const name = item.name ?? 'Unnamed Product';
            // Ensure price is a number, default to 0 if not
             const price = typeof item.price === 'number' ? item.price : 0;
            const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1; // Ensure quantity is at least 1
            const itemTotal = (price * quantity).toFixed(2);
            // Consistent image source logic
            const imageName = name.replace(/ /g, '_');
            const imageSrc = `src/${imageName}.jpg`; // *** ADJUST PATH AS NEEDED ***

            return `
            <div class="cart-item-card" data-id="${id}">
                <img src="${imageSrc}" alt="${name}" class="cart-item-image" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                <div class="cart-item-details">
                    <div class="cart-item-name">${name}</div>
                    <div class="cart-item-price">RM ${price.toFixed(2)}</div>
                     <div class="cart-item-quantity-controls">
                         <span>Qty:</span>
                         <button class="quantity-btn decrease-qty" data-id="${id}" aria-label="Decrease quantity of ${name}">-</button>
                         <span class="quantity-value">${quantity}</span>
                         <button class="quantity-btn increase-qty" data-id="${id}" aria-label="Increase quantity of ${name}">+</button>
                     </div>
                     <div class="cart-item-total">Subtotal: RM ${itemTotal}</div>
                </div>
                <button class="btn-remove-item" data-id="${id}" aria-label="Remove ${name} from cart">×</button>
            </div>`;
            }).join('');

        // Calculate Subtotal
        let subtotal = cart.reduce((sum, item) => {
            const price = typeof item.price === 'number' ? item.price : 0;
            const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
            return sum + (price * quantity);
        }, 0);

        // Create Summary and Items structure
        cartContainer.innerHTML = `
            <div class="cart-page-layout">
                 <div class="cart-items-list">
                     ${itemsHtml}
                 </div>
                 <div class="cart-summary-sidebar">
                     <h3>Order Summary</h3>
                     <div class="summary-row">
                         <span>Subtotal (${cart.reduce((n, i) => n + (i.quantity || 1), 0)} items)</span>
                         <span id="cart-subtotal">RM ${subtotal.toFixed(2)}</span>
                     </div>
                     <!-- Add shipping/discount later if needed -->
                     <div class="summary-row total">
                         <span>Total</span>
                         <span id="cart-total">RM ${subtotal.toFixed(2)}</span>
                     </div>
                     <button class="btn-purple checkout-btn" id="proceed-checkout-btn">
                         <i class="fas fa-lock"></i> Proceed to Checkout
                     </button>
                 </div>
             </div>`;


        // --- Event Listeners for dynamic cart items ---
        const itemsList = cartContainer.querySelector('.cart-items-list');
        if (itemsList) {
            itemsList.addEventListener('click', function(event) {
                const target = event.target;
                const productId = parseInt(target.dataset.id);

                if (isNaN(productId)) return; // Ignore clicks not on data-id elements

                if (target.classList.contains('btn-remove-item')) {
                    console.log(`Remove button clicked for ID: ${productId}`);
                    const cardToRemove = target.closest('.cart-item-card');
                    removeFromCart(productId, cardToRemove); // Pass element for animation
                } else if (target.classList.contains('increase-qty')) {
                     console.log(`Increase Qty clicked for ID: ${productId}`);
                     updateCartQuantity(productId, 1); // Increase by 1
                } else if (target.classList.contains('decrease-qty')) {
                     console.log(`Decrease Qty clicked for ID: ${productId}`);
                     updateCartQuantity(productId, -1); // Decrease by 1
                }
            });
        }

        // Add listener for checkout button
        const checkoutBtn = cartContainer.querySelector('#proceed-checkout-btn');
        if(checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                // Save cart one last time before checkout? (Optional, should be saved on updates)
                // saveCart();
                window.location.href = 'checkOut.php'; // Navigate to checkout page
            });
        }
    }
     // Add styles for the new cart layout if not already in style.css
    addCartPageStyles();
}


// Function to update quantity in cart
function updateCartQuantity(productId, change) { // change is +1 or -1
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const newQuantity = (cart[itemIndex].quantity || 1) + change;
        console.log(`Updating quantity for ${productId} from ${cart[itemIndex].quantity} to ${newQuantity}`);

        if (newQuantity <= 0) {
            // If quantity drops to 0 or less, remove the item
            console.log("Quantity is 0 or less, removing item.");
             // Find the card element to pass for animation
             const cardToRemove = document.querySelector(`.cart-item-card[data-id="${productId}"]`);
            removeFromCart(productId, cardToRemove);
        } else {
            // Otherwise, update the quantity
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            updateCartCount();
            // Re-render the cart to show updated quantity and totals
            displayCart();
        }
    } else {
         console.warn(`Item ${productId} not found in cart for quantity update.`);
    }
}


// Dynamically add CSS for cart page layout if needed
function addCartPageStyles() {
    const styleId = 'cart-page-dynamic-styles';
    if (document.getElementById(styleId)) return; // Style already added

    const css = `
        .cart-page-layout {
            display: flex;
            gap: 30px;
            align-items: flex-start; /* Align top */
        }
        .cart-items-list {
            flex: 2; /* Takes more space */
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .cart-summary-sidebar {
            flex: 1;
            background: var(--content-bg, #fff);
            padding: 25px;
            border-radius: 8px;
            border: 1px solid var(--border-color, #ddd);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            position: sticky; /* Make summary sticky */
            top: 80px; /* Adjust based on top-bar height */
        }
        .cart-summary-sidebar h3 {
            margin-top: 0;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color, #eee);
            font-size: 1.4em;
            font-weight: 600;
        }
        .cart-summary-sidebar .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 1em;
            color: var(--text-secondary, #555);
        }
         .cart-summary-sidebar .summary-row span:last-child {
            font-weight: 500;
            color: var(--text-color, #333);
         }
        .cart-summary-sidebar .summary-row.total {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid var(--border-color, #eee);
            font-size: 1.2em;
            font-weight: bold;
        }
        .cart-summary-sidebar .checkout-btn {
            width: 100%;
            margin-top: 25px;
            padding: 14px;
            font-size: 1.1em;
        }
        .cart-item-card {
            display: flex;
            align-items: center;
            padding: 15px;
            background: var(--content-bg, #fff);
            border: 1px solid var(--border-color, #ddd);
            border-radius: 8px;
            position: relative; /* For remove button */
        }
        .cart-item-image {
            width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px;
        }
        .cart-item-details { flex-grow: 1; }
        .cart-item-name { font-weight: 600; margin-bottom: 5px; font-size: 1.1em; }
        .cart-item-price { font-size: 1em; color: var(--primary-color); margin-bottom: 10px; font-weight: 500;}
        .cart-item-quantity-controls { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .quantity-btn { width: 28px; height: 28px; border: 1px solid #ccc; background: #f7f7f7; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2em; line-height: 1; }
        .quantity-btn:hover { background: #eee; }
        .quantity-value { min-width: 25px; text-align: center; font-weight: 500; }
         .cart-item-total { font-size: 0.95em; color: var(--text-secondary); font-weight: 500; }
        .btn-remove-item { position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #dc3545; font-size: 1.4em; cursor: pointer; padding: 5px; line-height: 1; }
        .btn-remove-item:hover { color: #a71d2a; }
         .cart-empty-message { text-align: center; padding: 40px; background: var(--content-bg); border-radius: 8px; border: 1px solid var(--border-color); }
         .cart-empty-message p { font-size: 1.2em; margin-top: 15px; margin-bottom: 20px; color: var(--text-secondary); }
         .cart-empty-message button { padding: 10px 20px; font-size: 1em; }

         /* Responsive Cart Layout */
         @media (max-width: 992px) {
             .cart-page-layout { flex-direction: column; }
             .cart-summary-sidebar { position: static; width: 100%; margin-top: 20px; }
         }
          @media (max-width: 576px) {
              .cart-item-card { flex-direction: column; align-items: flex-start; }
              .cart-item-image { width: 100%; height: 150px; margin-right: 0; margin-bottom: 10px; }
              .btn-remove-item { top: 5px; right: 5px; font-size: 1.2em; }
              .cart-item-details { width: 100%; }
          }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}


function updateCartCount() {
    console.log("--- updateCartCount called ---");
    // Ensure cart is an array before reducing
    const currentCart = Array.isArray(cart) ? cart : [];
    const count = currentCart.reduce((total, item) => total + (item.quantity || 0), 0);
    console.log("Calculated total cart quantity:", count);

    // Update ALL cart badges (top bar, maybe sidebar if it existed)
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.textContent = count;
        // Show badge only if count > 0
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
    console.log("--- updateCartCount finished ---");
}

function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    // Sanitize productName before inserting - simplistic textContent is safe here
    notification.textContent = `${productName} added to cart!`;
    document.body.appendChild(notification);

    // Force reflow before adding 'show' class for transition
    void notification.offsetWidth;

    notification.classList.add('show');

    // Remove notification after duration
    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, { once: true });
    }, 3000); // Notification visible for 3 seconds
}


// ==========================
// Save Functionality (Shared Logic)
// ==========================

function toggleSave(productId, buttonElement) {
    console.log(`Toggling save for product ID: ${productId}`);
    if (isNaN(productId)) {
         console.error("Invalid productId in toggleSave:", productId);
         return;
    }

    const index = savedItems.indexOf(productId);
    let isNowSaved; // Variable to hold the new state

    if (index === -1) {
        // Not saved, so save it
        savedItems.push(productId);
        isNowSaved = true;
        console.log(`Item ${productId} saved. New savedItems:`, JSON.stringify(savedItems));
        // Optional: Show feedback notification
        // showSaveNotification(getProductById(productId)?.name || `Product ${productId}`, true);
    } else {
        // Saved, so unsave it
        savedItems.splice(index, 1);
         isNowSaved = false;
        console.log(`Item ${productId} unsaved. New savedItems:`, JSON.stringify(savedItems));
         // Optional: Show feedback notification
         // showSaveNotification(getProductById(productId)?.name || `Product ${productId}`, false);

        // If we are currently *in* the Saved Items view on Main.php, remove the card visually
        const currentCategoryTitle = document.getElementById('current-category')?.textContent;
        if (document.getElementById('product-container') && (currentCategoryTitle === 'Saved Items' || currentCategoryTitle === 'Saves')) {
             if (buttonElement) {
                 const productCard = buttonElement.closest('.product-card');
                 if (productCard) {
                     console.log("Removing product card from Saved Items view.");
                      // Animate removal before actually removing
                      explodeEffect(productCard).then(() => {
                          // Check if saves list is now empty AFTER removing
                          if(savedItems.length === 0) {
                              const container = document.getElementById('product-container');
                              if(container) container.innerHTML = '<p>No saved items yet.</p>';
                          }
                      });
                 }
             }
        }
    }

    saveSavedItems(); // Persist changes to localStorage

    // Update the button's appearance (if buttonElement was provided)
    if (buttonElement) {
        updateSaveButtonState(buttonElement, isNowSaved);
    } else {
         // If called without a button (e.g., programmatically), we might need
         // to find the button on the page if it exists and update it.
         // This is relevant for the product detail page where the button is static.
         const buttonOnPage = document.querySelector(`.btn-save[data-id="${productId}"]`);
         if(buttonOnPage) {
             updateSaveButtonState(buttonOnPage, isNowSaved);
         }
    }

    updateSaveCount(); // Update the badge count
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
     const count = savedItems.length;
     console.log("Updating save count:", count);
    // Update ALL save badges
    document.querySelectorAll('.save-badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
}

// Display saved products (typically on Main.php when 'Saves' is selected)
function displaySavedProducts() {
    const container = document.getElementById('product-container');
    const categoryTitle = document.getElementById('current-category');

    if(categoryTitle) categoryTitle.textContent = 'Saved Items';
    if (!container) {
         console.error("Main product container not found for displaying saved items!");
         return;
    }

    console.log("--- Displaying Saved Products --- Current saved items:", JSON.stringify(savedItems));

    const allProducts = getAllMockProducts(); // Get all available product details
    // Filter all products to get only the ones whose IDs are in the savedItems array
    const savedProductsDetails = allProducts.filter(product =>
        savedItems.includes(product.id)
    );

    // Use the common displayProducts function
    displayProducts(savedProductsDetails); // It handles the empty case message correctly now
}

// Helper to update button visual state
function updateSaveButtonState(button, isSaved) {
    if (!button) return;

    const iconClass = isSaved ? 'fas fa-heart' : 'far fa-heart'; // Solid vs outline
    const text = isSaved ? ' Saved' : ' Save';
    const ariaLabel = isSaved ? 'Unsave' : 'Save'; // Correct Aria label
     const productName = getProductById(parseInt(button.dataset.id))?.name || 'this item';

    button.innerHTML = `<i class="${iconClass}"></i>${text}`;
    button.classList.toggle('saved', isSaved);
    button.setAttribute('aria-label', `${ariaLabel} ${productName}`); // Update accessibility label

    // console.log(`Updated button state for ID ${button.dataset.id}: isSaved=${isSaved}`);
}


// ==========================
// Product Detail Page Initialization
// ==========================
function initProductDetailPage() {
    console.log("Running initProductDetailPage...");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId || isNaN(productId)) {
        console.error('No valid product ID found in URL');
        const container = document.querySelector('.main-content');
        if (container) container.innerHTML = '<h2>Error</h2><p>Product not found. Please go back and try again.</p>';
        return;
    }
    console.log(`Product ID from URL: ${productId}`);

    // Data (cart, savedItems) is already loaded globally

    const product = getProductById(productId);
    if (!product) {
        console.error('Product data not found for ID:', productId);
         const container = document.querySelector('.main-content');
        if (container) container.innerHTML = '<h2>Error</h2><p>Product details could not be loaded. Please go back and try again.</p>';
        return;
    }
    console.log("Product data found:", product);

    // --- Update UI Elements ---
    const nameEl = document.getElementById('detail-product-name');
    const priceEl = document.getElementById('detail-product-price');
    const imageEl = document.getElementById('detail-product-image');
    const descriptionEl = document.getElementById('detail-product-description');
    const saveButton = document.getElementById('save-product-btn');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const writeReviewBtn = document.getElementById('write-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const reviewForm = document.getElementById('review-form');


    if (nameEl) nameEl.textContent = product.name;
    if (priceEl) priceEl.textContent = `RM ${product.price.toFixed(2)}`;
    if (imageEl) {
         const imageName = product.name.replace(/ /g, '_');
        imageEl.src = `src/${imageName}.jpg`; // *** ADJUST PATH AS NEEDED ***
        imageEl.alt = product.name;
        imageEl.onerror = function() {
            this.onerror = null;
            this.src = 'images/placeholder.jpg';
            console.warn(`Image not found for ${product.name}, using placeholder.`);
        };
    }
     if (descriptionEl) {
         // Use textContent for safety unless HTML is intended in description
         descriptionEl.textContent = product.description || "No description available.";
         // If description CAN contain HTML (like line breaks):
         // descriptionEl.innerHTML = product.description ? product.description.replace(/\n/g, '<br>') : "No description available.";
     }


    // --- Initialize Save Button ---
    if (saveButton) {
        console.log("Initializing detail page save button...");
        saveButton.dataset.id = productId; // Set the data-id
        let isSaved = savedItems.includes(productId);
        console.log(`Initial saved state for product ${productId}: ${isSaved}`);
        updateSaveButtonState(saveButton, isSaved); // Update visual state

        // Add listener - calls the shared toggleSave function
        saveButton.addEventListener('click', function() {
            console.log(`Detail page Save button clicked for ID: ${productId}`);
            toggleSave(productId, this); // 'this' refers to the button element
        });
    } else {
        console.warn("Save button (#save-product-btn) not found on detail page.");
    }

    // --- Initialize Add to Cart Button ---
    if (addToCartBtn) {
        console.log("Initializing detail page add-to-cart button...");
        addToCartBtn.addEventListener('click', function() {
            console.log(`Detail page Add to cart clicked for ID: ${productId}`);
            addToCartLogic(product); // Use shared logic function
            // Trigger animation using the main product image
            const productImage = document.getElementById('detail-product-image');
            if (productImage) {
                 animateFlyToCart(productImage);
             }
            showCartNotification(product.name); // Show feedback
        });
    } else {
         console.warn("Add to cart button (#add-to-cart-btn) not found on detail page.");
    }

    // --- Initialize Review Button & Modal ---
    if (writeReviewBtn && reviewModal) {
        console.log("Initializing write review button...");
        writeReviewBtn.addEventListener('click', function() {
            showModal(reviewModal); // Use modal helper
        });
    }

    if (reviewForm && reviewModal) {
        console.log("Initializing review form...");
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Review form submitted.");

            // Determine reviewer name (handle guest vs logged in - simplistic version)
             const nameInput = document.getElementById('review-name'); // Check if name input exists
             let reviewerName = 'Anonymous'; // Default
             if (nameInput && nameInput.value.trim()) {
                 reviewerName = nameInput.value.trim();
             } else {
                // Potentially check for a logged-in user session variable here if applicable
                // e.g., if (loggedInUsername) reviewerName = loggedInUsername;
             }

            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;

             if (!rating || !comment || !reviewerName) {
                 alert("Please fill in all review fields (including name if required).");
                 return;
             }

            // Create review HTML (using helper to escape potentially harmful text)
            const reviewHTML = `
                <div class="review-item">
                    <div class="review-author">${escapeHTML(reviewerName)}</div>
                    <div class="review-rating">${'★'.repeat(parseInt(rating))}${'☆'.repeat(5 - parseInt(rating))}</div>
                    <div class="review-date">${new Date().toLocaleDateString()}</div>
                    <div class="review-content">${escapeHTML(comment)}</div>
                </div>
            `;

            const reviewsContainer = document.getElementById('detail-product-reviews');
            if (reviewsContainer) {
                 const noReviewsMsg = reviewsContainer.querySelector('p, span'); // Find placeholder text more reliably
                if (reviewsContainer.textContent.trim().toLowerCase() === 'no reviews at the moment' || (noReviewsMsg && noReviewsMsg.textContent.toLowerCase().includes('no reviews'))) {
                     reviewsContainer.innerHTML = reviewHTML; // Replace placeholder
                 } else {
                     reviewsContainer.insertAdjacentHTML('afterbegin', reviewHTML); // Add to top
                 }
            }

            hideModal(reviewModal);
            this.reset();
            alert('Thank you for your review!');
        });
    }

    console.log("initProductDetailPage finished.");
}


// ==========================
// HELPER FUNCTIONS
// ==========================

// Get Product Data by ID (from Mock Data)
function getProductById(id) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) return null;
    const allProducts = getAllMockProducts();
    return allProducts.find(product => product.id === numericId);
}

// HTML Escaping for Review Content
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Animation: Fly item to cart
function animateFlyToCart(sourceElement) {
    console.log("Triggering fly-to-cart animation...");
    const cartTarget = document.querySelector('.action-link[data-category="cart"] i'); // Target top-bar icon

    if (!sourceElement || !cartTarget) {
        console.warn("Cannot perform fly-to-cart: source or target element missing.", sourceElement, cartTarget);
        return;
    }

    const imgClone = sourceElement.cloneNode(true);
    const imgRect = sourceElement.getBoundingClientRect();
    const cartRect = cartTarget.getBoundingClientRect();

    // Apply styles for cloning and positioning
    imgClone.style.position = 'fixed';
    imgClone.style.top = `${imgRect.top}px`;
    imgClone.style.left = `${imgRect.left}px`;
    imgClone.style.width = `${imgRect.width}px`;
    imgClone.style.height = `${imgRect.height}px`;
    imgClone.style.maxWidth = `${imgRect.width}px`;
    imgClone.style.maxHeight = `${imgRect.height}px`;
    imgClone.style.objectFit = sourceElement.style.objectFit || 'contain';
    imgClone.style.margin = '0';
    imgClone.style.padding = '0';
    imgClone.style.border = 'none';
    imgClone.style.borderRadius = '5px';
    imgClone.style.opacity = '0.9';
    imgClone.style.zIndex = '1001';
    imgClone.style.pointerEvents = 'none';
    imgClone.style.transition = 'all 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045)'; // Ease-in curve

    document.body.appendChild(imgClone);

    requestAnimationFrame(() => {
         const finalScale = 0.1;
        const targetX = cartRect.left + (cartRect.width / 2) - (imgRect.width / 2 * finalScale);
        const targetY = cartRect.top + (cartRect.height / 2) - (imgRect.height / 2 * finalScale);

        imgClone.style.left = `${targetX}px`;
        imgClone.style.top = `${targetY}px`;
        imgClone.style.transform = `scale(${finalScale})`;
        imgClone.style.opacity = '0';
    });

    imgClone.addEventListener('transitionend', () => {
        if (imgClone.parentNode) {
             console.log("Fly animation clone removed.");
             imgClone.remove();
        }
    }, { once: true });
}

// Animation: Explode effect for removal
function explodeEffect(element) {
    return new Promise((resolve) => {
        if (!element) return resolve(); // Resolve immediately if no element

        const rect = element.getBoundingClientRect();
        const particleCount = 15;
        const particles = [];
        const container = document.body; // Or a closer positioned ancestor

        // Hide original element
        element.style.transition = 'opacity 0.1s ease-out, transform 0.1s ease-out';
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)'; // Slight shrink before disappearing
        element.style.pointerEvents = 'none';


        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            // Add particle class for styling from style.css
            particle.classList.add('particle'); // Ensure .particle is styled in CSS

            // Position particle absolutely relative to the viewport
            particle.style.position = 'fixed'; // Use fixed positioning
             particle.style.width = `${Math.random() * 5 + 3}px`; // Random size
             particle.style.height = particle.style.width;
             particle.style.borderRadius = '50%';
             // Start particles from within the element's bounds
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
             particle.style.opacity = '1';
            // Assign a random purple/pinkish color (adjust HSL values as needed)
            particle.style.backgroundColor = `hsl(${Math.random() * 40 + 280}, 70%, 60%)`;
            particle.style.zIndex = '1002'; // Above cloned image
            particle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';


            container.appendChild(particle);
            particles.push(particle);

            // Calculate random trajectory
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50; // 50-150px away
            const rotation = Math.random() * 720 - 360;

            const translateX = Math.cos(angle) * distance;
            const translateY = Math.sin(angle) * distance;

             // Apply final animation state after a tiny delay to ensure transition triggers
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { // Double requestAnimationFrame for safety
                    particle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(0.3)`;
                    particle.style.opacity = '0';
                });
            });
        }

        // Clean up particles and resolve promise
        setTimeout(() => {
            particles.forEach(p => {
                if (p.parentNode) p.remove();
            });
             // Remove the original element from DOM after animation+delay
             if(element.parentNode) element.remove();
            resolve();
        }, 600 + 50); // Match CSS transition duration + small buffer
    });
}


// ==========================
// Top Bar Action Buttons (Navigation Handling)
// ==========================
function initActionButtons() {
    const savesLink = document.querySelector('.action-link[data-category="saves"]');
    const cartLink = document.querySelector('.action-link[data-category="cart"]');

    // Function to handle navigation to Main.php and setting a flag
    const navigateToMainAndShow = (flagName) => {
        // If already on Main.php, just display the section
         if (document.getElementById('product-container')) { // Check if on Main.php
             if (flagName === 'showCart') {
                 displayCart();
                 const categoryTitle = document.getElementById('current-category');
                 if (categoryTitle) categoryTitle.textContent = 'Your Cart';
                 document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
             } else if (flagName === 'showSaves') {
                 displaySavedProducts();
                  const categoryTitle = document.getElementById('current-category');
                 if (categoryTitle) categoryTitle.textContent = 'Saved Items';
                  document.querySelectorAll('.sidebar-menu a').forEach(item => item.classList.remove('active'));
             }
         } else {
             // If on another page, set flag and redirect
             console.log(`Navigating to Main.php and setting flag: ${flagName}`);
             localStorage.setItem(flagName, 'true');
             window.location.href = 'Main.php';
         }
    };

    if (savesLink) {
        savesLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Top bar Saves link clicked");
            navigateToMainAndShow('showSaves');
        });
    }

    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Top bar Cart link clicked");
            navigateToMainAndShow('showCart');
        });
    }
}

// ==========================
// CSS (Add particle style if not in style.css)
// ==========================
function addParticleStyle() {
    const styleId = 'particle-dynamic-styles';
    if (document.getElementById(styleId)) return;
    const css = `.particle { position: fixed; pointer-events: none; border-radius: 50%; }`; // Base style
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
}
addParticleStyle(); // Ensure particle style exists