<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="style.css" rel="stylesheet">
</head>
<body>
    <div class="checkout-container">
        <div class="checkout-grid">
            <!-- Shipping Information Section -->
            <div class="shipping-section">
                <h2 class="section-title">Shipping Information</h2>
                
                <div class="delivery-options">
                    <div class="delivery-option active">
                        <i class="fas fa-truck"></i>
                        <span>Delivery</span>
                    </div>
                    <div class="delivery-option">
                        <i class="fas fa-store"></i>
                        <span>Pick up</span>
                    </div>
                </div>

                <form id="shipping-form">
                    <div class="form-group">
                        <label>Full name<span class="required">*</span></label>
                        <input type="text" placeholder="Enter full name" required>
                    </div>

                    <div class="form-group">
                        <label>Email address<span class="required">*</span></label>
                        <input type="email" placeholder="Enter email address" required>
                    </div>

                    <div class="form-group">
                        <label>Phone number<span class="required">*</span></label>
                        <div class="phone-input">
                            <select class="country-code">
                                <option value="+60">🇲🇾 +60</option>
                                <option value="+65">🇸🇬 +65</option>
                                <option value="+62">🇮🇩 +62</option>
                            </select>
                            <input type="tel" placeholder="Enter phone number" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Country<span class="required">*</span></label>
                        <select required>
                            <option value="">Choose country</option>
                            <option value="MY">Malaysia</option>
                            <option value="SG">Singapore</option>
                            <option value="ID">Indonesia</option>
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" placeholder="Enter city">
                        </div>
                        <div class="form-group">
                            <label>State</label>
                            <input type="text" placeholder="Enter state">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>ZIP Code</label>
                        <input type="text" placeholder="Enter ZIP code">
                    </div>
                </form>
            </div>

            <!-- Cart Review Section -->
            <div class="cart-review">
                <h2 class="section-title">Review your cart</h2>
                
                <div class="cart-items">
                    <!-- Cart items will be dynamically loaded here -->
                </div>

                <div class="discount-input">
                    <input type="text" placeholder="Discount code">
                    <button class="btn-apply">Apply</button>
                </div>

                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>RM 0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>RM 0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Discount</span>
                        <span>-RM 0.00</span>
                    </div>
                    <div class="summary-row total-row">
                        <span>Total</span>
                        <span>RM 0.00</span>
                    </div>
                </div>

                <button class="btn-pay">Pay Now</button>

                <div class="secure-checkout">
                    <i class="fas fa-lock"></i>
                    Secure Checkout - SSL Encrypted
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
