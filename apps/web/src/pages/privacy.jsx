import LegalPageLayout from "./legal-page-layout.jsx";

const sections = [
  {
    title: "01  Data yang digunakan",
    body: "Data akun mencakup nama, kontak, kecamatan, dan kredensial. UMKM juga mengirim identitas pemilik, detail usaha, alamat, dan dokumen verifikasi. Informasi listing, klaim, serah terima, serta laporan dicatat untuk menjalankan layanan.",
  },
  {
    title: "02  Tujuan penggunaan",
    body: "Data digunakan untuk membuat akun dan memisahkan akses peran, memverifikasi UMKM, menampilkan listing, mengelola klaim dan serah terima, menindaklanjuti laporan, serta menyusun rekap dampak dan audit.",
  },
  {
    title: "03  Informasi yang terlihat",
    body: "Kontak pribadi tidak ditampilkan pada halaman publik. Informasi yang dibagikan kepada pihak terkait setelah klaim dibatasi pada hal yang diperlukan; aturan dan waktunya masih perlu dikonfirmasi.",
  },
  {
    title: "04  Penyimpanan dan retensi",
    body: "Data disimpan sesuai kebijakan retensi yang berlaku. Jadwal retensi di PRD masih memiliki konflik dan belum dapat dijadikan janji final.",
  },
  {
    title: "05  Permintaan data",
    body: "Profil direncanakan menyediakan pintu masuk untuk mengajukan permintaan data atau penghapusan. Verifikasi identitas, pengecualian retensi, dan status permintaan masih perlu ditetapkan.",
  },
];

const panels = [
  {
    tone: "green",
    title: "Yang terlihat publik",
    body: "Listing dapat menampilkan nama UMKM dan detail makanan. Kontak pribadi tidak ditampilkan di feed publik.",
  },
  {
    tone: "white",
    title: "Permintaan data",
    body: "Kanal dan waktu penyelesaian permintaan akses atau penghapusan data akan dijelaskan setelah kebijakannya ditetapkan.",
  },
];

export default function Privacy() {
  return (
    <LegalPageLayout
      title="Kebijakan Privasi"
      intro="Ringkasan data yang digunakan SIPANA dan hal yang masih perlu ditetapkan sebelum peluncuran."
      sections={sections}
      panels={panels}
      notice="Draf untuk peninjauan legal. Kanal permintaan, masa retensi, penghapusan, dan pengecualian harus disetujui sebelum dipublikasikan."
    />
  );
}
