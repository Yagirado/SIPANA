import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, MapPin, Store } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { DashboardState } from "./dashboard-state.jsx";

const views = {
  community: {
    endpoint: "/api/community/dashboard",
    eyebrow: "WARGA · BERANDA",
    heading: "Temukan surplus di sekitar",
    description: "Jelajahi pangan berlebih dari UMKM terverifikasi di wilayah Karawang.",
    icon: MapPin,
    sections: [
      { title: "Temukan makanan", description: "Daftar makanan dan filter kecamatan tersedia setelah API listing terhubung." },
      { title: "Klaim saya", description: "Riwayat dan status pengambilan muncul setelah alur klaim tersedia." },
    ],
  },
  umkm: {
    endpoint: "/api/umkm/dashboard",
    eyebrow: "UMKM · RINGKASAN USAHA",
    heading: "Kelola surplus usaha",
    description: "Pantau kesiapan akun dan pengelolaan pangan berlebih dari satu tempat.",
    icon: Store,
    sections: [
      { title: "Status verifikasi", description: "Status dan alasan verifikasi akan muncul setelah profil UMKM terhubung." },
      { title: "Listing dan klaim masuk", description: "Pengelolaan listing dan klaim tersedia pada tahap integrasi workflow berikutnya." },
    ],
  },
  admin: {
    endpoint: "/api/admin/dashboard",
    eyebrow: "ADMIN · RINGKASAN",
    heading: "Pantau operasi SIPANA",
    description: "Ruang kerja admin untuk menjaga proses verifikasi dan penyaluran tetap tertata.",
    icon: ClipboardList,
    sections: [
      { title: "Verifikasi UMKM", description: "Antrean dan tindakan verifikasi akan muncul setelah API administrasi tersedia." },
      { title: "Moderasi dan laporan", description: "Data dan alur moderasi belum tersedia pada tahap ini." },
    ],
  },
};

export function DashboardOverview({ role }) {
  const { user, refresh } = useAuth();
  const view = views[role];
  const [state, setState] = useState({ status: "loading", error: "" });

  useEffect(() => {
    let active = true;
    apiRequest(view.endpoint)
      .then(() => {
        if (active) setState({ status: "ready", error: "" });
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          void refresh();
          return;
        }
        setState({ status: "error", error: error.message });
      });

    return () => {
      active = false;
    };
  }, [view.endpoint, refresh]);

  async function retry() {
    setState({ status: "loading", error: "" });
    try {
      await apiRequest(view.endpoint);
      setState({ status: "ready", error: "" });
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        await refresh();
        return;
      }
      setState({ status: "error", error: error.message });
    }
  }

  const GreetingIcon = view.icon;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#1C6B4A]">{view.eyebrow}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-[#183A2E] sm:text-3xl">{view.heading}</h2>
          <p className="mt-2 text-sm leading-6 text-[#63756B] sm:text-base">{view.description}</p>
        </div>
        <div aria-hidden="true" className="hidden size-12 place-items-center rounded-xl bg-[#E6F1E9] text-[#236644] sm:grid">
          <GreetingIcon size={22} />
        </div>
      </div>

      {state.status === "loading" ? (
        <div className="mt-8">
          <DashboardState title="Memuat ringkasan" description="Mengambil informasi akun dari SIPANA…" tone="loading" />
        </div>
      ) : state.status === "error" ? (
        <div className="mt-8">
          <DashboardState
            title="Ringkasan belum dapat dimuat"
            description={state.error}
            actionLabel="Coba lagi"
            onAction={() => void retry()}
            tone="error"
          />
        </div>
      ) : (
        <>
          <section className="mt-7 rounded-2xl border border-[#DDE5DC] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#63756B]">Selamat datang,</p>
                <h3 className="mt-1 text-xl font-bold text-[#183A2E]">{user?.name}</h3>
                <p className="mt-1 text-sm text-[#63756B]">{user?.email}</p>
              </div>
              <span className="inline-flex min-h-8 items-center rounded-full border border-[#CFE3D2] bg-[#F0F8F1] px-3 text-xs font-semibold text-[#236644]">
                {role === "community" ? "Anggota komunitas" : role === "umkm" ? "Akun UMKM" : "Akses administrator"}
              </span>
            </div>
          </section>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {view.sections.map((section) => (
              <section className="flex min-h-44 flex-col rounded-2xl border border-[#DDE5DC] bg-white p-5 sm:p-6" key={section.title}>
                <h3 className="text-base font-semibold text-[#183A2E]">{section.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#63756B]">{section.description}</p>
                <div className="mt-auto flex items-center gap-2 pt-6 text-xs font-medium text-[#63756B]">
                  <span className="inline-block size-2 rounded-full bg-[#A65B15]" aria-hidden="true" />
                  Belum tersedia pada tahap ini
                </div>
              </section>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#DDE5DC] pt-5">
            <p className="text-sm text-[#63756B]">Dashboard menampilkan data akun yang terhubung ke server.</p>
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#1C6B4A] hover:bg-[#EAF3EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
              to="/kebijakan-privasi"
            >
              Tentang data akun <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
