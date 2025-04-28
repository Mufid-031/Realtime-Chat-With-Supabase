"use client";

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
import { ChevronDown, MinusSquare, UserPlus2, Users2 } from "lucide-react";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  created_at: string;
}

export function AppSidebar() {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [groups, setGroups] = useState<any[]>([]);

  const getGroups = async () => {
    try {
      const { data } = await supabase.from("groups").select("*");
      if (data) {
        setGroups(data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      await supabase.from("groups").delete().eq("id", id);
      toast.success("Group deleted successfully");
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Error deleting group");
    }
  };

  useEffect(() => {
    getGroups();

    const channel = supabase
      .channel("public:groups")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups" },
        (payload) => {
          const { eventType, new: newGroup, old: oldGroup } = payload;

          setGroups((currentGroups) => {
            switch (eventType) {
              case "INSERT":
                return [...currentGroups, newGroup as Group];

              case "UPDATE":
                return currentGroups.map((group) =>
                  group.id === (newGroup as Group).id ? newGroup : group
                );

              case "DELETE":
                return currentGroups.filter(
                  (group) => group.id !== oldGroup.id
                );

              default:
                return currentGroups;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
                {groups.map((group) => (
                  <SidebarMenuSub key={group.id}>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton className="group" size="sm" asChild>
                        <Link href={`/groups/${group.id}`}>
                          <Users2 />
                          {group.name}
                          <MinusSquare
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              deleteGroup(group.id);
                            }}
                            className={`ml-auto opacity-0 transition-opacity group-hover:opacity-100`}
                          />
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
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </Collapsible>
  );
}
