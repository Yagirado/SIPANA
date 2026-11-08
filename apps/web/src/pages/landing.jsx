import Nav from "../components/nav.jsx";
import Footer from "../components/footer.jsx";

const steps = [
  {
    number: "01",
    title: "Temukan",
    description:
      "Jelajahi surplus pangan yang dibagikan UMKM di sekitar Karawang.",
  },
  {
    number: "02",
    title: "Ajukan klaim",
    description:
      "Masuk atau daftar untuk mengajukan klaim pada listing yang tersedia.",
  },
  {
    number: "03",
    title: "Ambil langsung",
    description: "Datang ke UMKM sesuai waktu pengambilan yang tercantum.",
  },
];

const reasons = [
  {
    number: "01",
    title: "Pemberi yang jelas",
    description:
      "Listing berasal dari UMKM kuliner yang identitas usahanya telah diverifikasi.",
  },
  {
    number: "02",
    title: "Info penting terlihat",
    description:
      "Lihat jenis dan jumlah makanan, waktu memasak, peruntukan, serta jadwal pengambilan.",
  },
  {
    number: "03",
    title: "Berbagi tanpa biaya",
    description:
      "Pangan dibagikan gratis dan diambil langsung di lokasi UMKM—tanpa layanan antar.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F5F7F1] font-sans text-[#183A2E] antialiased">
      <Nav isLanding />

      <main id="atas">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:py-10">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#1C6B4A]">
              Pangan berlebih, manfaat bersama
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">
              Makanan baik, dibagikan dekatmu.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#52645A] sm:text-lg sm:leading-8">
              Temukan surplus pangan dari UMKM kuliner terverifikasi di
              Karawang. Gratis untuk penerima, dengan jadwal pengambilan yang
              jelas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                className="rounded-lg bg-[#1C6B4A] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#183A2E]"
                href="#cara-kerja"
              >
                Jelajahi Makanan 
              </a>
            </div>
          </div>

          <aside
            aria-label="Contoh informasi pada listing SIPANA"
            className="rounded-2xl border border-[#DDE5DC] bg-white p-6 sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#63756B]">
              Contoh informasi listing
            </p>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Roti gandum segar</h2>
                <p className="mt-1 text-sm text-[#52645A]">Dapur Bu Wati</p>
              </div>
              <span className="rounded-full bg-[#E6F3E9] px-3 py-1.5 text-xs font-semibold text-[#236644]">
                UMKM terverifikasi
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#DDE5DC] pt-5 text-sm">
              <div>
                <dt className="text-[#63756B]">Jumlah</dt>
                <dd className="mt-1 font-semibold">6 porsi</dd>
              </div>
              <div>
                <dt className="text-[#63756B]">Waktu memasak</dt>
                <dd className="mt-1 font-semibold">12.30 WIB</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#63756B]">Waktu pengambilan</dt>
                <dd className="mt-1 font-semibold">
                  Hari ini, 16.00–18.00 WIB
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#63756B]">Peruntukan</dt>
                <dd className="mt-1 font-semibold">Untuk konsumsi</dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-5 text-[#63756B]">
              Ilustrasi informasi, bukan listing yang sedang tersedia.
            </p>
          </aside>
        </section>

        <section
          id="tentang"
          className="scroll-mt-8 border-y border-[#DDE5DC] bg-white"
        >
          <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-16 lg:px-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1C6B4A]">
                Tentang SIPANA
              </p>
              <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Surplus pangan punya kesempatan untuk dibagikan.
              </h2>
            </div>
            <div className="max-w-2xl text-base leading-7 text-[#52645A]">
              <p>
                SIPANA (Sistem Informasi Pangan Berlebih) menghubungkan UMKM
                kuliner di Karawang dengan warga yang ingin menerima surplus
                pangan. UMKM mencantumkan informasi makanan dan waktu
                pengambilan agar warga dapat meninjaunya sebelum mengajukan
                klaim.
              </p>
              <p className="mt-4">
                Dengan daftar yang lebih terstruktur, penyaluran tidak hanya
                bergantung pada kabar dari lingkungan terdekat. SIPANA memulai
                uji coba di Karawang Barat, Telukjambe Timur, dan Karawang
                Timur.
              </p>
            </div>
          </div>
        </section>

        <section
          id="cara-kerja"
          className="scroll-mt-8 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1C6B4A]">
              Cara kerja
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Tiga langkah untuk mengambil surplus pangan.
            </h2>
          </div>
          <ol className="mt-10 grid gap-0 md:grid-cols-3 md:divide-x md:divide-[#DDE5DC]">
            {steps.map((step, index) => (
              <li
                className={`border-t border-[#DDE5DC] py-6 md:border-t-0 md:px-7 md:py-2 ${index === 0 ? "md:pl-0" : ""} ${index === steps.length - 1 ? "md:pr-0" : ""}`}
                key={step.number}
              >
                <p className="text-sm font-bold tabular-nums text-[#1C6B4A]">
                  {step.number}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#52645A]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="kenapa-sipana"
          className="scroll-mt-8 bg-[#183A2E] text-white"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#D8F279]">
                Kenapa SIPANA?
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Berbagi pangan dengan informasi yang lebih jelas.
              </h2>
            </div>
            <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/20">
              {reasons.map((reason, index) => (
                <li
                  className={`md:px-7 ${index === 0 ? "md:pl-0" : ""} ${index === reasons.length - 1 ? "md:pr-0" : ""}`}
                  key={reason.number}
                >
                  <p className="text-sm font-bold tabular-nums text-[#D8F279]">
                    {reason.number}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/85">
                    {reason.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-3xl border-t border-white/20 pt-5 text-sm leading-6 text-white/80">
              Verifikasi menunjukkan identitas UMKM, bukan pemeriksaan kondisi
              makanan oleh SIPANA. Tinjau informasi dan pernyataan pemberi
              sebelum mengambil keputusan.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
