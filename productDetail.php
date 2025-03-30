<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Detail - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* =======================
           COLOR VARIABLES & DARK MODE (from style.css)
           ======================= */
        :root {
            --primary-color: #6f42c1;
            --primary-hover-color: #5a32a3;
            --light-bg: #f8f9fa;
            --light-content-bg: #ffffff;
            --light-text-color: #333;
            --light-text-secondary: #666;
            --light-border-color: #ddd;
            --light-shadow-color: rgba(0, 0, 0, 0.1);

            --dark-bg: #1a1a2e;
            --dark-content-bg: #2a2a4e;
            --dark-text-color: #e0e0ff;
            --dark-text-secondary: #a0a0cc;
            --dark-border-color: #4a4a6e;
            --dark-shadow-color: rgba(0, 0, 0, 0.3);

            --bg-color: var(--light-bg);
            --content-bg: var(--light-content-bg);
            --text-color: var(--light-text-color);
            --text-secondary: var(--light-text-secondary);
            --border-color: var(--light-border-color);
            --shadow-color: var(--light-shadow-color);
            --sidebar-bg: var(--light-content-bg);
            --card-bg: var(--light-content-bg);
            --input-bg: var(--light-content-bg);
            --input-border: var(--light-border-color);
            --button-secondary-bg: #e9ecef;
            --button-secondary-hover-bg: #dde2e6;
            --button-secondary-text: #333;
            --notification-bg: var(--primary-color);
            --notification-text: white;
        }

        body.dark-mode {
            --bg-color: var(--dark-bg);
            --content-bg: var(--dark-content-bg);
            --text-color: var(--dark-text-color);
            --text-secondary: var(--dark-text-secondary);
            --border-color: var(--dark-border-color);
            --shadow-color: var(--dark-shadow-color);
            --sidebar-bg: var(--dark-content-bg);
            --card-bg: var(--dark-content-bg);
            --input-bg: var(--dark-content-bg);
            --input-border: var(--dark-border-color);
            --button-secondary-bg: #4a4a6e;
            --button-secondary-hover-bg: #5a5a8e;
            --button-secondary-text: var(--dark-text-color);
            --notification-bg: var(--primary-hover-color);
            --notification-text: var(--dark-text-color);
        }

        /* =======================
           GENERAL STYLES (from style.css)
           ======================= */
        body {
            font-family: 'Arial', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 0;
            transition: background-color 0.3s, color 0.3s;
        }

        /* =======================
           PRODUCT DETAIL PAGE STYLES
           ======================= */
        .product-detail-container {
            display: flex;
            gap: 40px;
            margin-top: 20px;
        }

        .product-detail-image {
            flex: 1;
            background-color: rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            border-radius: 10px;
            max-height: 500px;
        }

        body.dark-mode .product-detail-image {
            background-color: rgba(255,255,255,0.05);
        }

        .product-detail-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .product-detail-info {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        #detail-product-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            color: var(--text-color);
        }

        .product-detail-price {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 25px;
        }

        .product-detail-description {
            margin-bottom: 30px;
            color: var(--text-color);
            line-height: 1.6;
            white-space: pre-line;
        }

        .product-detail-actions {
            display: flex;
            gap: 15px;
            margin-bottom: 40px;
        }

        .product-detail-actions .btn-purple {
            flex: 2;
            padding: 12px;
            font-size: 16px;
        }

        .product-detail-actions .btn-save {
            flex: 1;
            padding: 12px;
            font-size: 16px;
        }

        .product-detail-reviews {
            border-top: 1px solid var(--border-color);
            padding-top: 20px;
        }

        .product-detail-reviews h3 {
            margin-bottom: 10px;
            color: var(--text-color);
        }

        #detail-product-reviews {
            color: var(--text-secondary);
            font-style: italic;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .product-detail-container {
                flex-direction: column;
            }
            
            .product-detail-image {
                margin-bottom: 20px;
                max-height: 300px;
            }
        }

        /* =======================
           BUTTON STYLES (from style.css)
           ======================= */
        .btn-purple {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .btn-purple:hover {
            background-color: var(--primary-hover-color);
        }

        .btn-save {
            background-color: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-save:hover {
            background-color: rgba(111, 66, 193, 0.1);
        }

        body.dark-mode .btn-save:hover {
            background-color: rgba(111, 66, 193, 0.2);
        }

        .btn-save.saved {
            background-color: var(--primary-color);
            color: white;
        }

        .btn-save.saved:hover {
            background-color: var(--primary-hover-color);
        }
    </style>
</head>
<body>
    <!-- [Rest of your HTML from previous product-detail.php] -->
    <div class="sidebar">
        <!-- Your sidebar content -->
    </div>

    <div class="main-content">
        <!-- Your main content with product detail -->
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Global state variables
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

        document.addEventListener('DOMContentLoaded', function() {
            // Initialize dark mode toggle
            initDarkModeToggle();
            
            // Get product ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            
            if (productId) {
                loadProductDetail(productId);
            } else {
                window.location.href = 'Main.php';
            }
            
            // Initialize other functionality
            initSearch();
            initAccountDropdown();
            updateCartCount();
            updateSaveCount();
            
            // Add to cart button
            document.querySelector('.add-to-cart-detail').addEventListener('click', function() {
                animateAddToCart(this, productId);
            });
            
            // Save button
            document.getElementById('save-detail-btn').addEventListener('click', function() {
                toggleSave(productId, this);
            });
        });

        function initDarkModeToggle() {
            const toggleButton = document.getElementById('dark-mode-toggle');
            const body = document.body;
            const icon = toggleButton?.querySelector('i');

            if (!toggleButton || !icon) return;

            const applyMode = (isDark) => {
                if (isDark) {
                    body.classList.add('dark-mode');
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    body.classList.remove('dark-mode');
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                    localStorage.setItem('darkMode', 'disabled');
                }
            };

            const prefersDark = localStorage.getItem('darkMode') === 'enabled';
            applyMode(prefersDark);

            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                const isCurrentlyDark = body.classList.contains('dark-mode');
                applyMode(!isCurrentlyDark);
            });
        }

        function loadProductDetail(productId) {
            const product = getAllMockProducts().find(p => p.id === productId);
            
            if (!product) {
                window.location.href = 'Main.php';
                return;
            }
            
            // Update page content
            document.getElementById('detail-product-name').textContent = product.name;
            document.getElementById('detail-product-price').textContent = `RM ${product.price.toFixed(2)}`;
            document.title = `${product.name} - HAMSA BEADS`;
            
            // Set image
            const imageSrc = `src/${product.name.replace(/ /g, '_')}.jpg`;
            const imgElement = document.getElementById('detail-product-image');
            imgElement.src = imageSrc;
            imgElement.alt = product.name;
            imgElement.onerror = function() {
                this.onerror = null;
                this.src = 'images/placeholder.jpg';
            };
            
            // Set description
            const description = product.description || "This product description is coming soon.";
            document.getElementById('detail-product-description').textContent = description;
            
            // Update save button state
            const saveButton = document.getElementById('save-detail-btn');
            const isSaved = savedItems.includes(productId);
            
            if (isSaved) {
                saveButton.innerHTML = '<i class="fas fa-heart"></i> <span>Saved</span>';
                saveButton.classList.add('saved');
            } else {
                saveButton.innerHTML = '<i class="far fa-heart"></i> <span>Save</span>';
                saveButton.classList.remove('saved');
            }
        }

        function getAllMockProducts() {
            return [
                { 
                    id: 1, 
                    name: 'Healing Soul', 
                    price: 110,
                    description: 'This Bracelet was curated with clear Quartz, the master healer crystal. Full benefit details in highlight labelled benefits.\n\nClear Quartz: 8mm\n\n1¾k gold plated charms with Zircon. (Moon, Ribbon and Filiqree Heart)'
                },
                // Add all other products
                { id: 2, name: 'Calm Butterfly', price: 160, description: '...' },
                // ...
            ];
        }

        function animateAddToCart(button, productId) {
            // Your existing animateAddToCart implementation
            // Make sure to use the passed productId parameter
            console.log(`Adding product ${productId} to cart`);
            
            const productData = getAllMockProducts().find(p => p.id === productId);
            if (!productData) return;

            const existingItemIndex = cart.findIndex(item => item.id === productId);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity++;
            } else {
                cart.push({ ...productData, quantity: 1 });
            }

            saveCart();
            updateCartCount();
            showCartNotification(productData.name);
        }

        function toggleSave(productId, buttonElement) {
            const index = savedItems.indexOf(productId);
            if (index === -1) {
                savedItems.push(productId);
                buttonElement.innerHTML = '<i class="fas fa-heart"></i> <span>Saved</span>';
                buttonElement.classList.add('saved');
            } else {
                savedItems.splice(index, 1);
                buttonElement.innerHTML = '<i class="far fa-heart"></i> <span>Save</span>';
                buttonElement.classList.remove('saved');
            }
            saveSavedItems();
            updateSaveCount();
        }

        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function saveSavedItems() {
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
        }

        function updateCartCount() {
            const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.textContent = count;
                cartBadge.style.display = count > 0 ? 'inline-flex' : 'none';
            }
        }

        function updateSaveCount() {
            const saveBadge = document.querySelector('.save-badge');
            if (saveBadge) {
                saveBadge.textContent = savedItems.length;
                saveBadge.style.display = savedItems.length > 0 ? 'inline-flex' : 'none';
            }
        }

        function showCartNotification(productName) {
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = `${productName} added to cart!`;
            document.body.appendChild(notification);

            requestAnimationFrame(() => {
                setTimeout(() => { notification.classList.add('show'); }, 10);
            });

            setTimeout(() => {
                notification.classList.remove('show');
                notification.addEventListener('transitionend', () => {
                    notification.remove();
                }, { once: true });
            }, 3000);
        }

        // Include other necessary functions (initSearch, initAccountDropdown, etc.)
    </script>
</body>
</html>
