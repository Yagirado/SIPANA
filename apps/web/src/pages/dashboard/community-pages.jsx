import { useEffect, useState } from "react";
import { CircleUserRound, ClipboardList, LogOut, MapPin, ShieldAlert } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { useReferenceData } from "../../lib/use-reference-data.js";
import { AdminBackLink, AdminPage, AdminPageHeading, AdminPanel } from "../../components/dashboard/admin-ui.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";
import { formatDateTime, purposeLabel } from "./community-formatters.js";
import { ReportCasesPanel } from "./report-cases.jsx";

function CommunityPage({ title, heading, description, children }) {
  return <AdminPage title={title}><AdminPageHeading eyebrow="AKUN KOMUNITAS" title={heading} description={description} /><div className="mt-7 space-y-5">{children}</div></AdminPage>;
}

function claimStatusLabel(status) {
  return { active: "Menunggu pengambilan", completed: "Selesai", expired: "Kedaluwarsa" }[status] ?? status;
}

function ClaimCard({ claim }) {
  return (
    <Link className="block rounded-xl border border-[#DDE5DC] bg-white p-5 transition-colors hover:border-[#9BB69E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]" to={`/dashboard/community/klaim/${claim.id}`}>
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-[#63756B]">{claim.listing.business_name}</p><h3 className="mt-1 text-lg font-semibold text-[#183A2E]">{claim.listing.title}</h3></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${claim.status === "active" ? "bg-[#FFF6E2] text-[#795D23]" : claim.status === "completed" ? "bg-[#E6F3E9] text-[#236644]" : "bg-[#F0F2EF] text-[#63756B]"}`}>{claimStatusLabel(claim.status)}</span></div>
      <p className="mt-4 text-sm text-[#52645A]">Waktu ambil: {formatDateTime(claim.listing.pickup_starts_at)} – {formatDateTime(claim.listing.pickup_ends_at)}</p>
    </Link>
  );
}

export function CommunityClaimsPage() {
  const { refresh } = useAuth();
  const [result, setResult] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => apiRequest(`/api/community/claims?page=${page}`))
      .then((data) => { if (active) { setResult(data); setStatus({ type: "ready", message: "" }); } })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) { void refresh(); return; }
        setStatus({ type: "error", message: error.message });
      });
    return () => { active = false; };
  }, [page, refresh, reload]);

  const claims = result?.data ?? [];
  const activeClaims = claims.filter((claim) => claim.status === "active");
  const history = claims.filter((claim) => claim.status !== "active");

  return (
    <CommunityPage title="Klaim saya" heading="Klaim Saya" description="Periksa waktu dan alamat pengambilan. Klaim mengunci seluruh listing sampai diambil atau kedaluwarsa.">
      {status.type === "loading" ? <DashboardState title="Memuat klaim" description="Mengambil klaim dari SIPANA…" tone="loading" /> : null}
      {status.type === "error" ? <DashboardState title="Klaim belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((count) => count + 1)} tone="error" /> : null}
      {status.type === "ready" ? <>
        <AdminPanel title={`Perlu diambil (${activeClaims.length})`} description="Tunjukkan detail klaim kepada UMKM saat mengambil surplus.">
          {activeClaims.length ? <div className="mt-4 space-y-3">{activeClaims.map((claim) => <ClaimCard claim={claim} key={claim.id} />)}</div> : <div className="mt-4 rounded-xl bg-[#F5F7F1] p-5"><p className="font-semibold">Belum ada klaim aktif</p><p className="mt-1 text-sm leading-6 text-[#63756B]">Pilih listing yang tersedia dan pastikan kamu dapat mengambilnya sesuai jadwal.</p><Link className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#1C6B4A]" to="/dashboard/community/jelajahi">Jelajahi makanan</Link></div>}
        </AdminPanel>
        <AdminPanel title="Riwayat klaim" description="Klaim yang sudah selesai atau melewati waktu pengambilan.">
          {history.length ? <div className="mt-4 space-y-3">{history.map((claim) => <ClaimCard claim={claim} key={claim.id} />)}</div> : <p className="mt-4 text-sm text-[#63756B]">Riwayat klaim akan muncul di sini.</p>}
        </AdminPanel>
        {result?.last_page > 1 ? <div className="flex items-center justify-between gap-3"><p className="text-sm text-[#63756B]">Halaman {result.current_page} dari {result.last_page}</p><div className="flex gap-2"><button className="min-h-11 rounded-lg border border-[#DDE5DC] bg-white px-4 text-sm font-semibold disabled:opacity-50" disabled={!result.prev_page_url} onClick={() => setPage((current) => current - 1)} type="button">Sebelumnya</button><button className="min-h-11 rounded-lg border border-[#DDE5DC] bg-white px-4 text-sm font-semibold disabled:opacity-50" disabled={!result.next_page_url} onClick={() => setPage((current) => current + 1)} type="button">Berikutnya</button></div></div> : null}
      </> : null}
    </CommunityPage>
  );
}

export function CommunityClaimDetailPage() {
  const { claimId } = useParams();
  const { refresh } = useAuth();
  const [claim, setClaim] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    let active = true;
    apiRequest(`/api/community/claims/${encodeURIComponent(claimId)}`)
      .then((result) => { if (active) { setClaim(result); setStatus({ type: "ready", message: "" }); } })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) { void refresh(); return; }
        setStatus({ type: "error", message: error.message });
      });
    return () => { active = false; };
  }, [claimId, refresh]);

  return (
    <CommunityPage title="Detail klaim" heading="Detail pengambilan" description="Simpan informasi ini dan datang sesuai waktu yang ditentukan.">
      <AdminBackLink to="/dashboard/community/klaim">Kembali ke Klaim Saya</AdminBackLink>
      {status.type === "loading" ? <DashboardState title="Memuat detail klaim" description="Mengambil informasi pengambilan…" tone="loading" /> : null}
      {status.type === "error" ? <DashboardState title="Klaim tidak dapat dimuat" description={status.message} actionLabel="Kembali ke klaim" onAction={() => window.location.assign("/dashboard/community/klaim")} tone="error" /> : null}
      {status.type === "ready" && claim ? <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <AdminPanel title={claim.listing.title} description={claim.listing.business_name}>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div><dt className="text-sm text-[#63756B]">Status</dt><dd className="mt-1 font-semibold">{claimStatusLabel(claim.status)}</dd></div>
            <div><dt className="text-sm text-[#63756B]">Jumlah listing</dt><dd className="mt-1 font-semibold">{claim.listing.quantity} porsi</dd></div>
            <div><dt className="text-sm text-[#63756B]">Peruntukan</dt><dd className="mt-1 font-semibold">{claim.listing.purpose_label || purposeLabel(claim.listing.purpose)}</dd></div>
            <div><dt className="text-sm text-[#63756B]">Jam memasak</dt><dd className="mt-1 font-semibold">{formatDateTime(claim.listing.prepared_at)}</dd></div>
            <div className="sm:col-span-2"><dt className="text-sm text-[#63756B]">Alamat pengambilan</dt><dd className="mt-1 flex items-start gap-2 font-semibold"><MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-[#1C6B4A]" size={17} />{claim.listing.pickup_address}, {claim.listing.district}</dd></div>
          </dl>
        </AdminPanel>
        <div className="space-y-5">
          <AdminPanel title="Jadwal pengambilan"><p className="mt-3 text-sm text-[#63756B]">Mulai</p><p className="font-semibold">{formatDateTime(claim.listing.pickup_starts_at)}</p><p className="mt-3 text-sm text-[#63756B]">Batas waktu</p><p className="font-semibold">{formatDateTime(claim.listing.pickup_ends_at)}</p>{claim.status === "active" ? <p className="mt-4 rounded-lg bg-[#FFF6E2] p-3 text-sm leading-6 text-[#795D23]">Klaim ini tidak dapat dibatalkan. Jika tidak diambil sebelum batas waktu, statusnya menjadi kedaluwarsa.</p> : null}</AdminPanel>
          {claim.listing.business_contact && claim.status === "active" ? <AdminPanel title="Kontak UMKM"><p className="mt-2 text-sm text-[#63756B]">Gunakan kontak ini hanya untuk koordinasi pengambilan.</p><a className="mt-2 inline-flex min-h-11 items-center font-semibold text-[#1C6B4A]" href={`https://wa.me/${claim.listing.business_contact.replace(/\D/g, "").replace(/^0/, "62")}`}>Hubungi melalui WhatsApp</a></AdminPanel> : null}
          <Link className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#1C6B4A]" to={`/dashboard/community/laporan?claim_id=${claim.id}`}><ShieldAlert aria-hidden="true" size={17} /> Laporkan masalah klaim</Link>
        </div>
      </div> : null}
    </CommunityPage>
  );
}

