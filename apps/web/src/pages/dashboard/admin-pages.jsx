import { useEffect, useState } from "react";
import { ArrowDownToLine, CalendarDays, MapPin, RefreshCw, Search } from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiDownload, apiRequest } from "../../lib/api.js";
import {
  AdminBackLink,
  AdminPage,
  AdminPageHeading,
  AdminPanel,
} from "../../components/dashboard/admin-ui.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";

function AdminDataPage({ title, heading, description, children }) {
  return (
    <AdminPage title={title}>
      <AdminPageHeading title={heading} description={description} />
      <div className="mt-7 space-y-5">{children}</div>
    </AdminPage>
  );
}

function currentJakartaMonth() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return `${year}-${month}`;
}

export function AdminVerificationQueue() {
  const { refresh } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    const timeout = window.setTimeout(() => { setSearch(searchInput.trim()); setPage(1); }, 250);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ status: "pending", page: String(page) });
    if (search) params.set("search", search);
    apiRequest(`/api/admin/verifications?${params}`).then((data) => {
      if (active) { setResult(data); setStatus({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [page, refresh, reload, search]);

  return (
    <AdminDataPage
      title="Verifikasi UMKM"
      heading="Antrean verifikasi UMKM"
      description="Tinjau data usaha sebelum mitra dapat memublikasikan surplus pangan."
    >
      <AdminPanel title="Pengajuan menunggu pemeriksaan" description="Buka pengajuan untuk memeriksa data pemilik dan foto usaha.">
        <label className="mt-4 block max-w-xl text-sm font-semibold text-[#364D41]">Cari nama pemilik atau usaha
          <span className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-[#D2DDD2] bg-white px-3"><Search aria-hidden="true" className="text-[#829187]" size={17} /><input className="min-w-0 flex-1 border-0 bg-transparent text-sm font-normal outline-none" onChange={(event) => setSearchInput(event.target.value)} placeholder="Contoh: Dapur Bu Wati" value={searchInput} /></span>
        </label>
        {status.type === "loading" ? <div className="mt-4"><DashboardState title="Memuat antrean verifikasi" description="Mengambil data pengajuan…" tone="loading" compact /></div> : null}
        {status.type === "error" ? <div className="mt-4"><DashboardState title="Antrean belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((value) => value + 1)} tone="error" compact /></div> : null}
        {status.type === "ready" ? result?.data?.length ? <div className="mt-5 overflow-x-auto rounded-xl border border-[#E5EBE4]"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#F5F7F1] text-[11px] font-semibold uppercase tracking-wide text-[#63756B]"><tr>{["Usaha / pemilik", "Kecamatan", "Tanggal pengajuan", "Status", "Aksi"].map((column) => <th className="px-4 py-3" key={column}>{column}</th>)}</tr></thead><tbody className="divide-y divide-[#E8EEE7]">{result.data.map((item) => <tr key={item.id}><td className="px-4 py-4"><p className="font-semibold text-[#183A2E]">{item.business_name}</p><p className="mt-1 text-xs text-[#63756B]">{item.owner} · {item.email}</p></td><td className="px-4 py-4">{item.district || "—"}</td><td className="px-4 py-4">{new Date(item.submitted_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}</td><td className="px-4 py-4"><span className="rounded-full bg-[#FFF3D8] px-3 py-1.5 text-xs font-semibold text-[#795D23]">Menunggu</span></td><td className="px-4 py-4"><Link className="font-semibold text-[#1C6B4A] hover:underline" to={`/dashboard/admin/verifikasi/${item.id}`}>Tinjau</Link></td></tr>)}</tbody></table></div> : <p className="mt-5 rounded-xl bg-[#F5F7F1] p-5 text-sm text-[#63756B]">Tidak ada pengajuan yang menunggu pemeriksaan.</p> : null}
        {status.type === "ready" && result?.last_page > 1 ? <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm text-[#63756B]">Halaman {result.current_page} dari {result.last_page}</p><div className="flex gap-2"><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.prev_page_url} onClick={() => setPage((value) => value - 1)} type="button">Sebelumnya</button><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.next_page_url} onClick={() => setPage((value) => value + 1)} type="button">Berikutnya</button></div></div> : null}
      </AdminPanel>
    </AdminDataPage>
  );
}

export function AdminVerificationDetail() {
  const { applicationId } = useParams();
  const { refresh } = useAuth();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    apiRequest(`/api/admin/verifications/${applicationId}`).then((data) => {
      if (active) { setApplication(data); setStatus({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [applicationId, refresh]);

  async function decide(nextStatus) {
    setBusy(true); setNotice({ type: "", message: "" });
    try {
      const response = await apiRequest(`/api/admin/verifications/${applicationId}`, { method: "PUT", body: { status: nextStatus, ...(nextStatus === "rejected" ? { reason } : {}) } });
      setApplication(response.application);
      setNotice({ type: "success", message: response.message });
    } catch (error) { setNotice({ type: "error", message: error.message }); }
    finally { setBusy(false); }
  }

  return (
    <AdminDataPage
      title="Tinjau pengajuan UMKM"
      heading="Detail pengajuan"
      description="Periksa data dan dokumen usaha sebelum mengambil keputusan."
    >
      <AdminBackLink to="/dashboard/admin/verifikasi">Kembali ke antrean</AdminBackLink>
      {status.type === "loading" ? <DashboardState title="Memuat pengajuan" description="Mengambil data usaha dan berkas…" tone="loading" /> : null}
      {status.type === "error" ? <DashboardState title="Pengajuan tidak dapat dimuat" description={status.message} tone="error" /> : null}
      {application ? <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <AdminPanel title={application.business_name} description={`${application.owner} · ${application.business_type}`}>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2"><div><dt className="text-sm text-[#63756B]">Email pemilik</dt><dd className="mt-1 break-all font-semibold">{application.email}</dd></div><div><dt className="text-sm text-[#63756B]">Nomor kontak</dt><dd className="mt-1 font-semibold">{application.phone || "—"}</dd></div><div><dt className="text-sm text-[#63756B]">Kecamatan</dt><dd className="mt-1 font-semibold">{application.district || "—"}</dd></div><div><dt className="text-sm text-[#63756B]">Diajukan</dt><dd className="mt-1 font-semibold">{new Date(application.submitted_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</dd></div><div className="sm:col-span-2"><dt className="text-sm text-[#63756B]">Alamat usaha</dt><dd className="mt-1 font-semibold">{application.business_address}</dd></div></dl>
          {application.status === "rejected" && application.reason ? <p className="mt-5 rounded-xl bg-[#FFF5F3] p-4 text-sm leading-6 text-[#8D3029]">Alasan sebelumnya: {application.reason}</p> : null}
        </AdminPanel>
        <div className="space-y-5"><AdminPanel title="Foto usaha"><a href={application.document_url} rel="noreferrer" target="_blank"><img alt={`Bukti usaha ${application.business_name}`} className="mt-3 max-h-[420px] w-full rounded-xl border border-[#E5EBE4] object-contain" src={application.document_url} /></a><p className="mt-2 text-xs text-[#829187]">Berkas ini hanya dapat diakses oleh administrator.</p></AdminPanel>
          <AdminPanel title="Keputusan verifikasi" description="Persetujuan mengaktifkan fitur publikasi listing untuk UMKM.">
            {application.status === "verified" ? <p className="mt-3 text-sm font-semibold text-[#236644]">Akun ini sudah terverifikasi.</p> : <><label className="mt-3 block text-sm font-semibold text-[#364D41]">Alasan jika ditolak<textarea className="mt-2 min-h-24 w-full rounded-lg border border-[#D2DDD2] px-3 py-2 text-sm font-normal outline-none focus:border-[#1C6B4A] focus:ring-2 focus:ring-[#1C6B4A]/15" maxLength={1000} onChange={(event) => setReason(event.target.value)} placeholder="Jelaskan bagian yang perlu diperbaiki" value={reason} /></label><div className="mt-4 flex flex-wrap gap-2"><button className="min-h-11 rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} onClick={() => void decide("verified")} type="button">{busy ? "Menyimpan…" : "Setujui verifikasi"}</button><button className="min-h-11 rounded-lg border border-[#A33B32] px-4 text-sm font-semibold text-[#A33B32] disabled:opacity-60" disabled={busy || reason.trim().length < 5} onClick={() => void decide("rejected")} type="button">Tolak pengajuan</button></div></>}
            {notice.message ? <p className={`mt-3 text-sm ${notice.type === "error" ? "text-[#A33B32]" : "text-[#236644]"}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p> : null}
          </AdminPanel>
        </div>
      </div> : null}
    </AdminDataPage>
  );
}

const reportCategoryLabels = {
  food_safety: "Keamanan pangan",
  misrepresentation: "Informasi tidak sesuai",
  inappropriate_behavior: "Perilaku tidak pantas",
  other: "Lainnya",
};

function reportStatusLabel(status) {
  return ({ open: "Menunggu tinjau", under_review: "Sedang ditinjau", awaiting_response: "Menunggu jawaban", resolved_no_action: "Tanpa tindakan", resolved_action: "Keputusan dibuat", appealed: "Banding masuk", appeal_resolved: "Banding diputus" })[status] ?? status;
}

function formatReportDate(value, withTime = true) {
  if (!value) return "—";
  return new Date(value).toLocaleString("id-ID", withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" });
}

export function AdminReportQueue() {
  const { refresh } = useAuth();
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    let active = true;
    apiRequest(`/api/admin/reports?page=${page}`).then((data) => {
      if (active) { setResult(data); setStatus({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [page, refresh, reload]);

  return (
    <AdminDataPage
      title="Laporan masuk"
      heading="Laporan masuk"
      description="Tinjau laporan keamanan pangan dan ketidaksesuaian. Identitas pelapor tetap dirahasiakan."
    >
      <div className="flex justify-end"><button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 text-sm font-semibold text-[#52645A] hover:bg-[#F5F7F1]" onClick={() => setReload((value) => value + 1)} type="button"><RefreshCw aria-hidden="true" size={15} />Muat ulang</button></div>
      <AdminPanel title="Antrean laporan" description="Laporan terbaru dari warga dan UMKM.">
        {status.type === "loading" ? <div className="mt-4"><DashboardState title="Memuat laporan" description="Mengambil antrean laporan…" tone="loading" compact /></div> : null}
        {status.type === "error" ? <div className="mt-4"><DashboardState title="Laporan belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((value) => value + 1)} tone="error" compact /></div> : null}
        {status.type === "ready" && result?.data?.length ? <div className="mt-5 overflow-x-auto rounded-xl border border-[#E5EBE4]"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#F5F7F1] text-[11px] font-semibold uppercase tracking-wide text-[#63756B]"><tr>{["ID laporan", "Listing / usaha", "Kategori", "Diterima", "Status", ""].map((column) => <th className="px-4 py-3" key={column}>{column}</th>)}</tr></thead><tbody className="divide-y divide-[#E8EEE7]">{result.data.map((report) => <tr key={report.id}><td className="px-4 py-4 font-semibold">#{report.id}</td><td className="px-4 py-4"><p className="font-semibold text-[#183A2E]">{report.target_title || (report.target_type === "claim" ? "Klaim" : "Listing")}</p><p className="mt-1 text-xs text-[#63756B]">{report.business_name || "Usaha"}{report.district ? ` · ${report.district}` : ""}</p></td><td className="px-4 py-4">{reportCategoryLabels[report.category] ?? report.category}</td><td className="px-4 py-4">{formatReportDate(report.created_at)}</td><td className="px-4 py-4"><span className="rounded-full bg-[#FFF3D8] px-3 py-1.5 text-xs font-semibold text-[#795D23]">{reportStatusLabel(report.status)}</span></td><td className="px-4 py-4"><Link className="font-semibold text-[#1C6B4A] hover:underline" to={`/dashboard/admin/laporan/${report.id}`}>Tinjau</Link></td></tr>)}</tbody></table></div> : null}
        {status.type === "ready" && !result?.data?.length ? <p className="mt-4 rounded-xl bg-[#F5F7F1] p-5 text-sm text-[#63756B]">Belum ada laporan masuk.</p> : null}
        {status.type === "ready" && result?.last_page > 1 ? <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm text-[#63756B]">Halaman {result.current_page} dari {result.last_page}</p><div className="flex gap-2"><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.prev_page_url} onClick={() => setPage((value) => value - 1)} type="button">Sebelumnya</button><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.next_page_url} onClick={() => setPage((value) => value + 1)} type="button">Berikutnya</button></div></div> : null}
      </AdminPanel>
    </AdminDataPage>
  );
}

export function AdminReportDetail() {
  const { reportId } = useParams();
  const { refresh } = useAuth();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    let active = true;
    apiRequest(`/api/admin/reports/${reportId}`).then((data) => {
      if (active) { setReport(data); setStatus({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [reportId, refresh]);

  return (
    <AdminDataPage
      title="Tinjau laporan"
      heading={`Tinjau laporan ${reportId}`}
      description="Periksa detail laporan tanpa menampilkan identitas pelapor."
    >
      <AdminBackLink to="/dashboard/admin/laporan">Kembali ke laporan</AdminBackLink>
      {status.type === "loading" ? <DashboardState title="Memuat detail laporan" description="Mengambil informasi listing dan laporan…" tone="loading" /> : null}
      {status.type === "error" ? <DashboardState title="Detail laporan tidak dapat dimuat" description={status.message} tone="error" /> : null}
      {report ? <AdminPanel title={report.target_title || (report.target_type === "claim" ? "Laporan klaim" : "Laporan listing")} description={report.business_name || "Informasi usaha tidak tersedia"}>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2"><div><dt className="text-sm text-[#63756B]">Kategori</dt><dd className="mt-1 font-semibold">{reportCategoryLabels[report.category] ?? report.category}</dd></div><div><dt className="text-sm text-[#63756B]">Status</dt><dd className="mt-1 font-semibold">{reportStatusLabel(report.status)}</dd></div><div><dt className="text-sm text-[#63756B]">Diterima</dt><dd className="mt-1 font-semibold">{formatReportDate(report.created_at)}</dd></div><div><dt className="text-sm text-[#63756B]">Kecamatan</dt><dd className="mt-1 font-semibold">{report.district || "—"}</dd></div><div className="sm:col-span-2"><dt className="text-sm text-[#63756B]">Keterangan pelapor</dt><dd className="mt-1 whitespace-pre-wrap rounded-xl bg-[#F5F7F1] p-4 text-sm leading-6 text-[#364D41]">{report.description || "Pelapor tidak menambahkan keterangan."}</dd></div></dl>
      </AdminPanel> : null}
    </AdminDataPage>
  );
}

export function AdminImpactRecap() {
  const { refresh } = useAuth();
  const [month, setMonth] = useState(currentJakartaMonth);
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtError, setDistrictError] = useState("");
  const [districtReload, setDistrictReload] = useState(0);
  const [impact, setImpact] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    apiRequest("/api/reference-data").then((data) => {
      if (active) {
        setDistricts(data.listing_districts ?? []);
        setDistrictError("");
      }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setDistrictError(error.message || "Daftar kecamatan gagal dimuat.");
    });
    return () => { active = false; };
  }, [districtReload, refresh]);
  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ month });
    if (district) params.set("district", district);
    apiRequest("/api/admin/impact?" + params).then((data) => { if (active) { setImpact(data); setStatus({ type: "ready", message: "" }); } }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [district, month, refresh, reload]);
  const metrics = ["Listing terbit", "Klaim dibuat", "Serah terima selesai", "Porsi tersalurkan"];
  const metricValues = [impact?.published_listings ?? 0, impact?.claims ?? 0, impact?.completed_handovers ?? 0, impact?.portions_distributed ?? 0];

  return (
    <AdminDataPage
      title="Rekap dampak"
      heading="Rekap dampak SIPANA"
      description="Pantau serah terima yang selesai menurut periode dan kecamatan."
      >
      <div className="flex flex-wrap items-end gap-3 text-sm">
        <label className="text-sm font-semibold text-[#364D41]">Bulan<span className="mt-2 flex min-h-10 items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 font-normal text-[#63756B]"><CalendarDays aria-hidden="true" size={16} /><input className="bg-transparent outline-none" onChange={(event) => setMonth(event.target.value)} type="month" value={month} /></span></label>
        <label className="text-sm font-semibold text-[#364D41]">Kecamatan<span className="mt-2 flex min-h-10 items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 font-normal text-[#63756B]"><MapPin aria-hidden="true" size={16} /><select className="bg-transparent outline-none" onChange={(event) => setDistrict(event.target.value)} value={district}><option value="">Semua kecamatan</option>{districts.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></span></label>
        <button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 font-semibold text-[#52645A]" onClick={() => setReload((value) => value + 1)} type="button"><RefreshCw aria-hidden="true" size={15} />Muat ulang</button>
        <Link className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1C6B4A] px-4 font-semibold text-white hover:bg-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]" to="/dashboard/admin/ekspor"><ArrowDownToLine aria-hidden="true" size={16} /> Ekspor data</Link>
      </div>
      {districtError ? <p aria-live="polite" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F0DCA8] bg-[#FFF6E2] px-4 py-3 text-sm text-[#795D23]" role="alert">Daftar kecamatan gagal dimuat ({districtError}). Rekap saat ini mencakup semua kecamatan.<button className="min-h-9 rounded-lg border border-[#D8BD78] px-3 font-semibold" onClick={() => setDistrictReload((value) => value + 1)} type="button">Coba muat ulang</button></p> : null}
      {status.type === "loading" ? <DashboardState title="Memuat rekap dampak" description="Menghitung listing dan serah terima…" tone="loading" compact /> : null}
      {status.type === "error" ? <DashboardState title="Rekap dampak belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((value) => value + 1)} tone="error" compact /> : null}
      {status.type === "ready" ? <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <AdminPanel className="min-h-28" key={metric}>
            <p className="text-sm text-[#63756B]">{metric}</p>
            <p className="mt-3 text-xl font-bold text-[#183A2E]">{Number(metricValues[index]).toLocaleString("id-ID")}</p>
          </AdminPanel>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <AdminPanel title="Porsi tersalurkan per minggu" description="Porsi dari klaim yang selesai pada setiap pekan dalam bulan terpilih.">
          <div className="mt-5 space-y-3">{(impact?.weekly_portions ?? []).map((item) => <div className="grid grid-cols-[5rem_1fr_5rem] items-center gap-3 text-sm" key={item.week}><span className="text-[#63756B]">Minggu {item.week}</span><div className="h-2 overflow-hidden rounded-full bg-[#E8EEE7]"><div className="h-full rounded-full bg-[#1C6B4A]" style={{ width: Math.min(100, impact?.portions_distributed ? item.portions / impact.portions_distributed * 100 : 0) + "%" }} /></div><span className="text-right font-semibold">{Number(item.portions).toLocaleString("id-ID")} porsi</span></div>)}</div>
        </AdminPanel>
        <AdminPanel title="Rincian kecamatan" description="Rekap berdasarkan wilayah layanan.">
          {(impact?.district_breakdown ?? []).length ? <div className="mt-4 divide-y divide-[#E8EEE7]">{impact.district_breakdown.map((item) => <div className="flex items-center justify-between gap-3 py-3 text-sm" key={item.key}><span className="font-medium">{item.label}</span><span className="text-right text-[#63756B]">{item.handovers} serah terima · {Number(item.portions).toLocaleString("id-ID")} porsi</span></div>)}</div> : <p className="mt-4 rounded-xl bg-[#F5F7F1] p-4 text-sm text-[#63756B]">Belum ada serah terima selesai pada periode ini.</p>}
        </AdminPanel>
      </div>
      <p className="rounded-xl border border-[#F0DCA8] bg-[#FFF6E2] px-4 py-3 text-sm leading-6 text-[#795D23]">Dampak dihitung dari klaim yang sudah dikonfirmasi selesai. Satu listing yang diklaim utuh dihitung sesuai jumlah porsinya.</p>
      </> : null}
    </AdminDataPage>
  );
}

export function AdminExportPage() {
  const { refresh } = useAuth();
  const [month, setMonth] = useState(currentJakartaMonth);
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    apiRequest("/api/reference-data").then((data) => {
      if (active) setDistricts(data.listing_districts ?? []);
    }).catch((error) => {
      if (active && (error.status === 401 || error.status === 403)) void refresh();
      else if (active) setNotice({ type: "error", message: error.message });
    }).finally(() => { if (active) setLoadingDistricts(false); });
    return () => { active = false; };
  }, [refresh]);

  async function downloadCsv() {
    if (busy || !month) return;
    setBusy(true);
    setNotice({ type: "", message: "" });
    try {
      const params = new URLSearchParams({ month });
      if (district) params.set("district", district);
      const blob = await apiDownload(`/api/admin/impact/export?${params}`);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `rekap-dampak-${month}${district ? `-${district}` : ""}.csv`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice({ type: "success", message: "Berkas CSV berhasil diunduh." });
    } catch (error) {
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setNotice({ type: "error", message: error.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminDataPage
      title="Ekspor rekap dampak"
      heading="Ekspor rekap dampak"
      description="Unduh aktivitas listing, klaim, dan serah terima sesuai bulan dan kecamatan."
    >
      <AdminBackLink to="/dashboard/admin/dampak">Kembali ke rekap dampak</AdminBackLink>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <AdminPanel title="Atur ekspor">
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#364D41]">Bulan<span className="mt-2 flex min-h-11 items-center rounded-lg border border-[#DDE5DC] bg-white px-3 font-normal"><input className="w-full bg-transparent outline-none" onChange={(event) => setMonth(event.target.value)} type="month" value={month} /></span></label>
            <label className="text-sm font-semibold text-[#364D41]">Kecamatan<span className="mt-2 flex min-h-11 items-center rounded-lg border border-[#DDE5DC] bg-white px-3 font-normal"><select className="w-full bg-transparent outline-none" disabled={loadingDistricts} onChange={(event) => setDistrict(event.target.value)} value={district}><option value="">Semua kecamatan</option>{districts.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></span></label>
          </div>
          {notice.message ? <p aria-live="polite" className={`mt-4 rounded-lg p-3 text-sm ${notice.type === "error" ? "bg-[#FFF0EE] text-[#A33B32]" : "bg-[#E6F3E9] text-[#236644]"}`}>{notice.message}</p> : null}
          <button className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white hover:bg-[#183A2E] disabled:cursor-wait disabled:opacity-60" disabled={busy || !month || loadingDistricts} onClick={() => void downloadCsv()} type="button"><ArrowDownToLine aria-hidden="true" size={17} /> {busy ? "Menyiapkan CSV…" : "Unduh CSV"}</button>
        </AdminPanel>
        <AdminPanel title="Data yang disertakan">
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#52645A]">
            <li>Judul listing, usaha, dan peruntukan</li>
            <li>Periode dan kecamatan</li>
            <li>Status listing, klaim, dan serah terima selesai</li>
            <li>Jumlah porsi tersalurkan dan waktu ekspor</li>
          </ul>
          <p className="mt-6 rounded-xl bg-[#F5F7F1] p-4 text-sm leading-6 text-[#63756B]">Berkas berisi satu baris per listing yang memiliki aktivitas pada bulan terpilih. Informasi pribadi penerima tidak disertakan.</p>
        </AdminPanel>
      </div>
    </AdminDataPage>
  );
}

export function AdminAuditLog() {
  const { refresh } = useAuth();
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    apiRequest("/api/admin/audit-logs?page=" + page).then((data) => {
      if (active) { setResult(data); setStatus({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [page, refresh, reload]);
  return (
    <AdminDataPage
      title="Audit log"
      heading="Audit log"
      description="Riwayat keputusan verifikasi, moderasi, dan perubahan status."
    >
      <AdminPanel title="Aktivitas administrator" description="Aktivitas tercatat sejak audit log diaktifkan. Perubahan kecamatan/peruntukan dan keputusan verifikasi disimpan beserta nilai sebelum dan sesudah.">
        {status.type === "loading" ? <div className="mt-4"><DashboardState title="Memuat audit log" description="Mengambil aktivitas admin…" tone="loading" compact /></div> : null}
        {status.type === "error" ? <div className="mt-4"><DashboardState title="Audit log belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((value) => value + 1)} tone="error" compact /></div> : null}
        {status.type === "ready" ? <>
          {result?.data?.length ? <div className="mt-5 overflow-x-auto rounded-xl border border-[#E5EBE4]"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#F5F7F1] text-[11px] font-semibold uppercase tracking-wide text-[#63756B]"><tr>{["Waktu", "Aktor", "Tindakan", "Entitas", "Perubahan", "Alasan"].map((column) => <th className="px-4 py-3" key={column}>{column}</th>)}</tr></thead><tbody className="divide-y divide-[#E8EEE7]">{result.data.map((log) => <tr key={log.id}><td className="whitespace-nowrap px-4 py-3">{new Date(log.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</td><td className="px-4 py-3">{log.actor_name || "Admin dihapus"}</td><td className="px-4 py-3 font-medium">{log.action.replaceAll("_", " ").replaceAll(".", " · ")}</td><td className="px-4 py-3">{log.entity_type} #{log.entity_id}</td><td className="max-w-sm whitespace-pre-wrap px-4 py-3 text-xs text-[#63756B]">{log.before || log.after ? <details><summary className="cursor-pointer font-semibold text-[#1C6B4A]">Lihat nilai</summary><pre className="mt-2 whitespace-pre-wrap">{JSON.stringify({ sebelum: log.before, sesudah: log.after }, null, 2)}</pre></details> : "—"}</td><td className="max-w-xs whitespace-pre-wrap px-4 py-3 text-[#63756B]">{log.reason || "—"}</td></tr>)}</tbody></table></div> : <p className="mt-4 rounded-xl bg-[#F5F7F1] p-5 text-sm text-[#63756B]">Belum ada aktivitas admin yang tersimpan.</p>}
          {result?.last_page > 1 ? <div className="mt-4 flex items-center justify-between gap-3"><p className="text-sm text-[#63756B]">Halaman {result.current_page} dari {result.last_page} · {result.total} aktivitas</p><div className="flex gap-2"><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.prev_page_url} onClick={() => setPage((value) => value - 1)} type="button">Sebelumnya</button><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.next_page_url} onClick={() => setPage((value) => value + 1)} type="button">Berikutnya</button></div></div> : null}
        </> : null}
      </AdminPanel>
    </AdminDataPage>
  );
}

export function AdminUserManagement() {
  const { refresh } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);

    Promise.resolve()
      .then(() => {
        if (active) setStatus({ type: "loading", message: "" });
        return apiRequest(`/api/admin/users?${params}`);
      })
      .then((data) => {
        if (!active) return;
        setResult(data);
        setStatus({ type: "ready", message: "" });
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
  }, [page, refresh, reload, search]);

  return (
    <AdminDataPage
      title="Pengguna"
      heading="Manajemen pengguna"
      description="Lihat akun yang terdaftar. Halaman ini bersifat baca saja; perubahan akun belum tersedia."
    >
      <AdminPanel title="Akun terdaftar" description="Nama, email, peran, dan tanggal pembuatan akun.">
        <label className="mt-4 flex min-h-11 max-w-lg items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 focus-within:border-[#1C6B4A] focus-within:ring-2 focus-within:ring-[#1C6B4A]/20">
          <Search aria-hidden="true" className="shrink-0 text-[#63756B]" size={18} />
          <span className="sr-only">Cari nama atau email</span>
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-[#829187]" onChange={(event) => setSearchInput(event.target.value)} placeholder="Cari nama atau email" type="search" value={searchInput} />
        </label>
        {status.type === "loading" ? (
          <div className="mt-5"><DashboardState title="Memuat pengguna" description="Mengambil akun dari server SIPANA…" tone="loading" /></div>
        ) : status.type === "error" ? (
          <div className="mt-5"><DashboardState title="Data pengguna belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((current) => current + 1)} tone="error" /></div>
        ) : (
          <>
            <div className="mt-5 overflow-hidden rounded-xl border border-[#E5EBE4]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-[#F5F7F1] text-[11px] font-semibold uppercase tracking-wide text-[#63756B]"><tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Peran</th><th className="px-4 py-3">Terdaftar</th></tr></thead>
                  <tbody className="divide-y divide-[#E8EEE7]">
                    {result?.data?.length ? result.data.map((account) => (
                      <tr key={account.id}>
                        <td className="px-4 py-3 font-medium text-[#183A2E]">{account.name}</td>
                        <td className="px-4 py-3 text-[#52645A]">{account.email}</td>
                        <td className="px-4 py-3 capitalize text-[#52645A]">{account.role}</td>
                        <td className="px-4 py-3 text-[#52645A]">{new Date(account.created_at).toLocaleDateString("id-ID")}</td>
                      </tr>
                    )) : <tr><td className="px-4 py-8 text-center text-[#63756B]" colSpan={4}>{search ? "Tidak ada akun yang cocok." : "Belum ada akun terdaftar."}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#63756B]">
              <p>Menampilkan {result?.from ?? 0}–{result?.to ?? 0} dari {result?.total ?? 0} akun</p>
              <div className="flex gap-2">
                <button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50" disabled={!result?.prev_page_url} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">Sebelumnya</button>
                <button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50" disabled={!result?.next_page_url} onClick={() => setPage((current) => current + 1)} type="button">Berikutnya</button>
              </div>
            </div>
          </>
        )}
      </AdminPanel>
    </AdminDataPage>
  );
}

export function AdminPlatformMetrics() {
  const { refresh } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => {
        if (active) setStatus({ type: "loading", message: "" });
        return apiRequest("/api/admin/metrics");
      })
      .then((data) => {
        if (!active) return;
        setMetrics(data);
        setStatus({ type: "ready", message: "" });
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
  }, [refresh, reload]);

  const roleLabels = { community: "Anggota komunitas", umkm: "UMKM", admin: "Admin" };

  return (
    <AdminDataPage
      title="Metrik platform"
      heading="Metrik platform"
      description="Ringkasan akun, listing, klaim, laporan, dan serah terima dihitung langsung dari basis data SIPANA."
    >
      {status.type === "loading" ? <DashboardState title="Memuat metrik" description="Menghitung akun terdaftar dari server SIPANA…" tone="loading" /> : null}
      {status.type === "error" ? <DashboardState title="Metrik belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((current) => current + 1)} tone="error" /> : null}
      {status.type === "ready" ? <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminPanel className="min-h-32"><p className="text-sm text-[#63756B]">Total akun</p><p className="mt-3 text-3xl font-bold text-[#183A2E]">{metrics.total_users}</p></AdminPanel>
          <AdminPanel className="min-h-32"><p className="text-sm text-[#63756B]">Akun baru · 30 hari</p><p className="mt-3 text-3xl font-bold text-[#183A2E]">{metrics.new_users_last_30_days}</p></AdminPanel>
          {Object.entries(roleLabels).map(([role, label]) => <AdminPanel className="min-h-28" key={role}><p className="text-sm text-[#63756B]">{label}</p><p className="mt-3 text-2xl font-bold text-[#183A2E]">{metrics.users_by_role?.[role] ?? 0}</p></AdminPanel>)}
        </div>
        <p className="text-xs text-[#829187]">Data diperbarui {new Date(metrics.generated_at).toLocaleString("id-ID")}.</p>
      </> : null}
      {status.type === "ready" ? <AdminPanel title="Metrik operasional" description="Jumlah status listing dan klaim saat ini, serta porsi dari serah terima yang sudah selesai.">
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Total listing", metrics.listings?.total], ["Listing aktif", metrics.listings?.published], ["Total klaim", metrics.claims?.total], ["Klaim selesai", metrics.claims?.completed], ["Laporan terbuka", metrics.open_reports], ["Verifikasi menunggu", metrics.pending_verifications], ["Porsi disalurkan", metrics.listings?.portions_distributed]].map(([label, value]) => <div className="rounded-xl bg-[#F5F7F1] p-4" key={label}><p className="text-sm text-[#63756B]">{label}</p><p className="mt-2 text-2xl font-bold text-[#183A2E]">{Number(value ?? 0).toLocaleString("id-ID")}</p></div>)}</div>
        <div className="mt-4 flex flex-wrap gap-2">{Object.entries(metrics.listings ?? {}).filter(([key, value]) => !["total", "portions_distributed", "by_district"].includes(key) && ["string", "number"].includes(typeof value)).map(([key, value]) => <span className="rounded-full bg-[#F5F7F1] px-3 py-1.5 text-xs text-[#52645A]" key={"listing-" + key}>Listing {key}: {value}</span>)}{Object.entries(metrics.claims ?? {}).filter(([key, value]) => key !== "total" && ["string", "number"].includes(typeof value)).map(([key, value]) => <span className="rounded-full bg-[#F5F7F1] px-3 py-1.5 text-xs text-[#52645A]" key={"claim-" + key}>Klaim {key}: {value}</span>)}</div>
      </AdminPanel> : null}
    </AdminDataPage>
  );
}

export function AdminMasterData() {
  const { refresh } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [newItem, setNewItem] = useState({ type: "district", label: "", available_for_listings: true });
  useEffect(() => {
    let active = true;
    apiRequest("/api/admin/master-data").then((data) => { if (active) { setItems(data); setStatus({ type: "ready", message: "" }); } }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [refresh, reload]);

  async function createItem(event) {
    event.preventDefault(); setBusy(true); setNotice({ type: "", message: "" });
    try {
      const result = await apiRequest("/api/admin/master-data", { method: "POST", body: newItem });
      setNotice({ type: "success", message: result.message });
      setNewItem((value) => ({ ...value, label: "" }));
      setReload((value) => value + 1);
    } catch (error) { setNotice({ type: "error", message: error.message }); }
    finally { setBusy(false); }
  }

  async function saveItem(item) {
    setBusyId(item.id); setNotice({ type: "", message: "" });
    try {
      const result = await apiRequest("/api/admin/master-data/" + item.id, { method: "PUT", body: { label: item.label, is_active: item.is_active, available_for_listings: item.available_for_listings } });
      setNotice({ type: "success", message: result.message }); setReload((value) => value + 1);
    } catch (error) { setNotice({ type: "error", message: error.message }); }
    finally { setBusyId(null); }
  }

  async function deleteItem(item) {
    setBusyId(item.id); setNotice({ type: "", message: "" });
    try {
      const result = await apiRequest("/api/admin/master-data/" + item.id, { method: "DELETE" });
      setNotice({ type: "success", message: result.message }); setReload((value) => value + 1);
    } catch (error) { setNotice({ type: "error", message: error.message }); }
    finally { setBusyId(null); }
  }

  function updateItem(itemId, field, value) {
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, [field]: value } : item));
  }

  return (
    <AdminDataPage
      title="Data master"
      heading="Pengelolaan data master"
      description="Kelola daftar kecamatan dan peruntukan listing. Referensi yang sedang dipakai hanya dapat dinonaktifkan."
    >
      <AdminPanel title="Tambah referensi">
        <form className="mt-4 grid gap-3 sm:grid-cols-[12rem_1fr_auto]" onSubmit={(event) => void createItem(event)}>
          <select aria-label="Jenis referensi" className="min-h-11 rounded-lg border border-[#D2DDD2] bg-white px-3 text-sm" onChange={(event) => setNewItem((value) => ({ ...value, type: event.target.value }))} value={newItem.type}><option value="district">Kecamatan</option><option value="purpose">Peruntukan listing</option></select>
          <input className="min-h-11 rounded-lg border border-[#D2DDD2] px-3 text-sm" maxLength={120} minLength={2} onChange={(event) => setNewItem((value) => ({ ...value, label: event.target.value }))} placeholder="Nama kecamatan / peruntukan" required value={newItem.label} />
          <button className="min-h-11 rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white disabled:opacity-60" disabled={busy} type="submit">Tambah</button>
          {newItem.type === "district" ? <label className="flex items-center gap-2 text-sm text-[#52645A] sm:col-start-2"><input checked={newItem.available_for_listings} onChange={(event) => setNewItem((value) => ({ ...value, available_for_listings: event.target.checked }))} type="checkbox" />Tersedia untuk listing UMKM</label> : null}
        </form>
        {notice.message ? <p className={"mt-3 text-sm " + (notice.type === "error" ? "text-[#A33B32]" : "text-[#236644]")} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</p> : null}
      </AdminPanel>
      {status.type === "loading" ? <DashboardState title="Memuat data master" description="Mengambil kecamatan dan peruntukan…" tone="loading" /> : null}
      {status.type === "error" ? <DashboardState title="Data master belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((value) => value + 1)} tone="error" /> : null}
      {status.type === "ready" ? ["district", "purpose"].map((type) => <AdminPanel key={type} title={type === "district" ? "Kecamatan" : "Peruntukan listing"}>
        <div className="mt-4 space-y-3">{items.filter((item) => item.type === type).map((item) => <div className="grid gap-3 rounded-xl border border-[#E5EBE4] p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center" key={item.id}>
          <div><input aria-label={"Nama " + item.label} className="min-h-10 w-full rounded-lg border border-[#D2DDD2] px-3 text-sm font-semibold" onChange={(event) => updateItem(item.id, "label", event.target.value)} value={item.label} /><p className="mt-1 text-xs text-[#63756B]">Key: {item.key} · Dipakai {item.usage_count} kali</p></div>
          <div className="flex flex-wrap gap-3 text-xs text-[#52645A]"><label className="flex items-center gap-2"><input checked={item.is_active} onChange={(event) => updateItem(item.id, "is_active", event.target.checked)} type="checkbox" />Aktif</label>{type === "district" ? <label className="flex items-center gap-2"><input checked={item.available_for_listings} onChange={(event) => updateItem(item.id, "available_for_listings", event.target.checked)} type="checkbox" />Untuk listing</label> : null}</div>
          <div className="flex gap-2"><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-xs font-semibold text-[#1C6B4A] disabled:opacity-50" disabled={busyId === item.id} onClick={() => void saveItem(item)} type="button">Simpan</button><button className="min-h-10 rounded-lg border border-[#F0D7D3] px-3 text-xs font-semibold text-[#A33B32] disabled:opacity-50" disabled={busyId === item.id || item.usage_count > 0} onClick={() => void deleteItem(item)} type="button">Hapus</button></div>
        </div>)}</div>
      </AdminPanel>) : null}
    </AdminDataPage>
  );
}

