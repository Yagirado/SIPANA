import logoText from "../assets/logotext.png";
import { Link } from "react-router";

export function AuthLayout({ children, width = "medium" }) {
  const widthClass =
    width === "wide" ? "max-w-4xl" : width === "compact" ? "max-w-lg" : "max-w-3xl";

  return (
    <div className="min-h-screen bg-[#F5F7F1] text-[#183A2E] antialiased">
      <header className="border-b border-[#DDE5DC] bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link
            className="inline-flex shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1C6B4A]"
            to="/"
            aria-label="SIPANA, kembali ke halaman utama"
          >
            <img
              className="h-auto w-32 sm:w-36"
              src={logoText}
              alt="SIPANA — Sistem Informasi Pangan Berlebih"
            />
          </Link>
          <nav aria-label="Navigasi akun" className="flex items-center gap-2 sm:gap-3">
            <Link
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[#1C6B4A] transition-colors hover:bg-[#F5F7F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A] sm:px-4"
              to="/login"
            >
              Masuk
            </Link>
            <Link
              className="rounded-lg bg-[#1C6B4A] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A] sm:px-4"
              to="/regist-user"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full px-4 py-8 sm:px-8 sm:py-12">
        <div className={`mx-auto ${widthClass}`}>{children}</div>
      </main>
    </div>
  );
}

export function AuthField({
  id,
  label,
  error,
  hint,
  className = "",
  children,
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-[#364D41]" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-[#A33B32]" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-[#63756B]" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const authControlClass =
  "min-h-12 w-full rounded-xl border border-[#D2DDD2] bg-white px-3.5 py-3 text-sm text-[#183A2E] placeholder:text-[#829187] transition-colors hover:border-[#A8BBAA] focus:border-[#1C6B4A] focus:outline-none focus:ring-2 focus:ring-[#1C6B4A]/15 disabled:cursor-not-allowed disabled:bg-[#F5F7F1]";

export function FormNotice({ children, tone = "success" }) {
  const toneClass =
    tone === "error"
      ? "border-[#E9C8C3] bg-[#FFF5F3] text-[#8D3029]"
      : tone === "info"
        ? "border-[#C8DCEA] bg-[#F3F8FC] text-[#245A8D]"
        : "border-[#CFE3D2] bg-[#F0F8F1] text-[#236644]";

  return (
    <p className={`rounded-lg border px-4 py-3 text-sm leading-6 ${toneClass}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </p>
  );
}

export const primaryButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1C6B4A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A] disabled:cursor-not-allowed disabled:bg-[#8AA99A]";
