import { useEffect, useState } from "react";
import { ArrowDownToLine, CalendarDays, MapPin, Search } from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import {
  AdminBackLink,
  AdminPage,
  AdminPageHeading,
  AdminPanel,
  AdminUnavailable,
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

function EmptyTable({ columns, message }) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-[#E5EBE4]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#F5F7F1] text-[11px] font-semibold uppercase tracking-wide text-[#63756B]">
            <tr>
              {columns.map((column) => <th className="px-4 py-3" key={column}>{column}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-8" colSpan={columns.length}>
                <p className="text-center text-sm text-[#63756B]">{message}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
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

export function AdminReportQueue() {
  return (
    <AdminDataPage
      title="Laporan masuk"
      heading="Laporan masuk"
      description="Tinjau laporan keamanan pangan dan ketidaksesuaian dengan menjaga identitas pelapor."
    >
      <AdminPanel>
        <AdminUnavailable
          title="Antrean laporan belum tersambung"
          description="API laporan dan moderasi belum tersedia. Tidak ada aduan, bukti, atau status yang dapat ditampilkan saat ini."
        />
        <EmptyTable
          columns={["ID laporan", "Objek", "Kategori", "Diterima", "Status", ""]}
          message="Belum ada laporan dari server."
        />
      </AdminPanel>
    </AdminDataPage>
  );
}

export function AdminReportDetail() {
  const { reportId } = useParams();

  return (
    <AdminDataPage
      title="Tinjau laporan"
      heading={`Tinjau laporan ${reportId}`}
      description="Tinjau laporan dan pilih tindakan yang sesuai kebijakan SIPANA."
    >
      <AdminBackLink to="/dashboard/admin/laporan">Kembali ke laporan</AdminBackLink>
      <AdminPanel>
        <AdminUnavailable
          title="Detail laporan belum dapat dimuat"
          description="API detail laporan, bukti, dan riwayat moderasi belum tersedia. Peringatan, penangguhan, pemulihan, dan penghapusan memerlukan endpoint serta aturan keputusan yang tercatat."
        />
      </AdminPanel>
    </AdminDataPage>
  );
}

export function AdminImpactRecap() {
  const metrics = ["Listing terbit", "Klaim dibuat", "Serah terima selesai", "Rasio selesai"];

  return (
    <AdminDataPage
      title="Rekap dampak"
      heading="Rekap dampak SIPANA"
      description="Pantau serah terima yang selesai menurut periode dan kecamatan."
      >
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 text-[#63756B]"><CalendarDays aria-hidden="true" size={16} /> Periode belum tersedia</span>
        <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 text-[#63756B]"><MapPin aria-hidden="true" size={16} /> Semua kecamatan</span>
        <Link className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#1C6B4A] px-4 font-semibold text-white hover:bg-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]" to="/dashboard/admin/ekspor"><ArrowDownToLine aria-hidden="true" size={16} /> Ekspor data</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <AdminPanel className="min-h-28" key={metric}>
            <p className="text-sm text-[#63756B]">{metric}</p>
            <p className="mt-3 text-xl font-bold text-[#829187]" aria-label={`${metric}: data belum tersedia`}>—</p>
          </AdminPanel>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <AdminPanel title="Tren serah terima" description="Perubahan jumlah serah terima per minggu.">
          <div className="mt-5"><AdminUnavailable title="Grafik belum tersedia" description="Data klaim dan serah terima belum tersambung." /></div>
        </AdminPanel>
        <AdminPanel title="Rincian kecamatan" description="Rekap berdasarkan wilayah layanan.">
          <div className="mt-5"><AdminUnavailable title="Rincian belum tersedia" description="Data per kecamatan akan muncul setelah API dampak tersedia." /></div>
        </AdminPanel>
      </div>
      <p className="rounded-xl border border-[#F0DCA8] bg-[#FFF6E2] px-4 py-3 text-sm leading-6 text-[#795D23]">Total porsi dan kilogram tidak ditampilkan sebelum cara konversi porsi ke berat ditetapkan.</p>
    </AdminDataPage>
  );
}

export function AdminExportPage() {
  return (
    <AdminDataPage
      title="Ekspor rekap dampak"
      heading="Ekspor rekap dampak"
      description="Unduh data terstruktur sesuai periode dan kecamatan setelah data tersedia."
    >
      <AdminBackLink to="/dashboard/admin/dampak">Kembali ke rekap dampak</AdminBackLink>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <AdminPanel title="Atur ekspor">
          <div className="mt-5"><AdminUnavailable title="Ekspor belum tersedia" description="Belum ada endpoint laporan yang dapat menghasilkan CSV. Filter dan berkas ekspor akan diaktifkan saat data dampak tersedia." /></div>
          <button className="mt-5 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#8AA99A] px-4 text-sm font-semibold text-white" disabled type="button"><ArrowDownToLine aria-hidden="true" size={17} /> Unduh CSV</button>
        </AdminPanel>
        <AdminPanel title="Data yang disertakan">
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[#52645A]">
            <li>Ringkasan listing</li>
            <li>Periode dan kecamatan</li>
            <li>Rekap klaim dan serah terima</li>
            <li>Waktu ekspor</li>
          </ul>
          <p className="mt-6 rounded-xl bg-[#F5F7F1] p-4 text-sm leading-6 text-[#63756B]">Ekspor hanya akan memuat data agregat sesuai filter yang dipilih.</p>
        </AdminPanel>
      </div>
    </AdminDataPage>
  );
}

export function AdminAuditLog() {
  return (
    <AdminDataPage
      title="Audit log"
      heading="Audit log"
      description="Riwayat keputusan verifikasi, moderasi, dan perubahan status."
    >
      <AdminPanel>
        <AdminUnavailable title="Audit log belum tersedia" description="Belum ada API atau penyimpanan untuk mencatat aktor, waktu, entitas, tindakan, dan alasan keputusan admin." />
        <EmptyTable columns={["Waktu", "Aktor", "Tindakan", "Entitas", "Alasan"]} message="Belum ada aktivitas admin yang tersimpan." />
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
      description="Ringkasan akun dihitung langsung dari basis data SIPANA. Metrik listing, klaim, dan serah terima belum tersedia."
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
      <AdminPanel title="Metrik operasional" description="Metrik berikut mengikuti sumber data transaksi SIPANA.">
        <div className="mt-5"><AdminUnavailable title="Data listing dan serah terima belum tersedia" description="Ringkasan porsi, listing, klaim, dan serah terima memerlukan modul listing dan klaim pada backend." /></div>
      </AdminPanel>
    </AdminDataPage>
  );
}

export function AdminMasterData() {
  return (
    <AdminDataPage
      title="Data master"
      heading="Pengelolaan data master"
      description="Referensi kecamatan, kategori pangan, dan ketentuan keamanan."
    >
      <AdminPanel>
        <AdminUnavailable
          title="Data master belum dapat diubah"
          description="API data master belum tersedia. Daftar kecamatan, kategori makanan, dan teks ketentuan tetap berasal dari konfigurasi yang ada sampai sumber pengelolaan beserta proses revisinya ditetapkan."
        />
      </AdminPanel>
    </AdminDataPage>
  );
}

