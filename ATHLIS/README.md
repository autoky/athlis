# 🎒 Antigravity Bags — Official Website Project

Website e-commerce dan landing page brand tas modern (*Antigravity Bags*), dibuat dengan arsitektur HTML5 semantik, CSS3 modern (*responsive grid & glassmorphism*), serta JavaScript modular tanpa dependensi pihak ketiga.

---

## 📁 Struktur Folder

```
d:\RIPKI\ANTIGRAVITY_WEB\
├── index.html            # Halaman utama (Hero, Katalog, Keunggulan, Ulasan, Kontak)
├── README.md             # Petunjuk penggunaan & konfigurasi
├── css/
│   └── style.css         # Styling modern, responsive layout, animatif & modal
├── js/
│   ├── products.js       # Database katalog produk tas (spesifikasi, foto, harga)
│   └── app.js            # Interaksi katalog, keranjang belanja, checkout WhatsApp
└── assets/               # Folder aset gambar & ikon kustom
```

---

## 🚀 Cara Menjalankan Website

1. **Buka Langsung di Browser**:
   - Buka File Explorer di Windows, masuk ke folder `d:\RIPKI\ANTIGRAVITY_WEB\`.
   - Klik ganda file `index.html`, halaman website akan langsung terbuka di Google Chrome / Edge / browser favorit Anda.
2. **Menggunakan Live Server (VS Code / Antigravity)**:
   - Buka folder `ANTIGRAVITY_WEB` di editor kode.
   - Klik kanan pada `index.html` dan pilih **"Open with Live Server"**.

---

## ⚙️ Panduan Kustomisasi

### 1. Mengubah Nomor WhatsApp Admin
Buka file `js/app.js`, ubah baris nomor WhatsApp:
```javascript
const WA_ADMIN_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp aktif Anda (awali dengan 62)
```

### 2. Menambah / Mengedit Produk Tas
Buka file `js/products.js`. Setiap produk didefinisikan dalam format objek:
```javascript
{
  id: "bag-07",
  name: "Nama Tas Baru",
  category: "backpack", // Pilihan: "backpack", "sling", "tote", "travel"
  price: 350000,
  rating: 4.9,
  badge: "Best Seller",
  image: "URL_GAMBAR_PRODUK",
  description: "Deskripsi singkat tas...",
  specs: {
    material: "Cordura 1000D",
    capacity: "25 Liter",
    dimensions: "45 x 30 x 15 cm",
    laptopSlot: "Hingga 15.6 inch",
    weight: "700 gram"
  }
}
```

---

## ✨ Fitur Unggulan
- **Responsive & Mobile-Ready**: Tampilan rapi dan nyaman dibuka dari smartphone, tablet, maupun layar desktop besar.
- **Katalog & Filter Interaktif**: Filter instan untuk kategori Backpack, Sling Bag, Tote Bag, dan Duffle Travel Bag.
- **Modern `<dialog>` Modal**: Popup detail spesifikasi teknis dan drawer keranjang belanja menggunakan standar native HTML5 dialog.
- **Keranjang Belanja LocalStorage**: Keranjang belanja tersimpan otomatis di browser sehingga tidak hilang saat halaman di-refresh.
- **Checkout WhatsApp Otomatis**: Tombol pemesanan langsung merangkum nama produk, jumlah barang, dan total harga ke pesan WhatsApp admin secara rapi.
