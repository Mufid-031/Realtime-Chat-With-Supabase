import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { UserInfo } from "./user-info";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions";

export function UserMenuContent() {
  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="end"
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout}>
        <LogOut className="mr-2" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
