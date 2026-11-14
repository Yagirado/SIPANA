import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { AdminPage, AdminPageHeading, AdminPanel } from "../../components/dashboard/admin-ui.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";

const categoryNames = { food_safety: "Keamanan pangan", misrepresentation: "Informasi tidak sesuai", inappropriate_behavior: "Perilaku tidak pantas", other: "Lainnya" };
const statusNames = { open: "Menunggu tinjauan", under_review: "Sedang ditinjau", awaiting_response: "Menunggu jawaban", resolved_no_action: "Ditutup tanpa tindakan", resolved_action: "Keputusan dibuat", appealed: "Banding ditinjau", appeal_resolved: "Banding diputus" };
const formatDate = (value) => value ? new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "—";

export function ReportCasesPanel() {
  const { refresh } = useAuth();
  const [cases, setCases] = useState([]);
  const [state, setState] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/api/reports/cases").then((data) => {
      if (active) { setCases(data.data || []); setState({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setState({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [refresh, reload]);

  async function submit(report, endpoint, body) {
    setBusy(report.id);
    setNotice("");
    try {
      const result = await apiRequest(`/api/reports/cases/${report.id}/${endpoint}`, { method: "POST", body });
      setNotice(result.message || "Terkirim.");
      setValues((current) => ({ ...current, [report.id]: { ...current[report.id], response: "", appeal: "" } }));
      setReload((current) => current + 1);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy(null);
    }
  }

  return <AdminPanel title="Perkembangan kasus" description="Kasus yang kamu laporkan atau yang memerlukan jawaban darimu.">
    {notice ? <p aria-live="polite" className="mb-3 rounded-lg bg-[#F5F7F1] p-3 text-sm text-[#364D41]">{notice}</p> : null}
    {state.type === "loading" ? <DashboardState title="Memuat kasus" description="Mengambil perkembangan laporan…" tone="loading" compact /> : null}
    {state.type === "error" ? <DashboardState title="Kasus belum dapat dimuat" description={state.message} actionLabel="Coba lagi" onAction={() => setReload((value) => value + 1)} tone="error" compact /> : null}
    {state.type === "ready" && !cases.length ? <p className="mt-3 text-sm text-[#63756B]">Belum ada kasus untuk ditampilkan.</p> : null}
    <ul className="mt-3 divide-y divide-[#E8EEE7]">{cases.map((item) => <li className="py-5" key={item.id}>
      <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-semibold text-[#183A2E]">{item.target_title || item.business_name || `Laporan #${item.id}`}</p><p className="mt-1 text-sm text-[#63756B]">{categoryNames[item.category] || item.category} · {formatDate(item.created_at)}</p></div><span className="rounded-full bg-[#F0F2EF] px-3 py-1.5 text-xs font-semibold text-[#52645A]">{statusNames[item.status] || item.status}</span></div>
      {item.subject_summary ? <div className="mt-3 rounded-lg bg-[#F5F7F1] p-3"><p className="text-xs font-semibold uppercase tracking-wide text-[#63756B]">Ringkasan kasus untukmu</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#364D41]">{item.subject_summary}</p></div> : null}
      {item.decision_reason ? <p className="mt-3 text-sm text-[#52645A]"><strong>Alasan keputusan:</strong> {item.decision_reason}</p> : null}
      {item.appeal_outcome ? <p className="mt-3 text-sm text-[#52645A]"><strong>Hasil banding:</strong> {item.appeal_outcome === "overturned" ? "Keputusan dibatalkan" : "Keputusan tetap berlaku"}{item.appeal_decision_reason ? ` · ${item.appeal_decision_reason}` : ""}</p> : null}
      {item.reporter_outcome_summary ? <p className="mt-3 text-sm text-[#52645A]"><strong>Ringkasan hasil:</strong> {item.reporter_outcome_summary}</p> : null}
      {item.can_respond ? <form className="mt-3 grid gap-2" onSubmit={(event) => { event.preventDefault(); const text = values[item.id]?.response?.trim(); if (text) void submit(item, "responses", { body: text }); }}><label className="text-sm font-semibold">Jawabanmu (batas {formatDate(item.response_due_at)})<textarea className="mt-2 min-h-24 w-full rounded-lg border border-[#D2DDD2] p-3 font-normal" maxLength={3000} onChange={(event) => setValues((current) => ({ ...current, [item.id]: { ...current[item.id], response: event.target.value } }))} required value={values[item.id]?.response || ""} /></label><button className="min-h-10 justify-self-start rounded-lg bg-[#1C6B4A] px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy === item.id} type="submit">Kirim jawaban</button></form> : null}
      {item.can_appeal ? <form className="mt-3 grid gap-2" onSubmit={(event) => { event.preventDefault(); const text = values[item.id]?.appeal?.trim(); if (text) void submit(item, "appeals", { body: text }); }}><p className="text-sm text-[#52645A]">Kamu dapat mengajukan satu banding sampai {formatDate(item.appeal_deadline_at)}.</p><label className="text-sm font-semibold">Alasan banding<textarea className="mt-2 min-h-24 w-full rounded-lg border border-[#D2DDD2] p-3 font-normal" maxLength={3000} onChange={(event) => setValues((current) => ({ ...current, [item.id]: { ...current[item.id], appeal: event.target.value } }))} required value={values[item.id]?.appeal || ""} /></label><button className="min-h-10 justify-self-start rounded-lg border border-[#1C6B4A] px-4 text-sm font-semibold text-[#1C6B4A] disabled:opacity-50" disabled={busy === item.id} type="submit">Ajukan banding</button></form> : null}
    </li>)}</ul>
  </AdminPanel>;
}

export function UmkmReportCasesPage() {
  return <AdminPage title="Kasus dan laporan"><AdminPageHeading eyebrow="RUANG UMKM" title="Kasus dan laporan" description="Baca ringkasan laporan, kirim jawaban, dan ajukan banding atas tindakan dalam waktu tujuh hari." /><div className="mt-7"><ReportCasesPanel /></div><Link className="mt-5 inline-flex font-semibold text-[#1C6B4A]" to="/dashboard/umkm">Kembali ke dasbor</Link></AdminPage>;
}
