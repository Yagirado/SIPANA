import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, ShieldCheck, Utensils, Clock3 } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { useReferenceData } from "../../lib/use-reference-data.js";
import Nav from "../../components/nav.jsx";
import Footer from "../../components/footer.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";
import { DashboardLayout } from "../../components/dashboard/dashboard-layout.jsx";
import { AdminPanel, AdminPageHeading } from "../../components/dashboard/admin-ui.jsx";
import { formatDateTime, purposeLabel } from "./community-formatters.js";

export function FoodListingCard({ listing, detailHref }) {
  return (
    <Link
      className="group flex min-h-64 flex-col rounded-2xl border border-[#DDE5DC] bg-white p-5 transition-colors hover:border-[#9BB69E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
      to={detailHref ?? `/makanan/${listing.id}`}
    >
      {listing.image_url ? <img alt={`Foto ${listing.title}`} className="mb-4 aspect-[16/9] w-full rounded-xl bg-[#F5F7F1] object-cover" loading="lazy" src={listing.image_url} /> : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-bold text-[#183A2E] group-hover:text-[#1C6B4A]">{listing.title}</h3>
          <p className="mt-1 truncate text-sm text-[#63756B]">{listing.business_name}</p>
        </div>
        {listing.verified ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E6F3E9] px-2.5 py-1.5 text-xs font-semibold text-[#236644]"><ShieldCheck aria-hidden="true" size={14} /> Terverifikasi</span> : null}
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#52645A]">{listing.description || "Surplus pangan yang masih layak dibagikan."}</p>
      <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-3 border-t border-[#E8EEE7] pt-4 text-sm">
        <div><dt className="text-xs text-[#63756B]">Jumlah</dt><dd className="mt-1 font-semibold text-[#183A2E]">{listing.quantity} porsi</dd></div>
        <div><dt className="text-xs text-[#63756B]">Kecamatan</dt><dd className="mt-1 truncate font-semibold text-[#183A2E]">{listing.district}</dd></div>
        <div className="col-span-2"><dt className="text-xs text-[#63756B]">Ambil sebelum</dt><dd className="mt-1 font-semibold text-[#183A2E]">{formatDateTime(listing.pickup_ends_at)}</dd></div>
      </dl>
    </Link>
  );
}

function PublicPage({ children }) {
  return <div className="min-h-screen bg-[#F5F7F1] text-[#183A2E]"><Nav /><main className="mx-auto min-h-[65vh] max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">{children}</main><Footer /></div>;
}

export function FoodBrowsePage({ dashboard = false }) {
  const { data: referenceData } = useReferenceData();
  const [district, setDistrict] = useState("");
  const [purpose, setPurpose] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams({ page: String(page) });
    if (district) query.set("district", district);
    if (purpose) query.set("purpose", purpose);

    Promise.resolve().then(() => {
      if (active) setStatus({ type: "loading", message: "" });
      return apiRequest(`/api/listings?${query}`);
    }).then((data) => {
      if (!active) return;
      setResult(data);
      setStatus({ type: "ready", message: "" });
    }).catch((error) => {
      if (active) setStatus({ type: "error", message: error.message });
    });

    return () => { active = false; };
  }, [district, page, purpose, reload]);

  function updateDistrict(value) {
    setPage(1);
    setDistrict(value);
  }

  function updatePurpose(value) {
    setPage(1);
    setPurpose(value);
  }

  const content = (
    <>
      <AdminPageHeading eyebrow="JELAJAHI SIPANA" title="Temukan surplus di sekitar" description="Lihat pangan berlebih dari UMKM terverifikasi di Karawang. Ambil langsung sesuai waktu yang tercantum." />
      <section aria-label="Filter listing" className="mt-7 flex flex-wrap gap-3 rounded-2xl border border-[#DDE5DC] bg-white p-4">
        <label className="min-w-52 flex-1 text-sm font-semibold text-[#364D41]">Kecamatan
          <select className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 text-sm font-normal focus:border-[#1C6B4A] focus:outline-none focus:ring-2 focus:ring-[#1C6B4A]/15" onChange={(event) => updateDistrict(event.target.value)} value={district}>
            <option value="">Semua kecamatan</option>{referenceData.listing_districts.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </label>
        <label className="min-w-52 flex-1 text-sm font-semibold text-[#364D41]">Peruntukan
          <select className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 text-sm font-normal focus:border-[#1C6B4A] focus:outline-none focus:ring-2 focus:ring-[#1C6B4A]/15" onChange={(event) => updatePurpose(event.target.value)} value={purpose}>
            <option value="">Semua peruntukan</option>{referenceData.purposes.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </label>
        {district || purpose ? <button className="mt-auto min-h-11 rounded-lg px-3 text-sm font-semibold text-[#1C6B4A] hover:bg-[#F0F6F1]" onClick={() => { updateDistrict(""); updatePurpose(""); }} type="button">Hapus filter</button> : null}
      </section>
      <div className="mt-7" aria-live="polite">
        {status.type === "loading" ? <DashboardState title="Memuat listing" description="Mencari surplus yang masih tersedia…" tone="loading" /> : null}
        {status.type === "error" ? <DashboardState title="Listing belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((count) => count + 1)} tone="error" /> : null}
        {status.type === "ready" && result?.data?.length ? <>
          <p className="mb-4 text-sm text-[#63756B]">{result.total} listing tersedia</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{result.data.map((listing) => <FoodListingCard key={listing.id} listing={listing} detailHref={dashboard ? `/dashboard/community/jelajahi/${listing.id}` : undefined} />)}</div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-[#63756B]">Halaman {result.current_page} dari {result.last_page}</p>
            <div className="flex gap-2"><button className="min-h-11 rounded-lg border border-[#DDE5DC] bg-white px-4 text-sm font-semibold disabled:opacity-50" disabled={!result.prev_page_url} onClick={() => setPage((current) => current - 1)} type="button">Sebelumnya</button><button className="min-h-11 rounded-lg border border-[#DDE5DC] bg-white px-4 text-sm font-semibold disabled:opacity-50" disabled={!result.next_page_url} onClick={() => setPage((current) => current + 1)} type="button">Berikutnya</button></div>
          </div>
        </> : null}
        {status.type === "ready" && !result?.data?.length ? <AdminPanel className="py-10 text-center"><Utensils aria-hidden="true" className="mx-auto text-[#1C6B4A]" size={28} /><h2 className="mt-4 text-lg font-semibold">Belum ada surplus tersedia</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#63756B]">Coba lagi nanti atau pilih kecamatan lain. Listing akan tampil setelah UMKM terverifikasi membagikan surplus.</p></AdminPanel> : null}
      </div>
    </>
  );

  return dashboard
    ? <DashboardLayout pageTitle="Jelajahi makanan">{content}</DashboardLayout>
    : <PublicPage>{content}</PublicPage>;
}

export function FoodDetailPage({ dashboard = false }) {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status: authStatus } = useAuth();
  const [listing, setListing] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [action, setAction] = useState({ type: "idle", message: "" });

  useEffect(() => {
    let active = true;
    apiRequest(`/api/listings/${encodeURIComponent(listingId)}`)
      .then((data) => { if (active) { setListing(data); setStatus({ type: "ready", message: "" }); } })
      .catch((error) => { if (active) setStatus({ type: "error", message: error.status === 404 ? "Listing tidak ditemukan atau sudah tidak dapat dilihat." : error.message }); });
    return () => { active = false; };
  }, [listingId]);

  async function claimListing() {
    if (authStatus === "unauthenticated") {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (user?.role !== "community") {
      setAction({ type: "error", message: "Klaim hanya tersedia untuk akun anggota komunitas." });
      return;
    }

    setAction({ type: "loading", message: "Memproses klaim…" });
    try {
      const result = await apiRequest(`/api/community/listings/${encodeURIComponent(listingId)}/claim`, { method: "POST", body: {} });
      navigate(`/dashboard/community/klaim/${result.claim.id}`, { replace: true });
    } catch (error) {
      setAction({ type: "error", message: error.message });
    }
  }

  function reportListing() {
    const destination = `/dashboard/community/laporan?listing_id=${encodeURIComponent(listingId)}`;
    if (authStatus === "unauthenticated") navigate("/login", { state: { from: destination } });
    else if (user?.role === "community") navigate(destination);
    else setAction({ type: "error", message: "Laporan dari halaman ini hanya tersedia untuk akun anggota komunitas." });
  }

  const browsePath = dashboard ? "/dashboard/community/jelajahi" : "/jelajahi";
  const content = (
    <>
      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to={browsePath}><ArrowLeft aria-hidden="true" size={17} /> Kembali ke listing</Link>
      <div className="mt-5">
        {status.type === "loading" ? <DashboardState title="Memuat detail listing" description="Mengambil informasi makanan dan pengambilan…" tone="loading" /> : null}
        {status.type === "error" ? <DashboardState title="Detail listing tidak tersedia" description={status.message} actionLabel="Kembali ke listing" onAction={() => navigate(browsePath)} tone="error" /> : null}
        {status.type === "ready" && listing ? <article className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <AdminPanel>
            {listing.image_url ? <img alt={`Foto ${listing.title}`} className="mb-5 max-h-[420px] w-full rounded-xl bg-[#F5F7F1] object-cover" loading="lazy" src={listing.image_url} /> : null}
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-medium text-[#1C6B4A]">{listing.business_name}</p><h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{listing.title}</h1></div>{listing.verified ? <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F3E9] px-3 py-2 text-xs font-semibold text-[#236644]"><ShieldCheck aria-hidden="true" size={15} /> UMKM terverifikasi</span> : null}</div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#52645A]">{listing.description || "Surplus pangan yang masih layak dibagikan."}</p>
            <dl className="mt-6 grid gap-5 border-t border-[#E8EEE7] pt-5 sm:grid-cols-2">
              <div><dt className="text-sm text-[#63756B]">Jumlah</dt><dd className="mt-1 font-semibold">{listing.quantity} porsi</dd></div>
              <div><dt className="text-sm text-[#63756B]">Peruntukan</dt><dd className="mt-1 font-semibold">{listing.purpose_label || purposeLabel(listing.purpose)}</dd></div>
              <div><dt className="text-sm text-[#63756B]">Waktu memasak</dt><dd className="mt-1 font-semibold">{formatDateTime(listing.prepared_at)}</dd></div>
              <div><dt className="text-sm text-[#63756B]">Waktu pengambilan</dt><dd className="mt-1 font-semibold">{formatDateTime(listing.pickup_starts_at)} – {formatDateTime(listing.pickup_ends_at)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-sm text-[#63756B]">Lokasi pengambilan</dt><dd className="mt-1 flex items-start gap-2 font-semibold"><MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[#1C6B4A]" size={17} />Kecamatan {listing.district}. Alamat lengkap tersedia setelah klaim berhasil.</dd></div>
            </dl>
            <p className="mt-6 flex items-start gap-2 rounded-lg bg-[#F5F7F1] p-4 text-sm leading-6 text-[#52645A]"><Clock3 aria-hidden="true" className="mt-0.5 shrink-0 text-[#1C6B4A]" size={17} />Listing ini diklaim secara utuh. Pastikan kamu dapat datang pada waktu pengambilan sebelum melanjutkan.</p>
          </AdminPanel>
          <aside className="space-y-4">
            <AdminPanel title="Ambil surplus ini"><p className="mt-2 text-sm leading-6 text-[#63756B]">Setelah klaim berhasil, alamat dan kontak UMKM tersedia di halaman Klaim Saya. Klaim tidak dapat dibatalkan.</p><button className="mt-5 min-h-12 w-full rounded-xl bg-[#1C6B4A] px-4 text-sm font-semibold text-white hover:bg-[#183A2E] disabled:cursor-wait disabled:opacity-60" disabled={action.type === "loading" || listing.status !== "published"} onClick={() => void claimListing()} type="button">{action.type === "loading" ? "Memproses…" : listing.status === "published" ? "Klaim seluruh listing" : "Tidak tersedia"}</button>{action.type === "error" ? <p className="mt-3 text-sm text-[#A33B32]" role="alert">{action.message}</p> : null}</AdminPanel>
            <AdminPanel title="Ada masalah?"><p className="mt-2 text-sm leading-6 text-[#63756B]">Laporkan masalah terkait keamanan pangan atau informasi listing.</p><button className="mt-3 min-h-11 w-full rounded-lg border border-[#DDE5DC] px-4 text-sm font-semibold text-[#1C6B4A] hover:bg-[#F5F7F1]" onClick={reportListing} type="button">Laporkan listing</button></AdminPanel>
          </aside>
        </article> : null}
      </div>
    </>
  );

  return dashboard
    ? <DashboardLayout pageTitle="Detail surplus">{content}</DashboardLayout>
    : <PublicPage>{content}</PublicPage>;
}
