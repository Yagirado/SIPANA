import { useEffect, useState } from "react";
import { ArrowRight, Flag, Store, Users } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { AdminPageHeading, AdminPanel, AdminUnavailable } from "../../components/dashboard/admin-ui.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";

const adminDestinations = [
  { label: "Tinjau pengajuan UMKM", detail: "Verifikasi usaha dan dokumen", to: "/dashboard/admin/verifikasi", icon: Store },
  { label: "Tinjau laporan masuk", detail: "Laporan keamanan dan ketidaksesuaian", to: "/dashboard/admin/laporan", icon: Flag },
];

export function AdminOverview() {
  const { user, refresh } = useAuth();
  const [status, setStatus] = useState({ type: "loading", message: "", metrics: null });

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/api/admin/dashboard"), apiRequest("/api/admin/metrics")])
      .then(([, metrics]) => {
        if (active) setStatus({ type: "ready", message: "", metrics });
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          void refresh();
          return;
        }
        setStatus({ type: "error", message: error.message });
      });

    return () => { active = false; };
  }, [refresh]);

  async function retry() {
    setStatus({ type: "loading", message: "", metrics: null });
    try {
      const [, metrics] = await Promise.all([apiRequest("/api/admin/dashboard"), apiRequest("/api/admin/metrics")]);
      setStatus({ type: "ready", message: "", metrics });
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        await refresh();
        return;
      }
      setStatus({ type: "error", message: error.message });
    }
  }

  return (
    <div>
      <AdminPageHeading
        eyebrow="ADMIN · RINGKASAN"
        title="Pantau operasi SIPANA"
        description="Ringkasan verifikasi, laporan, dan dampak penyaluran pangan."
      />

      {status.type === "loading" ? (
        <div className="mt-7"><DashboardState title="Memuat ringkasan" description="Mengambil informasi akun admin dari SIPANA…" tone="loading" /></div>
      ) : status.type === "error" ? (
        <div className="mt-7"><DashboardState title="Ringkasan belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => void retry()} tone="error" /></div>
      ) : (
        <>
          <section className="mt-7 rounded-2xl border border-[#DDE5DC] bg-white p-5 sm:p-6">
            <p className="text-sm text-[#63756B]">Administrator</p>
            <h3 className="mt-1 text-xl font-bold text-[#183A2E]">{user?.name}</h3>
            <p className="mt-1 break-all text-sm text-[#63756B]">{user?.email}</p>
          </section>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total akun", value: status.metrics.total_users },
              { label: "Anggota komunitas", value: status.metrics.users_by_role?.community ?? 0 },
              { label: "Akun UMKM", value: status.metrics.users_by_role?.umkm ?? 0 },
              { label: "Akun baru · 30 hari", value: status.metrics.new_users_last_30_days },
            ].map(({ label, value }) => (
              <AdminPanel className="min-h-32" key={label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#63756B]">{label}</p>
                  <Users aria-hidden="true" className="shrink-0 text-[#1C6B4A]" size={18} />
                </div>
                <p className="mt-4 text-2xl font-bold text-[#183A2E]">{value}</p>
                <p className="mt-1 text-xs text-[#829187]">Dari data akun terdaftar</p>
              </AdminPanel>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
            <AdminPanel title="Sebaran postingan" description="Aktivitas per kecamatan.">
              <div className="mt-4"><AdminUnavailable title="Grafik belum tersedia" description="Ringkasan API admin belum menyediakan data listing per kecamatan." /></div>
            </AdminPanel>
            <AdminPanel title="Akses cepat" description="Buka antrean admin yang tersedia di navigasi.">
              <div className="mt-3 divide-y divide-[#E8EEE7]">
                {adminDestinations.map(({ label, detail, to, icon: Icon }) => (
                  <Link className="flex min-h-16 items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-[#1C6B4A]" key={to} to={to}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E6F1E9] text-[#236644]"><Icon aria-hidden="true" size={18} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#183A2E]">{label}</span>
                      <span className="mt-0.5 block text-xs text-[#63756B]">{detail}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="shrink-0 text-[#63756B]" size={17} />
                  </Link>
                ))}
              </div>
            </AdminPanel>
          </div>
        </>
      )}
    </div>
  );
}
