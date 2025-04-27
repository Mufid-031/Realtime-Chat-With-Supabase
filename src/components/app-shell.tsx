import { SidebarProvider } from "./ui/sidebar";

interface AppShellProps {
  children: React.ReactNode;
  variant?: "sidebar" | "header";
}

export function AppShell({ children, variant = "sidebar" }: AppShellProps) {
  if (variant === "header") {
    return <div className="flex min-h-screen w-full flex-col"></div>;
  }

  return <SidebarProvider>{children}</SidebarProvider>;
}
