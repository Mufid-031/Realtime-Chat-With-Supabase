"use client";

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { UserInfo } from "./user-info";
import { LogOut, SettingsIcon } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { createClient } from "@/lib/supabase/server";

export function UserMenuContent({ user }: { user: User }) {
  const cleanup = useMobileNavigation();
  const { state } = useSidebar();
  const isMobile = useIsMobile();

  const logout = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="end"
      side={isMobile ? "bottom" : state === "collapsed" ? "left" : "bottom"}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="block w-full"
            href="/user/settings"
            as="button"
            prefetch
            onClick={cleanup}
          >
            <SettingsIcon className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout}>
        <LogOut className="mr-2" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
