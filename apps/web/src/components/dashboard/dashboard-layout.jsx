import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../auth/use-auth.js";
import { rolePresentation } from "../../config/dashboard-navigation.js";

function Brand() {
  return (
    <Link
      aria-label="SIPANA, ke beranda"
      className="inline-flex rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8F279]"
      to="/"
    >
      <span className="text-xl font-bold tracking-wide text-white">SIPANA</span>
    </Link>
  );
}

function SideNavigation({ presentation, onNavigate }) {
  return (
    <nav aria-label="Navigasi dashboard" className="mt-8 space-y-1">
      {presentation.navigation.map(({ label, path, icon: Icon }) => (
        <NavLink
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8F279] ${
              isActive ? "bg-[#285A45] text-white" : "text-[#D6E4D8] hover:bg-[#244B3B] hover:text-white"
            }`
          }
          end
          key={path}
          onClick={onNavigate}
          to={path}
        >
          <Icon aria-hidden="true" size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function MobileBottomNavigation({ presentation, onLogout }) {
  const communityNavigation = presentation.role === "community";
  const umkmNavigation = presentation.role === "umkm";

  return (
    <nav
      aria-label="Navigasi utama"
      className={`fixed inset-x-0 bottom-0 z-40 ${umkmNavigation ? "flex overflow-x-auto" : "grid grid-cols-4"} border-t border-[#DDE5DC] bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(24,58,46,0.06)] md:hidden`}
    >
      {presentation.navigation.map(({ label, path, icon: Icon }) => (
        <NavLink
          className={({ isActive }) =>
            `flex min-h-14 ${umkmNavigation ? "min-w-[74px] flex-1 flex-col" : "flex-col"} items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1C6B4A] ${
              isActive ? "text-[#1C6B4A]" : "text-[#63756B]"
            }`
          }
          end
          key={path}
          to={path}
        >
          <Icon aria-hidden="true" size={18} />
          {label}
        </NavLink>
      ))}
      {!communityNavigation ? <button
        className={`flex min-h-14 ${umkmNavigation ? "min-w-[68px] flex-1 flex-col" : "flex-col"} items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-semibold text-[#63756B] hover:text-[#183A2E] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1C6B4A]`}
        onClick={onLogout}
        type="button"
      >
        <LogOut aria-hidden="true" size={18} />
        Keluar
      </button> : null}
    </nav>
  );
}

export function DashboardLayout({ children, pageTitle }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const navigate = useNavigate();
  const presentation = rolePresentation[user?.role] ?? rolePresentation.community;
  const hasBottomNavigation = user?.role !== "admin";

  useEffect(() => {
    if (!profileMenuOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setProfileMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [profileMenuOpen]);

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(error.message);
    }
  }

  const logoutButton = (
    <button
      className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#D6E4D8] hover:bg-[#244B3B] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8F279]"
      onClick={() => void handleLogout()}
      type="button"
    >
      <LogOut aria-hidden="true" size={18} />
      Keluar
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F1] text-[#183A2E]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#183A2E] px-5 py-6 md:flex">
        <Brand />
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.08em] text-[#B6CDBB]">
          {presentation.label}
        </p>
        <SideNavigation presentation={presentation} />
        <div className="mt-auto">{logoutButton}</div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#DDE5DC] bg-white">
          <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              {!hasBottomNavigation ? (
                <button
                  aria-controls="mobile-dashboard-menu"
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
                  className="grid size-11 shrink-0 place-items-center rounded-lg text-[#183A2E] hover:bg-[#F5F7F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A] md:hidden"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  type="button"
                >
                  {mobileMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
                </button>
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-xs text-[#63756B]">SIPANA / {presentation.shortLabel}</p>
                <h1 className="truncate text-base font-semibold sm:text-lg">{pageTitle}</h1>
              </div>
            </div>
            <div className="relative flex shrink-0 items-center gap-3">
              <button
                aria-controls="dashboard-profile-menu"
                aria-expanded={profileMenuOpen}
                aria-label={`Profil ${user?.name ?? "pengguna"}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 hover:bg-[#F5F7F1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A] sm:gap-3 sm:px-3"
                onClick={() => setProfileMenuOpen((open) => !open)}
                type="button"
              >
                <span className="hidden text-right sm:block">
                  <span className="block max-w-52 truncate text-sm font-semibold">{user?.name}</span>
                  <span className="block text-xs text-[#63756B]">{presentation.label}</span>
                </span>
                <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#E6F1E9] text-sm font-bold text-[#236644]">
                  {user?.name?.trim()?.charAt(0)?.toLocaleUpperCase("id-ID") ?? "S"}
                </span>
              </button>
              {profileMenuOpen ? (
                <div
                  className="absolute right-0 top-full z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[#DDE5DC] bg-white p-4 shadow-[0_12px_32px_rgba(24,58,46,0.14)]"
                  id="dashboard-profile-menu"
                >
                  <p className="truncate text-sm font-semibold text-[#183A2E]">{user?.name}</p>
                  <p className="mt-1 break-all text-xs text-[#63756B]">{user?.email}</p>
                  <p className="mt-1 text-xs text-[#63756B]">{presentation.label}</p>
                  <button
                    className="mt-4 flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold text-[#A33B32] hover:bg-[#FFF5F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C6B4A]"
                    onClick={() => void handleLogout()}
                    type="button"
                  >
                    <LogOut aria-hidden="true" size={17} />
                    Keluar dari SIPANA
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          {mobileMenuOpen ? (
            <div
              className="absolute inset-x-0 top-full border-b border-[#DDE5DC] bg-[#183A2E] px-4 pb-4 pt-2 shadow-lg md:hidden"
              id="mobile-dashboard-menu"
            >
              <SideNavigation
                onNavigate={() => setMobileMenuOpen(false)}
                presentation={presentation}
              />
              {logoutButton}
            </div>
          ) : null}
        </header>

        <main className={`mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 ${hasBottomNavigation ? "pb-24 md:pb-10" : "pb-10"}`}>
          {logoutError ? (
            <p className="mb-5 rounded-lg border border-[#E9C8C3] bg-[#FFF5F3] px-4 py-3 text-sm text-[#8D3029]" role="alert">
              {logoutError}
            </p>
          ) : null}
          {children}
        </main>
      </div>
      {hasBottomNavigation ? (
        <MobileBottomNavigation
          onLogout={() => void handleLogout()}
          presentation={presentation}
        />
      ) : null}
    </div>
  );
}
