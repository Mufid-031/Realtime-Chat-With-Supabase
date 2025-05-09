"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { IMessage } from "@/types";

export function Messages({ groupId, user }: { groupId: number; user: User }) {
  const supabase = createClient();
  const getInitials = useInitials();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const getMessages = async () => {
    const { data } = await supabase
      .from("messages_with_user_email")
      .select("*")
      .eq("group_id", groupId);
    setMessages(data!);
  };

  useEffect(() => {
    getMessages();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const { data } = await supabase
            .from("messages_with_user_email")
            .select("*")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setMessages((messages) => [...messages, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  console.log(messages);

  return (
    <div className="p-4 overflow-y-auto h-[550px]">
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 items-center",
              user.email === message.user_email ? "flex-row-reverse" : ""
            )}
          >
            <Avatar>
              <AvatarImage src={""} alt="" />
              <AvatarFallback>{getInitials(message.user_email)}</AvatarFallback>
            </Avatar>
            <div className="bg-muted p-2 rounded w-1/3 break-words h-auto">
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
