import { ActivityChart } from "@/components/activity-chart";
import { DashboardStats } from "@/components/dashboard-stats";
import { PopularGroups } from "@/components/popular-groups";
import { RecentActivity } from "@/components/recent-activity";
import AppLayout from "@/layouts/app-layout";
import type { IBreadcrumbs } from "@/types";


const breadcrumbs: IBreadcrumbs[] = [
  {
    title: "Dashboard",
    href: "/",
  },
];

export default async function Home() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>

          {/* Popular Groups */}
          <div className="lg:col-span-1">
            <PopularGroups />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
