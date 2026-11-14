# Format Waktu Indonesia di Form Listing UMKM

## Tujuan

Pemilih waktu pada form posting dan edit listing UMKM menampilkan waktu 24 jam tanpa penanda AM/PM, dengan format lokal Indonesia.

## Desain

- Pertahankan pemilih tanggal bawaan browser untuk waktu masak, awal pengambilan, dan batas pengambilan.
- Pisahkan jam dari pemilih tanggal dan gunakan input teks `HH:mm` dengan validasi 24 jam (00:00–23:59), sehingga tampilan jam tidak bergantung pada locale browser/OS dan tidak menampilkan AM/PM.
- Pertahankan nilai formulir dan payload API yang sudah digunakan (`YYYY-MM-DDTHH:mm`); tidak ada perubahan pada validasi tanggal, zona waktu, atau backend.
- Pertahankan date picker native; tidak menambahkan komponen kalender atau dependensi baru.

## Batasan

Kalender tanggal tetap dibuat oleh browser/OS. Bagian waktu ditampilkan dalam format `HH:mm` yang dikendalikan aplikasi.

## Verifikasi

Periksa ketiga input pada form posting dan edit listing. Pastikan kalender tanggal tetap native, waktu menerima 00:00–23:59 dan menolak format lain, nilai batas minimum/maksimum tetap berlaku, dan payload API tetap memakai format yang sudah ada.
