# 🌟 WetoMind AI

**WetoMind AI** adalah platform chatbot berbasis kecerdasan buatan (AI) yang menggabungkan kearifan lokal budaya Jawa (Kalender Jawa, Weton, Primbon) dengan teknologi modern **Google Gemini API**. Platform ini dirancang untuk memberikan analisis personal secara cepat, interaktif, mendalam, dan mudah dipahami oleh generasi modern.

---

## 🚀 Fitur Utama

WetoMind AI memiliki beberapa fitur unggulan yang dirancang untuk membantu pengguna memahami potensi diri dan dinamika hubungan mereka:

1. **Kalkulator Weton Otomatis**
   Menghitung hari lahir Jawa, pasaran, neptu hari, neptu pasaran, dan total neptu secara presisi berdasarkan tanggal lahir masehi.
2. **Bedah Karakter (Character Analysis)**
   Mengupas tuntas kelebihan, watak tersembunyi, serta sisi unik kepribadian pengguna berdasarkan weton lahir.
3. **Kompas Karir (Career Guidance)**
   Rekomendasi jenis pekerjaan, bidang usaha, serta cara terbaik untuk menjemput rezeki sesuai dengan neptu dan weton.
4. **Peta Perbaikan (Self Improvement)**
   Panduan personal untuk mengenali kelemahan diri, cara mengelola emosi, dan solusi atas tantangan hidup terbesar.
5. **Uji Jodoh (Love Compatibility)**
   Menganalisis tingkat kecocokan asmara dengan pasangan berdasarkan perhitungan neptu pembagian sembilan (menghasilkan status seperti *Jodoh, Ratu, Topo, Tinari, Pegat, Padu, Sujanan, atau Pesthi*).
6. **Sinergi Rekan (Business Partnership)**
   Analisis kecocokan kemitraan bisnis dan pembagian peran yang ideal antar rekan kerja untuk meminimalkan konflik dan memaksimalkan potensi sukses.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan ekosistem teknologi web modern:

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router) dengan [TypeScript](https://www.typescriptlang.org/)
- **Kecerdasan Buatan:** [Google Gemini API](https://ai.google.dev/) (menggunakan SDK resmi `@google/genai`)
- **Styling & Desain:** [Tailwind CSS v4](https://tailwindcss.com/) dengan custom theme yang elegan dan responsif
- **Animasi:** [Motion](https://motion.dev/) (untuk transisi antar halaman dan interaksi chatbot yang interaktif)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Struktur Direktori

Berikut adalah gambaran umum struktur folder penting dalam proyek ini:

```text
├── app/                  # Router Next.js (App Router)
│   ├── api/              # API Routes (termasuk integrasi server-side Gemini API)
│   ├── privasi/          # Halaman Kebijakan Privasi
│   ├── tentang/          # Halaman Tentang Kami
│   ├── globals.css       # File style global Tailwind
│   └── page.tsx          # Halaman utama aplikasi
├── components/           # Komponen React reusable
│   ├── ui/               # Komponen dasar UI (DatePicker, Button, dll.)
│   ├── layouts/          # Navbar, Footer, dll.
│   ├── sections/         # Seksi halaman utama (Hero, Features, FAQ, dll.)
│   ├── ChatPanel.tsx     # Panel utama interaksi konsultasi chatbot
│   └── ChatBubble.tsx    # Balon chat user dan AI
├── hooks/                # Custom React hooks
├── lib/                  # Logika utilitas (Kalkulator kalender Jawa)
│   └── javaCalendar.ts   # Algoritma perhitungan weton & kecocokan jodoh
├── types/                # Definisi tipe TypeScript
└── metadata.json         # Metadata manifest aplikasi
```

---

## ⚙️ Panduan Memulai

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- NPM atau Yarn / Pnpm

### Langkah-langkah Instalasi

1. **Kloning Repositori**
   ```bash
   git clone <url-repositori-anda>
   cd wetomind-ai
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**
   Salin file `.env.example` menjadi `.env.local` or `.env`:
   ```bash
   cp .env.example .env.local
   ```
   Buka file `.env.local` dan masukkan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY=isi_dengan_gemini_api_key_anda
   ```

4. **Jalankan Aplikasi Mode Pengembangan**
   ```bash
   npm run dev
   ```
   Aplikasi Anda sekarang dapat diakses melalui browser di alamat [http://localhost:3000](http://localhost:3000).

5. **Build untuk Produksi**
   Jika ingin melakukan kompilasi aplikasi untuk mode produksi:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧮 Cara Kerja Perhitungan Weton

Aplikasi ini menggunakan algoritma berbasis selisih hari dari titik acuan (Epoch).
- **Titik Acuan (Epoch):** 1 Januari 1970 masehi bertepatan dengan **Kamis Pahing**.
- **Perhitungan Hari:** Menggunakan sisa pembagian dari total selisih hari untuk memetakan hari dalam seminggu (Minggu s.d. Sabtu) beserta nilai Neptunya.
- **Perhitungan Pasaran:** Menggunakan sisa pembagian 5 untuk memetakan pasaran Jawa (*Pahing, Pon, Wage, Kliwon, Legi*) beserta nilai Neptunya.
- **Perhitungan Jodoh:** Menjumlahkan Neptu kedua pasangan lalu dihitung dengan sisa pembagian 9 (atau sisa matematika tertentu) untuk mendapatkan kategori kecocokan adat Jawa Primbon.

---

## 🔒 Privasi dan Keamanan
Semua data konsultasi (seperti nama, tanggal lahir, dan riwayat obrolan) disimpan secara lokal di sesi browser pengguna (`sessionStorage`) dan tidak disimpan secara permanen di server kami demi menjaga privasi pengguna.
