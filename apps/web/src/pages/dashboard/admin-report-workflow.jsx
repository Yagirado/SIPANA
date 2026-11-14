import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { AdminPage, AdminPageHeading, AdminPanel, AdminBackLink } from "../../components/dashboard/admin-ui.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";

const labels = { food_safety: "Keamanan pangan", misrepresentation: "Informasi tidak sesuai", inappropriate_behavior: "Perilaku tidak pantas", other: "Lainnya" };
const dateLabel = (value) => value ? new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Belum ditentukan";

export default function AdminReportWorkflow() {
  const { reportId } = useParams();
  const { refresh } = useAuth();
  const [report, setReport] = useState(null);
  const [state, setState] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);
  const [summary, setSummary] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [decision, setDecision] = useState("no_action");
  const [reason, setReason] = useState("");
  const [reporterSummary, setReporterSummary] = useState("");
  const [severe, setSevere] = useState(false);
  const [appealOutcome, setAppealOutcome] = useState("upheld");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest(`/api/admin/reports/${reportId}`).then((data) => {
      if (active) { setReport(data); setState({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setState({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [reportId, refresh, reload]);

  async function act(action, data = {}) {
    if (busy) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await apiRequest(`/api/admin/reports/${reportId}/workflow`, { method: "POST", body: { action, ...data } });
      setNotice(response.message || "Perubahan kasus tersimpan.");
      setReload((value) => value + 1);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(false);
    }
  }

  const canDecide = ["open", "under_review", "awaiting_response"].includes(report?.status);
  const canRequestResponse = ["open", "under_review"].includes(report?.status);
  const punitiveReady = Boolean(report?.subject && report.status === "awaiting_response" && ((report.events || []).some((event) => event.type === "subject_response") || (report.response_due_at && new Date(report.response_due_at) <= new Date())));

  return <AdminPage title="Tinjau laporan">
    <AdminPageHeading title={`Tinjau laporan ${reportId}`} description="Laporan baru tidak memberi sanksi otomatis. Admin meninjau bukti, memberi hak jawab, lalu mencatat keputusan dan alasannya." />
    <div className="mt-7 space-y-5">
      <AdminBackLink to="/dashboard/admin/laporan">Kembali ke laporan</AdminBackLink>
      {state.type === "loading" ? <DashboardState title="Memuat laporan" description="Mengambil data kasus…" tone="loading" /> : null}
      {state.type === "error" ? <DashboardState title="Laporan belum dapat dimuat" description={state.message} tone="error" /> : null}
      {notice ? <p aria-live="polite" className="rounded-xl bg-[#F5F7F1] p-4 text-sm text-[#364D41]">{notice}</p> : null}
      {report ? <>
        <AdminPanel title={report.target_title || "Laporan"} description={report.business_name || "Informasi usaha tidak tersedia"}>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm text-[#63756B]">Kategori</dt><dd className="mt-1 font-semibold">{labels[report.category] || report.category}</dd></div>
            <div><dt className="text-sm text-[#63756B]">Status</dt><dd className="mt-1 font-semibold">{report.status}</dd></div>
            <div><dt className="text-sm text-[#63756B]">Pelapor (khusus admin)</dt><dd className="mt-1 font-semibold">{report.reporter?.name || "Tidak tersedia"}</dd></div>
            <div><dt className="text-sm text-[#63756B]">Pihak terlapor</dt><dd className="mt-1 font-semibold">{report.subject?.name || "Belum dapat ditentukan; perlu triase manual"}</dd></div>
            <div><dt className="text-sm text-[#63756B]">Diterima</dt><dd className="mt-1 font-semibold">{dateLabel(report.created_at)}</dd></div>
            <div><dt className="text-sm text-[#63756B]">Tenggat jawaban</dt><dd className="mt-1 font-semibold">{dateLabel(report.response_due_at)}</dd></div>
            <div className="sm:col-span-2"><dt className="text-sm text-[#63756B]">Uraian asli pelapor</dt><dd className="mt-1 whitespace-pre-wrap rounded-xl bg-[#F5F7F1] p-4 text-sm leading-6">{report.description || "Pelapor tidak menambahkan uraian."}</dd></div>
          </dl>
        </AdminPanel>

        <AdminPanel title="Tindakan peninjauan" description="Ringkasan untuk terlapor ditulis admin supaya uraian asli dan identitas pelapor tetap privat.">
          <div className="flex flex-wrap gap-2">
            {!report.subject && (report.target_owner_id || report.target_claimant_id) ? <form className="flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); const id = Number(new FormData(event.currentTarget).get("subject_user_id")); if (id) void act("assign_subject", { subject_user_id: id }); }}><label className="text-sm font-medium">Tentukan pihak terlapor<select className="ml-2 min-h-10 rounded-lg border border-[#DDE5DC] bg-white px-3" name="subject_user_id" required defaultValue=""><option disabled value="">Pilih pihak terkait</option>{report.target_owner_id && report.target_owner_id !== report.reporter?.id ? <option value={report.target_owner_id}>Pemilik listing</option> : null}{report.target_claimant_id && report.target_claimant_id !== report.reporter?.id ? <option value={report.target_claimant_id}>Penerima klaim</option> : null}</select></label><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-4 text-sm font-semibold" disabled={busy} type="submit">Tetapkan</button></form> : null}
            {report.status === "open" ? <button className="min-h-10 rounded-lg border border-[#DDE5DC] px-4 text-sm font-semibold" disabled={busy} onClick={() => void act("review")} type="button">Mulai tinjau</button> : null}
            {report.category === "food_safety" && report.target_title && !report.emergency_hold_at ? <button className="min-h-10 rounded-lg border border-[#B94D42] px-4 text-sm font-semibold text-[#A33B32]" disabled={busy} onClick={() => { const value = window.prompt("Alasan penahanan sementara listing"); if (value) void act("hold_listing", { reason: value }); }} type="button">Tahan listing sementara</button> : null}
            {report.emergency_hold_at ? <button className="min-h-10 rounded-lg border border-[#DDE5DC] px-4 text-sm font-semibold" disabled={busy} onClick={() => void act("release_hold")} type="button">Buka kembali listing</button> : null}
          </div>
          {canRequestResponse ? <form className="mt-5 grid gap-3 rounded-xl bg-[#F5F7F1] p-4" onSubmit={(event) => { event.preventDefault(); void act("request_response", { summary, response_due_at: new Date(dueAt).toISOString() }); }}>
            <h3 className="font-semibold text-[#183A2E]">Minta hak jawab</h3>
            <label className="grid gap-1 text-sm font-medium">Ringkasan aman untuk terlapor<textarea className="min-h-24 rounded-lg border border-[#DDE5DC] bg-white p-3" maxLength={1500} onChange={(event) => setSummary(event.target.value)} required value={summary} /></label>
            <label className="grid gap-1 text-sm font-medium">Batas waktu jawaban<input className="rounded-lg border border-[#DDE5DC] bg-white p-3" onChange={(event) => setDueAt(event.target.value)} required type="datetime-local" value={dueAt} /></label>
            <button className="min-h-10 justify-self-start rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy} type="submit">Kirim permintaan jawaban</button>
          </form> : null}
          {report.status === "awaiting_response" ? <p className="mt-4 text-sm text-[#63756B]">Menunggu jawaban sampai {dateLabel(report.response_due_at)}. Tindakan biasa hanya bisa dijatuhkan setelah jawaban diterima atau tenggat lewat.</p> : null}
          {canDecide ? <form className="mt-5 grid gap-3 border-t border-[#E5EBE4] pt-5" onSubmit={(event) => { event.preventDefault(); void act("decide", { decision, reason, reporter_summary: reporterSummary || undefined, severe }); }}>
            <h3 className="font-semibold text-[#183A2E]">Catat keputusan</h3>
            <label className="grid gap-1 text-sm font-medium">Hasil<select className="rounded-lg border border-[#DDE5DC] bg-white p-3" onChange={(event) => setDecision(event.target.value)} value={decision}><option value="no_action">Tanpa tindakan</option><option value="warning">Teguran</option>{report.subject?.id === report.target_owner_id ? <option value="hide_listing">Sembunyikan listing</option> : null}<option value="restrict_account">Batasi akun (kasus berat/berulang)</option></select></label>
            <label className="grid gap-1 text-sm font-medium">Alasan keputusan<textarea className="min-h-24 rounded-lg border border-[#DDE5DC] p-3" maxLength={2000} onChange={(event) => setReason(event.target.value)} required value={reason} /></label>
            <label className="grid gap-1 text-sm font-medium">Ringkasan aman untuk pelapor (opsional)<textarea className="min-h-16 rounded-lg border border-[#DDE5DC] p-3" maxLength={1000} onChange={(event) => setReporterSummary(event.target.value)} value={reporterSummary} /></label>
            {decision === "restrict_account" ? <label className="flex items-center gap-2 text-sm"><input checked={severe} onChange={(event) => setSevere(event.target.checked)} type="checkbox" />Kasus berat (jika bukan pelanggaran berulang)</label> : null}
            {decision !== "no_action" && !punitiveReady ? <p className="text-sm text-[#8A6A2E]">Tindakan biasa menunggu jawaban pihak terlapor atau tenggat jawaban yang sudah lewat.</p> : null}
            <button className="min-h-10 justify-self-start rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || (decision !== "no_action" && !punitiveReady)} type="submit">Simpan keputusan</button>
          </form> : null}
          {report.status === "appealed" ? <form className="mt-5 grid gap-3 border-t border-[#E5EBE4] pt-5" onSubmit={(event) => { event.preventDefault(); void act("resolve_appeal", { appeal_outcome: appealOutcome, reason }); }}>
            <h3 className="font-semibold text-[#183A2E]">Tinjau banding</h3><p className="whitespace-pre-wrap rounded-lg bg-[#F5F7F1] p-3 text-sm">{report.appeal_reason}</p>
            <label className="grid gap-1 text-sm font-medium">Hasil banding<select className="rounded-lg border border-[#DDE5DC] bg-white p-3" onChange={(event) => setAppealOutcome(event.target.value)} value={appealOutcome}><option value="upheld">Keputusan tetap berlaku</option><option value="overturned">Keputusan dibatalkan</option></select></label>
            <label className="grid gap-1 text-sm font-medium">Alasan peninjauan<textarea className="min-h-24 rounded-lg border border-[#DDE5DC] p-3" maxLength={2000} onChange={(event) => setReason(event.target.value)} required value={reason} /></label>
            <button className="min-h-10 justify-self-start rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy} type="submit">Simpan hasil banding</button>
          </form> : null}
        </AdminPanel>

        <AdminPanel title="Riwayat kasus"><ol className="mt-4 space-y-4">{(report.events || []).map((event, index) => <li className="border-l-2 border-[#C9D9CB] pl-4" key={`${event.type}-${index}`}><p className="font-semibold text-[#183A2E]">{event.type.replaceAll("_", " ")}</p><p className="mt-1 whitespace-pre-wrap text-sm text-[#52645A]">{event.body || "Pembaruan status"}</p><p className="mt-1 text-xs text-[#7B8980]">{event.actor || "Sistem"} · {dateLabel(event.created_at)}</p></li>)}</ol></AdminPanel>
      </> : null}
    </div>
  </AdminPage>;
}
