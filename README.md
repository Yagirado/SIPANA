# SIPANA 🥖🥯🍚

### Surplus pangan, manfaat nyata untuk sekitar.

SIPANA (*Sistem Informasi Pangan Berlebih*) adalah platform web yang dirancang untuk menghubungkan UMKM kuliner terverifikasi di Kabupaten Karawang dengan warga yang ingin mengambil surplus pangan.


## Gambaran Umum

SIPANA ingin membuat surplus pangan lebih mudah ditemukan dan dibagikan melalui informasi listing, jadwal pengambilan, verifikasi UMKM, dan pencatatan serah terima.

Wilayah layanan mencakup Karawang Barat, Telukjambe Timur, dan Karawang Timur. Pengunjung dapat menjelajah tanpa akun; klaim memerlukan akun anggota.

## Fitur

Ruang lingkup produk yang direncanakan dalam PRD meliputi:

- Menjelajah listing surplus yang tersedia, dengan filter kecamatan dan peruntukan sesuai cakupan yang disetujui.
- Pendaftaran anggota, klaim makanan, detail pengambilan, serta riwayat klaim.
- Pendaftaran dan verifikasi UMKM, pembuatan listing, edit, penarikan, dan berbagi ke WhatsApp jika fitur tersebut diaktifkan.
- Konfirmasi serah terima, penanganan listing kedaluwarsa dan no-show, serta pelaporan masalah keamanan atau listing.
- Verifikasi dan moderasi oleh admin, rekap dampak, ekspor data terstruktur, dan audit log.
- Tampilan web responsif serta akses offline baca-saja untuk listing yang pernah dibuka.


## Teknologi

- **Web:** React 19, Vite 8, Tailwind CSS 4, dan ESLint.
- **API:** Laravel 13, PHP 8.3+, dan Laravel Sanctum.
- **Workspace:** pnpm; Composer mengelola dependensi PHP.
- **Database lokal:** konfigurasi contoh `apps/api/.env.example` menggunakan MySQl.

## Struktur Proyek

```text
.
|-- apps/
|   |-- api/                  # Aplikasi Laravel, route, migrasi, dan pengujian
|   `-- web/                  # Aplikasi React dan Vite
|       `-- src/              # Entry aplikasi, style, komponen, dan halaman
|-- docs/                     # Dokumen kebutuhan produk dan desain
|-- package.json              # Skrip pengembangan root
|-- pnpm-workspace.yaml       # Definisi workspace
`-- pnpm-lock.yaml            # Lockfile dependensi JavaScript
```

## Mulai

### Prasyarat

- Node.js `^20.19.0` atau `>=22.12.0` (sesuai kebutuhan Vite yang terpasang) dan pnpm.
- PHP 8.3 atau lebih baru, Composer, serta dukungan SQLite di PHP untuk konfigurasi lokal.

### Instalasi dan konfigurasi

Pasang dependensi JavaScript dari direktori root:

```bash
pnpm install
```

Di Windows PowerShell, siapkan Laravel API. Perintah pertama tidak menimpa `.env` yang sudah ada:

```powershell
if (!(Test-Path apps/api/.env)) { Copy-Item apps/api/.env.example apps/api/.env }
Set-Location apps/api
composer install
php artisan key:generate
php artisan migrate
Set-Location ../..
```

### Jalankan saat pengembangan

Jalankan API dan web di dua terminal terpisah dari direktori root:

```bash
pnpm dev:api
pnpm dev:web
```

`pnpm dev:api` menjalankan `php artisan serve`; `pnpm dev:web` menjalankan Vite. Skrip web tambahan:

```bash
pnpm --filter @sipana/web build
pnpm --filter @sipana/web lint
```

## Dokumentasi

- [Dokumen Kebutuhan Produk (PRD)](docs/PRD.md)
- [Brief Desain Produk](docs/design-brief.md)
- [Dokumen Desain Sistem (Bahasa Indonesia)](docs/sipana_dokumen_desain_sistem.md)
