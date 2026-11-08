import LegalPageLayout from "./legal-page-layout.jsx";

const sections = [
  {
    title: "01  Ruang lingkup SIPANA",
    body: "SIPANA menghubungkan UMKM kuliner yang membagikan pangan berlebih dengan warga penerima. Layanan ini gratis dan pengambilan dilakukan langsung di lokasi UMKM.",
  },
  {
    title: "02  Akun dan peran pengguna",
    body: "Pengguna memberikan informasi akun yang benar. UMKM dapat memasang listing setelah identitas usaha diverifikasi oleh admin; warga dapat menjelajahi listing secara publik.",
  },
  {
    title: "03  Informasi listing",
    body: "UMKM mencantumkan jenis makanan, jumlah, waktu memasak, peruntukan, dan waktu pengambilan. Tinjau informasi tersebut sebelum mengajukan klaim.",
  },
  {
    title: "04  Klaim dan pengambilan",
    body: "Klaim diajukan melalui SIPANA. Pangan diambil langsung dari UMKM sesuai waktu yang tercantum. Besaran kuota, pembatalan, dan no-show masih menunggu keputusan produk.",
  },
  {
    title: "05  Kondisi pangan dan pelaporan",
    body: "Verifikasi SIPANA memeriksa identitas UMKM, bukan kondisi atau keamanan pangan. Pengguna dapat menggunakan fitur Lapor; kategori dan tindak lanjutnya perlu mengikuti kebijakan final.",
  },
];

const panels = [
  {
    tone: "green",
    title: "Penting untuk diketahui",
    body: "Pangan dibagikan gratis dan diambil langsung di lokasi UMKM. SIPANA tidak menyediakan pembayaran atau pengantaran.",
  },
  {
    tone: "white",
    title: "Kebijakan Privasi",
    body: "Pelajari ringkasan penggunaan data akun, informasi yang terlihat publik, dan hal-hal yang masih menunggu keputusan.",
    action: { label: "Baca Kebijakan Privasi", href: "/kebijakan-privasi" },
  },
];

export default function Terms() {
  return (
    <LegalPageLayout
      title="Ketentuan Pengguna"
      intro="Aturan dasar bagi warga penerima dan UMKM yang menggunakan SIPANA."
      sections={sections}
      panels={panels}
      notice="Draf untuk peninjauan legal. Ketentuan dan penafian tanggung jawab masih perlu ditinjau dan disetujui sebelum peluncuran."
    />
  );
}
