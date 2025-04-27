import { SidebarInset } from "./ui/sidebar";

interface AppContentProps extends React.ComponentProps<"main"> {
  variant?: "sidebar" | "header";
}

export function AppContent({
  children,
  variant = "header",
  ...props
}: AppContentProps) {
  if (variant === "sidebar") {
    return <SidebarInset {...props}>{children}</SidebarInset>;
  }

  return (
    <main
      className="mx-auto flex flex-col w-full h-full max-w-7xl gap-4 rounded-xl"
      {...props}
    >
      {children}
    </main>
  );
}
