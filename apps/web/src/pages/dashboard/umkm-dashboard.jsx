import { DashboardLayout } from "../../components/dashboard/dashboard-layout.jsx";
import { DashboardOverview } from "../../components/dashboard/dashboard-overview.jsx";

export default function UmkmDashboard() {
  return (
    <DashboardLayout pageTitle="Ringkasan usaha">
      <DashboardOverview role="umkm" />
    </DashboardLayout>
  );
}
