import AppLayout from "@/layouts/app-layout";
import { IBreadcrumbs } from "@/types";

const breadcrumbs: IBreadcrumbs[] = [
  {
    title: "Groups",
    href: "/groups",
  },
  {
    title: "Create",
    href: "/groups/create",
  },
];

export default function CreateGroup() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min"></div>
      </div>
    </AppLayout>
  );
}
