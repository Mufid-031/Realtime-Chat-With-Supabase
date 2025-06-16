import { Messages } from "@/components/messages";
import { SendMessage } from "@/components/send-message";
import AppLayout from "@/layouts/app-layout";
import { createClient } from "@/lib/supabase/server";
import type { IBreadcrumbs } from "@/types";
import { Users } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
        <div className="border border-gray-200 dark:border-gray-700 relative min-h-[100vh] flex-1 overflow-hidden rounded-2xl md:min-h-min bg-white dark:bg-gray-800 shadow-lg">
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  {group.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Group chat
                </p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <Messages groupId={group.id} user={user} />
            <SendMessage groupId={group.id} user={user} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
