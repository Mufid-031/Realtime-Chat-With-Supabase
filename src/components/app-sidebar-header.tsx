import { IBreadcrumbs } from "@/types";
import { SidebarTrigger } from "./ui/sidebar";
import { Breadcrumbs } from "./breadcrumbs";

export function AppSidebarHeader({
  breadcrumbs,
}: {
  breadcrumbs: IBreadcrumbs[];
}) {
  return (
    <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </header>
  );
}
