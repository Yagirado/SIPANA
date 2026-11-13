import { useEffect, useState } from "react";
import { ArrowRight, ClipboardList, MapPin, PackageCheck } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";
import { AdminPanel, AdminPageHeading } from "../../components/dashboard/admin-ui.jsx";
import { FoodListingCard } from "./community-food-pages.jsx";

function CommunityHome() {
  const { refresh } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest("/api/community/dashboard")
      .then((result) => { if (active) { setData(result); setStatus({ type: "ready", message: "" }); } })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) { void refresh(); return; }
        setStatus({ type: "error", message: error.message });
      });
    return () => { active = false; };
  }, [refresh, reload]);

  return (
    <div>
      <AdminPageHeading eyebrow="ANGGOTA KOMUNITAS" title={`Halo, ${data?.user?.name ?? "teman"}`} description="Temukan pangan berlebih yang masih tersedia dan ambil langsung sesuai jadwal." />
      {status.type === "loading" ? <div className="mt-7"><DashboardState title="Memuat beranda" description="Mengambil listing dan klaim kamu…" tone="loading" /></div> : null}
      {status.type === "error" ? <div className="mt-7"><DashboardState title="Beranda belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((count) => count + 1)} tone="error" /></div> : null}
      {status.type === "ready" ? <>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <AdminPanel className="flex min-h-28 items-center gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E6F1E9] text-[#236644]"><MapPin aria-hidden="true" size={20} /></span><div><p className="text-sm text-[#63756B]">Listing tersedia</p><p className="mt-1 text-2xl font-bold">{data.available_listings}</p></div></AdminPanel>
          <Link className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]" to="/dashboard/community/klaim"><AdminPanel className="flex min-h-28 items-center gap-4 hover:border-[#9BB69E]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#E6F1E9] text-[#236644]"><PackageCheck aria-hidden="true" size={20} /></span><div className="flex-1"><p className="text-sm text-[#63756B]">Klaim aktif kamu</p><p className="mt-1 text-2xl font-bold">{data.active_claims}</p></div><ArrowRight aria-hidden="true" className="text-[#63756B]" size={18} /></AdminPanel></Link>
        </div>
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold">Baru dibagikan</h2><p className="mt-1 text-sm text-[#63756B]">Listing dari UMKM terverifikasi di Karawang.</p></div><Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to="/dashboard/community/jelajahi">Jelajahi semua <ArrowRight aria-hidden="true" size={16} /></Link></div>
          {data.latest_listings.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.latest_listings.map((listing) => <FoodListingCard key={listing.id} listing={listing} detailHref={`/dashboard/community/jelajahi/${listing.id}`} />)}</div> : <AdminPanel className="py-8 text-center"><ClipboardList aria-hidden="true" className="mx-auto text-[#1C6B4A]" size={26} /><h3 className="mt-3 font-semibold">Belum ada surplus yang tersedia</h3><p className="mt-1 text-sm leading-6 text-[#63756B]">Listing dari UMKM terverifikasi akan muncul di sini.</p><Link className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#1C6B4A]" to="/dashboard/community/jelajahi">Buka Jelajahi</Link></AdminPanel>}
        </section>
        <p className="mt-8 border-t border-[#DDE5DC] pt-5 text-sm leading-6 text-[#63756B]">Kontak kamu tetap pribadi. Jika kamu membuat klaim, informasi pengambilan dan kontak UMKM hanya tampil pada detail klaim kamu.</p>
      </> : null}
    </div>
  );
}

export default function CommunityDashboard() {
  return <DashboardLayout pageTitle="Beranda"><CommunityHome /></DashboardLayout>;
}
