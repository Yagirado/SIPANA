import {
  ChartNoAxesCombined,
  ClipboardList,
  ClipboardClock,
  Compass,
  Flag,
  Home,
  House,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

export const rolePresentation = {
  community: {
    role: "community",
    label: "Anggota komunitas",
    shortLabel: "Anggota",
    dashboardLabel: "Ringkasan warga",
    icon: Home,
    navigation: [
      { label: "Beranda", path: "/dashboard/community", icon: Home },
      { label: "Jelajahi", path: "/dashboard/community/jelajahi", icon: Compass },
      { label: "Klaim Saya", path: "/dashboard/community/klaim", icon: ReceiptText },
      { label: "Profil", path: "/dashboard/community/profil", icon: Users },
    ],
  },
  umkm: {
    role: "umkm",
    label: "UMKM",
    shortLabel: "UMKM",
    dashboardLabel: "Ringkasan usaha",
    icon: Store,
    navigation: [
      { label: "Dasbor", path: "/dashboard/umkm", icon: Store },
      { label: "Listing Saya", path: "/dashboard/umkm/listing-saya", icon: ClipboardList },
      { label: "Klaim Masuk", path: "/dashboard/umkm/klaim-masuk", icon: ReceiptText },
      { label: "Laporan Dampak", path: "/dashboard/umkm/dampak", icon: ChartNoAxesCombined },
      { label: "Profil & Verifikasi", path: "/dashboard/umkm/profil", icon: ShieldCheck },
    ],
  },
  admin: {
    role: "admin",
    label: "Administrator",
    shortLabel: "Admin",
    dashboardLabel: "Ringkasan admin",
    icon: House,
    navigation: [
      { label: "Ringkasan", path: "/dashboard/admin", icon: House },
      { label: "Verifikasi UMKM", path: "/dashboard/admin/verifikasi", icon: ShieldCheck },
      { label: "Laporan", path: "/dashboard/admin/laporan", icon: Flag },
      { label: "Dampak", path: "/dashboard/admin/dampak", icon: ChartNoAxesCombined },
      { label: "Audit log", path: "/dashboard/admin/audit", icon: ClipboardClock },
      { label: "Pengguna", path: "/dashboard/admin/pengguna", icon: Users },
      { label: "Metrik", path: "/dashboard/admin/metrik", icon: ChartNoAxesCombined },
      { label: "Data master", path: "/dashboard/admin/data-master", icon: Settings2 },
    ],
  },
};

export const dashboardPathByRole = {
  community: "/dashboard/community",
  umkm: "/dashboard/umkm",
  admin: "/dashboard/admin",
};
