<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* --- Existing Styles --- */
        :root {
            --primary-color: #6f42c1;
            --hover-color: #5a32a3;
        }

        body {
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
        }

        .checkout-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
        }

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
            margin-bottom: 20px;
            transition: all 0.3s;
        }

        .back-button:hover {
            background-color: var(--hover-color);
            color: white;
        }

        .back-button i {
            font-size: 16px;
        }

        .checkout-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 30px;
        }

        .section {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .section-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 25px;
            color: #333;
        }

        .delivery-options {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
        }

        .delivery-option {
            flex: 1;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            background: white;
            transition: all 0.3s;
        }

        .delivery-option:hover {
            border-color: var(--primary-color);
            background-color: #f8f5ff;
        }

        .delivery-option.active {
            background-color: #f3ebff;
            border-color: var(--primary-color);
            color: var(--primary-color);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
        }

        .required {
            color: red;
            margin-left: 3px;
        }

        .phone-input {
            display: flex;
            gap: 10px;
        }

        .country-code {
            width: 120px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .payment-methods {
            margin-top: 30px;
        }

        .payment-option {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s;
            background-color: white;
        }

        .payment-option:hover {
            border-color: var(--primary-color);
            background-color: #f8f5ff;
        }

        .payment-option.active {
            border-color: var(--primary-color);
            background-color: #f3ebff;
        }

        .payment-header {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #333;
        }

        .payment-option.active .payment-header {
            color: var(--primary-color);
        }

        .card-details {
            margin-top: 15px;
            display: none;
        }

        .card-details.active {
            display: block;
        }

        .cart-summary {
            margin-top: 20px;
        }

        /* Updated: Ensure discount input and button align nicely */
        .discount-input {
            display: flex;
            gap: 10px; /* Add gap between input and button */
            margin-bottom: 20px; /* Existing margin */
        }
        .discount-input input {
            flex-grow: 1; /* Allow input to take available space */
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
        }
        .discount-input button { /* Target the button specifically */
            white-space: nowrap; /* Prevent button text wrapping */
        }
        /* Style for applied discount message */
        .discount-applied-msg {
            color: green;
            font-size: 0.9em;
            margin-top: -10px; /* Pull up slightly */
            margin-bottom: 15px;
            text-align: left; /* Align to left under input */
            display: none; /* Hide initially */
        }


        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            color: #666;
        }

        .total-row {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            border-top: 2px solid #eee;
            padding-top: 15px;
            margin-top: 15px;
        }

        .btn-apply {
            padding: 12px 25px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s, opacity 0.3s; /* Add opacity transition */
        }
        /* Style for disabled apply button */
        .btn-apply:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            opacity: 0.7;
        }


        .btn-pay {
            width: 100%;
            padding: 15px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 20px;
        }

        .btn-pay:hover {
            background-color: var(--hover-color);
        }

        .secure-checkout {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 15px;
            color: #666;
            font-size: 14px;
        }

        .cart-items {
            margin-bottom: 20px;
        }

        .cart-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
            transition: background-color 0.3s;
        }

        .cart-item:last-child {
            border-bottom: none;
        }

        .cart-item:hover {
            background-color: #f8f9fa;
        }

        .cart-item img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: 15px;
        }

        .item-details {
            flex-grow: 1;
        }

        .item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }

        .item-quantity {
            color: #666;
            font-size: 0.9em;
        }

        .item-price {
            font-weight: 600;
            color: var(--primary-color);
            font-size: 1.1em;
            margin-left: 15px;
        }
        /* --- End Existing Styles --- */
    </style>
