import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowUpRight, Check, Clock3, FileText, Plus, ShieldCheck, Utensils } from "lucide-react";
import { useAuth } from "../../auth/use-auth.js";
import { AdminPage, AdminPageHeading, AdminPanel, AdminBackLink } from "../../components/dashboard/admin-ui.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";
import { apiRequest } from "../../lib/api.js";
import { formatDateTime, purposeLabel } from "./community-formatters.js";

const districts = ["Karawang Barat", "Telukjambe Timur", "Karawang Timur"];
const purposeOptions = [["consumption", "Untuk konsumsi"], ["redistribution", "Redistribusi"], ["animal_feed", "Pakan ternak"]];
const listingStatuses = [["published", "Aktif"], ["claimed", "Diklaim"], ["history", "Riwayat"]];
const statusLabels = { published: "Aktif", claimed: "Diklaim", completed: "Selesai", expired: "Kedaluwarsa", withdrawn: "Ditarik", removed: "Dihapus" };
const statusStyles = {
  published: "bg-[#E6F3E9] text-[#236644]",
  claimed: "bg-[#FFF3D8] text-[#795D23]",
  completed: "bg-[#E6F3E9] text-[#236644]",
  expired: "bg-[#F0F2EF] text-[#63756B]",
  withdrawn: "bg-[#F0F2EF] text-[#63756B]",
  removed: "bg-[#FFF0EE] text-[#A33B32]",
};

function UmkmPage({ title, heading, description, children, action }) {
  return <AdminPage title={title}><AdminPageHeading eyebrow="RUANG UMKM" title={heading} description={description} action={action} /><div className="mt-7 space-y-5">{children}</div></AdminPage>;
}

function useApiResource(path, refresh) {
  const [reload, setReload] = useState(0);
  const [resource, setResource] = useState({ key: "", type: "loading", data: null, message: "" });
  useEffect(() => {
    let active = true;
    apiRequest(path).then((data) => {
      if (active) setResource({ key: path, type: "ready", data, message: "" });
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401) { void refresh(); return; }
      setResource({ key: path, type: "error", data: null, message: error.message });
    });
    return () => { active = false; };
  }, [path, refresh, reload]);
  const current = resource.key === path ? resource : { type: "loading", data: null, message: "" };
  return { ...current, reload: () => setReload((value) => value + 1) };
}

function LoadingOrError({ resource, title, onRetry }) {
  if (resource.type === "loading") return <DashboardState title={title ?? "Memuat data"} description="Mengambil informasi usaha dari SIPANA…" tone="loading" />;
  if (resource.type === "error") return <DashboardState title="Data belum dapat dimuat" description={resource.message} actionLabel="Coba lagi" onAction={onRetry} tone="error" />;
  return null;
}

