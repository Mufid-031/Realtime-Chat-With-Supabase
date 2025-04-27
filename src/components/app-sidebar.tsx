import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, UserPlus2, Users2 } from "lucide-react";
import { NavUser } from "./nav-user";
import { requireUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";

export async function AppSidebar() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <Sidebar>
        <SidebarHeader>
          <SidebarMenuButton size="lg">Supabase</SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarGroupLabel asChild>
              <SidebarMenuButton asChild size="lg">
                <CollapsibleTrigger>
                  Groups
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarMenuButton>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuButton size="sm" asChild>
                      <Link href="/groups/create">
                        <UserPlus2 />
                        New Group
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
                {groups!.map((group) => (
                  <SidebarMenuSub key={group.id}>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton size="sm" asChild>
                        <Link href={`/groups/${group.id}`}>
                          <Users2 />
                          {group.name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                ))}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>
    </Collapsible>
  );
}
