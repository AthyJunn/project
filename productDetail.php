<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Detail - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <!-- Reuse your sidebar from Main.php -->
    <div class="sidebar">
        <div class="logo">HAMSA BEADS</div>
        <div class="BEADS-name">HAMSA BEADS</div>
        <br>
        <ul class="sidebar-menu">
            <li><a href="Main.php" data-category="recommendation">Recommendation</a></li>
            <li><a href="Main.php" data-category="butterfly">Butterfly Series</a></li>
            <li><a href="Main.php" data-category="moonstone">Moonstone Series</a></li>
            <li><a href="Main.php" data-category="malachite">Mystical Malachite Series</a></li>
            <li><a href="Main.php" data-category="luxe">LUXE Series</a></li>

            <div class="sidebar-bottom">
                <li><a href="Main.php" data-category="saves">
                    <i class="far fa-heart"></i>
                    <span>Saves</span>
                    <span class="save-badge">0</span>
                </a></li>
                <li><a href="Main.php" data-category="cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Cart</span>
                    <span class="cart-badge">0</span>
                </a></li>
                <li>
                    <a href="#" id="dark-mode-toggle" title="Toggle Dark Mode">
                        <i class="fas fa-moon"></i>
                        <span>Toggle Mode</span>
                    </a>
                </li>
            </div>
        </ul>
    </div>

    <div class="main-content">
        <div class="top-bar">
            <div class="search-container">
                <input type="text" placeholder="Search products..." id="search-input">
                <button id="search-button"><i class="fas fa-search"></i></button>
            </div>
            <div class="account-menu">
                <button id="account-button"><i class="fas fa-user-circle"></i></button>
                <div class="account-dropdown" id="account-dropdown">
                    <div class="dropdown-header">
                        <div class="currently-in">Currently in</div>
                        <div class="user-info">
                            <img src="images/guest-avatar.png" alt="Guest" class="user-avatar">
                            <span class="user-status">Guest</span>
                        </div>
                    </div>
                    <button class="add-account" id="add-account-btn">Add Account</button>
                    <button class="logout" id="logout-btn">Log out</button>
                </div>
            </div>
        </div>
        
        <!-- Product Detail Content -->
        <div class="product-detail-container">
            <div class="product-detail-image">
                <img id="detail-product-image" src="" alt="">
            </div>
            <div class="product-detail-info">
                <h1 id="detail-product-name">Product Name</h1>
                <div class="product-detail-price" id="detail-product-price">RM 0.00</div>
                <div class="product-detail-description" id="detail-product-description">
                    Product description goes here.
                </div>
                <div class="product-detail-actions">
                    <button class="btn-purple add-to-cart-detail">Add to Cart</button>
                    <button class="btn-save" id="save-detail-btn">
                        <i class="far fa-heart"></i> <span>Save</span>
                    </button>
                </div>
                <div class="product-detail-reviews">
                    <h3>Reviews</h3>
                    <p id="detail-product-reviews">No reviews at the moment</p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
    <script>
        // Product Detail Page Specific JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Get product ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            
            if (productId) {
                loadProductDetail(productId);
            } else {
                // Redirect if no product ID
                window.location.href = 'Main.php';
            }
            
            // Initialize other common functionality
            initDarkModeToggle();
            initSearch();
            initAccountDropdown();
            updateCartCount();
            updateSaveCount();
            
            // Add to cart button in detail page
            document.querySelector('.add-to-cart-detail').addEventListener('click', function() {
                animateAddToCart(this);
            });
            
            // Save button in detail page
            document.getElementById('save-detail-btn').addEventListener('click', function() {
                toggleSave(productId, this);
            });
        });
        
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
            const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
            const isSaved = savedItems.includes(productId);
            
            if (isSaved) {
                saveButton.innerHTML = '<i class="fas fa-heart"></i> <span>Saved</span>';
                saveButton.classList.add('saved');
            } else {
                saveButton.innerHTML = '<i class="far fa-heart"></i> <span>Save</span>';
                saveButton.classList.remove('saved');
            }
        }
        
        // Make sure to include getAllMockProducts() from script.js here
        function getAllMockProducts() {
            return [
                { 
                    id: 1, 
                    name: 'Healing Soul', 
                    price: 110,
                    description: 'This Bracelet was curated with clear Quartz, the master healer crystal. Full benefit details in highlight labelled benefits.\n\nClear Quartz: 8mm\n\n1¾k gold plated charms with Zircon. (Moon, Ribbon and Filiqree Heart)'
                },
                // Add all other products with their descriptions
                // ...
            ];
        }
    </script>
</body>
</html>
