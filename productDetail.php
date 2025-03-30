<?php
// Start session if needed for login status (example)
// session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Details - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
    <!-- Add this to your style.css or here -->
    <style>
        /* Ensure product detail specific styles are present */
        .product-detail-container {
            display: flex;
            gap: 30px; /* Adjusted gap */
            margin-top: 20px;
            padding: 20px;
            background-color: var(--content-bg);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .product-detail-image {
            flex: 1;
            max-width: 450px; /* Adjusted max-width */
            height: auto; /* Allow height to adjust */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px; /* Reduced padding */
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }
        .product-detail-image img {
            max-width: 100%;
            max-height: 450px; /* Max height for the image */
            height: auto;
            object-fit: contain; /* Use contain to show full image */
        }
        .product-detail-info {
            flex: 1.5; /* Give more space to info */
            display: flex;
            flex-direction: column;
        }
        #detail-product-name {
            font-size: 2rem; /* Larger name */
            font-weight: 600;
            margin-bottom: 10px;
        }
        .product-detail-price {
            font-size: 1.8rem; /* Larger price */
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 20px;
        }
        .product-detail-description {
            margin-bottom: 25px;
            line-height: 1.7; /* Increased line height */
            color: var(--text-secondary);
            white-space: pre-line; /* Respect line breaks from JS */
        }
        .product-detail-actions {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
        }
        .product-detail-actions .btn-purple,
        .product-detail-actions .btn-save {
            flex: 1;
            padding: 12px 20px;
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
        }
         .product-detail-actions .btn-save i {
            margin-right: 8px;
        }

        .product-detail-reviews {
            border-top: 1px solid var(--border-color);
            padding-top: 25px;
            margin-top: 20px;
        }
        .product-detail-reviews h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            font-weight: 600;
        }
        #detail-product-reviews {
            margin-bottom: 20px;
        }
        .review-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px dashed var(--border-color); /* Dashed border */
        }
        .review-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .review-author {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .review-rating {
            color: #FFD700; /* Gold color for stars */
            margin-bottom: 5px;
            font-size: 1.1em;
        }
        .review-date {
            color: var(--text-secondary);
            font-size: 0.85em;
            margin-bottom: 8px;
        }
        .review-content {
            line-height: 1.5;
        }
        #write-review-btn {
            display: inline-block; /* Align properly */
            margin-top: 10px; /* Adjusted margin */
        }

        /* Review Modal Styles */
        #review-modal .modal-content {
             max-width: 500px; /* Wider modal */
        }
        #review-form select,
        #review-form textarea,
        #review-form input[type="text"] { /* Style name input */
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            margin-top: 5px;
            margin-bottom: 15px; /* Add margin below */
            background-color: var(--input-bg);
            color: var(--text-color);
            font-size: 1rem;
        }
        #review-form textarea {
            min-height: 120px; /* Taller textarea */
            resize: vertical; /* Allow vertical resize */
        }
        #review-form label {
             font-weight: 500;
             margin-bottom: 3px;
        }
        #review-form button[type="submit"] {
            padding: 12px 25px;
            font-size: 1rem;
        }

        /* Back button consistent with checkout */
        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px; /* Added margin */
            transition: all 0.3s;
        }
        .back-button:hover {
            background-color: var(--primary-hover-color);
            color: white;
        }
        .back-button i {
            font-size: 16px;
        }

        @media (max-width: 768px) {
            .product-detail-container {
                flex-direction: column;
                padding: 15px;
            }
            .product-detail-image {
                max-width: 100%;
                height: 300px; /* Adjust height for mobile */
                margin-bottom: 20px;
                padding: 10px;
            }
             .product-detail-image img {
                max-height: 280px;
            }
            .product-detail-info {
                flex: 1;
            }
             #detail-product-name { font-size: 1.8rem; }
             .product-detail-price { font-size: 1.5rem; }
             .product-detail-actions { flex-direction: column; }
        }

    </style>
