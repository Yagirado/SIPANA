# Desain Penanganan Laporan dan Moderasi SIPANA

## Tujuan

Membuat laporan dari komunitas maupun UMKM bisa ditinjau sampai tuntas, memberi pihak yang dilaporkan kesempatan menjawab dan banding, serta memastikan laporan yang belum terbukti tidak otomatis merugikan akun, listing, atau angka dampak pangan.

## Kondisi sekarang

- Komunitas dapat melaporkan listing atau klaim melalui `CommunityController::storeReport`.
- UMKM dapat melaporkan kendala pada klaim melalui `UmkmController::storeClaimReport`.
- Laporan disimpan dalam satu tabel dengan status awal `open`.
- Admin hanya dapat melihat antrean dan isi laporan. Belum ada API untuk triase, meminta jawaban, memutuskan, atau menangani banding.
- Komunitas dapat melihat laporan yang ia kirim, tetapi belum mendapat hasil peninjauan.
- UMKM belum mendapat tempat untuk membaca laporan terkait akunnya, menjawab, atau banding.
- Laporan klaim belum menyatakan pihak yang dilaporkan secara eksplisit. Karena itu laporan dari penerima maupun UMKM berisiko diarahkan ke pihak yang salah jika tindakan moderasi ditambahkan tanpa memperjelas subjek.
- Tidak ada tindakan moderasi yang berjalan otomatis dari laporan. Hitungan dampak saat ini berasal dari serah terima yang selesai.

## Prinsip keadilan

1. Laporan adalah dugaan, bukan bukti pelanggaran. Status `open` atau `under_review` tidak mengubah visibilitas akun/listing maupun metrik dampak.
2. Admin menentukan pihak yang dilaporkan berdasarkan objek laporan dan peran pelapor. Laporan listing menyasar pemilik UMKM. Laporan klaim menyasar pihak lain dalam klaim tersebut.
3. Pelapor dapat melihat status dan hasil laporan miliknya. Identitas pelapor dan isi jawaban privat tidak ditampilkan kepada pihak yang dilaporkan. Admin menulis ringkasan tuduhan yang aman dibagikan; uraian asli tidak otomatis dibuka kepada pihak lawan.
4. Pihak yang dilaporkan mendapat ringkasan tuduhan dan kesempatan memberi jawaban sebelum keputusan biasa dibuat. Admin dapat memperpanjang tenggat dan mencatat alasan bila jawaban belum diterima.
5. Sanksi harus beralasan, proporsional, tercatat, dan dapat diajukan banding. Laporan tanpa bukti cukup dapat ditutup tanpa tindakan.
6. Dugaan risiko keamanan pangan yang kredibel dapat membuat listing terkait disembunyikan sementara selama peninjauan cepat. Penahanan ini tidak sama dengan penetapan pelanggaran dan tidak membekukan seluruh akun.
7. Status moderasi dipisahkan dari status transaksi. Listing selesai, klaim selesai, dan porsi yang sudah disalurkan tetap tercatat sebagai dampak historis.

## Alur yang diusulkan

1. **Kirim laporan.** Komunitas atau UMKM memilih satu listing/klaim, kategori, dan uraian. API mencatat reporter, objek, serta `subject_user_id` yang ditentukan server. Klien tidak boleh memilih sendiri siapa yang dikenai laporan.
2. **Antrean admin.** Admin melihat kategori, uraian, waktu, objek, reporter, pihak yang dilaporkan, laporan serupa yang terbuka, dan status. Identitas reporter hanya terlihat untuk admin yang berwenang.
3. **Triase.** Admin memulai pemeriksaan, menandai laporan duplikat/tidak cukup informasi, atau meminta jawaban pihak yang dilaporkan. Setiap perubahan status dan catatan keputusan masuk audit log.
4. **Hak jawab.** UMKM atau anggota komunitas yang dilaporkan melihat ringkasan kasus dan mengirim jawaban teks dari dashboard-nya. Mereka tidak melihat identitas pelapor atau uraian asli yang belum disanitasi.
5. **Keputusan.** Admin memilih tanpa tindakan, teguran, menyembunyikan listing tertentu, atau membatasi akun untuk kasus berat/berulang. Pembatasan berulang hanya menghitung keputusan pelanggaran yang sudah terbukti; laporan mentah atau laporan yang ditutup tanpa tindakan tidak menjadi dasar pembatasan. Keputusan memuat alasan dan pihak admin yang menetapkan.
6. **Banding.** Pihak yang dikenai tindakan dapat mengirim satu banding dalam 7 hari kalender sejak keputusan. Banding diperiksa sebagai tahap baru dan hasilnya dicatat. Bila tersedia, admin yang berbeda meninjau banding.
7. **Hasil bagi pelapor.** Pelapor melihat status akhir dan ringkasan bahwa laporan ditindaklanjuti/tidak terbukti. Pelapor tidak melihat jawaban privat atau detail sanksi yang tidak perlu dibagikan.

### Status kasus

