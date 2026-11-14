export function formatDateTime(value) {
  if (!value) return "Jadwal belum tersedia";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function purposeLabel(purpose) {
  return {
    consumption: "Untuk konsumsi",
    redistribution: "Untuk dibagikan kembali",
    animal_feed: "Untuk pakan ternak",
  }[purpose] ?? "Peruntukan belum tersedia";
}
