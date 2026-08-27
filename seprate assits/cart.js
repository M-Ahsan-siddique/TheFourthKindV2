/**
 * THE FOURTH KIND — STANDALONE CART SYSTEM
 * Pure Vanilla JS, Luxury White Theme, Dynamic Multi-Level Path Resolution
 */

(function () {
  const STORAGE_KEY = 'tfk_cart_items';

  // Determine current directory depth relative to seprate assits root
  function getRootPrefix() {
    const currentScript = document.currentScript || document.querySelector('script[src*="cart.js"]');
    const src = currentScript ? currentScript.getAttribute('src') : '';
    if (src.startsWith('../../')) return '../../';
    if (src.startsWith('../')) return '../';
    return './';
  }

  // Load items from localStorage
  let cart = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  // DOM Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartCountBadge = document.getElementById('cart-count-badge');
  const cartItemsTotal = document.getElementById('cart-items-total');
  const cartBody = document.getElementById('cart-body');
  const cartSubtotal = document.getElementById('cart-subtotal-amount');

  // Open / Close Drawer
  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Extract clean filename: e.g. "brazilian_origin.png"
  function getCleanFileName(path) {
    if (!path) return 'brazilian_origin.png';
    const parts = path.split('/');
    return parts[parts.length - 1];
  }

  // Add Item
  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    const fileName = getCleanFileName(product.img);

    if (existing) {
      existing.qty += 1;
      if (!existing.fileName) existing.fileName = fileName;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        fileName: fileName,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    openCart();

    if (cartCountBadge) {
      cartCountBadge.classList.remove('bump');
      void cartCountBadge.offsetWidth;
      cartCountBadge.classList.add('bump');
    }
  }

  // Update Qty
  function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }

    saveCart();
    renderCart();
  }

  // Remove Item
  function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  // Currency Formatter
  function formatMoney(amount) {
    return '$' + amount.toLocaleString('en-US');
  }

  // Render UI
  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const rootPrefix = getRootPrefix();

    if (cartCountBadge) {
      cartCountBadge.textContent = totalCount;
      cartCountBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (cartItemsTotal) {
      cartItemsTotal.textContent = `(${totalCount})`;
    }

    if (cartSubtotal) {
      cartSubtotal.textContent = formatMoney(totalPrice);
    }

    if (!cartBody) return;

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 256 256" fill="rgba(0,0,0,0.2)">
            <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM96,88a32,32,0,0,0,64,0,8,8,0,0,0-16,0,16,16,0,0,1-32,0,8,8,0,0,0-16,0Z"/>
          </svg>
          <p class="empty-title">YOUR CART IS EMPTY</p>
          <p class="empty-desc">Discover our cosmic roasts and begin your journey.</p>
          <a href="${rootPrefix}index.html#coffee-section" class="empty-cta" onclick="window.__closeTfkCart && window.__closeTfkCart()">EXPLORE COFFEE</a>
        </div>
      `;
      return;
    }

    let html = '<div class="cart-items-list">';
    cart.forEach((item) => {
      const fileName = item.fileName || getCleanFileName(item.img);
      const resolvedImg = `${rootPrefix}assits/${fileName}`;

      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="item-thumb">
            <img src="${resolvedImg}" alt="${item.name}" />
          </div>
          <div class="item-details">
            <div class="item-top">
              <h4 class="item-name">${item.name}</h4>
              <button class="item-remove" data-action="remove" data-id="${item.id}" aria-label="Remove item">✕</button>
            </div>
            <div class="item-bottom">
              <div class="qty-selector">
                <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
              </div>
              <span class="item-price">${formatMoney(item.price * item.qty)}</span>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    cartBody.innerHTML = html;
  }

  // Event Listeners
  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('open')) {
      closeCart();
    }
  });

  // Cart Body Actions Delegation
  if (cartBody) {
    cartBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'remove') removeItem(id);
      if (action === 'increase') changeQty(id, 1);
      if (action === 'decrease') changeQty(id, -1);
    });
  }

  // Add to Cart buttons
  document.querySelectorAll('.add-to-cart-btn, .btn-add-cart, .add-to-cart-action').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = {
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: btn.getAttribute('data-price'),
        img: btn.getAttribute('data-img')
      };
      addToCart(product);
    });
  });

  // Checkout Button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Please add coffee before checking out.');
        return;
      }
      alert(`Proceeding to checkout with ${cart.length} item(s)!`);
    });
  }

  window.__closeTfkCart = closeCart;
  renderCart();
})();
