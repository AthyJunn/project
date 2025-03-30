<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - HAMSA BEADS</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
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
    </style>
</head>
<body>
    <div class="checkout-container">
        <div class="checkout-grid">
            <div class="section">
                <h2 class="section-title">Shipping Information</h2>
                
                <div class="delivery-options">
                    <div class="delivery-option active" onclick="selectDeliveryOption('delivery')">
                        <i class="fas fa-truck"></i>
                        <span>Delivery</span>
                    </div>
                    <div class="delivery-option" onclick="selectDeliveryOption('pickup')">
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

                <div class="payment-methods">
                    <h3 class="section-title">Payment Method</h3>
                    
                    <div class="payment-option" data-method="card">
                        <div class="payment-header">
                            <i class="fas fa-credit-card"></i>
                            <span>Credit/Debit Card</span>
                        </div>
                        <div class="card-details">
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
                    </div>

                    <div class="payment-option" data-method="shopee">
                        <div class="payment-header">
                            <i class="fas fa-shopping-bag"></i>
                            <span>ShopeePay</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Review your cart</h2>
                <div class="cart-items">
                    <!-- Cart items will be loaded here -->
                </div>

                <div class="discount-input form-group">
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
                        <span>RM 5.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Discount</span>
                        <span>-RM 0.00</span>
                    </div>
                    <div class="summary-row total-row">
                        <span>Total</span>
                        <span>RM 5.00</span>
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
        // Load cart items from localStorage
        function loadCartItems() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartContainer = document.querySelector('.cart-items');
            let subtotal = 0;

            cartContainer.innerHTML = cart.map(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                return `
                    <div class="cart-item">
                        <img src="src/${name.replace(/ /g, '_')}.jpg" alt="${item.name}">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-quantity">${item.quantity}x</div>
                        </div>
                        <div class="item-price">RM ${itemTotal.toFixed(2)}</div>
                    </div>
                `;
            }).join('');

            updateSummary(subtotal);
        }

        // Update cart summary
        function updateSummary(subtotal) {
            const shipping = document.querySelector('.delivery-option.active').querySelector('span').textContent === 'Delivery' ? 5.00 : 0.00;
            const discount = 0.00;
            const total = subtotal + shipping - discount;

            document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `RM ${subtotal.toFixed(2)}`;
            document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `RM ${shipping.toFixed(2)}`;
            document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = `-RM ${discount.toFixed(2)}`;
            document.querySelector('.total-row span:last-child').textContent = `RM ${total.toFixed(2)}`;
        }

        // Handle delivery option selection
        function selectDeliveryOption(option) {
            const deliveryOptions = document.querySelectorAll('.delivery-option');
            deliveryOptions.forEach(opt => opt.classList.remove('active'));
            
            const selectedOption = document.querySelector(`.delivery-option:${option === 'delivery' ? 'first-child' : 'last-child'}`);
            selectedOption.classList.add('active');

            // Update shipping cost
            const subtotalText = document.querySelector('.summary-row:nth-child(1) span:last-child').textContent;
            const subtotal = parseFloat(subtotalText.replace('RM ', ''));
            updateSummary(subtotal);
        }

        // Initialize payment method handlers
        document.addEventListener('DOMContentLoaded', function() {
            const paymentOptions = document.querySelectorAll('.payment-option');
            
            paymentOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const method = this.dataset.method;
                    selectPaymentMethod(method);
                });
            });

            // Set initial payment method
            selectPaymentMethod('card');
        });

        // Handle payment method selection
        function selectPaymentMethod(method) {
            console.log('Selecting payment method:', method); // Debug log
            
            const paymentOptions = document.querySelectorAll('.payment-option');
            const cardDetails = document.querySelector('.card-details');
            
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            
            // Find the selected option using data-method attribute
            const selectedOption = document.querySelector(`.payment-option[data-method="${method}"]`);
            
            if (!selectedOption) {
                console.error('Payment option not found:', method);
                return;
            }
            
            // Add active class to selected option
            selectedOption.classList.add('active');
            
            // Handle card details
            if (method === 'card') {
                cardDetails.classList.add('active');
                cardDetails.querySelectorAll('input').forEach(input => {
                    input.required = true;
                });
            } else {
                cardDetails.classList.remove('active');
                cardDetails.querySelectorAll('input').forEach(input => {
                    input.required = false;
                });
            }
        }

        // Process payment
        function processPayment() {
            const form = document.getElementById('shipping-form');
            const activePayment = document.querySelector('.payment-option.active');
            
            if (!activePayment) {
                alert('Please select a payment method');
                return;
            }

            if (form.checkValidity()) {
                // Here you would typically send the data to your backend
                const paymentMethod = activePayment.querySelector('.payment-header').textContent.trim();
                alert(`Payment processed successfully using ${paymentMethod}!`);
            } else {
                form.reportValidity();
            }
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            loadCartItems();
        });
    </script>
</body>
</html> 