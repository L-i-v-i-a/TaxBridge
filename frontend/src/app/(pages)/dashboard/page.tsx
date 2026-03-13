import Sidebar from "../../../../components/dashboard/Sidebar";
import Topbar from "../../../../components/dashboard/Topbar";
import StatsCards from "../../../../components/dashboard/StatsCards";
import ActivityChart from "../../../../components/dashboard/ActivityChart";
import PieChart from "../../../../components/dashboard/PieChart";
import RecentActivity from "../../../../components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FF] text-[#0B0F1F]">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-10">
          <Topbar />

          <div className="mt-8 space-y-8">
            <StatsCards />

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ActivityChart />
              </div>
              <PieChart />
            </div>

            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;