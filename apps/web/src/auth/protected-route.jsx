import { Navigate, useLocation } from "react-router";
import { useAuth } from "./use-auth.js";
import { DashboardState } from "../components/dashboard/dashboard-state.jsx";
import { dashboardPathByRole } from "../config/dashboard-navigation.js";

export function ProtectedRoute({ roles, children }) {
  const { user, status, error, refresh } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <DashboardState title="Memeriksa sesi" description="Menyiapkan akun Anda…" />;
  }

  if (status === "error") {
    return (
      <DashboardState
        title="SIPANA belum dapat dijangkau"
        description={error}
        actionLabel="Coba lagi"
        onAction={() => void refresh()}
        tone="error"
      />
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!roles.includes(user?.role)) {
    const destination = dashboardPathByRole[user?.role];
    if (destination) return <Navigate to={destination} replace />;

    return (
      <DashboardState
        title="Peran akun belum dikenali"
        description="SIPANA belum menerima peran yang valid untuk akun ini. Periksa sesi akun atau hubungi administrator."
        actionLabel="Periksa akun lagi"
        onAction={() => void refresh()}
        tone="error"
      />
    );
  }

  return children;
}

export function DashboardRedirect() {
  const { user, status, error, refresh } = useAuth();

  if (status === "loading") {
    return <DashboardState title="Memeriksa sesi" description="Menyiapkan akun Anda…" />;
  }

  if (status === "error") {
    return (
      <DashboardState
        title="SIPANA belum dapat dijangkau"
        description={error}
        actionLabel="Coba lagi"
        onAction={() => void refresh()}
        tone="error"
      />
    );
  }

  if (status === "unauthenticated") return <Navigate to="/login" replace />;

  const routeByRole = {
    community: "/dashboard/community",
    umkm: "/dashboard/umkm",
    admin: "/dashboard/admin",
  };

  const destination = routeByRole[user?.role];
  if (destination) return <Navigate to={destination} replace />;

  return (
    <DashboardState
      title="Peran akun belum dikenali"
      description="SIPANA belum menerima peran yang valid untuk akun ini. Periksa sesi akun atau hubungi administrator."
      actionLabel="Periksa akun lagi"
      onAction={() => void refresh()}
      tone="error"
    />
  );
}
