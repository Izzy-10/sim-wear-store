/* ============================================
   SIM WEAR — SHARED LOGIC
   Product catalog + cart (persisted in localStorage)
   Included on every page via <script src="shop.js">
   ============================================ */

/* ── PRODUCT CATALOG ──
   NOTE ON IMAGES: `img` fields point to a free placeholder photo service
   (picsum.photos) seeded per-product so each item gets a consistent stand-in
   photo. These are NOT real Sim Wear product photography — swap each `img`
   value for your own photo URL or local file path (e.g. "images/tee-black.jpg")
   as soon as you have real product shoots. Nothing else needs to change. */
function placeholderImg(seed, w = 600, h = 750) { return `https://picsum.photos/seed/${seed}/${w}/${h}`; }

const PRODUCTS = [
  { id: 'p1', name: 'Classic Oversized Tee', type: 'T-Shirts & Hoodies', category: 'tees', price: 280, emoji: '👕', bg: 'p1-bg', badge: 'new',
    img: placeholderImg('simwear-tee-1'), imgAlt: placeholderImg('simwear-tee-1b'),
    colours: ['#1a1a1a','#F5F3EE','#FF5C3A','#4DDFFF'], sizes: ['XS','S','M','L','XL','XXL'],
    desc: 'Premium quality cotton. Relaxed oversized fit built for comfort and style. Machine washable. Unisex cut.' },
  { id: 'p2', name: 'Street Sole Runner', type: 'Sneakers', category: 'sneakers', price: 899, oldPrice: 1200, emoji: '👟', bg: 'p2-bg', badge: 'sale',
    img: placeholderImg('simwear-sneaker-1'), imgAlt: placeholderImg('simwear-sneaker-1b'),
    colours: ['#1a1a1a','#F5F3EE','#D4FF00'], sizes: ['UK 6','UK 7','UK 8','UK 9','UK 10','UK 11'],
    desc: 'Lightweight street runner with cushioned sole. Breathable upper. Perfect for everyday wear and street style.' },
  { id: 'p3', name: 'Sim Wear Cap', type: 'Accessories', category: 'accessories', price: 180, emoji: '🧢', bg: 'p3-bg', badge: 'new',
    img: placeholderImg('simwear-cap-1'), imgAlt: placeholderImg('simwear-cap-1b'),
    colours: ['#1a1a1a','#D4FF00','#FF5C3A'], sizes: ['One Size'],
    desc: 'Structured 6-panel cap. Embroidered SW logo on front. Adjustable strap at back. One size fits all.' },
  { id: 'p4', name: 'Sunset Outfit Set', type: 'Full Outfits', category: 'outfits', price: 1150, emoji: '🔥', bg: 'p4-bg', badge: 'hot',
    img: placeholderImg('simwear-outfit-1'), imgAlt: placeholderImg('simwear-outfit-1b'),
    colours: ['#FF5C3A','#1a1a1a','#FF3DAB'], sizes: ['XS','S','M','L','XL'],
    desc: 'Matching top and bottom set. Bold coral colourway. Premium stretch fabric. Designed to turn heads.' },
  { id: 'p5', name: 'Heavyweight Hoodie', type: 'T-Shirts & Hoodies', category: 'tees', price: 540, emoji: '🧥', bg: 'p5-bg',
    img: placeholderImg('simwear-hoodie-1'), imgAlt: placeholderImg('simwear-hoodie-1b'),
    colours: ['#1a1a1a','#2d4e1b','#1a0e2e'], sizes: ['XS','S','M','L','XL','XXL'],
    desc: '400gsm heavyweight fleece. Kangaroo pocket. Ribbed cuffs and hem. A hoodie built to last.' },
  { id: 'p6', name: 'Chain & Ring Bundle', type: 'Accessories', category: 'accessories', price: 320, oldPrice: 480, emoji: '💍', bg: 'p6-bg', badge: 'sale',
    img: placeholderImg('simwear-jewelry-1'), imgAlt: placeholderImg('simwear-jewelry-1b'),
    colours: ['#C0C0C0','#FFD700'], sizes: ['One Size'],
    desc: 'Stainless steel chain necklace and matching ring. Anti-tarnish coating. Fits most wrist and neck sizes.' },
  { id: 'p7', name: 'Midnight Track Jacket', type: 'Full Outfits', category: 'outfits', price: 780, emoji: '🎽', bg: 'p7-bg',
    img: placeholderImg('simwear-jacket-1'), imgAlt: placeholderImg('simwear-jacket-1b'),
    colours: ['#1a1a1a','#1a0e2e'], sizes: ['S','M','L','XL'],
    desc: 'Lightweight track jacket with zip closure. Contrast stripe detailing. Layers perfectly over any tee.' },
  { id: 'p8', name: 'High-Top Canvas', type: 'Sneakers', category: 'sneakers', price: 650, emoji: '👞', bg: 'p8-bg',
    img: placeholderImg('simwear-canvas-1'), imgAlt: placeholderImg('simwear-canvas-1b'),
    colours: ['#4DDFFF','#F5F3EE','#1a1a1a'], sizes: ['UK 6','UK 7','UK 8','UK 9','UK 10'],
    desc: 'Classic canvas high-tops with rubber sole. Durable laces. A timeless everyday staple.' }
];

const CATEGORIES = [
  { key: 'tees', name: 'Tees & Hoodies', emoji: '👕', css: 'c1', img: placeholderImg('simwear-cat-tees', 500, 400) },
  { key: 'sneakers', name: 'Sneakers', emoji: '👟', css: 'c2', img: placeholderImg('simwear-cat-sneakers', 500, 400) },
  { key: 'accessories', name: 'Accessories', emoji: '💎', css: 'c3', img: placeholderImg('simwear-cat-accessories', 500, 400) },
  { key: 'outfits', name: 'Full Outfit Sets', emoji: '🔥', css: 'c4', img: placeholderImg('simwear-cat-outfits', 500, 400) }
];

