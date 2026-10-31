# 💸 Expense & Budget Visualizer

![Status](https://img.shields.io/badge/Status-Completed-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20Tailwind%20CSS%20%7C%20JS-yellow?style=flat-square)

**Expense & Budget Visualizer** adalah aplikasi web interaktif yang dirancang untuk membantu pengguna melacak pengeluaran harian, memantau sisa anggaran, dan melihat kebiasaan pengeluaran melalui visualisasi grafik yang mudah dipahami. Proyek ini dikembangkan dengan antarmuka yang modern, responsif, dan ramah pengguna.

---

## 🌐 Demo Langsung

Proyek ini telah di-deploy dan dapat diakses langsung melalui GitHub Pages.
👉 **[Buka Expense & Budget Visualizer](https://alfenno17.github.io/CodingCamp-26October26-alfenno/)**

---

## ✨ Fitur Utama

- **💰 Pencatatan Transaksi Dinamis**: Tambahkan transaksi pengeluaran baru dengan form input untuk nama barang, nominal harga, dan kategori (misal: *Food*, *Transport*, dll).
- **🎯 Penetapan Batas Anggaran (Budgeting)**: Pengguna dapat menetapkan batas anggaran (*Spending Limit*) dan melihat total pengeluaran secara real-time.
- **📊 Visualisasi Data Interaktif**: Menampilkan *Pie Chart* dinamis untuk memvisualisasikan persentase pengeluaran berdasarkan kategori.
- **📋 Manajemen Histori Transaksi**: Menampilkan daftar transaksi yang telah diinput. Pengguna dapat mengurutkan (*Sort*) dan menghapus (*Delete*) transaksi dengan mudah.
- **🌓 Mode Terang / Gelap**: Dilengkapi tombol *toggle* tema gelap/terang (Dark Mode) untuk kenyamanan mata pengguna di berbagai kondisi pencahayaan.
- **📱 Responsif**: Tata letak yang beradaptasi secara otomatis untuk layar desktop, tablet, dan smartphone.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan teknologi *frontend* modern:

*   **HTML5**: Struktur semantik halaman web.
*   **CSS3 & Framework (Tailwind CSS)**: Untuk *styling* dan *layouting* yang cepat, responsif, dan konsisten.
*   **Vanilla JavaScript (ES6)**: Untuk logika bisnis, manipulasi DOM (menambah/menghapus transaksi), serta mengelola *state* (total pengeluaran, tema aplikasi).
*   **Library Grafik (Chart.js / sejenisnya)**: Digunakan untuk merender *Pie Chart* pengeluaran secara real-time.

---

## 🚀 Panduan Instalasi (Menjalankan secara Lokal)

Jika Anda ingin mengunduh dan memodifikasi proyek ini di komputer Anda, ikuti langkah-langkah berikut:

1. **Clone Repositori ini:**
   Buka terminal/CMD Anda dan jalankan perintah berikut:
   ```bash
   git clone https://github.com/alfenno17/CodingCamp-26October26-alfenno.git
   ```

2. **Masuk ke Direktori Proyek:**
   ```bash
   cd CodingCamp-26October26-alfenno
   ```

3. **Jalankan Aplikasi:**
   Karena ini adalah aplikasi web statis, Anda cukup membuka file `index.html` menggunakan web browser pilihan Anda (Chrome, Firefox, Safari, dll).
   *Alternatif*: Gunakan ekstensi seperti **Live Server** di VS Code untuk pengalaman *development* yang lebih baik dengan fitur *auto-reload*.

---

## 💡 Cara Penggunaan

1. Buka aplikasi (via Demo Langsung atau Lokal).
2. Di bagian atas, atur **Spending Limit** (Batas Anggaran) Anda, lalu klik tombol **Set**.
3. Pada form **Add Transaction**, masukkan nama barang (Item Name), jumlah pengeluaran (Amount), dan pilih kategori pengeluaran.
4. Klik tombol **Add Transaction**.
5. Transaksi akan muncul di daftar riwayat, dan grafik *Pie Chart* akan otomatis diperbarui untuk merepresentasikan pengeluaran baru Anda.

---

## 👤 Author

Dikembangkan oleh:

**Alfenno Septian Ramadhan**  
Software Engineering Student | Web & Mobile Developer
- GitHub: [@alfenno17](https://github.com/alfenno17)
