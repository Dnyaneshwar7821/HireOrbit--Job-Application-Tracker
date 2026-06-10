import StatsCard from "../../components/dashboard/StatsCard";
import { useApplication } from "../../context/applicationContextValue";
import ApplicationChart, {
  MonthlyApplicationChart,
} from "../../components/dashboard/ApplicationChart";
import { ui } from "../../styles/ui";

const Dashboard = () => {
  const { applications } = useApplication();

  const total = applications.length;
  const applied = applications.filter((a) => a.status === "APPLIED").length;
  const interview = applications.filter((a) => a.status === "INTERVIEW").length;
  const offer = applications.filter((a) => a.status === "OFFER").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;
  const followUps = applications.filter((a) => a.followUpDate).length;
  const interviewsScheduled = applications.filter(
    (a) => a.status === "INTERVIEW",
  ).length;

  const successRate = total === 0 ? 0 : (offer * 100) / total;

  const chartData = [
    { name: "Applied", value: applied },
    { name: "Interview", value: interview },
    { name: "Offer", value: offer },
    { name: "Rejected", value: rejected },
  ];

  const monthlyData = Object.values(
    applications.reduce((acc, app) => {
      const month = app.appliedDate?.slice(0, 7) || "Unknown";
      acc[month] = acc[month] || { name: month, applications: 0 };
      acc[month].applications += 1;
      return acc;
    }, {}),
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={ui.container}>
      <h1 className={ui.title}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard title="Total" value={total} />
        <StatsCard title="Applied" value={applied} />
        <StatsCard title="Interview" value={interview} />
        <StatsCard title="Offers" value={offer} />
        <StatsCard title="Rejected" value={rejected} />
        <StatsCard title="Follow-ups" value={followUps} />
      </div>

      {/* EMPTY STATE */}
      {total === 0 ? (
        <div className={ui.emptyState}>
          No applications yet. Start by adding one 🚀
        </div>
      ) : (
        <>
          {/* Success Rate */}
          <div className={`${ui.card} mt-6 grid md:grid-cols-3 gap-4`}>
            <div>
              <p className="text-gray-500">Success Rate</p>
              <h2 className={ui.subtitle}>{successRate.toFixed(2)}%</h2>
            </div>
            <div>
              <p className="text-gray-500">Interviews Scheduled</p>
              <h2 className={ui.subtitle}>{interviewsScheduled}</h2>
            </div>
            <div>
              <p className="text-gray-500">Offers Received</p>
              <h2 className={ui.subtitle}>{offer}</h2>
            </div>
          </div>

          {/* Chart */}
          <ApplicationChart data={chartData} />
          <MonthlyApplicationChart data={monthlyData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