</head>
<body>
    <div class="checkout-container">
        <button class="back-button" onclick="window.location.href='Main.php'">
            <i class="fas fa-arrow-left"></i>
            Back to Shop
        </button>
        <div class="checkout-grid">
            <div class="section">
                <h2 class="section-title">Shipping Information</h2>

                <div class="delivery-options">
                    <div class="delivery-option active" data-option="delivery">
                        <i class="fas fa-truck"></i>
                        <span>Delivery</span>
                    </div>
                    <div class="delivery-option" data-option="pickup">
                        <i class="fas fa-store"></i>
                        <span>Pick up</span>
                    </div>
                </div>

                <!-- Delivery Form -->
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
                            <label>City<span class="required">*</span></label>
                            <input type="text" placeholder="Enter city" required>
                        </div>
                        <div class="form-group">
                            <label>State<span class="required">*</span></label>
                            <input type="text" placeholder="Enter state" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>ZIP Code<span class="required">*</span></label>
                        <input type="text" placeholder="Enter ZIP code" required>
                    </div>
                </form>

                <!-- Pick-up Form -->
                <form id="pickup-form" style="display: none;">
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
                        <label>Preferred Pick-up Date<span class="required">*</span></label>
                        <input type="date" required>
                    </div>

                    <div class="form-group">
                        <label>Preferred Pick-up Time<span class="required">*</span></label>
                        <select required>
                            <option value="">Select time</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">1:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Pick-up Location<span class="required">*</span></label>
                        <select required>
                            <option value="">Select location</option>
                            <option value="kl">Kuala Lumpur Store</option>
                            <option value="penang">Penang Store</option>
                            <option value="johor">Johor Store</option>
                        </select>
                    </div>
                </form>

                <div class="payment-methods">
                    <h3 class="section-title">Payment Method</h3>

                    <div class="payment-option active" data-method="card"> <!-- Set card as default active -->
                        <div class="payment-header">
                            <i class="fas fa-credit-card"></i>
                            <span>Credit/Debit Card</span>
                        </div>
                        <div class="card-details active"> <!-- Show card details by default -->
                            <div class="form-group">
                                <label>Card Number<span class="required">*</span></label>
                                <input type="text" placeholder="1234 5678 9012 3456" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Expiry Date<span class="required">*</span></label>
                                    <input type="text" placeholder="MM/YY" required>
                                </div>
                                <div class="form-group">
                                    <label>CVV<span class="required">*</span></label>
                                    <input type="text" placeholder="123" required>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="payment-option" data-method="tng">
                        <div class="payment-header">
                            <i class="fas fa-wallet"></i>
                            <span>Touch n Go eWallet</span>
                        </div>
                         <!-- No extra details needed for TNG -->
                    </div>

                    <div class="payment-option" data-method="shopee">
                        <div class="payment-header">
                            <i class="fas fa-shopping-bag"></i>
                            <span>ShopeePay</span>
                        </div>
                         <!-- No extra details needed for ShopeePay -->
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Review your cart</h2>
                <div class="cart-items">
                    <!-- Cart items will be loaded here -->
                </div>

                <!-- Updated Discount Section -->
                <div class="discount-input form-group">
                    <input type="text" placeholder="Discount code" id="discount-code-input">
                    <button class="btn-apply" id="apply-discount-btn">Apply</button>
                </div>
                <!-- Added element for success message -->
                <div class="discount-applied-msg" id="discount-message">10% Discount Applied!</div>

                <div class="cart-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span id="summary-subtotal">RM 0.00</span> <!-- Added ID -->
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span id="summary-shipping">RM 5.00</span> <!-- Added ID -->
                    </div>
                    <div class="summary-row">
                        <span>Discount</span>
                        <span id="summary-discount">-RM 0.00</span> <!-- Added ID -->
                    </div>
                    <div class="summary-row total-row">
                        <span>Total</span>
                        <span id="summary-total">RM 5.00</span> <!-- Added ID -->
                    </div>
                </div>

                <button class="btn-pay" onclick="processPayment()">Pay Now</button>

                <div class="secure-checkout">
                    <i class="fas fa-lock"></i>
                    Secure Checkout - SSL Encrypted
                </div>
            </div>
        </div>
    </div>

    <script>
        // --- Constants and State Variables ---
        const validDiscountCodes = ['SAVE10', 'BEADS10', 'HAMSA10']; // Your valid codes
        let currentDiscountRate = 0; // 0 means no discount, 0.10 means 10%
        let currentSubtotal = 0; // Keep track of subtotal globally in this script
        let isPickup = false; // Track delivery method

        // --- DOM Element References ---
        const discountInput = document.getElementById('discount-code-input');
        const applyDiscountBtn = document.getElementById('apply-discount-btn');
        const discountMessage = document.getElementById('discount-message');
        const subtotalEl = document.getElementById('summary-subtotal');
        const shippingEl = document.getElementById('summary-shipping');
        const discountEl = document.getElementById('summary-discount');
        const totalEl = document.getElementById('summary-total');
        const cartContainer = document.querySelector('.cart-items');
        const shippingForm = document.getElementById('shipping-form');
        const pickupForm = document.getElementById('pickup-form');
        const deliveryOptions = document.querySelectorAll('.delivery-option');

        // --- Functions ---

        // Load cart items from localStorage
        function loadCartItems() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            currentSubtotal = 0; // Reset subtotal before calculating

            if (!cartContainer) return; // Safety check

            cartContainer.innerHTML = cart.map(item => {
                // Validate item structure slightly
                const name = item.name || 'Unknown Item';
                const price = typeof item.price === 'number' ? item.price : 0;
                const quantity = typeof item.quantity === 'number' ? item.quantity : 1;

                const itemTotal = price * quantity;
                currentSubtotal += itemTotal; // Update global subtotal

                // Construct image path safely
                const imageName = name.replace(/ /g, '_');
                const imageSrc = `src/${imageName}.jpg`; // Adjust path if needed

                return `
                    <div class="cart-item">
                        <img src="${imageSrc}" alt="${name}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                        <div class="item-details">
                            <div class="item-name">${name}</div>
                            <div class="item-quantity">Quantity: ${quantity}</div>
                        </div>
                        <div class="item-price">RM ${itemTotal.toFixed(2)}</div>
                    </div>
                `;
            }).join('');

            updateSummary(); // Update summary after loading items and calculating subtotal
        }

        // Update cart summary based on current state
        function updateSummary() {
            const shippingCost = isPickup ? 0.00 : 5.00;
            const discountAmount = currentSubtotal * currentDiscountRate;
            const total = currentSubtotal + shippingCost - discountAmount;

            // Update DOM elements safely
            if (subtotalEl) subtotalEl.textContent = `RM ${currentSubtotal.toFixed(2)}`;
            if (shippingEl) shippingEl.textContent = `RM ${shippingCost.toFixed(2)}`;
            if (discountEl) discountEl.textContent = `-RM ${discountAmount.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `RM ${total.toFixed(2)}`;
        }

        // Handle delivery option selection
        function selectDeliveryOption(option) {
            // Update active state
            deliveryOptions.forEach(opt => opt.classList.remove('active'));
            const selectedOption = document.querySelector(`.delivery-option[data-option="${option}"]`);
            if (selectedOption) {
                selectedOption.classList.add('active');
                isPickup = option === 'pickup';
                
                // Show/hide appropriate form
                if (shippingForm && pickupForm) {
                    if (isPickup) {
                        shippingForm.style.display = 'none';
                        pickupForm.style.display = 'block';
                    } else {
                        shippingForm.style.display = 'block';
                        pickupForm.style.display = 'none';
                    }
                }

                // Update shipping cost and total
                updateSummary();
            }
        }

        // Handle payment method selection
        function selectPaymentMethod(method) {
            console.log('Selecting payment method:', method); // Debug log

            const paymentOptions = document.querySelectorAll('.payment-option');
            const cardDetails = document.querySelector('.card-details');

            paymentOptions.forEach(opt => opt.classList.remove('active'));

            const selectedOption = document.querySelector(`.payment-option[data-method="${method}"]`);
            if (!selectedOption) {
                console.error('Payment option not found:', method);
                return;
            }
            selectedOption.classList.add('active');

            // Reset all card inputs requirement first
             if (cardDetails) {
                cardDetails.classList.remove('active');
                cardDetails.querySelectorAll('input').forEach(input => input.required = false);
             }

            // Activate card details and set required only if 'card' is selected
            if (method === 'card' && cardDetails) {
                cardDetails.classList.add('active');
                cardDetails.querySelectorAll('input').forEach(input => input.required = true);
            }
        }

        // Process payment (basic validation)
        function processPayment() {
            const activeForm = isPickup ? pickupForm : shippingForm;
            const activePaymentOption = document.querySelector('.payment-option.active');

            if (!activePaymentOption) {
                alert('Please select a payment method.');
                return;
            }

            // Check validity of the active form
            let isFormValid = activeForm.checkValidity();

            // If card payment is active, also check its inputs
            const paymentMethod = activePaymentOption.dataset.method;
            if (paymentMethod === 'card') {
                const cardDetailsForm = document.querySelector('.card-details');
                cardDetailsForm.querySelectorAll('input').forEach(input => {
                    if (!input.checkValidity()) {
                        isFormValid = false;
                        input.reportValidity();
                    }
                });
            }

            if (isFormValid) {
                // Here you would typically send the data to your backend
                const paymentMethodText = activePaymentOption.querySelector('.payment-header span').textContent.trim();
                const deliveryMethod = isPickup ? 'Pick-up' : 'Delivery';
                alert(`Order confirmed!\nPayment Method: ${paymentMethodText}\nDelivery Method: ${deliveryMethod}`);
                localStorage.removeItem('cart');
                window.location.href = 'Main.php'; // Redirect to main page after successful order
            } else {
                activeForm.reportValidity();
                alert('Please fill in all required fields correctly.');
            }
        }

        // --- Event Listeners Setup ---
        document.addEventListener('DOMContentLoaded', function() {
            loadCartItems(); // Load items and calculate initial subtotal/summary

            // Delivery Option Listeners
            deliveryOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const selectedOption = this.dataset.option;
                    selectDeliveryOption(selectedOption);
                });
            });

            // Payment Method Listeners
            const paymentOptions = document.querySelectorAll('.payment-option');
            paymentOptions.forEach(option => {
                option.addEventListener('click', function() {
                    selectPaymentMethod(this.dataset.method);
                });
            });

            // Discount Code Listener
            if (applyDiscountBtn && discountInput) {
                applyDiscountBtn.addEventListener('click', function() {
                    const enteredCode = discountInput.value.trim().toUpperCase();

                    if (validDiscountCodes.includes(enteredCode)) {
                        currentDiscountRate = 0.10;
                        discountMessage.style.display = 'block';
                        applyDiscountBtn.disabled = true;
                        applyDiscountBtn.textContent = 'Applied ✓';
                        discountInput.disabled = true;
                        updateSummary();
                    } else {
                        alert('Invalid discount code.');
                        discountInput.value = '';
                    }
                });
            }
        });
    </script>
</body>
</html>