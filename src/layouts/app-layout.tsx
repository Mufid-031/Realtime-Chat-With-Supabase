import { IBreadcrumbs } from "@/types";
import AppSidebarTemplate from "./app/app-sidebar-layout";

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs: IBreadcrumbs[];
}

export default function AppLayout({
  children,
  breadcrumbs,
  ...props
}: AppLayoutProps) {
  return (
    <AppSidebarTemplate breadcrumbs={breadcrumbs} {...props}>
      {children}
    </AppSidebarTemplate>
  );
}
