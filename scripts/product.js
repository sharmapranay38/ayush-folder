// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Initial Cart:', cart); // Debugging log

// Function to add a product to the cart
function addToCart(id, name, price) {
    console.log(`Adding to cart: id=${id}, name=${name}, price=${price}`); // Debugging log
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        console.log('Item already in cart, increasing quantity'); // Debugging log
        existingItem.quantity++;
    } else {
        console.log('Item not in cart, adding new item'); // Debugging log
        cart.push({ id, name, price: parseFloat(price), quantity: 1 });
    }

    updateCart();
    saveCart();
    updateCartCount();
    alert(`${name} added to cart!`);
}
    
// Function to remove an item from the cart
function removeFromCart(id) {
    console.log(`Removing item with id=${id} from cart`); // Debugging log
    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
        cart.splice(index, 1);
        console.log('Item removed successfully'); // Debugging log
    } else {
        console.warn('Item not found in cart'); // Debugging log
    }

    updateCart();
    saveCart();
    updateCartCount();
}

// Function to update the cart display
function updateCart() {
    console.log('Updating cart display...'); // Debugging log
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !cartTotal) {
        console.error('Cart display elements are missing in the DOM'); // Debugging log
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        // Ensure price is a number
        item.price = parseFloat(item.price);

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('tr');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <td style="padding: 10px; font-size: 1.1rem; color: #333;">${item.name}</td>
            <td style="padding: 10px; font-size: 1.1rem; color: #333;">₹${item.price.toFixed(2)}</td>
            <td style="padding: 10px;">
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input" style="width: 60px; padding: 5px;">
            </td>
            <td style="padding: 10px; font-size: 1.1rem; color: #333;">₹${itemTotal.toFixed(2)}</td>
            <td style="padding: 10px;">
                <button onclick="removeFromCart(${item.id})" style="background-color: #ff6f61; color: white; padding: 8px 16px; border: none; cursor: pointer; font-size: 0.9rem;">Remove</button>
            </td>
        `;
        cartItems.appendChild(cartItem);
    });

    if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="5" style="text-align: center;">Your cart is empty</td></tr>';
        console.log('Cart is empty'); // Debugging log
    }

    cartTotal.textContent = total.toFixed(2);
    console.log('Cart updated successfully', { total, cart }); // Debugging log

    // Attach event listeners to quantity inputs
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            const id = parseInt(e.target.getAttribute('data-id'));
            updateItemQuantity(id, newQuantity);
        });
    });
}

// Function to save cart to localStorage
function saveCart() {
    console.log('Saving cart to localStorage', cart); // Debugging log
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        console.log('Cart count updated:', totalItems); // Debugging log
    } else {
        console.error('Cart count element is missing in the DOM'); // Debugging log
    }
}

// Function to update item quantity in the cart
function updateItemQuantity(id, newQuantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            updateCart();  // Update cart display
            saveCart();    // Save to localStorage
            updateCartCount(); // Update cart count in navigation
            console.log('Item quantity updated:', item); // Debugging log
        } else {
            alert("Quantity must be at least 1!");
        }
    } else {
        console.error("Item not found in cart to update quantity");
    }
}

// Event listener for adding products to cart
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded, initializing cart'); // Debugging log
    updateCartCount();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            console.log(`Add to Cart Button Clicked: id=${id}, name=${name}, price=${price}`); // Debugging log
            addToCart(id, name, price);
        });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log('Checkout button clicked'); // Debugging log
            if (cart.length === 0) {
                alert('Your cart is empty. Add some items before checking out!');
                console.warn('Attempted checkout with an empty cart'); // Debugging log
            } else {
                const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                alert(`Thank you for your purchase! Total: ₹${total.toFixed(2)}`);
                console.log('Checkout successful, clearing cart'); // Debugging log
                cart = [];
                saveCart();
                updateCart();
                updateCartCount();
            }
        });
    }

    // Initialize cart display
    updateCart();
});
