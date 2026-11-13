import { ArrowLeft, CircleHelp } from "lucide-react";
import { Link } from "react-router";
import { DashboardLayout } from "./dashboard-layout.jsx";

export function AdminPage({ title, children }) {
  return <DashboardLayout pageTitle={title}>{children}</DashboardLayout>;
}

export function AdminPageHeading({ eyebrow = "RUANG ADMIN", title, description, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#1C6B4A]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#183A2E] sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-[#63756B] sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminPanel({ title, description, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[#DDE5DC] bg-white p-5 sm:p-6 ${className}`}>
      {title ? <h3 className="text-base font-semibold text-[#183A2E]">{title}</h3> : null}
      {description ? <p className="mt-1 text-sm leading-6 text-[#63756B]">{description}</p> : null}
      {children}
    </section>
  );
}

export function AdminUnavailable({ title = "Data belum tersedia", description }) {
  return (
    <div className="flex min-h-40 items-start gap-3 rounded-xl border border-dashed border-[#C9D8CB] bg-[#F8FAF6] p-5 sm:p-6" role="status">
      <CircleHelp aria-hidden="true" className="mt-0.5 shrink-0 text-[#1C6B4A]" size={20} />
      <div>
        <h4 className="font-semibold text-[#183A2E]">{title}</h4>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#63756B]">{description}</p>
      </div>
    </div>
  );
}

export function AdminBackLink({ to, children }) {
  return (
    <Link
      className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#1C6B4A] hover:text-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
      to={to}
    >
      <ArrowLeft aria-hidden="true" size={17} />
      {children}
    </Link>
  );
}

