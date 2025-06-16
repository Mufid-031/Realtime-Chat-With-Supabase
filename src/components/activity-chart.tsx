"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

interface DayActivity {
  date: string;
  messages: number;
  groups: number;
}

export function ActivityChart() {
  const [activityData, setActivityData] = useState<DayActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivityData = async () => {
      const supabase = createClient();

      try {
        // Get last 7 days of activity
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split("T")[0];
        }).reverse();

        const activityPromises = last7Days.map(async (date) => {
          const startOfDay = new Date(date + "T00:00:00.000Z");
          const endOfDay = new Date(date + "T23:59:59.999Z");

          // Get messages count for this day
          const { count: messagesCount } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfDay.toISOString())
            .lte("created_at", endOfDay.toISOString());

          // Get groups created this day
          const { count: groupsCount } = await supabase
            .from("groups")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfDay.toISOString())
            .lte("created_at", endOfDay.toISOString());

          return {
            date,
            messages: messagesCount || 0,
            groups: groupsCount || 0,
          };
        });

        const results = await Promise.all(activityPromises);
        setActivityData(results);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  const maxMessages = Math.max(...activityData.map((d) => d.messages), 1);

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Activity Overview (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart */}
            <div className="h-48 flex items-end justify-between gap-2">
              {activityData.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.messages / maxMessages) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gray-900 dark:bg-gray-100 rounded-t-md min-h-[4px] relative group"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.messages}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              {activityData.map((day) => (
                <span key={day.date} className="flex-1 text-center">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </span>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activityData.reduce((sum, day) => sum + day.messages, 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Messages
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activityData.reduce((sum, day) => sum + day.groups, 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  New Groups
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
