/**
 * Antigravity Bags - Core Application Logic
 */

// Konfigurasi WhatsApp Admin (Ganti dengan nomor WhatsApp Anda, format 62...)
const WA_ADMIN_NUMBER = "6281234567890";

// State Aplikasi
let currentFilter = "all";
let cart = [];

// DOM Elements
const productsContainer = document.getElementById("productsContainer");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartBadge = document.getElementById("cartBadge");
const btnOpenCart = document.getElementById("btnOpenCart");
const cartDialog = document.getElementById("cartDialog");
const btnCloseCart = document.getElementById("btnCloseCart");
const cartItemsList = document.getElementById("cartItemsList");
const cartEmptyState = document.getElementById("cartEmptyState");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const btnCheckoutWA = document.getElementById("btnCheckoutWA");

// Modal Detail Produk
const productDetailDialog = document.getElementById("productDetailDialog");
const btnCloseDetail = document.getElementById("btnCloseDetail");
const detailBody = document.getElementById("detailModalBody");

// Toast Container
const toastContainer = document.getElementById("toastContainer");

// Format Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Inisialisasi Aplikasi
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  renderProducts();
  setupFilterListeners();
  setupCartModalListeners();
  setupDetailModalListeners();
});

// ==========================================================
// Product Rendering & Filtering
// ==========================================================
function renderProducts() {
  if (!productsContainer) return;

  const filtered = currentFilter === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentFilter);

  if (filtered.length === 0) {
    productsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p>Tidak ada produk tas dalam kategori ini.</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = filtered.map(product => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-thumb">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="badge-tag">${product.badge}</span>` : ""}
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="product-cat">${getCategoryLabel(product.category)}</span>
          <span class="product-rating">★ ${product.rating}</span>
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc-snippet">${product.description}</p>
        <div class="product-bottom">
          <div class="product-price">${formatRupiah(product.price)}</div>
          <div class="card-actions">
            <button class="btn-icon-action btn-detail" title="Detail Produk" onclick="openProductDetail('${product.id}')">
              👁️
            </button>
            <button class="btn-icon-action btn-add-cart" onclick="addToCart('${product.id}')">
              <span>+</span> Keranjang
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join("");
}

function getCategoryLabel(cat) {
  switch (cat) {
    case "backpack": return "Backpack";
    case "sling": return "Sling & Waist";
    case "tote": return "Tote Bag";
    case "travel": return "Travel / Duffle";
    default: return cat;
  }
}

function setupFilterListeners() {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderProducts();
    });
  });
}

// ==========================================================
// Cart Logic
// ==========================================================
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("antigravity_cart");
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Gagal membaca keranjang belanja:", e);
    cart = [];
  }
  updateCartBadge();
}

function saveCartToStorage() {
  try {
    localStorage.setItem("antigravity_cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Gagal menyimpan keranjang belanja:", e);
  }
  updateCartBadge();
}

function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "flex" : "none";
  }
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }

  saveCartToStorage();
  showToast(`"${product.name}" ditambahkan ke keranjang`);
}

function changeItemQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCartToStorage();
  renderCartModal();
}

function removeItemFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCartToStorage();
  renderCartModal();
  showToast("Item dihapus dari keranjang");
}

