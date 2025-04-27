import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { UserInfo } from "./user-info";
import { UserMenuContent } from "./user-menu-content";
import { User } from "@supabase/supabase-js";

export function NavUser({ user }: { user: User }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group"
            >
              <UserInfo user={user} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <UserMenuContent user={user} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
