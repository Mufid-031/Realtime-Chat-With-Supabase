"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useRef } from "react";

export function CreateGroupForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddGroup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    try {
      const name = formData.get("name") as string;
      const supabase = createClient();
      const { data } = await supabase
        .from("groups")
        .insert([{ name }])
        .select();
      if (data) {
        toast.success("Group created successfully");
        inputRef.current!.value = "";
      }
    } catch (error) {
      console.log("Error adding group: ", error);
      toast.error("Error adding group");
    }
  };

  return (
    <form onSubmit={handleAddGroup} className="p-4">
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            ref={inputRef}
            id="name"
            name="name"
            type="text"
            placeholder="Name"
          />
        </div>
        <Button className="cursor-pointer">Create</Button>
      </div>
    </form>
  );
}
