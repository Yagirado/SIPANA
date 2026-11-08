import { useEffect, useState } from "react";
import logoText from "../assets/logotext.png";

const links = [
  { label: "Tentang SIPANA", href: "#tentang" },
  { label: "Cara kerja", href: "#cara-kerja" },
  { label: "Kenapa SIPANA?", href: "#kenapa-sipana" },
];

export default function Nav({ isLanding = false }) {
  const [darkNav, setDarkNav] = useState(false);

  useEffect(() => {
    if (!isLanding) return;

    const section = document.querySelector("#kenapa-sipana");
    if (!section || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setDarkNav(entry.isIntersecting),
      { rootMargin: "0px 0px -90% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isLanding]);

  const navLinkClass = darkNav
    ? "text-sm font-medium text-white hover:text-[#D8F279] focus-visible:outline-[#D8F279]"
    : "text-sm font-medium text-[#52645A] hover:text-[#183A2E]";
  const landingHref = (href) => (isLanding ? href : `/${href}`);

  return (
    <header className="sticky top-0 z-10 border-b border-[#183A2E]/15 bg-white/20 backdrop-blur-sm">
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <a
          className={`inline-flex items-center rounded-md focus-visible:outline-2 ${darkNav ? "focus-visible:outline-[#D8F279]" : "focus-visible:outline-[#1C6B4A]"}`}
          href="/"
          aria-label="SIPANA, kembali ke atas halaman"
        >
          <img
            className="h-auto w-36 sm:w-40"
            src={logoText}
            alt="SIPANA — Sistem Informasi Pangan Berlebih"
            loading="eager"
          />
        </a>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-8 md:flex"
        >
          {links.map((link) => (
            <a
              className={navLinkClass}
              href={landingHref(link.href)}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          className="shrink-0 rounded-lg bg-[#1C6B4A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#183A2E]"
          href=""
        >
          Masuk
        </a>
      </div>
    </header>
  );
}