function renderCartModal() {
  if (!cartItemsList) return;

  if (cart.length === 0) {
    cartItemsList.innerHTML = "";
    if (cartEmptyState) cartEmptyState.style.display = "block";
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatRupiah(0);
    if (btnCheckoutWA) btnCheckoutWA.style.display = "none";
    return;
  }

  if (cartEmptyState) cartEmptyState.style.display = "none";
  if (btnCheckoutWA) btnCheckoutWA.style.display = "flex";

  let subtotal = 0;
  cartItemsList.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)} x ${item.qty} = <strong>${formatRupiah(itemTotal)}</strong></div>
        </div>
        <div class="cart-qty-controls">
          <button class="btn-qty" onclick="changeItemQty('${item.id}', -1)">-</button>
          <span class="cart-qty-val">${item.qty}</span>
          <button class="btn-qty" onclick="changeItemQty('${item.id}', 1)">+</button>
        </div>
        <button class="btn-remove-item" title="Hapus" onclick="removeItemFromCart('${item.id}')">🗑️</button>
      </div>
    `;
  }).join("");

  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = formatRupiah(subtotal);
  }
}

// ==========================================================
// WhatsApp Checkout Link Generation
// ==========================================================
function checkoutViaWhatsApp() {
  if (cart.length === 0) return;

  let message = "Halo Admin *Antigravity Bags*! 👋\n";
  message += "Saya ingin memesan produk berikut dari website:\n\n";

  let totalOrder = 0;
  cart.forEach((item, index) => {
    const lineTotal = item.price * item.qty;
    totalOrder += lineTotal;
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Jumlah: ${item.qty} pcs\n`;
    message += `   Subtotal: ${formatRupiah(lineTotal)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL PESANAN: ${formatRupiah(totalOrder)}*\n\n`;
  message += `Mohon konfirmasi ketersediaan stok & ongkos kirim ke alamat saya. Terima kasih! 🙏`;

  const waUrl = `https://wa.me/${WA_ADMIN_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

// ==========================================================
// Modal Handlers (<dialog>)
// ==========================================================
function setupCartModalListeners() {
  if (btnOpenCart && cartDialog) {
    btnOpenCart.addEventListener("click", () => {
      renderCartModal();
      cartDialog.showModal();
    });
  }

  if (btnCloseCart && cartDialog) {
    btnCloseCart.addEventListener("click", () => {
      cartDialog.close();
    });
  }

  // Light dismiss on click outside
  if (cartDialog) {
    cartDialog.addEventListener("click", (e) => {
      const rect = cartDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        cartDialog.close();
      }
    });
  }

  if (btnCheckoutWA) {
    btnCheckoutWA.addEventListener("click", checkoutViaWhatsApp);
  }
}

function openProductDetail(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product || !productDetailDialog || !detailBody) return;

  detailBody.innerHTML = `
    <div class="detail-modal-layout">
      <div>
        <img src="${product.image}" alt="${product.name}" class="detail-img">
      </div>
      <div>
        <span class="product-cat">${getCategoryLabel(product.category)}</span>
        <h2 style="font-size: 1.4rem; margin: 6px 0 10px; color: var(--primary);">${product.name}</h2>
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent); margin-bottom: 12px;">
          ${formatRupiah(product.price)}
        </div>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">
          ${product.description}
        </p>

        <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--primary); margin-bottom: 6px;">
          Spesifikasi Teknis
        </h4>
        <table class="detail-specs-table">
          <tr>
            <td>Material</td>
            <td>${product.specs.material}</td>
          </tr>
          <tr>
            <td>Kapasitas</td>
            <td>${product.specs.capacity}</td>
          </tr>
          <tr>
            <td>Dimensi</td>
            <td>${product.specs.dimensions}</td>
          </tr>
          <tr>
            <td>Slot Laptop / Fitur</td>
            <td>${product.specs.laptopSlot}</td>
          </tr>
          <tr>
            <td>Berat Tas</td>
            <td>${product.specs.weight}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; display: flex; gap: 12px;">
          <button class="btn btn-primary" style="flex: 1;" onclick="addToCart('${product.id}'); productDetailDialog.close();">
            + Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  `;

  productDetailDialog.showModal();
}

function setupDetailModalListeners() {
  if (btnCloseDetail && productDetailDialog) {
    btnCloseDetail.addEventListener("click", () => {
      productDetailDialog.close();
    });
  }

  if (productDetailDialog) {
    productDetailDialog.addEventListener("click", (e) => {
      const rect = productDetailDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        productDetailDialog.close();
      }
    });
  }
}

// ==========================================================
// Toast Notification
// ==========================================================
function showToast(message) {
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}
