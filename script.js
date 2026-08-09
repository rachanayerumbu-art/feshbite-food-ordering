// --- Data Stores ---
const restaurants = [
    { id: 'r1', name: 'Pizza Palace', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0rdGi0DorysIgWgnA2U31vOVKKgkwCRDL6Q&s', cuisine: 'Italian ' },
    { id: 'r2', name: 'Burger Hub', image: 'https://static.wixstatic.com/media/9a1d3f_534dd088a24b4298bd45c3e6d904a0ca~mv2.png/v1/fill/w_260,h_250,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Burgers%20from%20Burger%20Hub%20located%20at%206231%20S%2027th%20St%20Greenfield%2C%20WI%2053221.png', cuisine: 'American Gourmet' },
    { id: 'r3', name: 'Spice Villa', image: 'https://www.uengage.in/images/addo/logos/logo-49730-1720009417.jpeg', cuisine: 'Authentic Indian' }
];

const menuItems = [
    { id: 1, restaurantId: 'r1', name: 'Margherita Pizza', price: 299, category: 'Pizza', diet: 'veg', image: 'https://www.foodandwine.com/thmb/7BpSJWDh1s-2M2ooRPHoy07apq4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/mozzarella-pizza-margherita-FT-RECIPE0621-11fa41ceb1a5465d9036a23da87dd3d4.jpg', desc: 'Classic cheese pizza topped with fresh basil leaves.', calories: '250 kcal/slice', ingredients: 'Mozzarella, Tomato Sauce, Fresh Basil, Olive Oil' },
    { id: 2, restaurantId: 'r1', name: 'Pepperoni Supreme', price: 449, category: 'Pizza', diet: 'non-veg', image: 'https://png.pngtree.com/background/20250602/original/pngtree-supreme-pizza-with-pepperoni-sausage-peppers-onions-olives-and-mushrooms-picture-image_16606053.jpg', desc: 'Loaded with spicy pepperoni slices and extra cheese.', calories: '320 kcal/slice', ingredients: 'Pepperoni, Mozzarella, Secret Pizza Sauce' },
    { id: 3, restaurantId: 'r2', name: 'Classic Cheeseburger', price: 199, category: 'Burgers', diet: 'non-veg', image: 'https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1:1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg', desc: 'Juicy beef patty topped with cheddar cheese and fresh veggies.', calories: '550 kcal', ingredients: 'Beef Patty, Cheddar Cheese, Lettuce, Tomato, Pickles' },
    { id: 4, restaurantId: 'r2', name: 'Vegan Black Bean Burger', price: 219, category: 'Burgers', diet: 'vegan', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=500&q=80', desc: 'Hearty house-made black bean patty served on a vegan brioche bun.', calories: '410 kcal', ingredients: 'Black Beans, Corn, Avocado, Vegan Mayonnaise' },
    { id: 5, restaurantId: 'r3', name: 'Paneer Butter Masala', price: 320, category: 'Indian', diet: 'veg', image: 'https://myfoodstory.com/wp-content/uploads/2021/07/restaurant-style-paneer-butter-masala-2-500x500.jpg', desc: 'Soft cottage cheese cubes cooked in a rich tomato-butter gravy.', calories: '480 kcal', ingredients: 'Paneer, Butter, Cream, Tomatoes, Spices' },
    { id: 6, restaurantId: 'r3', name: 'Chicken Tikka Masala', price: 380, category: 'Indian', diet: 'non-veg', image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2018/05/Chicken-Tikka-Masala-recipe.jpg', desc: 'Roasted marinated chicken pieces served in a spiced curry sauce.', calories: '520 kcal', ingredients: 'Chicken, Yogurt, Spices, Tomato Cream Sauce' }
];

// --- State Variables ---
let cart = [];
let wishlist = [];
let activeRestaurant = 'all';
let activeCategory = 'all';
let discountAmount = 0;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    renderRestaurants();
    renderMenu();
});

// --- Render Functions ---
function renderRestaurants() {
    const grid = document.getElementById('restaurantGrid');
    if (!grid) return;

    grid.innerHTML = restaurants.map(r => `
        <div class="restaurant-card" onclick="filterByRestaurant('${r.id}')">
            <img src="${r.image}" alt="${r.name}">
            <div class="restaurant-info">
                <h3>${r.name}</h3>
                <p style="color: #636e72; font-size: 14px;">${r.cuisine}</p>
            </div>
        </div>
    `).join('');
}

function renderMenu() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    let filtered = menuItems;

    // Filter by Restaurant
    if (activeRestaurant !== 'all') {
        filtered = filtered.filter(item => item.restaurantId === activeRestaurant);
    }

    // Filter by Category / Dietary
    if (activeCategory !== 'all') {
        if (['veg', 'non-veg', 'vegan'].includes(activeCategory)) {
            filtered = filtered.filter(item => item.diet === activeCategory);
        } else {
            filtered = filtered.filter(item => item.category === activeCategory);
        }
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777;">No dishes match your selected filters.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(item => {
        const isWishlisted = wishlist.some(w => w.id === item.id);
        return `
            <div class="food-card">
                <div class="food-card-header">
                    <img src="${item.image}" alt="${item.name}">
                    <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${item.id})" title="Wishlist">
                        <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="food-card-body">
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price}</p>
                    <div class="food-actions">
                        <button class="btn-secondary" onclick="openDetailsModal(${item.id})">Details</button>
                        <button class="btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// --- Filtering Logic ---
function filterByRestaurant(restId) {
    activeRestaurant = restId;
    const title = document.getElementById('menuSectionTitle');
    const clearBtn = document.getElementById('clearRestFilter');

    if (restId === 'all') {
        title.textContent = 'All Menu Items';
        clearBtn.style.display = 'none';
    } else {
        const rest = restaurants.find(r => r.id === restId);
        title.textContent = `Menu from ${rest ? rest.name : ''}`;
        clearBtn.style.display = 'inline-block';
    }

    renderMenu();
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function filterCategory(category, btnElement) {
    activeCategory = category;
    
    // Toggle active state on buttons
    const buttons = document.querySelectorAll('#categoryFilters .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    renderMenu();
}

// --- Wishlist Management ---
function toggleWishlist(itemId) {
    const index = wishlist.findIndex(item => item.id === itemId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        const dish = menuItems.find(m => m.id === itemId);
        if (dish) wishlist.push(dish);
    }

    updateWishlistBadge();
    renderWishlist();
    renderMenu();
}

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistCount');
    if (badge) badge.textContent = wishlist.length;
}

function toggleWishlistSidebar() {
    const sidebar = document.getElementById('wishlistSidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    renderWishlist();
}

function renderWishlist() {
    const container = document.getElementById('wishlistItemsList');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #777; padding: 20px;">Your wishlist is empty.</p>`;
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>₹${item.price}</p>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="btn-primary" style="padding: 4px 10px; font-size: 12px;" onclick="moveToCart(${item.id})">Add to Cart</button>
                <button class="close-btn" onclick="removeFromWishlist(${item.id})">&times;</button>
            </div>
        </div>
    `).join('');
}

function moveToCart(itemId) {
    addToCart(itemId);
    removeFromWishlist(itemId);
}

function removeFromWishlist(itemId) {
    wishlist = wishlist.filter(item => item.id !== itemId);
    updateWishlistBadge();
    renderWishlist();
    renderMenu();
}

// --- Cart Management ---
function addToCart(itemId) {
    const existing = cart.find(i => i.id === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const dish = menuItems.find(m => m.id === itemId);
        if (dish) cart.push({ ...dish, quantity: 1 });
    }
    updateCartUI();
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    // Badge Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalCount;

    // Render Items
    const container = document.getElementById('cartItemsList');
    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #777; padding: 20px;">Your cart is empty.</p>`;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="btn-secondary" style="padding: 2px 8px;" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-secondary" style="padding: 2px 8px;" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    // Totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
    document.getElementById('cartDiscount').textContent = `-₹${discountAmount}`;
    
    const finalTotal = Math.max(0, subtotal - discountAmount);
    document.getElementById('cartTotal').textContent = `₹${finalTotal}`;
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const msg = document.getElementById('couponMessage');

    if (code === 'SAVE20') {
        if (subtotal >= 300) {
            discountAmount = Math.round(subtotal * 0.20);
            msg.style.color = '#2ed573';
            msg.textContent = '20% Promo Applied!';
        } else {
            msg.style.color = '#ff4757';
            msg.textContent = 'Minimum order value of ₹300 required.';
        }
    } else if (code === 'FRESHBITE100') {
        discountAmount = 100;
        msg.style.color = '#2ed573';
        msg.textContent = '₹100 Instant Discount Applied!';
    } else {
        msg.style.color = '#ff4757';
        msg.textContent = 'Invalid Promo Code.';
    }

    updateCartUI();
}

// --- Modals & Overlay Handling ---
function openModal(modalId) {
    closeAllModals();
    document.getElementById(modalId).classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('active'));
    document.getElementById('overlay').classList.remove('active');
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// --- Dish Overview Modal ---
function openDetailsModal(itemId) {
    const dish = menuItems.find(m => m.id === itemId);
    if (!dish) return;

    document.getElementById('modalTitle').textContent = dish.name;
    document.getElementById('modalBody').innerHTML = `
        <img src="${dish.image}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;">
        <p><strong>Description:</strong> ${dish.desc}</p>
        <p style="margin-top: 8px;"><strong>Calories:</strong> ${dish.calories}</p>
        <p style="margin-top: 8px;"><strong>Ingredients:</strong> ${dish.ingredients}</p>
        <button class="btn-primary btn-full" style="margin-top: 15px;" onclick="addToCart(${dish.id}); closeModal('detailsModal');">Add to Cart (₹${dish.price})</button>
    `;

    openModal('detailsModal');
}

// --- Checkout & Tracking Process ---
function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    openModal('checkoutModal');
}

function processOrder(event) {
    event.preventDefault();
    const slot = document.getElementById('deliveryTimeSelect').value;
    document.getElementById('trackerDeliveryTime').textContent = slot;
    
    // Clear cart and show tracker
    cart = [];
    discountAmount = 0;
    updateCartUI();
    
    openModal('statusModal');
}

// --- Form Event Handlers ---
function handleContactSubmit(event) {
    event.preventDefault();
    alert("Thank you for contacting FreshBite! We've received your message.");
    event.target.reset();
}

function simulatedLogin(event) {
    event.preventDefault();
    alert("Successfully logged in!");
    closeModal('loginModal');
}