const COLOUR_NAMES = {
  '#1a1a1a': 'Black', '#F5F3EE': 'White', '#FF5C3A': 'Coral',
  '#4DDFFF': 'Sky Blue', '#D4FF00': 'Lime', '#FF3DAB': 'Pink',
  '#2d4e1b': 'Forest', '#1a0e2e': 'Midnight', '#C0C0C0': 'Silver', '#FFD700': 'Gold'
};

function categoryCount(key) { return PRODUCTS.filter(p => p.category === key).length; }
function findProduct(id) { return PRODUCTS.find(p => p.id === id); }

/* ── CART STATE (persisted) ── */
let cart = JSON.parse(localStorage.getItem('simwear_cart') || '[]');

function saveCart() { localStorage.setItem('simwear_cart', JSON.stringify(cart)); }

function addToCart(productId, opts = {}) {
  const product = findProduct(productId);
  if (!product) return;
  const size = opts.size || (product.sizes.length === 1 ? product.sizes[0] : null);
  const colour = opts.colour || product.colours[0];
  const qty = opts.qty || 1;
  const label = size && product.sizes.length > 1 ? `${product.name} (${size})` : product.name;
  const key = `${productId}|${size || ''}|${colour}`;

  const existing = cart.find(i => i.key === key);
  if (existing) existing.qty += qty;
  else cart.push({ key, id: productId, name: label, type: product.type, price: product.price, emoji: product.emoji, bg: product.bg, img: product.img, size, colour, qty });

  saveCart();
  renderCartUI();
  bumpCartBadges();
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCartUI();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCartUI();
}

function cartSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function zar(n) { return `R ${n.toLocaleString('en-ZA')}`; }

function bumpCartBadges() {
  ['cartCount', 'bottomCartBadge'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 400);
  });
}

/* ── NAV / CART DRAWER (present on every page) ── */
function updateCounts() {
  const total = cartCount();
  const c1 = document.getElementById('cartCount');
  const c2 = document.getElementById('bottomCartBadge');
  const c3 = document.getElementById('drawerItemCount');
  if (c1) c1.textContent = total;
  if (c2) c2.textContent = total;
  if (c3) c3.textContent = total === 1 ? '1 item' : `${total} items`;
}

function renderCartDrawer() {
  const container = document.getElementById('cartItemsContainer');
  if (!container) return;
  const totalEl = document.getElementById('cartTotal');
  const checkBtn = document.getElementById('checkoutBtn');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Your bag is empty</h3>
        <p>Add some fire fits and come back!</p>
      </div>`;
    if (totalEl) totalEl.textContent = 'R 0';
    if (checkBtn) checkBtn.classList.add('disabled');
    return;
  }

  if (checkBtn) checkBtn.classList.remove('disabled');
  if (totalEl) totalEl.textContent = zar(cartSubtotal());

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img ${item.bg}">
        <span class="product-img-fallback">${item.emoji}</span>
        ${item.img ? `<img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.remove()" />` : ''}
      </div>
      <div class="cart-item-body">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-type">${item.type}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty('${item.key}',-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.key}',1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;">
        <button class="remove-btn" onclick="removeItem('${item.key}')">✕</button>
        <div class="cart-item-price">${zar(item.price * item.qty)}</div>
      </div>
    </div>
  `).join('');
}

function renderCartUI() {
  updateCounts();
  renderCartDrawer();
  if (typeof renderCartPage === 'function') renderCartPage();
}

function openCart() {
  closeMobileMenu();
  const d = document.getElementById('cartDrawer');
  const o = document.getElementById('cartOverlay');
  if (d) d.classList.add('open');
  if (o) o.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  const d = document.getElementById('cartDrawer');
  const o = document.getElementById('cartOverlay');
  if (d) d.classList.remove('open');
  if (o) o.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const hbg = document.getElementById('hamburger');
  const open = menu.classList.toggle('open');
  hbg.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const hbg = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (hbg) hbg.classList.remove('open');
  document.body.style.overflow = '';
}

/* Quick add — used by product-card "+" buttons on grid pages */
function quickAdd(btn, productId) {
  addToCart(productId);
  btn.textContent = '✓';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = '+'; btn.classList.remove('added'); }, 1200);
  openCart();
}

/* Renders a row of product-cards into any container element */
function renderProductCards(container, products) {
  container.innerHTML = products.map(p => `
    <a href="product.html?id=${p.id}" class="product-card">
      <div class="product-img ${p.bg}">
        <span class="product-img-fallback">${p.emoji}</span>
        ${p.img ? `<img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()" />` : ''}
        ${p.badge ? `<span class="badge ${p.badge}">${p.badge === 'hot' ? '🔥 Hot' : p.badge === 'new' ? '✦ New' : '🏷️ Sale'}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-type">${p.type}</div>
        <div class="product-footer">
          <div class="product-price">${zar(p.price)}${p.oldPrice ? `<span class="old">${zar(p.oldPrice)}</span>` : ''}</div>
          <button class="add-btn" onclick="event.preventDefault(); quickAdd(this,'${p.id}')">+</button>
        </div>
      </div>
    </a>
  `).join('');
}

/* Init shared UI on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  renderCartUI();
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a, .bottom-nav-item').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.split('#')[0] === path) a.classList.add('active');
  });
});

