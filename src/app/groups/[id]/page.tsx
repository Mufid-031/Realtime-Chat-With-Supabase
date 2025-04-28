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

  // Fetch all messages for that group
  const { data: messages } = await supabase
    .from("messages")
    .select("*, users(username)") // ambil user username
    .eq("group_id", id)
    .order("created_at", { ascending: true });

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
          <h1 className="text-2xl font-bold">{group.name}</h1>

          <div className="mt-4 space-y-4">
            {messages?.map((message) => (
              <div key={message.id} className="rounded-lg bg-gray-100 p-4">
                <p className="text-sm text-gray-700">{message.content}</p>
                <span className="text-xs text-gray-500">
                  {message.users?.username ?? "Unknown User"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
