import { useEffect, useState } from "react";
import { useAuth } from "../../auth/use-auth.js";
import { apiRequest } from "../../lib/api.js";
import { AdminBackLink, AdminPage, AdminPageHeading, AdminPanel } from "../../components/dashboard/admin-ui.jsx";
import { DashboardState } from "../../components/dashboard/dashboard-state.jsx";

const actionLabels = {
  "master_data.created": "Tambah data master",
  "master_data.updated": "Ubah data master",
  "master_data.deleted": "Hapus data master",
  "umkm_verification.verified": "Setujui verifikasi UMKM",
  "umkm_verification.rejected": "Tolak verifikasi UMKM",
  report_assign_subject: "Tentukan pihak terlapor",
  report_review: "Mulai tinjauan",
  report_request_response: "Minta hak jawab",
  report_decide: "Catat keputusan laporan",
  report_hold_listing: "Tahan listing sementara",
  report_release_hold: "Buka kembali listing",
  report_resolve_appeal: "Putus banding",
  "listing.created": "Buat listing",
  "listing.updated": "Ubah listing",
  "listing.withdrawn": "Tarik listing",
  "listing.expired": "Kedaluwarsa listing otomatis",
  "claim.created": "Buat klaim",
  "claim.expired": "Kedaluwarsa klaim otomatis",
  "handover.confirmed": "Konfirmasi serah terima",
};

const entityLabels = { report: "Laporan", umkm_verification: "Verifikasi UMKM", master_data: "Data master", listing: "Listing", claim: "Klaim" };
const roleLabels = { admin: "Admin", umkm: "UMKM", community: "Anggota", system: "Sistem" };
const fieldLabels = {
  type: "Jenis", key: "Kode", label: "Nama", is_active: "Status aktif", available_for_listings: "Untuk listing",
  status: "Status", decision_action: "Keputusan", listing_moderation: "Status listing", subject_moderation: "Status akun", reason: "Alasan",
  title: "Judul listing", quantity: "Jumlah porsi", purpose: "Peruntukan", district: "Kecamatan", prepared_at: "Waktu masak",
  pickup_starts_at: "Mulai pengambilan", pickup_ends_at: "Batas pengambilan", listing_id: "ID listing", claimant_id: "ID anggota",
  claim_status: "Status klaim", listing_status: "Status listing", portions: "Porsi", claimed_at: "Waktu klaim", completed_at: "Waktu serah terima",
};
const valueLabels = {
  open: "Menunggu tinjauan", under_review: "Sedang ditinjau", awaiting_response: "Menunggu jawaban",
  resolved_no_action: "Tanpa tindakan", resolved_action: "Tindakan diberikan", appealed: "Banding masuk", appeal_resolved: "Banding diputus",
  verified: "Terverifikasi", rejected: "Ditolak", pending: "Menunggu", no_action: "Tanpa tindakan", warning: "Teguran",
  hide_listing: "Listing disembunyikan", restrict_account: "Akun dibatasi", active: "Aktif", temporarily_hidden: "Disembunyikan sementara",
  published: "Aktif", claimed: "Diklaim", completed: "Selesai", expired: "Kedaluwarsa", withdrawn: "Ditarik", removed: "Dihapus",
  restricted: "Dibatasi", district: "Kecamatan", purpose: "Peruntukan",
};

function readableValue(key, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return key === "is_active" ? (value ? "Aktif" : "Nonaktif") : (value ? "Ya" : "Tidak");
  if (typeof value === "object") return JSON.stringify(value);
  return valueLabels[value] ?? String(value);
}

function summarizeChanges(log) {
  if (!log.before && log.after) return "Data baru dicatat.";
  if (log.before && !log.after) return "Data dihapus.";
  const before = log.before ?? {};
  const after = log.after ?? {};
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
  if (!changed.length) return "Peristiwa dicatat.";
  return changed.slice(0, 3).map((key) => `${fieldLabels[key] ?? key}: ${readableValue(key, before[key])} → ${readableValue(key, after[key])}`).join(" · ");
}

