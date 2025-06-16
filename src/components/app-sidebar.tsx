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
import {
  ChevronDown,
  MinusSquare,
  UserPlus2,
  Users2,
  MessageCircle,
  Home,
} from "lucide-react";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { IGroup } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export function AppSidebar() {
  const supabase = createClient();
  const [groups, setGroups] = useState<IGroup[]>([]);

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
                if (
                  "id" in newGroup &&
                  "name" in newGroup &&
                  "created_at" in newGroup
                ) {
                  return [...currentGroups, newGroup as IGroup];
                } else {
                  console.error("Invalid group data:", newGroup);
                  return currentGroups;
                }

              case "UPDATE":
                return currentGroups.map((group) =>
                  group.id === (newGroup as IGroup).id
                    ? (newGroup as IGroup)
                    : group
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
      <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <SidebarHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                ChatApp
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time messaging
              </p>
            </div>
          </motion.div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarMenu>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Link href="/" className="flex items-center gap-3 p-3">
                      <Home className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            </SidebarMenu>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SidebarGroupLabel asChild>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3">
                    <div className="flex items-center gap-3">
                      <Users2 className="w-5 h-5" />
                      <span className="font-medium">Groups</span>
                    </div>
                    <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarMenuButton>
              </SidebarGroupLabel>
            </motion.div>

            <CollapsibleContent>
              <SidebarGroupContent>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuButton
                        size="sm"
                        asChild
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Link
                          href="/groups/create"
                          className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300"
                        >
                          <UserPlus2 className="w-4 h-4" />
                          <span>New Group</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </motion.div>

                <AnimatePresence>
                  {groups.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuButton
                            className="group hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                            size="sm"
                            asChild
                          >
                            <Link
                              href={`/groups/${group.id}`}
                              className="flex items-center justify-between w-full p-2"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Users2 className="w-3 h-3 text-white" />
                                </div>
                                <span className="truncate">{group.name}</span>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteGroup(Number(group.id));
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                              >
                                <MinusSquare className="w-4 h-4 text-red-500" />
                              </motion.button>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-200 dark:border-gray-700 p-2">
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </Collapsible>
  );
}
