import { getGroups } from "@/lib/store";
import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import Link from "next/link";
import { Users2 } from "lucide-react";
import { Fragment } from "react";

export async function NavMain() {
  const groups = await getGroups();

  if (!groups) {
    return null;
  }

  return (
    <Fragment>
      {groups.map((group) => (
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
    </Fragment>
  );
}
