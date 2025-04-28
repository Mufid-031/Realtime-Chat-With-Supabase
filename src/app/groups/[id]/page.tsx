import { Messages } from "@/components/messages";
import { SendMessage } from "@/components/send-message";
import AppLayout from "@/layouts/app-layout";
import { createClient } from "@/lib/supabase/server"; // pakai server client
import { IBreadcrumbs } from "@/types";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();

  // Fetch group info
  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (!group) {
    throw new Error("Group not found");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  console.log(user);

  const breadcrumbs: IBreadcrumbs[] = [
    {
      title: "Groups",
      href: "/groups",
    },
    {
      title: group.name,
      href: `/groups/${id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
          <Messages groupId={group.id} user={user} />
          <SendMessage groupId={group.id} user={user} />
        </div>
      </div>
    </AppLayout>
  );
}
