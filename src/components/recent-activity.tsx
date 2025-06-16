"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useInitials } from "@/hooks/use-initials";
import { formatDistanceToNow } from "date-fns";
import type { IMessage } from "@/types";

export function RecentActivity() {
  const [recentMessages, setRecentMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getInitials = useInitials();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      const supabase = createClient();

      try {
        const { data } = await supabase
          .from("messages_with_user_email")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        setRecentMessages(data || []);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentActivity();

    // Subscribe to real-time updates
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard:messages")
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
            setRecentMessages((prev) => [data, ...prev.slice(0, 9)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={message.user_email}
                    />
                    <AvatarFallback className="bg-gray-500 text-white text-sm">
                      {getInitials(message.user_email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {message.user_email.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {recentMessages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activity
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