- `open`: baru diterima.
- `under_review`: sedang ditinjau admin.
- `awaiting_response`: menunggu jawaban pihak yang dilaporkan.
- `resolved_no_action`: bukti tidak cukup/tidak ada pelanggaran.
- `resolved_action`: pelanggaran terbukti dan tindakan tercatat.
- `appealed`: pihak yang dikenai tindakan mengajukan banding.
- `appeal_resolved`: banding telah diputuskan.

Status lama `open` dipertahankan agar laporan yang sudah ada tetap dapat dibaca. Saat migrasi, pihak terlapor untuk laporan lama diturunkan dari listing/claim dan peran reporter; kasus yang tidak dapat ditentukan secara aman ditandai untuk triase manual, tanpa tindakan moderasi otomatis. Riwayat status dan pesan disimpan sebagai event kronologis, dengan jenis visibilitas `admin_only`, `reporter_summary`, atau `subject_visible`.

## Konsekuensi moderasi

- Tambahkan status moderasi listing terpisah dari `listings.status`, minimal `active`, `temporarily_hidden`, dan `removed`. Listing transaksi yang sudah selesai tidak dihapus atau diubah statusnya oleh proses laporan.
- Tambahkan status pembatasan akun yang tidak mengubah status verifikasi UMKM. Saat akun dibatasi, akun tetap dapat masuk untuk membaca alasan, menjawab, dan banding, tetapi tidak dapat membuat atau menerbitkan listing baru. Listing aktif terkait dapat disembunyikan sesuai keputusan. Klaim yang sudah berjalan tetap ditangani aman dan tidak dihapus dari histori.
- Tindakan biasa baru diterapkan setelah jawaban diterima atau tenggat jawaban yang ditetapkan admin lewat. Pengecualian hanya penahanan sementara listing untuk risiko keamanan pangan mendesak, dengan alasan, waktu, dan peninjauan lanjutan tercatat.
- Tidak ada skor reputasi publik atau pengurangan angka porsi/pangan tersalurkan dari laporan. Metrik dampak tetap menghitung serah terima yang benar-benar selesai.
- Setiap penahanan, pembukaan kembali, teguran, pembatasan, dan pencabutan tindakan memiliki aktor, waktu, alasan, nilai sebelum/sesudah, serta referensi kasus pada audit log.

## Perubahan teknis yang diharapkan

- Perluasan model/tabel `reports` untuk subjek, ringkasan aman bagi pihak terlapor, status tahap, tenggat jawaban, keputusan, dan tanggal banding.
- Tabel event kasus untuk jawaban, catatan admin, perubahan status, dan keputusan dengan visibilitas yang jelas.
- Status moderasi listing dan akun yang terpisah dari status transaksi dan verifikasi.
- Endpoint terautentikasi untuk triase/keputusan admin, melihat kasus oleh pihak terkait, jawaban, dan banding. Semua endpoint memastikan role dan kepemilikan kasus di server.
- Halaman admin untuk antrean, detail, triase, keputusan, serta banding; halaman komunitas untuk status laporan; area UMKM untuk membaca tuduhan, menjawab, dan banding.
- Validasi panjang teks, pembatasan frekuensi, sanitasi ringkasan yang dibagikan, dan pemisahan data internal dari respons publik.

## Batasan tahap awal

- Tidak ada sanksi otomatis berdasarkan kategori atau jumlah laporan.
- Tidak ada penilaian reputasi publik.
- Tahap awal tidak menerima lampiran; uraian laporan, ringkasan yang dibagikan, jawaban, dan alasan keputusan berupa teks. Lampiran dapat direncanakan kemudian dan harus disimpan privat serta hanya dilayani melalui endpoint berotorisasi.
- Tidak ada janji SLA tetap untuk keputusan admin. Admin menetapkan tenggat jawaban per kasus; tenggat banding adalah 7 hari kalender.

## Kriteria penerimaan

- Laporan dari kedua role masuk antrean dengan pihak yang dilaporkan tepat dan reporter tidak terbuka bagi pihak lawan.
- Status kasus konsisten terlihat oleh admin, pelapor, dan pihak terlapor sesuai batas visibilitas.
- Laporan terbuka, jawaban, dan banding tidak mengubah status listing/akun atau angka dampak.
- Admin dapat merekam hasil tanpa tindakan maupun tindakan beralasan; keputusan dapat dibaca pihak yang terdampak dan diajukan banding dalam tenggat.
- Penahanan darurat hanya berlaku pada listing terkait, tercatat, dan dapat dicabut/diubah oleh admin.
- Listing/claim historis dan angka porsi tersalurkan tetap utuh setelah moderasi.
- Akses lintas akun/role ke laporan, jawaban, dan dokumen privat ditolak server.

## Keputusan yang sudah disepakati

- Banding dapat diajukan satu kali dalam 7 hari kalender setelah keputusan.
- Pilihan hasil admin adalah tanpa tindakan, teguran, sembunyikan listing, atau pembatasan akun untuk kasus berat/berulang.
- Pembatasan akun didasarkan pada pelanggaran yang terbukti. Laporan mentah dan kasus tanpa tindakan tidak dihitung sebagai pelanggaran berulang.
- Tenggat jawaban ditentukan admin per kasus.
- Tahap pertama memakai uraian dan jawaban teks tanpa lampiran.
