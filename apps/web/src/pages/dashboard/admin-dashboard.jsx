import { DashboardLayout } from "../../components/dashboard/dashboard-layout.jsx";
import { AdminOverview } from "./admin-overview.jsx";

export default function AdminDashboard() {
  return (
    <DashboardLayout pageTitle="Ringkasan admin">
      <AdminOverview />
    </DashboardLayout>
  );
}
