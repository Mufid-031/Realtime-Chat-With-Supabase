import { AppContent } from "@/components/app-content";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { IBreadcrumbs } from "@/types";

interface AppSidebarLayoutProps {
  children: React.ReactNode;
  breadcrumbs: IBreadcrumbs[];
}

export default function AppSidebarLayout({
  children,
  breadcrumbs,
}: AppSidebarLayoutProps) {
  return (
    <AppShell>
      <AppSidebar />
      <AppContent variant="sidebar">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        {children}
      </AppContent>
    </AppShell>
  );
}
