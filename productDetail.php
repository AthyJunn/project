<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Details - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <!-- Reuse the same sidebar from Main.php -->
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
            </div>
        </ul>
    </div>

    <div class="main-content">
        <div class="top-bar">
            <div class="search-container">
                <input type="text" placeholder="Search products..." id="search-input">
                <button id="search-button"><i class="fas fa-search"></i></button>
            </div>
            <div class="user-actions">
                <a href="#" class="action-link" data-category="saves">
                    <i class="far fa-heart"></i>
                    <span class="save-badge">0</span>
                </a>
                <a href="#" class="action-link" data-category="cart">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-badge">0</span>
                </a>
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
        </div>

        <!-- Back Button -->
        <button class="back-button" onclick="window.location.href='Main.php'">
            <i class="fas fa-arrow-left"></i>
            Back to Shop
        </button>

        <!-- Product Detail Section -->
        <div class="product-detail-container">
            <div class="product-detail-image">
                <img src="src/Healing_Soul.jpg" alt="Healing Soul" id="detail-product-image">
            </div>
            <div class="product-detail-info">
                <h1 id="detail-product-name">Healing Soul</h1>
                <div class="product-detail-price" id="detail-product-price">RM 140</div>
                <div class="product-detail-description" id="detail-product-description">
                    This Bracelet was curated with clear Quartz, the master healer crystal. Full benefit details in highlight labelled benefits.
                    <br><br>
                    Clear Quartz : 8mm
                    <br><br>
                    1¾k gold plated charms with Zircon. (Moon, Ribbon and Filiqree Heart)
                </div>
                <div class="product-detail-actions">
                    <button class="btn-purple" id="add-to-cart-btn">Add to Cart</button>
                    <button class="btn-save" id="save-product-btn" data-id="1">
                        <i class="far fa-heart"></i>
                        Save
                    </button>
                </div>
                
                <!-- Reviews Section -->
                <div class="product-detail-reviews">
                    <h3>Reviews</h3>
                    <div id="detail-product-reviews">
                        No reviews at the moment
                    </div>
                    <button class="btn-purple" id="write-review-btn" style="margin-top: 15px;">Write a Review</button>
                </div>
            </div>
        </div>
    </div>

   <!-- Review Modal -->
<div class="modal-overlay" id="review-modal">
    <div class="modal-content">
        <button class="close-modal">&times;</button>
        <h2>Write a Review</h2>
        <form id="review-form">
            <?php if(!isset($_SESSION['username'])): ?>
            <div class="form-group">
                <label for="review-name">Your Name</label>
                <input type="text" id="review-name" required>
            </div>
            <?php endif; ?>
            <div class="form-group">
                <label for="review-rating">Rating</label>
                <select id="review-rating" required>
                    <option value="">Select rating</option>
                    <option value="5">★★★★★ (5 stars)</option>
                    <option value="4">★★★★☆ (4 stars)</option>
                    <option value="3">★★★☆☆ (3 stars)</option>
                    <option value="2">★★☆☆☆ (2 stars)</option>
                    <option value="1">★☆☆☆☆ (1 star)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="review-comment">Your Review</label>
                <textarea id="review-comment" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-purple">Submit Review</button>
        </form>
    </div>
</div>

    <!-- Reuse the same modals from Main.php -->
    <div class="modal-overlay" id="login-modal">
        <!-- ... same as Main.php ... -->
    </div>

    <div class="modal-overlay" id="register-modal">
        <!-- ... same as Main.php ... -->
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
    
    <!-- Add this to your style.css -->
    <style>
        /* Additional styles for product detail page */
        .product-detail-image img {
            max-width: 100%;
            max-height: 400px;
            object-fit: contain;
        }
        
        #review-form select, #review-form textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            margin-top: 5px;
            background-color: var(--input-bg);
            color: var(--text-color);
        }
        
        #review-form textarea {
            min-height: 100px;
        }
        
        .review-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .review-author {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .review-rating {
            color: #FFD700;
            margin-bottom: 5px;
        }
        
        .review-date {
            color: var(--text-secondary);
            font-size: 0.8em;
            margin-bottom: 5px;
        }
        
        .review-content {
            margin-top: 10px;
        }
    </style>
    
    <script>
        // This should be added to your script.js file
        
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize the page with product details from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            
            // Load product details based on ID (using mock data for this example)
            const product = getProductById(productId);
            if (product) {
                document.getElementById('detail-product-name').textContent = product.name;
                document.getElementById('detail-product-price').textContent = `RM ${product.price}`;
                document.getElementById('detail-product-image').src = `src/${product.name.replace(/ /g, '_')}.jpg`;
                document.getElementById('detail-product-image').alt = product.name;
                document.getElementById('save-product-btn').dataset.id = product.id;
                
                // Check if product is saved
                const isSaved = savedItems.includes(parseInt(product.id));
                if (isSaved) {
                    const saveBtn = document.getElementById('save-product-btn');
                    saveBtn.innerHTML = '<i class="fas fa-heart"></i> Unsave';
                    saveBtn.classList.add('saved');
                }

                // Check if product is in cart
                const isInCart = cart.some(item => item.id === parseInt(product.id));
                if (isInCart) {
                    const addToCartBtn = document.getElementById('add-to-cart-btn');
                    addToCartBtn.textContent = 'Added to Cart';
                    addToCartBtn.disabled = true;
                    addToCartBtn.style.backgroundColor = '#28a745';
                    addToCartBtn.style.cursor = 'default';
                }
            }
            
            // Add to cart button
            document.getElementById('add-to-cart-btn').addEventListener('click', function() {
                if (product) {
                    // Create a mock button element for the animation
                    const mockButton = document.createElement('button');
                    mockButton.classList.add('add-to-cart');
                    document.body.appendChild(mockButton);
                    
                    // Update the actual button state
                    this.textContent = 'Added to Cart';
                    this.disabled = true;
                    this.style.backgroundColor = '#28a745';
                    this.style.cursor = 'default';
                    
                    animateAddToCart(mockButton);
                    setTimeout(() => {
                        mockButton.remove();
                    }, 1000);
                    
                    showCartNotification(product.name);
                }
            });
            
            // Save product button
            document.getElementById('save-product-btn').addEventListener('click', function() {
                const button = this;
                const productId = parseInt(button.dataset.id);
                if (!isNaN(productId)) {
                    toggleSave(productId, button);
                }
            });
            
            // Write review button
            document.getElementById('write-review-btn').addEventListener('click', function() {
                document.getElementById('review-modal').classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            // Review form submission
            document.getElementById('review-form').addEventListener('submit', function(e) {
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
                document.getElementById('review-modal').classList.remove('active');
                document.body.style.overflow = '';
                this.reset();
                
                // Show success message
                alert('Thank you for your review!');
            });
        });
        
        // Helper function to get product by ID (should be in script.js)
        function getProductById(id) {
            const allProducts = getAllMockProducts();
            return allProducts.find(product => product.id === parseInt(id));
        }
        
    </script>
</body>
</html>