const reportCategories = [
  ["food_safety", "Keamanan pangan"],
  ["misrepresentation", "Informasi tidak sesuai"],
  ["inappropriate_behavior", "Perilaku tidak pantas"],
  ["other", "Lainnya"],
];

export function CommunityReportsPage() {
  const { refresh } = useAuth();
  const [params] = useSearchParams();
  const [reportResult, setReportResult] = useState(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("food_safety");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reload, setReload] = useState(0);
  const listingId = params.get("listing_id");
  const claimId = params.get("claim_id");
  const targetLabel = listingId ? `Listing #${listingId}` : claimId ? `Klaim #${claimId}` : "listing atau klaim";

  useEffect(() => {
    let active = true;
    apiRequest(`/api/community/reports?page=${page}`)
      .then((result) => { if (active) { setReportResult(result); setStatus({ type: "ready", message: "" }); } })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) { void refresh(); return; }
        setStatus({ type: "error", message: error.message });
      });
    return () => { active = false; };
  }, [page, refresh, reload]);

  const reports = reportResult?.data ?? [];

  async function submitReport(event) {
    event.preventDefault();
    if (submitting || (!listingId && !claimId)) return;
    setSubmitting(true);
    setNotice("");
    try {
      await apiRequest("/api/community/reports", {
        method: "POST",
        body: { listing_id: listingId ? Number(listingId) : null, claim_id: claimId ? Number(claimId) : null, category, description },
      });
      setNotice("Laporan terkirim. Terima kasih telah membantu menjaga SIPANA.");
      setDescription("");
      setReload((count) => count + 1);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <CommunityPage title="Laporan saya" heading="Laporan dan keamanan" description="Laporkan masalah pada listing atau klaim. Uraian asli hanya terlihat oleh kamu dan admin; pihak terlapor menerima ringkasan aman bila diminta menjawab.">
      {(listingId || claimId) ? <AdminPanel title={`Laporkan ${targetLabel}`}>
        <form className="mt-4 space-y-4" onSubmit={(event) => void submitReport(event)}>
          <label className="block text-sm font-semibold text-[#364D41]">Kategori
            <select className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 font-normal" onChange={(event) => setCategory(event.target.value)} value={category}>{reportCategories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          </label>
          <label className="block text-sm font-semibold text-[#364D41]">Keterangan (opsional)
            <textarea className="mt-2 min-h-28 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 py-2 font-normal focus:border-[#1C6B4A] focus:outline-none focus:ring-2 focus:ring-[#1C6B4A]/15" maxLength={2000} onChange={(event) => setDescription(event.target.value)} placeholder="Jelaskan masalah yang kamu temukan" value={description} />
            <span className="mt-1 block text-right text-xs font-normal text-[#829187]">{description.length}/2000</span>
          </label>
          <button className="min-h-11 rounded-lg bg-[#1C6B4A] px-5 text-sm font-semibold text-white disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Mengirim laporan…" : "Kirim laporan"}</button>
          {notice ? <p className={`text-sm ${notice.startsWith("Laporan terkirim") ? "text-[#236644]" : "text-[#A33B32]"}`} role={notice.startsWith("Laporan terkirim") ? "status" : "alert"}>{notice}</p> : null}
        </form>
      </AdminPanel> : <AdminPanel title="Mulai laporan" description="Buka detail listing atau klaim untuk melaporkan masalah yang kamu temukan."><Link className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#1C6B4A]" to="/dashboard/community/jelajahi">Jelajahi listing</Link></AdminPanel>}
      <ReportCasesPanel />
      <AdminPanel title="Riwayat laporan" description="Status laporan diperbarui oleh tim admin.">
        {status.type === "loading" ? <div className="mt-3"><DashboardState title="Memuat laporan" description="Mengambil laporan kamu…" tone="loading" compact /></div> : null}
        {status.type === "error" ? <div className="mt-3"><DashboardState title="Laporan belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((count) => count + 1)} tone="error" compact /></div> : null}
        {status.type === "ready" && reports.length ? <ul className="mt-3 divide-y divide-[#E8EEE7]">{reports.map((report) => <li className="py-4" key={report.id}><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{report.target_title || "Objek laporan"}</p><span className="text-xs capitalize text-[#63756B]">{report.status === "open" ? "Menunggu ditinjau" : report.status}</span></div><p className="mt-1 text-sm text-[#63756B]">{reportCategories.find(([value]) => value === report.category)?.[1]} · {formatDateTime(report.created_at)}</p>{report.description ? <p className="mt-2 text-sm leading-6 text-[#52645A]">{report.description}</p> : null}</li>)}</ul> : null}
        {status.type === "ready" && !reports.length ? <p className="mt-3 text-sm text-[#63756B]">Belum ada laporan yang kamu kirim.</p> : null}
        {status.type === "ready" && reportResult?.last_page > 1 ? <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm text-[#63756B]">Halaman {reportResult.current_page} dari {reportResult.last_page}</p><div className="flex gap-2"><button className="min-h-11 rounded-lg border border-[#DDE5DC] bg-white px-4 text-sm font-semibold disabled:opacity-50" disabled={!reportResult.prev_page_url} onClick={() => setPage((current) => current - 1)} type="button">Sebelumnya</button><button className="min-h-11 rounded-lg border border-[#DDE5DC] bg-white px-4 text-sm font-semibold disabled:opacity-50" disabled={!reportResult.next_page_url} onClick={() => setPage((current) => current + 1)} type="button">Berikutnya</button></div></div> : null}
      </AdminPanel>
    </CommunityPage>
  );
}

export function CommunityProfilePage() {
  const { data: referenceData, status: referenceStatus } = useReferenceData();
  const { refresh, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [values, setValues] = useState({ name: "", phone: "", gender: "", birth_date: "", district: "" });
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest("/api/community/profile")
      .then((result) => { if (active) { setProfile(result); setValues({ name: result.name ?? "", phone: result.phone ?? "", gender: result.gender ?? "", birth_date: result.birth_date ?? "", district: result.district_key ?? "" }); setStatus({ type: "ready", message: "" }); } })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) { void refresh(); return; }
        setStatus({ type: "error", message: error.message });
      });
    return () => { active = false; };
  }, [refresh]);

  async function saveProfile(event) {
    event.preventDefault();
    setSubmitting(true);
    setNotice({ type: "", message: "" });
    try {
      const result = await apiRequest("/api/community/profile", { method: "PUT", body: values });
      setProfile(result.profile);
      setValues((current) => ({
        ...current,
        gender: result.profile.gender ?? "",
        birth_date: result.profile.birth_date ?? "",
      }));
      await refresh();
      setNotice({ type: "success", message: result.message });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    try { await logout(); navigate("/", { replace: true }); }
    catch (error) { setNotice({ type: "error", message: error.message }); }
  }

  return (
    <CommunityPage title="Profil" heading="Profil kamu" description="Kelola informasi kontak yang diperlukan untuk koordinasi pengambilan.">
      {status.type === "loading" ? <DashboardState title="Memuat profil" description="Mengambil data akun kamu…" tone="loading" /> : null}
      {status.type === "error" ? <DashboardState title="Profil belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => window.location.reload()} tone="error" /> : null}
      {status.type === "ready" && profile ? <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <AdminPanel title="Informasi akun" description="Email akun digunakan untuk masuk dan belum dapat diubah di halaman ini.">
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void saveProfile(event)}>
            <label className="block text-sm font-semibold text-[#364D41]">Nama lengkap<input className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] px-3 font-normal focus:border-[#1C6B4A] focus:outline-none focus:ring-2 focus:ring-[#1C6B4A]/15" minLength={2} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} required value={values.name} /></label>
            <label className="block text-sm font-semibold text-[#364D41]">Email<input className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-[#F5F7F1] px-3 font-normal text-[#63756B]" readOnly value={profile.email} /></label>
            <label className="block text-sm font-semibold text-[#364D41]">Nomor WhatsApp<input className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] px-3 font-normal focus:border-[#1C6B4A] focus:outline-none focus:ring-2 focus:ring-[#1C6B4A]/15" inputMode="tel" onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))} required value={values.phone} /></label>
            <label className="block text-sm font-semibold text-[#364D41]">Kecamatan<select className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 font-normal" disabled={referenceStatus.type !== "ready"} onChange={(event) => setValues((current) => ({ ...current, district: event.target.value }))} required value={values.district}>{referenceData.districts.map((district) => <option key={district.key} value={district.key}>{district.label}</option>)}</select></label>
            <label className="block text-sm font-semibold text-[#364D41]">Jenis kelamin (opsional)<select className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 font-normal" onChange={(event) => setValues((current) => ({ ...current, gender: event.target.value }))} value={values.gender}><option value="">Belum diisi</option><option value="male">Laki-laki</option><option value="female">Perempuan</option><option value="prefer_not_to_say">Memilih tidak menjawab</option></select></label>
            <label className="block text-sm font-semibold text-[#364D41]">Tanggal lahir (opsional)<input className="mt-2 min-h-11 w-full rounded-lg border border-[#D2DDD2] px-3 font-normal" max={new Date().toISOString().slice(0, 10)} onChange={(event) => setValues((current) => ({ ...current, birth_date: event.target.value }))} type="date" value={values.birth_date ?? ""} /></label>
            <div className="flex flex-wrap items-center gap-3 pt-1 sm:col-span-2"><button className="min-h-11 rounded-lg bg-[#1C6B4A] px-5 text-sm font-semibold text-white disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "Menyimpan…" : "Simpan perubahan"}</button>{notice.message ? <p className={`text-sm ${notice.type === "error" ? "text-[#A33B32]" : "text-[#236644]"}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p> : null}</div>
          </form>
        </AdminPanel>
        <aside className="space-y-5">
          <AdminPanel title="Privasi"><p className="mt-2 text-sm leading-6 text-[#63756B]">Kontak kamu tidak ditampilkan ke publik. Kontak UMKM hanya muncul pada detail klaim aktif untuk koordinasi pengambilan.</p><Link className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to="/kebijakan-privasi"><CircleUserRound aria-hidden="true" size={16} /> Baca kebijakan privasi</Link></AdminPanel>
          <AdminPanel title="Laporan kamu"><p className="mt-2 text-sm leading-6 text-[#63756B]">Lihat laporan yang sudah dikirim dan buat laporan baru.</p><Link className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to="/dashboard/community/laporan"><ClipboardList aria-hidden="true" size={16} /> Buka laporan</Link></AdminPanel>
          <AdminPanel title="Keluar dari SIPANA"><button className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#A33B32]" onClick={() => void signOut()} type="button"><LogOut aria-hidden="true" size={17} /> Keluar</button></AdminPanel>
        </aside>
      </div> : null}
    </CommunityPage>
  );
}