function readableAction(action) {
  return actionLabels[action] ?? action.replaceAll("_", " ").replaceAll(".", " · ");
}

export default function AdminAuditLogPage() {
  const { refresh } = useAuth();
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest(`/api/admin/audit-logs?page=${page}`).then((data) => {
      if (active) { setResult(data); setStatus({ type: "ready", message: "" }); }
    }).catch((error) => {
      if (!active) return;
      if (error.status === 401 || error.status === 403) { void refresh(); return; }
      setStatus({ type: "error", message: error.message });
    });
    return () => { active = false; };
  }, [page, refresh, reload]);

  return <AdminPage title="Audit log">
    <AdminPageHeading title="Audit log" description="Riwayat tindakan admin dan aktivitas penting akun." />
    <div className="mt-7 space-y-5">
      <AdminBackLink to="/dashboard/admin">Kembali ke dasbor</AdminBackLink>
      <AdminPanel title="Aktivitas tercatat" description="Alasan dan nilai lengkap tersedia di rincian tiap aktivitas.">
        {status.type === "loading" ? <div className="mt-4"><DashboardState title="Memuat audit log" description="Mengambil aktivitas admin…" tone="loading" compact /></div> : null}
        {status.type === "error" ? <div className="mt-4"><DashboardState title="Audit log belum dapat dimuat" description={status.message} actionLabel="Coba lagi" onAction={() => setReload((value) => value + 1)} tone="error" compact /></div> : null}
        {status.type === "ready" ? <>
          {result?.data?.length ? <ol className="mt-4 divide-y divide-[#E8EEE7]">{result.data.map((log) => <li className="py-4 first:pt-0 last:pb-0" key={log.id}>
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
              <div className="min-w-0"><p className="font-semibold text-[#183A2E]">{readableAction(log.action)}</p><p className="mt-1 text-xs text-[#63756B]">{log.actor_name || "Akun dihapus"}{log.actor_role ? ` · ${roleLabels[log.actor_role] ?? log.actor_role}` : ""} · {entityLabels[log.entity_type] ?? log.entity_type} #{log.entity_id}</p></div>
              <time className="shrink-0 text-xs tabular-nums text-[#63756B]">{new Date(log.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</time>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#364D41]">{summarizeChanges(log)}</p>
            {log.reason ? <p className="mt-1 line-clamp-1 text-sm text-[#63756B]" title={log.reason}><span className="font-medium">Alasan:</span> {log.reason}</p> : null}
            {log.before || log.after ? <details className="mt-2 text-sm"><summary className="inline-flex cursor-pointer list-none font-semibold text-[#1C6B4A] underline decoration-[#B7CCBA] underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">Rincian nilai</summary><pre className="mt-2 overflow-x-auto rounded-lg bg-[#F5F7F1] p-3 text-xs leading-5 text-[#52645A]">{JSON.stringify({ sebelum: log.before, sesudah: log.after }, null, 2)}</pre></details> : null}
          </li>)}</ol> : <p className="mt-4 rounded-xl bg-[#F5F7F1] p-5 text-sm text-[#63756B]">Belum ada aktivitas admin.</p>}
          {result?.last_page > 1 ? <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E8EEE7] pt-4"><p className="text-sm text-[#63756B]">Halaman {result.current_page} dari {result.last_page} · {result.total} aktivitas</p><div className="flex gap-2"><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.prev_page_url} onClick={() => setPage((value) => value - 1)} type="button">Sebelumnya</button><button className="min-h-10 rounded-lg border border-[#DDE5DC] px-3 text-sm font-semibold disabled:opacity-50" disabled={!result.next_page_url} onClick={() => setPage((value) => value + 1)} type="button">Berikutnya</button></div></div> : null}
        </> : null}
      </AdminPanel>
    </div>
  </AdminPage>;
}
