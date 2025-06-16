"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import type { IMessage } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export function Messages({ groupId, user }: { groupId: number; user: User }) {
  const supabase = createClient();
  const getInitials = useInitials();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMessages = async () => {
    const { data } = await supabase
      .from("messages_with_user_email")
      .select("*")
      .eq("group_id", groupId);
    setMessages(data || []);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isCurrentUser = user.email === message.user_email;
          const showAvatar =
            index === 0 ||
            messages[index - 1].user_email !== message.user_email;

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className={cn(
                "flex gap-3 items-end max-w-[80%]",
                isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex-shrink-0",
                  showAvatar ? "opacity-100" : "opacity-0"
                )}
              >
                <Avatar className="w-8 h-8 ring-2 ring-white dark:ring-gray-700 shadow-sm">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={message.user_email}
                  />
                  <AvatarFallback className="bg-gray-500 text-white text-xs font-medium">
                    {getInitials(message.user_email)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "flex flex-col gap-1",
                  isCurrentUser ? "items-end" : "items-start"
                )}
              >
                {/* User name and timestamp */}
                {showAvatar && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400",
                      isCurrentUser ? "flex-row-reverse" : ""
                    )}
                  >
                    <span className="font-medium">
                      {isCurrentUser ? "You" : message.user_email.split("@")[0]}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}

                {/* Message bubble */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "px-4 py-2 rounded-2xl shadow-sm max-w-md break-words",
                    isCurrentUser
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-br-md"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-md"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
