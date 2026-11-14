import { LoaderCircle, RefreshCw, TriangleAlert } from "lucide-react";

export function DashboardState({
  title,
  description,
  actionLabel,
  onAction,
  tone = "neutral",
  compact = false,
}) {
  const Icon = tone === "error" ? TriangleAlert : tone === "loading" ? LoaderCircle : RefreshCw;
  const iconClass = tone === "error" ? "text-[#A33B32]" : "text-[#1C6B4A]";

  return (
    <section
      aria-live={tone === "loading" ? "polite" : "assertive"}
      className={`rounded-2xl border border-[#DDE5DC] bg-white ${compact ? "p-5" : "p-6 sm:p-8"}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className={`${iconClass} mt-0.5 shrink-0`} size={20} />
        <div className="min-w-0">
          <h2 className="font-semibold text-[#183A2E]">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-[#63756B]">{description}</p>
          {actionLabel && onAction ? (
            <button
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#1C6B4A] px-4 text-sm font-semibold text-[#1C6B4A] hover:bg-[#F0F6F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
              onClick={onAction}
              type="button"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
