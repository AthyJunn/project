<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HAMSA BEADS - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <div class="sidebar">
        <div class="logo">HAMSA BEADS</div>
        <div class="BEADS-name">HAMSA BEADS</div>
        <br>
        <ul class="sidebar-menu">
            <li><a href="#" class="active" data-category="recommendation">Recommendation</a></li>
            <li><a href="#" data-category="butterfly">Butterfly Series</a></li>
            <li><a href="#" data-category="moonstone">Moonstone Series</a></li>
            <li><a href="#" data-category="malachite">Mystical Malachite Series</a></li>
            <li><a href="#" data-category="luxe">LUXE Series</a></li>
            
            <div class="sidebar-bottom">
            <li><a href="#" data-category="saves">
                <i class="far fa-heart"></i>
                <span>Saves</span>
                <span class="save-badge">0</span>
                </a></li>
            <li><a href="#" data-category="cart">
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
        
        <h2 class="section-title" id="current-category">Recommendation</h2>
        
        <div class="product-grid" id="product-container">
            <!-- Products will be loaded here via JavaScript/PHP -->
        </div>
    </div>

    <!-- Login Modal -->
    <div class="modal-overlay" id="login-modal">
        <div class="modal-content">
            <button class="close-modal">&times;</button>
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
                <button type="submit" class="btn-purple">Log in</button>
                <div class="form-footer">
                    Don't have an account? <a href="#" id="show-register">Register now</a>
                </div>
            </form>
        </div>
    </div>

    <!-- Register Modal -->
    <div class="modal-overlay" id="register-modal">
        <div class="modal-content">
            <button class="close-modal">&times;</button>
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
                <button type="submit" class="btn-purple">Register</button>
                <div class="form-footer">
                    Already have an account? <a href="#" id="show-login">Log in here</a>
                </div>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>