"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { Users, MessageCircle, Calendar, TrendingUp } from "lucide-react";

interface DashboardData {
  totalGroups: number;
  totalMessages: number;
  totalUsers: number;
  todayMessages: number;
}

export function DashboardStats() {
  const [data, setData] = useState<DashboardData>({
    totalGroups: 0,
    totalMessages: 0,
    totalUsers: 0,
    todayMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient();

      try {
        // Get total groups
        const { count: groupsCount } = await supabase
          .from("groups")
          .select("*", { count: "exact", head: true });

        // Get total messages
        const { count: messagesCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true });

        // Get unique users count from messages
        const { data: uniqueUsers } = await supabase
          .from("messages")
          .select("user_id");

        const uniqueUserIds = new Set(
          uniqueUsers?.map((msg) => msg.user_id) || []
        );

        // Get today's messages
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .gte("created_at", today.toISOString());

        setData({
          totalGroups: groupsCount || 0,
          totalMessages: messagesCount || 0,
          totalUsers: uniqueUserIds.size,
          todayMessages: todayCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Groups",
      value: data.totalGroups,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Messages",
      value: data.totalMessages,
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Active Users",
      value: data.totalUsers,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Today's Messages",
      value: data.todayMessages,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
