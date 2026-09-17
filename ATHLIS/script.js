/* ============================================================
   ATHLIS — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Data produk ---------------- */
  const products = [
    {
      cat: 'Tote Harian',
      name: 'Sagara Tote',
      desc: 'Tote lapang berbahan kulit nabati, cocok untuk kerja maupun akhir pekan.',
      price: 'Rp 1.850.000',
      icon: 'tote'
    },
    {
      cat: 'Ransel Kota',
      name: 'Giri Backpack',
      desc: 'Ransel full-grain dengan kompartemen laptop dan bukaan magnetik.',
      price: 'Rp 2.450.000',
      icon: 'backpack'
    },
    {
      cat: 'Tas Selempang',
      name: 'Wulan Sling',
      desc: 'Selempang minimalis untuk kebutuhan ringkas sehari-hari.',
      price: 'Rp 1.250.000',
      icon: 'sling'
    },
    {
      cat: 'Clutch Pesta',
      name: 'Kanaya Clutch',
      desc: 'Clutch suede lembut dengan detail jahitan tangan di setiap sisi.',
      price: 'Rp 980.000',
      icon: 'clutch'
    },
    {
      cat: 'Tas Perjalanan',
      name: 'Arya Weekender',
      desc: 'Tas travel akhir pekan dengan ruang sepatu terpisah.',
      price: 'Rp 3.200.000',
      icon: 'weekender'
    },
    {
      cat: 'Mini Serbaguna',
      name: 'Nirmala Mini',
      desc: 'Tas mini ringkas untuk esensial harian yang ringkas dan rapi.',
      price: 'Rp 1.050.000',
      icon: 'mini'
    }
  ];

  const icons = {
    tote: `<path d="M28 42 Q28 20 50 20 Q72 20 72 42"/><rect x="18" y="42" width="64" height="52" rx="4"/><path d="M18 58 H82" stroke-dasharray="4 5" opacity=".6"/>`,
    backpack: `<path d="M35 30 Q35 16 50 16 Q65 16 65 30" /><rect x="25" y="30" width="50" height="60" rx="10"/><rect x="38" y="46" width="24" height="16" rx="3" opacity=".6"/><path d="M25 40 h-4 v20 h4" opacity=".6"/><path d="M75 40 h4 v20 h-4" opacity=".6"/>`,
    sling: `<path d="M22 20 L50 46 L78 20" opacity=".7"/><rect x="30" y="46" width="40" height="34" rx="6"/><path d="M30 60 H70" stroke-dasharray="4 5" opacity=".6"/>`,
    clutch: `<rect x="22" y="38" width="56" height="36" rx="5"/><path d="M50 38 V26 Q50 20 58 20 H68" opacity=".7"/><circle cx="50" cy="56" r="4" opacity=".6"/>`,
    weekender: `<rect x="16" y="36" width="68" height="40" rx="14"/><path d="M34 36 Q34 22 50 22 Q66 22 66 36" /><path d="M16 56 H84" stroke-dasharray="4 5" opacity=".5"/>`,
    mini: `<path d="M36 34 Q36 22 50 22 Q64 22 64 34"/><rect x="28" y="34" width="44" height="40" rx="6"/><path d="M28 48 H72" stroke-dasharray="4 5" opacity=".6"/>`
  };

  const grid = document.getElementById('productGrid');

  const svgWrap = (inner) =>
    `<svg viewBox="0 0 100 100" fill="none" stroke="var(--gold)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

  products.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.innerHTML = `
      <div class="product-media">
        ${svgWrap(icons[p.icon])}
        <button class="wishlist" aria-label="Tambah ke wishlist" data-index="${i}">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.3-8.8C1 8 2.4 4.8 5.6 4.1 7.8 3.6 10 4.6 12 7c2-2.4 4.2-3.4 6.4-2.9 3.2.7 4.6 3.9 2.9 7.1C19 15.4 12 20 12 20z"/></svg>
        </button>
      </div>
      <p class="product-eyebrow">${p.cat}</p>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-footer">
        <span class="product-price">${p.price}</span>
        <button class="btn btn-primary btn-small add-to-cart" data-name="${p.name}">Tambah</button>
      </div>
    `;
    grid.appendChild(card);
  });

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Menu mobile ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMobile = document.getElementById('navMobile');

  const closeMenu = () => {
    menuToggle.classList.remove('open');
    navMobile.classList.remove('open');
  };

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navMobile.classList.toggle('open');
  });

  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------------- Scroll reveal + stitch draw-in ---------------- */
  const revealTargets = document.querySelectorAll('.reveal, .stitch, .process-step');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------- Wishlist toggle ---------------- */
  grid.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('.wishlist');
    if (wishBtn) {
      wishBtn.classList.toggle('active');
      return;
    }

    const cartBtn = e.target.closest('.add-to-cart');
    if (cartBtn) {
      incrementCart();
      showToast(`${cartBtn.dataset.name} ditambahkan ke keranjang`);
    }
  });

  /* ---------------- Cart counter ---------------- */
  let cartCount = 0;
  const cartCountEl = document.getElementById('cartCount');

  function incrementCart() {
    cartCount += 1;
    cartCountEl.textContent = cartCount;
  }

  /* ---------------- Toast ---------------- */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------------- Newsletter ---------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    if (!email) return;

    newsletterMsg.textContent = `Terima kasih! Kami akan mengirim kabar terbaru ke ${email}.`;
    emailInput.value = '';
  });

  /* ---------------- Tahun footer ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