function StateBadge({ status }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[status] ?? statusStyles.expired}`}>{statusLabels[status] ?? status}</span>;
}

function VerificationNotice({ verification }) {
  if (!verification || verification.status === "verified") return null;
  const rejected = verification.status === "rejected";
  return <section className={`rounded-2xl border p-5 ${rejected ? "border-[#E9C8C3] bg-[#FFF5F3]" : "border-[#EAD8A9] bg-[#FFF9E8]"}`}>
    <div className="flex items-start gap-3"><ShieldCheck className={rejected ? "mt-0.5 text-[#A33B32]" : "mt-0.5 text-[#89671F]"} size={20} aria-hidden="true" /><div className="min-w-0">
      <h3 className="font-semibold">{rejected ? "Perlu perbaikan verifikasi" : "Profil usaha sedang ditinjau"}</h3>
      <p className="mt-1 text-sm leading-6 text-[#63756B]">{rejected ? (verification.reason || "Periksa kembali informasi usaha dan hubungi admin jika memerlukan bantuan.") : "Listing baru bisa diterbitkan setelah admin menyetujui profil usaha."}</p>
      <Link className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to="/dashboard/umkm/profil">Lihat status verifikasi <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </div></div>
  </section>;
}

function ListingCard({ listing, showActions = false }) {
  const to = listing.claim_id ? `/dashboard/umkm/klaim/${listing.claim_id}` : `/dashboard/umkm/listing/${listing.id}/ubah`;
  return <Link className="group flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E5EBE2] bg-white p-4 transition-colors hover:border-[#AFC5B1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]" to={to}>
    <div className="flex min-w-0 items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#F0F6F1] text-[#1C6B4A]"><Utensils size={18} aria-hidden="true" /></span><div className="min-w-0"><h3 className="truncate font-semibold text-[#183A2E]">{listing.title}</h3><p className="mt-1 text-sm text-[#63756B]">{listing.quantity} porsi · Batas ambil {formatDateTime(listing.pickup_ends_at)}</p></div></div>
    <div className="flex items-center gap-3"><StateBadge status={listing.status} />{showActions && listing.status === "published" ? <span className="text-xs font-semibold text-[#1C6B4A]">Ubah</span> : null}</div>
  </Link>;
}

export function UmkmDashboardPage() {
  const { refresh } = useAuth();
  const data = useApiResource("/api/umkm/dashboard", refresh);
  const summary = data.data;
  const canPost = summary?.verification?.status === "verified";
  return <UmkmPage title="Ringkasan usaha" heading={`Selamat datang, ${summary?.user?.name ?? ""}`} description="Pantau surplus, klaim masuk, dan dampak usaha kamu di SIPANA."
    action={<Link className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${canPost ? "bg-[#1C6B4A] text-white hover:bg-[#16573C]" : "bg-[#E5EBE2] text-[#63756B]"}`} to={canPost ? "/dashboard/umkm/posting-cepat" : "/dashboard/umkm/profil"}><Plus size={17} aria-hidden="true" />{canPost ? "Posting Cepat" : "Lihat verifikasi"}</Link>}>
    <LoadingOrError resource={data} title="Memuat ringkasan usaha" onRetry={data.reload} />
    {summary ? <>
      <VerificationNotice verification={summary.verification} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["Listing aktif", summary.metrics.active_listings, "Tersedia untuk diklaim"], ["Klaim masuk", summary.metrics.incoming_claims, "Menunggu serah terima"], ["Selesai bulan ini", summary.metrics.completed_handover, "Serah terima tercatat"], ["Porsi disalurkan", summary.metrics.portions_distributed, "Dari serah terima selesai"]].map(([label, value, detail]) => <div className="rounded-2xl border border-[#DDE5DC] bg-white p-5" key={label}><p className="text-sm font-medium text-[#63756B]">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-[#183A2E]">{value}</p><p className="mt-1 text-xs text-[#829187]">{detail}</p></div>)}
      </section>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <AdminPanel title="Listing terbaru" description="Status dan tindakan berikutnya untuk surplus yang kamu bagikan.">
          {summary.latest_listings.length ? <div className="mt-4 space-y-3">{summary.latest_listings.map((listing) => <ListingCard key={listing.id} listing={listing} showActions />)}</div> : <EmptyState title="Belum ada listing" description="Posting surplus pertama setelah akun usahamu terverifikasi." />}
          <Link className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to="/dashboard/umkm/listing-saya">Lihat semua listing <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </AdminPanel>
        <AdminPanel title="Perlu tindakan" description="Klaim aktif menunggu konfirmasi serah terima.">
          {summary.next_claim ? <div className="mt-4 rounded-xl bg-[#F5F7F1] p-4"><p className="text-sm font-semibold">{summary.next_claim.listing.title}</p><p className="mt-1 text-sm text-[#63756B]">Penerima {summary.next_claim.claimant?.name ?? "anggota"}</p><p className="mt-2 text-xs text-[#63756B]">Batas ambil {formatDateTime(summary.next_claim.listing.pickup_ends_at)}</p><Link className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-[#1C6B4A] px-3 text-sm font-semibold text-[#1C6B4A]" to={`/dashboard/umkm/klaim/${summary.next_claim.id}`}>Lihat klaim</Link></div> : <EmptyState title="Belum ada klaim aktif" description="Klaim baru akan muncul di sini setelah warga mengambil listing." />}
          <Link className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to="/dashboard/umkm/klaim-masuk">Buka semua klaim <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </AdminPanel>
      </div>
    </> : null}
  </UmkmPage>;
}

function EmptyState({ title, description, action }) {
  return <div className="mt-4 rounded-xl bg-[#F5F7F1] p-5"><p className="font-semibold text-[#183A2E]">{title}</p><p className="mt-1 text-sm leading-6 text-[#63756B]">{description}</p>{action ? <div className="mt-3">{action}</div> : null}</div>;
}

export function UmkmListingsPage() {
  const { refresh } = useAuth();
  const [params, setParams] = useSearchParams();
  const selected = params.get("status") ?? "published";
  const page = params.get("page") ?? "1";
  const path = `/api/umkm/listings?status=${selected}&page=${page}`;
  const resource = useApiResource(path, refresh);
  const all = resource.data?.data ?? [];
  const listings = all;
  const counts = resource.data?.counts ?? { published: 0, claimed: 0, history: 0 };
  return <UmkmPage title="Listing saya" heading="Listing Saya" description="Kelola surplus yang sedang dibagikan dan lihat statusnya."
    action={<Link className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white hover:bg-[#16573C]" to="/dashboard/umkm/posting-cepat"><Plus size={17} aria-hidden="true" />Posting Cepat</Link>}>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter status listing">{listingStatuses.map(([value, label]) => <button aria-selected={selected === value} className={`min-h-10 rounded-full px-4 text-sm font-semibold ${selected === value ? "bg-[#1C6B4A] text-white" : "border border-[#DDE5DC] bg-white text-[#52645A]"}`} key={value} onClick={() => setParams(value === "published" ? {} : { status: value })} role="tab" type="button">{label} <span className="ml-1 opacity-80">{counts[value]}</span></button>)}</div>
    <LoadingOrError resource={resource} title="Memuat listing" onRetry={resource.reload} />
    {resource.type === "ready" ? <AdminPanel title={selected === "history" ? "Riwayat listing" : selected === "claimed" ? "Listing diklaim" : "Listing aktif"} description="Buka listing untuk melihat tindakan yang tersedia pada statusnya.">
      {listings.length ? <div className="mt-4 space-y-3">{listings.map((listing) => <ListingCard key={listing.id} listing={listing} showActions />)}</div> : <EmptyState title="Belum ada listing di bagian ini" description={selected === "published" ? "Listing yang kamu publikasikan akan tampil di sini." : "Riwayat akan terisi setelah listing selesai, kedaluwarsa, atau ditarik."} action={selected === "published" ? <Link className="inline-flex min-h-10 items-center gap-2 font-semibold text-[#1C6B4A]" to="/dashboard/umkm/posting-cepat"><Plus size={16} />Buat listing</Link> : null} />}
      {resource.data?.last_page > 1 ? <Pagination result={resource.data} onPage={(nextPage) => setParams({ status: selected, page: String(nextPage) })} /> : null}
    </AdminPanel> : null}
  </UmkmPage>;
}

function Pagination({ result, onPage }) {
  return <div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm text-[#63756B]">Halaman {result.current_page} dari {result.last_page}</span><div className="flex gap-2"><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.prev_page_url} onClick={() => onPage(result.current_page - 1)} type="button">Sebelumnya</button><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.next_page_url} onClick={() => onPage(result.current_page + 1)} type="button">Berikutnya</button></div></div>;
}

function localDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const initialListing = { title: "", description: "", quantity: "", prepared_at: "", pickup_starts_at: "", pickup_ends_at: "", purpose: "consumption", district: districts[0], safety_attested: false, terms_accepted: false };

export function UmkmListingFormPage() {
  const { listingId } = useParams();
  const isEdit = Boolean(listingId);
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const listingsResource = useApiResource(isEdit ? `/api/umkm/listings/${listingId}` : "/api/umkm/dashboard", refresh);
  const [draft, setDraft] = useState({ key: "", values: {} });
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawBusy, setWithdrawBusy] = useState(false);
  const listing = isEdit ? listingsResource.data : null;
  const verification = isEdit ? null : listingsResource.data?.verification;
  const terms = isEdit ? null : listingsResource.data?.terms;
  const mustAcceptTerms = !isEdit && !terms?.accepted_at;
  const mayPost = isEdit || verification?.status === "verified";
  const draftKey = listingId ?? "new-listing";
  const listingValues = listing ? { title: listing.title ?? "", description: listing.description ?? "", quantity: String(listing.quantity ?? ""), prepared_at: localDateTime(listing.prepared_at), pickup_starts_at: localDateTime(listing.pickup_starts_at), pickup_ends_at: localDateTime(listing.pickup_ends_at), purpose: listing.purpose ?? "consumption", district: listing.district ?? districts[0], safety_attested: false } : initialListing;
  const values = { ...listingValues, ...(draft.key === draftKey ? draft.values : {}) };
  const setValues = (next) => setDraft({ key: draftKey, values: next });

  async function submit(event) {
    event.preventDefault();
    setNotice({ type: "", message: "" });
    setSubmitting(true);
    try {
      const body = { ...values, quantity: Number(values.quantity), prepared_at: new Date(values.prepared_at).toISOString(), pickup_starts_at: new Date(values.pickup_starts_at).toISOString(), pickup_ends_at: new Date(values.pickup_ends_at).toISOString() };
      const result = await apiRequest(isEdit ? `/api/umkm/listings/${listingId}` : "/api/umkm/listings", { method: isEdit ? "PUT" : "POST", body });
      navigate(`/dashboard/umkm/listing-terbit/${result.listing.id}`, { replace: true });
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function withdraw() {
    setWithdrawBusy(true);
    try {
      await apiRequest(`/api/umkm/listings/${listingId}`, { method: "DELETE" });
      navigate("/dashboard/umkm/listing-saya?status=history", { replace: true });
    } catch (error) { setNotice({ type: "error", message: error.message }); }
    finally { setWithdrawBusy(false); }
  }

  const locked = isEdit && listing && listing.status !== "published";
  const pageTitle = isEdit ? "Ubah listing" : "Posting Cepat";
  if (isEdit && listingsResource.type === "ready" && !listing) return <UmkmPage title={pageTitle} heading="Listing tidak ditemukan" description="Listing ini mungkin bukan milik akunmu atau sudah dihapus."><AdminBackLink to="/dashboard/umkm/listing-saya">Kembali ke Listing Saya</AdminBackLink></UmkmPage>;

  return <UmkmPage title={pageTitle} heading={pageTitle} description={isEdit ? "Perubahan tersedia selama listing belum diklaim." : "Isi detail penting dan publikasikan surplus untuk warga di kecamatanmu."}>
    <AdminBackLink to={isEdit ? "/dashboard/umkm/listing-saya" : "/dashboard/umkm"}>{isEdit ? "Kembali ke Listing Saya" : "Kembali ke dasbor"}</AdminBackLink>
    {isEdit && listingsResource.type === "loading" ? <DashboardState title="Memuat listing" description="Mengambil detail listing…" tone="loading" /> : null}
    {isEdit && listingsResource.type === "error" ? <DashboardState title="Listing tidak dapat dimuat" description={listingsResource.message} actionLabel="Coba lagi" onAction={listingsResource.reload} tone="error" /> : null}
    {!isEdit && listingsResource.type === "loading" ? <DashboardState title="Memeriksa status usaha" description="Memastikan akun sudah dapat menerbitkan listing…" tone="loading" /> : null}
    {!isEdit && listingsResource.type === "error" ? <DashboardState title="Status usaha tidak dapat dimuat" description={listingsResource.message} actionLabel="Coba lagi" onAction={listingsResource.reload} tone="error" /> : null}
    {!isEdit && verification && !mayPost ? <VerificationNotice verification={verification} /> : null}
    {locked ? <AdminPanel title={listing.status === "claimed" ? "Listing sudah diklaim" : `Listing ${statusLabels[listing.status] ?? "ditutup"}`} description={listing.status === "claimed" ? "Edit dan penarikan dinonaktifkan karena ada reservasi aktif." : "Listing ini sudah tidak dapat diubah atau ditarik."}>{listing.claim_id ? <Link className="mt-3 inline-flex min-h-11 items-center font-semibold text-[#1C6B4A]" to={`/dashboard/umkm/klaim/${listing.claim_id}`}>Buka detail klaim <ArrowUpRight size={16} className="ml-1" /></Link> : null}</AdminPanel> : null}
    {((!isEdit && listingsResource.type === "ready" && mayPost) || (listing && !locked)) ? <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
      <AdminPanel title={isEdit ? "Detail surplus" : "Detail makanan"} description="Pastikan jumlah dan waktu pengambilan dapat dipenuhi.">
        <form className="mt-4 space-y-4" onSubmit={(event) => void submit(event)}>
          <Field label="Jenis makanan" required><input autoComplete="off" className={inputClass} maxLength={160} onChange={(event) => setValues({ ...values, title: event.target.value })} placeholder="Contoh: Roti gandum segar" required value={values.title} /></Field>
          <Field label="Jumlah porsi" required><input className={inputClass} min="1" onChange={(event) => setValues({ ...values, quantity: event.target.value })} placeholder="Contoh: 6" required type="number" value={values.quantity} /></Field>
          <Field label="Keterangan" hint="Opsional"><textarea className={`${inputClass} min-h-24 py-2`} maxLength={2000} onChange={(event) => setValues({ ...values, description: event.target.value })} placeholder="Informasi singkat tentang makanan" value={values.description} /></Field>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Jam masak" required><input className={inputClass} max={localDateTime(new Date())} onChange={(event) => setValues({ ...values, prepared_at: event.target.value })} required type="datetime-local" value={values.prepared_at} /></Field><Field label="Kecamatan" required><select className={inputClass} onChange={(event) => setValues({ ...values, district: event.target.value })} value={values.district}>{districts.map((district) => <option key={district}>{district}</option>)}</select></Field></div>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Waktu pengambilan mulai" required><input className={inputClass} min={localDateTime(new Date())} onChange={(event) => setValues({ ...values, pickup_starts_at: event.target.value })} required type="datetime-local" value={values.pickup_starts_at} /></Field><Field label="Batas ambil" required><input className={inputClass} min={values.pickup_starts_at || localDateTime(new Date())} onChange={(event) => setValues({ ...values, pickup_ends_at: event.target.value })} required type="datetime-local" value={values.pickup_ends_at} /></Field></div>
          <fieldset><legend className="text-sm font-semibold text-[#364D41]">Peruntukan <span className="text-[#A33B32]">*</span></legend><div className="mt-2 grid gap-2 sm:grid-cols-3">{purposeOptions.map(([value, label]) => <label className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${values.purpose === value ? "border-[#1C6B4A] bg-[#F0F6F1] text-[#1C6B4A]" : "border-[#D2DDD2] bg-white text-[#52645A]"}`} key={value}><input checked={values.purpose === value} className="accent-[#1C6B4A]" name="purpose" onChange={() => setValues({ ...values, purpose: value })} type="radio" />{label}</label>)}</div></fieldset>
          <label className="flex items-start gap-3 rounded-xl bg-[#F5F7F1] p-4 text-sm leading-6 text-[#52645A]"><input checked={values.safety_attested} className="mt-1 size-4 shrink-0 accent-[#1C6B4A]" onChange={(event) => setValues({ ...values, safety_attested: event.target.checked })} required type="checkbox" /><span>Saya memastikan makanan masih layak untuk peruntukan yang dipilih dan informasi waktu pengambilan sudah benar.</span></label>
          {mustAcceptTerms ? <div className="flex items-start gap-3 rounded-xl border border-[#DDE5DC] p-4 text-sm leading-6 text-[#52645A]"><input aria-label="Saya menyetujui ketentuan penggunaan UMKM" checked={values.terms_accepted} className="mt-1 size-4 shrink-0 accent-[#1C6B4A]" onChange={(event) => setValues({ ...values, terms_accepted: event.target.checked })} required type="checkbox" /><p>Saya menyetujui <Link className="font-semibold text-[#1C6B4A] underline" target="_blank" to="/ketentuan-pengguna">ketentuan penggunaan UMKM</Link>, termasuk tanggung jawab keamanan pangan.</p></div> : null}
          {notice.message ? <p className={`text-sm ${notice.type === "error" ? "text-[#A33B32]" : "text-[#236644]"}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p> : null}
          <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1C6B4A] px-5 text-sm font-semibold text-white hover:bg-[#16573C] disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || !values.safety_attested || (mustAcceptTerms && !values.terms_accepted)} type="submit">{submitting ? "Menyimpan…" : isEdit ? "Simpan perubahan" : "Publikasikan listing"}</button>
        </form>
      </AdminPanel>
      <div className="space-y-5"><AdminPanel title="Pratinjau listing"><div className="mt-4 rounded-xl bg-[#F0F6F1] p-5"><p className="font-semibold">{values.title || "Nama makanan tampil di sini"}</p><p className="mt-2 text-sm text-[#63756B]">{values.quantity || "Jumlah"} porsi · {purposeLabel(values.purpose)}</p><p className="mt-2 flex items-center gap-2 text-sm text-[#63756B]"><Clock3 size={16} />{values.pickup_starts_at ? new Date(values.pickup_starts_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Waktu pengambilan"}</p></div></AdminPanel><div className="rounded-2xl border border-[#EAD8A9] bg-[#FFF9E8] p-5"><h3 className="font-semibold text-[#694F1E]">Sebelum dipublikasikan</h3><p className="mt-2 text-sm leading-6 text-[#795D23]">Penerima akan melihat waktu masak, jumlah porsi, peruntukan, dan batas pengambilan.</p></div>{isEdit ? <AdminPanel title="Tarik listing" description="Listing aktif yang belum diklaim dapat ditarik kapan saja."><button className="mt-3 min-h-10 text-sm font-semibold text-[#A33B32]" onClick={() => setWithdrawOpen(true)} type="button">Tarik listing dari publik <ArrowUpRight className="ml-1 inline" size={15} /></button></AdminPanel> : null}</div>
    </div> : null}
    {withdrawOpen ? <div className="fixed inset-0 z-50 grid place-items-center bg-[#10251E]/55 p-4" role="presentation"><section aria-labelledby="withdraw-title" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" role="dialog"><h2 className="text-lg font-bold" id="withdraw-title">Tarik listing ini?</h2><p className="mt-2 text-sm leading-6 text-[#63756B]">Listing akan hilang dari daftar publik dan tetap tersimpan di riwayat usahamu.</p>{notice.message ? <p className="mt-3 text-sm text-[#A33B32]" role="alert">{notice.message}</p> : null}<div className="mt-5 flex flex-wrap justify-end gap-2"><button className="min-h-11 rounded-lg border border-[#DDE5DC] px-4 text-sm font-semibold" onClick={() => setWithdrawOpen(false)} type="button">Kembali</button><button className="min-h-11 rounded-lg bg-[#A33B32] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={withdrawBusy} onClick={() => void withdraw()} type="button">{withdrawBusy ? "Menarik…" : "Tarik listing"}</button></div></section></div> : null}
  </UmkmPage>;
}

export function UmkmPublishedPage() {
  const { listingId } = useParams();
  const { refresh } = useAuth();
  const resource = useApiResource(`/api/umkm/listings/${listingId}`, refresh);
  const listing = resource.data;
  const shareUrl = typeof window === "undefined" ? "" : `${window.location.origin}/makanan/${listingId}`;
  const shareText = listing ? `Surplus ${listing.title}: ${listing.quantity} porsi di ${listing.business_name}. ${shareUrl}` : "";
  return <UmkmPage title="Listing diterbitkan" heading="Listing berhasil dipublikasikan" description="Warga di kecamatan pilihan sekarang dapat melihat surplus ini.">
    <AdminBackLink to="/dashboard/umkm/listing-saya">Kembali ke Listing Saya</AdminBackLink>
    {resource.type === "loading" ? <DashboardState title="Memuat listing" description="Mengambil detail listing…" tone="loading" /> : null}
    {resource.type === "error" ? <DashboardState title="Listing tidak dapat dimuat" description={resource.message} actionLabel="Coba lagi" onAction={resource.reload} tone="error" /> : null}
    {listing ? <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><AdminPanel title={listing.title} description={listing.business_name}><div className="mt-4 flex flex-wrap items-center gap-3"><StateBadge status={listing.status} />{listing.status === "published" ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#236644]"><Check size={15} />Terverifikasi</span> : null}</div><dl className="mt-5 grid gap-4 sm:grid-cols-2"><Info label="Jumlah" value={`${listing.quantity} porsi`} /><Info label="Jam masak" value={formatDateTime(listing.prepared_at)} /><Info label="Mulai pengambilan" value={formatDateTime(listing.pickup_starts_at)} /><Info label="Batas ambil" value={formatDateTime(listing.pickup_ends_at)} /><Info label="Peruntukan" value={purposeLabel(listing.purpose)} /><Info label="Kecamatan" value={listing.district} /></dl></AdminPanel><AdminPanel title="Sebarkan ke pelanggan" description="Bagikan tautan publik melalui WhatsApp."><a className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} rel="noreferrer" target="_blank">Bagikan ke WhatsApp <ArrowUpRight size={16} /></a><Link className="mt-3 flex min-h-10 items-center gap-2 text-sm font-semibold text-[#1C6B4A]" to={`/makanan/${listing.id}`}>Lihat listing publik <ArrowUpRight size={16} /></Link></AdminPanel></div> : resource.type === "ready" ? <EmptyState title="Listing tidak ditemukan" description="Buka daftar listing untuk melihat data terbaru." action={<Link className="font-semibold text-[#1C6B4A]" to="/dashboard/umkm/listing-saya">Buka Listing Saya</Link>} /> : null}
  </UmkmPage>;
}

export function UmkmClaimsPage() {
  const { refresh } = useAuth();
  const [params, setParams] = useSearchParams();
  const page = params.get("page") ?? "1";
  const resource = useApiResource(`/api/umkm/claims?page=${page}`, refresh);
  const claims = resource.data?.data ?? [];
  const active = claims.filter((claim) => claim.status === "active");
  const history = claims.filter((claim) => claim.status !== "active");
  return <UmkmPage title="Klaim masuk" heading="Klaim Masuk" description="Periksa penerima dan waktu pengambilan sebelum konfirmasi serah terima.">
    <LoadingOrError resource={resource} title="Memuat klaim masuk" onRetry={resource.reload} />
    {resource.type === "ready" ? <>
      <AdminPanel title={`Menunggu handover · ${active.length}`} description="Konfirmasi hanya setelah makanan diterima langsung oleh penerima.">{active.length ? <div className="mt-4 space-y-3">{active.map((claim) => <ClaimCard key={claim.id} claim={claim} />)}</div> : <EmptyState title="Tidak ada klaim yang menunggu" description="Klaim aktif akan muncul di bagian ini setelah listing diambil warga." />}</AdminPanel>
      <AdminPanel title="Riwayat klaim" description="Serah terima selesai dan klaim yang melewati batas pengambilan.">{history.length ? <div className="mt-4 space-y-3">{history.map((claim) => <ClaimCard key={claim.id} claim={claim} />)}</div> : <p className="mt-4 text-sm text-[#63756B]">Belum ada riwayat klaim.</p>}</AdminPanel>
      {resource.data?.last_page > 1 ? <Pagination result={resource.data} onPage={(nextPage) => setParams({ page: String(nextPage) })} /> : null}
    </> : null}
  </UmkmPage>;
}

function ClaimCard({ claim }) {
  return <Link className="block rounded-xl border border-[#E5EBE2] p-4 transition-colors hover:border-[#AFC5B1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]" to={`/dashboard/umkm/klaim/${claim.id}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-[#63756B]">Penerima · {claim.claimant.name}</p><h3 className="mt-1 font-semibold">{claim.listing.title}</h3><p className="mt-1 text-sm text-[#63756B]">{claim.listing.quantity} porsi · Batas {formatDateTime(claim.listing.pickup_ends_at)}</p></div><StateBadge status={claim.status === "active" ? "claimed" : claim.status} /></div></Link>;
}

export function UmkmClaimDetailPage({ confirmation = false }) {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const resource = useApiResource(`/api/umkm/claims/${claimId}`, refresh);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [reportOpen, setReportOpen] = useState(false);
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const claim = resource.data;
  const expired = claim?.status === "expired";
  async function confirm() {
    setBusy(true); setNotice({ type: "", message: "" });
    try { await apiRequest(`/api/umkm/claims/${claimId}/handover`, { method: "POST" }); navigate(`/dashboard/umkm/klaim/${claimId}`, { replace: true }); resource.reload(); }
    catch (error) { setNotice({ type: "error", message: error.message }); resource.reload(); }
    finally { setBusy(false); }
  }
  async function report() {
    setBusy(true); setNotice({ type: "", message: "" });
    try { await apiRequest(`/api/umkm/claims/${claimId}/reports`, { method: "POST", body: { category, description } }); setNotice({ type: "success", message: "Kendala berhasil dilaporkan." }); setReportOpen(false); }
    catch (error) { setNotice({ type: "error", message: error.message }); }
    finally { setBusy(false); }
  }
  return <UmkmPage title={confirmation ? "Konfirmasi serah terima" : "Detail klaim"} heading={confirmation ? "Konfirmasi serah terima" : expired ? "Klaim tidak diambil" : "Detail klaim masuk"} description={expired ? "Batas pengambilan sudah lewat tanpa konfirmasi serah terima." : "Pastikan makanan diserahkan langsung kepada penerima."}>
    <AdminBackLink to="/dashboard/umkm/klaim-masuk">Kembali ke Klaim Masuk</AdminBackLink>
    <LoadingOrError resource={resource} title="Memuat detail klaim" onRetry={resource.reload} />
    {claim ? <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <AdminPanel title={confirmation ? "Makanan sudah diserahkan?" : claim.listing.title} description={confirmation ? `${claim.listing.title} · ${claim.claimant.name} · ${claim.listing.quantity} porsi` : `Penerima · ${claim.claimant.name}`}>
        <div className="mt-4 flex items-center gap-3"><StateBadge status={claim.status === "active" ? "claimed" : claim.status} /><span className="text-sm text-[#63756B]">Diklaim {formatDateTime(claim.claimed_at)}</span></div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2"><Info label="Penerima" value={claim.claimant.name} /><Info label="Kontak" value={claim.claimant.phone || "Nomor kontak belum tersedia"} /><Info label="Jumlah" value={`${claim.listing.quantity} porsi disiapkan`} /><Info label="Waktu ambil" value={`${formatDateTime(claim.listing.pickup_starts_at)} – ${formatDateTime(claim.listing.pickup_ends_at)}`} /><Info label="Alamat usaha" value={`${claim.listing.pickup_address}, ${claim.listing.district}`} /></dl>
        {notice.message ? <p className={`mt-4 text-sm ${notice.type === "error" ? "text-[#A33B32]" : "text-[#236644]"}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p> : null}
        {claim.status === "active" && !confirmation ? <Link className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white" to={`/dashboard/umkm/klaim/${claim.id}/konfirmasi`}>Konfirmasi serah terima <ArrowUpRight size={16} /></Link> : null}
        {confirmation && claim.status === "active" ? <><p className="mt-4 rounded-xl bg-[#F5F7F1] p-4 text-sm leading-6 text-[#52645A]">Setelah dikonfirmasi, listing ditutup sebagai selesai dan masuk ke rekap dampak.</p><button className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} onClick={() => void confirm()} type="button"><Check size={17} />{busy ? "Menyimpan…" : "Ya, konfirmasi serah terima"}</button><Link className="ml-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#63756B]" to={`/dashboard/umkm/klaim/${claim.id}`}>Kembali ke detail klaim</Link></> : null}
      </AdminPanel>
      <div className="space-y-5"><AdminPanel title={expired ? "Status klaim" : "Sebelum menutup klaim"} description={expired ? "Status tercatat pada riwayat klaim penerima." : "Konfirmasi hanya jika makanan sudah diserahkan langsung kepada penerima."}><p className="mt-3 text-sm leading-6 text-[#63756B]">{expired ? "Klaim kedaluwarsa ketika batas pengambilan lewat. Listing tidak dapat dibuka kembali dari halaman ini." : "Jika ada kendala pada serah terima, laporkan agar tim SIPANA dapat meninjau."}</p><button className="mt-3 min-h-10 text-sm font-semibold text-[#A33B32]" onClick={() => setReportOpen((open) => !open)} type="button">Ada kendala? Laporkan <ArrowUpRight className="ml-1 inline" size={15} /></button>
        {reportOpen ? <div className="mt-4 space-y-3 border-t border-[#E8EEE7] pt-4"><label className="block text-sm font-semibold">Kategori<select className={inputClass} onChange={(event) => setCategory(event.target.value)} value={category}><option value="other">Lainnya</option><option value="food_safety">Keamanan pangan</option><option value="misrepresentation">Informasi tidak sesuai</option><option value="inappropriate_behavior">Perilaku tidak pantas</option></select></label><label className="block text-sm font-semibold">Keterangan<textarea className={`${inputClass} min-h-24 py-2`} maxLength={2000} onChange={(event) => setDescription(event.target.value)} value={description} /></label><button className="min-h-10 rounded-lg bg-[#A33B32] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} onClick={() => void report()} type="button">Kirim laporan</button></div> : null}
      </AdminPanel></div>
    </div> : null}
  </UmkmPage>;
}

function Info({ label, value }) { return <div className="min-w-0"><dt className="text-sm text-[#63756B]">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-[#183A2E]">{value || "—"}</dd></div>; }

export function UmkmProfilePage() {
  const { refresh } = useAuth();
  const resource = useApiResource("/api/umkm/profile", refresh);
  const [draft, setDraft] = useState({ key: "", values: {} });
  const [proofFile, setProofFile] = useState(null);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [busy, setBusy] = useState(false);
  const profileKey = resource.data?.email ?? "umkm-profile";
  const profileValues = resource.data ? { name: resource.data.name ?? "", phone: resource.data.phone ?? "", business_name: resource.data.business_name ?? "", business_type: resource.data.business_type ?? "", district: resource.data.district ?? districts[0], business_address: resource.data.business_address ?? "" } : {};
  const values = { ...profileValues, ...(draft.key === profileKey ? draft.values : {}) };
  const setValues = (next) => setDraft({ key: profileKey, values: next });
  async function save(event) {
    event.preventDefault(); setBusy(true); setNotice({ type: "", message: "" });
    try {
      const body = new FormData();
      Object.entries(values).forEach(([key, value]) => body.append(key, value));
      if (proofFile) body.append("business_proof", proofFile);
      body.append("_method", "PUT");
      const result = await apiRequest("/api/umkm/profile", { method: "POST", body });
      setProofFile(null);
      setNotice({ type: "success", message: result.message });
      resource.reload();
    }
    catch (error) { setNotice({ type: "error", message: error.message }); }
    finally { setBusy(false); }
  }
  const profile = resource.data;
  return <UmkmPage title="Profil & verifikasi" heading="Profil & Verifikasi" description="Periksa status pemeriksaan dan kelola informasi usaha.">
    <LoadingOrError resource={resource} title="Memuat profil usaha" onRetry={resource.reload} />
    {profile ? <><VerificationNotice verification={profile.verification} />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"><AdminPanel title="Informasi usaha" description="Perubahan identitas, kecamatan, alamat, atau foto usaha mengembalikan status ke antrean pemeriksaan.">
        <form className="mt-4 space-y-4" onSubmit={(event) => void save(event)}><div className="grid gap-4 sm:grid-cols-2"><Field label="Nama pemilik" required><input className={inputClass} maxLength={255} onChange={(event) => setValues({ ...values, name: event.target.value })} required value={values.name} /></Field><Field label="Email"><input className={`${inputClass} bg-[#F5F7F1]`} readOnly value={profile.email} /></Field></div><Field label="Nomor kontak" required><input className={inputClass} maxLength={20} onChange={(event) => setValues({ ...values, phone: event.target.value })} required value={values.phone} /></Field><Field label="Nama usaha" required><input className={inputClass} maxLength={160} onChange={(event) => setValues({ ...values, business_name: event.target.value })} required value={values.business_name} /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Jenis usaha" required><input className={inputClass} maxLength={80} onChange={(event) => setValues({ ...values, business_type: event.target.value })} required value={values.business_type} /></Field><Field label="Kecamatan" required><select className={inputClass} onChange={(event) => setValues({ ...values, district: event.target.value })} value={values.district}>{districts.map((district) => <option key={district}>{district}</option>)}</select></Field></div><Field label="Alamat pickup" required><textarea className={`${inputClass} min-h-24 py-2`} maxLength={1000} onChange={(event) => setValues({ ...values, business_address: event.target.value })} required value={values.business_address} /></Field><Field label="Ganti foto usaha" hint="Opsional · JPG, PNG, atau WebP, maks. 5 MB"><input accept="image/jpeg,image/png,image/webp" className="block min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 py-2 text-sm font-normal file:mr-3 file:rounded-md file:border-0 file:bg-[#E6F3E9] file:px-3 file:py-1 file:font-semibold file:text-[#236644]" onChange={(event) => setProofFile(event.target.files?.[0] ?? null)} type="file" />{proofFile ? <span className="mt-1 block text-xs font-normal text-[#63756B]">Berkas baru: {proofFile.name}</span> : null}</Field>{notice.message ? <p className={`text-sm ${notice.type === "error" ? "text-[#A33B32]" : "text-[#236644]"}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p> : null}<button className="min-h-11 rounded-lg bg-[#1C6B4A] px-5 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} type="submit">{busy ? "Menyimpan…" : "Simpan perubahan"}</button></form>
        </AdminPanel><div className="space-y-5"><AdminPanel title="Status pemeriksaan"><div className="mt-3 flex items-center gap-3"><StateBadge status={profile.verification.status === "verified" ? "completed" : profile.verification.status} /><span className="text-sm font-medium">{profile.verification.status === "verified" ? "Usaha terverifikasi" : profile.verification.status === "rejected" ? "Perlu perbaikan" : "Menunggu verifikasi"}</span></div><p className="mt-3 text-sm leading-6 text-[#63756B]">{profile.verification.reason || (profile.verification.status === "verified" ? `Terverifikasi ${formatDateTime(profile.verification.verified_at)}.` : "Admin akan meninjau informasi usaha dan foto yang dikirim saat pendaftaran.")}</p>{profile.verification.status !== "verified" ? <p className="mt-4 rounded-lg bg-[#F5F7F1] p-3 text-sm leading-6 text-[#63756B]">Posting listing akan tersedia setelah verifikasi disetujui.</p> : null}</AdminPanel><AdminPanel title="Dokumen usaha"><div className="mt-3 flex items-center gap-2 text-sm text-[#52645A]"><FileText size={17} className="text-[#1C6B4A]" />{profile.proof_submitted ? "Foto usaha sudah diterima" : "Dokumen belum tersedia"}</div><p className="mt-2 text-xs leading-5 text-[#829187]">Dokumen sensitif tidak ditampilkan di halaman publik.</p></AdminPanel><AdminPanel title="Persetujuan UMKM"><p className="mt-3 text-sm text-[#52645A]">{profile.terms?.accepted_at ? `Versi ${profile.terms.version} · disetujui ${formatDateTime(profile.terms.accepted_at)}` : "Ketentuan akan diminta sebelum posting pertama."}</p></AdminPanel><AdminPanel title="Kontak akun"><p className="mt-3 break-all text-sm text-[#52645A]">{profile.email}</p><p className="mt-1 text-sm text-[#52645A]">{profile.phone}</p></AdminPanel></div></div>
    </> : null}
  </UmkmPage>;
}

export function UmkmImpactPage() {
  const { refresh } = useAuth();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const resource = useApiResource(`/api/umkm/impact?month=${month}`, refresh);
  const report = resource.data;
  const max = Math.max(1, ...(report?.weekly_portions ?? []).map((week) => week.portions));
  return <UmkmPage title="Laporan dampak" heading="Dampak usaha saya" description="Ringkasan listing dan serah terima yang tercatat.">
    <div className="flex justify-end"><label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 text-sm font-medium text-[#52645A]">Periode <input aria-label="Pilih bulan laporan" className="min-h-9 border-0 bg-transparent font-semibold text-[#183A2E] outline-none" onChange={(event) => setMonth(event.target.value)} type="month" value={month} /></label></div>
    <LoadingOrError resource={resource} title="Memuat laporan dampak" onRetry={resource.reload} />
    {report ? <><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Listing dipublikasikan", report.published_listings], ["Klaim dibuat", report.claims], ["Serah terima selesai", report.completed_handovers], ["Porsi disalurkan", report.portions_distributed]].map(([label, value]) => <div className="rounded-2xl border border-[#DDE5DC] bg-white p-5" key={label}><p className="text-sm font-medium text-[#63756B]">{label}</p><p className="mt-2 text-3xl font-bold text-[#183A2E]">{value}</p></div>)}</section><div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]"><AdminPanel title="Distribusi per minggu"><div className="mt-5 space-y-4">{report.weekly_portions.map((week) => <div className="grid grid-cols-[75px_1fr_45px] items-center gap-3" key={week.week}><span className="text-sm text-[#63756B]">Minggu {week.week}</span><div aria-label={`${week.portions} porsi`} className="h-3 overflow-hidden rounded-full bg-[#E6EEE5]" role="img"><span className="block h-full rounded-full bg-[#1C6B4A]" style={{ width: `${Math.max(week.portions ? 3 : 0, (week.portions / max) * 100)}%` }} /></div><span className="text-right text-sm font-semibold tabular-nums">{week.portions}</span></div>)}</div></AdminPanel><div className="rounded-2xl border border-[#CFE2D1] bg-[#EAF4EB] p-5"><h3 className="font-semibold">Setiap porsi berarti</h3><p className="mt-2 text-sm leading-6 text-[#52645A]">Jumlah porsi dihitung dari listing dengan serah terima yang sudah dikonfirmasi.</p><p className="mt-4 text-xs text-[#63756B]">Berat makanan belum tersedia karena SIPANA mencatat jumlah porsi.</p></div></div></> : null}
  </UmkmPage>;
}

function Field({ label, hint, required, children }) { return <label className="block text-sm font-semibold text-[#364D41]">{label}{required ? <span className="ml-1 text-[#A33B32]">*</span> : null}{hint ? <span className="ml-2 text-xs font-normal text-[#829187]">{hint}</span> : null}<div className="mt-2">{children}</div></label>; }
const inputClass = "min-h-11 w-full rounded-lg border border-[#D2DDD2] bg-white px-3 text-sm font-normal text-[#183A2E] outline-none placeholder:text-[#829187] focus:border-[#1C6B4A] focus:ring-2 focus:ring-[#1C6B4A]/15 disabled:bg-[#F5F7F1]";
