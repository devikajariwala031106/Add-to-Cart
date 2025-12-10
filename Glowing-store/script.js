const products = [
    {
        id: "KX2",
        name: "Enriched Hard Ratio",
        price: 1.947,
        quantity: 0,
        color: "Key",
        description: "This natural and vegan body scrub focuses on cellulite and stretch marks too. Thanks to exfoliating coffee grinds and nourishing macadamia oil. Use 2-3 times a week and watch skin shine brighter.",
        image: "./Images/product-03-1.webp"
    },
    {
        id: "KX3",
        name: "Nourishing Eye Cream",
        price: 1.969,
        quantity: 0,
        color: "Key",
        description: "This natural and vegan eye cream reduces dark circles and puffiness. Enriched with nourishing macadamia oil and caffeine. Use daily for brighter, more awake-looking eyes.",
        image: "./Images/product-06-2.webp"
    },
    {
        id: "KX4",
        name: "Enriched Hard Ratio",
        price: 1.225,
        quantity: 0,
        color: "White",
        description: "This natural and vegan body scrub focuses on cellulite and stretch marks too. Thanks to exfoliating coffee grinds and nourishing macadamia oil. Use 2-3 times a week and watch skin shine brighter.",
        image: "./Images/product-05-2.jpg"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsGrid = document.querySelector('.products-grid');
const cartCountElement = document.getElementById('cart-count');
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const modalProductDetails = document.querySelector('.modal-product-details');

document.addEventListener('DOMContentLoaded', function () {

    if (window.location.pathname.includes('cart.html') || window.location.hash === '#cart') {
        renderCartPage();
    } else {
        renderProducts();
        updateCartCount();
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function renderProducts() {
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const cartItem = cart.find(item => item.id === product.id);
        const inCartQuantity = cartItem ? cartItem.quantity : 0;

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-header">
                    <span class="product-id">${product.id}</span>
                    <span class="product-price">$${product.price.toFixed(3)}</span>
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-color">Color: ${product.color}</p>
                <p class="product-quantity">In Stock: ${product.quantity}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn btn-add" onclick="addToCart('${product.id}')">
                        <i class="fas fa-cart-plus"></i> Add to Cart (${inCartQuantity})
                    </button>
                    <button class="btn btn-details" onclick="showProductDetails('${product.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const cartItemIndex = cart.findIndex(item => item.id === productId);

    if (cartItemIndex > -1) {
        cart[cartItemIndex].quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
    renderProducts();

    showNotification(`${product.name} added to cart!`);
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    modalProductDetails.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div>
            <div class="product-header">
                <span class="product-id">${product.id}</span>
                <span class="product-price">$${product.price.toFixed(3)}</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-color"><strong>Color:</strong> ${product.color}</p>
            <p class="product-quantity"><strong>In Stock:</strong> ${product.quantity}</p>
            <p class="product-description"><strong>Description:</strong> ${product.description}</p>
            <div class="product-actions">
                <button class="btn btn-add" onclick="addToCart('${product.id}'); modal.style.display='none'">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

function updateCartCount() {
    if (!cartCountElement) return;

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function renderCartPage() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="index.html" class="btn btn-details">Continue Shopping</a>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; 
    const total = subtotal + tax;

    let cartHTML = `
        <h2 class="cart-title">Your Shopping Cart</h2>
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartHTML += `
            <tr>
                <td>
                    <div class="cart-product-info">
                        <div class="cart-product-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div>
                            <h4>${item.name}</h4>
                            <p>ID: ${item.id}</p>
                            <p>Color: ${item.color}</p>
                        </div>
                    </div>
                </td>
                <td>$${item.price.toFixed(3)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>$${itemTotal.toFixed(3)}</td>
                <td><button class="btn-remove" onclick="removeFromCart('${item.id}')">Remove</button></td>
            </tr>
        `;
    });

    cartHTML += `
            </tbody>
        </table>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(3)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (8%)</span>
                <span>$${tax.toFixed(3)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>$${total.toFixed(3)}</span>
            </div>
            <button class="btn-checkout" onclick="checkout()">Proceed to Checkout</button>
        </div>
    `;

    cartContainer.innerHTML = cartHTML;
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const cartItemIndex = cart.findIndex(item => item.id === productId);

    if (cartItemIndex > -1) {
        cart[cartItemIndex].quantity = newQuantity;

        localStorage.setItem('cart', JSON.stringify(cart));

        renderCartPage();
        updateCartCount();

        if (!window.location.pathname.includes('cart.html')) {
            renderProducts();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));

    renderCartPage();
    updateCartCount();

    if (!window.location.pathname.includes('cart.html')) {
        renderProducts();
    }

    showNotification('Item removed from cart');
}

function checkout() {
    if (cart.length === 0) return;

    alert(`Thank you for your order! Total: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(3)}`);

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));

    renderCartPage();
    updateCartCount();

    showNotification('Order placed successfully!');
}