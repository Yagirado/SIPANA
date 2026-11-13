import Landing from "./pages/landing.jsx";
import Privacy from "./pages/privacy.jsx";
import Terms from "./pages/terms.jsx";
import Login from "./pages/login/login.jsx";
import RegisUser from "./pages/login/registUser.jsx";
import RegisUmkm from "./pages/login/registUmkm.jsx";
import AdminDashboard from "./pages/dashboard/admin-dashboard.jsx";
import {
  AdminAuditLog,
  AdminExportPage,
  AdminImpactRecap,
  AdminMasterData,
  AdminPlatformMetrics,
  AdminReportDetail,
  AdminReportQueue,
  AdminUserManagement,
  AdminVerificationDetail,
  AdminVerificationQueue,
} from "./pages/dashboard/admin-pages.jsx";
import CommunityDashboard from "./pages/dashboard/community-dashboard.jsx";
import {
  UmkmClaimDetailPage,
  UmkmClaimsPage,
  UmkmDashboardPage,
  UmkmImpactPage,
  UmkmListingFormPage,
  UmkmListingsPage,
  UmkmProfilePage,
  UmkmPublishedPage,
} from "./pages/dashboard/umkm-pages.jsx";
import { CommunityClaimsPage, CommunityClaimDetailPage, CommunityProfilePage, CommunityReportsPage } from "./pages/dashboard/community-pages.jsx";
import { FoodBrowsePage, FoodDetailPage } from "./pages/dashboard/community-food-pages.jsx";
import { DashboardRedirect, ProtectedRoute } from "./auth/protected-route.jsx";
import { Navigate, Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/regist-user" element={<RegisUser />} />
      <Route path="/regist-umkm" element={<RegisUmkm />} />
      <Route path="/ketentuan-pengguna" element={<Terms />} />
      <Route path="/kebijakan-privasi" element={<Privacy />} />
      <Route path="/jelajahi" element={<FoodBrowsePage />} />
      <Route path="/makanan/:listingId" element={<FoodDetailPage />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route
        path="/dashboard/community"
        element={
          <ProtectedRoute roles={["community"]}>
            <CommunityDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/community/jelajahi" element={<ProtectedRoute roles={["community"]}><FoodBrowsePage dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/community/jelajahi/:listingId" element={<ProtectedRoute roles={["community"]}><FoodDetailPage dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/community/klaim" element={<ProtectedRoute roles={["community"]}><CommunityClaimsPage /></ProtectedRoute>} />
      <Route path="/dashboard/community/klaim/:claimId" element={<ProtectedRoute roles={["community"]}><CommunityClaimDetailPage /></ProtectedRoute>} />
      <Route path="/dashboard/community/laporan" element={<ProtectedRoute roles={["community"]}><CommunityReportsPage /></ProtectedRoute>} />
      <Route path="/dashboard/community/profil" element={<ProtectedRoute roles={["community"]}><CommunityProfilePage /></ProtectedRoute>} />
      <Route
        path="/dashboard/umkm"
        element={
          <ProtectedRoute roles={["umkm"]}>
            <UmkmDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard/umkm/listing-saya" element={<ProtectedRoute roles={["umkm"]}><UmkmListingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/posting-cepat" element={<ProtectedRoute roles={["umkm"]}><UmkmListingFormPage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/listing/:listingId/ubah" element={<ProtectedRoute roles={["umkm"]}><UmkmListingFormPage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/listing-terbit/:listingId" element={<ProtectedRoute roles={["umkm"]}><UmkmPublishedPage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/klaim-masuk" element={<ProtectedRoute roles={["umkm"]}><UmkmClaimsPage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/klaim/:claimId/konfirmasi" element={<ProtectedRoute roles={["umkm"]}><UmkmClaimDetailPage confirmation /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/klaim/:claimId" element={<ProtectedRoute roles={["umkm"]}><UmkmClaimDetailPage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/dampak" element={<ProtectedRoute roles={["umkm"]}><UmkmImpactPage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/profil" element={<ProtectedRoute roles={["umkm"]}><UmkmProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard/umkm/verifikasi" element={<ProtectedRoute roles={["umkm"]}><UmkmProfilePage /></ProtectedRoute>} />
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/verifikasi"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminVerificationQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/verifikasi/:applicationId"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminVerificationDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/laporan"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminReportQueue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/laporan/:reportId"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminReportDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/dampak"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminImpactRecap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/ekspor"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminExportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/audit"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminAuditLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/pengguna"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/metrik"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminPlatformMetrics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/data-master"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminMasterData />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