</head>
<body>
    <!-- Sidebar (assuming it's consistent across pages) -->
    <div class="sidebar">
        <div class="logo">HAMSA BEADS</div>
        <div class="BEADS-name">HAMSA BEADS</div>
        <br>
        <ul class="sidebar-menu">
            <!-- Direct links to Main.php as productDetail doesn't handle category switching -->
            <li><a href="Main.php">Recommendation</a></li>
            <li><a href="Main.php">Butterfly Series</a></li>
            <li><a href="Main.php">Moonstone Series</a></li>
            <li><a href="Main.php">Mystical Malachite Series</a></li>
            <li><a href="Main.php">LUXE Series</a></li>
        </ul>
         <!-- Sidebar bottom links removed as per style.css, handled by top-bar actions -->
    </div>

    <div class="main-content">
        <!-- Top Bar (consistent across pages) -->
        <div class="top-bar">
            <div class="search-container">
                <!-- Search might redirect to Main.php or perform site-wide search -->
                <input type="text" placeholder="Search products..." id="search-input">
                <button id="search-button"><i class="fas fa-search"></i></button>
            </div>
            <div class="user-actions">
                <a href="#" class="action-link" data-category="saves" id="top-bar-saves-link">
                    <i class="far fa-heart"></i>
                    <span class="save-badge">0</span>
                </a>
                <a href="#" class="action-link" data-category="cart" id="top-bar-cart-link">
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
                                <span class="user-status">Guest</span> <!-- This would ideally be dynamic -->
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
                <!-- Image src and alt will be set by JS -->
                <img src="images/placeholder.jpg" alt="Loading Product..." id="detail-product-image">
            </div>
            <div class="product-detail-info">
                <!-- Name, Price, Desc will be set by JS -->
                <h1 id="detail-product-name">Loading...</h1>
                <div class="product-detail-price" id="detail-product-price">Loading...</div>
                <div class="product-detail-description" id="detail-product-description">
                    Loading description...
                </div>
                <div class="product-detail-actions">
                    <button class="btn-purple" id="add-to-cart-btn">Add to Cart</button>
                    <!-- data-id will be set by JS -->
                    <button class="btn-save" id="save-product-btn" data-id="">
                        <i class="far fa-heart"></i> <!-- Initial state -->
                        Save
                    </button>
                </div>

                <!-- Reviews Section -->
                <div class="product-detail-reviews">
                    <h3>Reviews</h3>
                    <div id="detail-product-reviews">
                        <!-- Reviews will be loaded/added here -->
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
            <button class="close-modal" aria-label="Close review modal">×</button>
            <h2>Write a Review</h2>
            <form id="review-form">
                <!-- Conditionally show Name field - simplistic check -->
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

    <!-- Login/Register Modals (assuming these are consistent) -->
    <div class="modal-overlay" id="login-modal">
        <div class="modal-content">
            <button class="close-modal" aria-label="Close login modal">×</button>
            <h2>Log In</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-username">Username</label>
                    <input type="text" id="login-username" required>
                </div>
                <div class="form-group password-group">
                    <label for="login-password">Password</label>
                    <div class="password-input">
                        <input type="password" id="login-password" required>
                        <button type="button" class="toggle-password" aria-label="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <br>
                <button type="submit" class="btn-purple">Log in</button>
                <div class="form-footer">
                    Don't have an account? <a href="#" id="show-register">Register now</a>
                </div>
            </form>
        </div>
    </div>
    <div class="modal-overlay" id="register-modal">
         <div class="modal-content">
            <button class="close-modal" aria-label="Close register modal">×</button>
            <h2>Create New Account</h2>
            <form id="register-form">
                <div class="form-group">
                    <label for="register-username">Username</label>
                    <input type="text" id="register-username" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="form-group password-group">
                    <label for="register-password">Password</label>
                    <div class="password-input">
                        <input type="password" id="register-password" required>
                        <button type="button" class="toggle-password" aria-label="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="form-group password-group">
                    <label for="register-confirm">Confirm Password</label>
                    <div class="password-input">
                        <input type="password" id="register-confirm" required>
                        <button type="button" class="toggle-password" aria-label="Show password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <br>
                <button type="submit" class="btn-purple">Register</button>
                <div class="form-footer">
                    Already have an account? <a href="#" id="show-login">Log in here</a>
                </div>
            </form>
        </div>
    </div>
    <!-- END MODALS -->

    <!-- Link to the single, external JS file -->
    <script src="script.js"></script>

    <!-- REMOVED the large inline <script> block that was here -->

</body>
</html>