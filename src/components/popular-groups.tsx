"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { Users, MessageCircle } from "lucide-react";
import Link from "next/link";

interface GroupStats {
  id: string;
  name: string;
  message_count: number;
  created_at: string;
}

export function PopularGroups() {
  const [popularGroups, setPopularGroups] = useState<GroupStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularGroups = async () => {
      const supabase = createClient();

      try {
        // Get groups with message counts
        const { data: groups } = await supabase.from("groups").select("*");

        if (groups) {
          // Get message counts for each group
          const groupsWithCounts = await Promise.all(
            groups.map(async (group) => {
              const { count } = await supabase
                .from("messages")
                .select("*", { count: "exact", head: true })
                .eq("group_id", group.id);

              return {
                ...group,
                message_count: count || 0,
              };
            })
          );

          // Sort by message count and take top 5
          const sortedGroups = groupsWithCounts
            .sort((a, b) => b.message_count - a.message_count)
            .slice(0, 5);

          setPopularGroups(sortedGroups);
        }
      } catch (error) {
        console.error("Error fetching popular groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularGroups();
  }, []);

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Popular Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
                  </div>
                </div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {popularGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/groups/${group.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
                        {group.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {group.message_count} messages
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-700"
                  >
                    #{index + 1}
                  </Badge>
                </Link>
              </motion.div>
            ))}
            {popularGroups.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No groups found
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
