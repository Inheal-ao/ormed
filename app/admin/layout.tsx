import { Suspense } from "react";
import { AdminAuthProvider } from "@/components/admin/auth-context";
import { NotificationsProvider } from "@/components/admin/notifications-context";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Painel de Gestão",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <NotificationsProvider>
        <Suspense>
          <AdminShell>{children}</AdminShell>
        </Suspense>
      </NotificationsProvider>
    </AdminAuthProvider>
  );
}
