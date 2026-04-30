import StatsCard from "../../components/dashboard/StatsCard";
import { useApplication } from "../../context/ApplicationContext";
import ApplicationChart from "../../components/dashboard/ApplicationChart";
import { ui } from "../../styles/ui";

const Dashboard = () => {
  const { applications } = useApplication();

  const total = applications.length;
  const applied = applications.filter((a) => a.status === "APPLIED").length;
  const interview = applications.filter((a) => a.status === "INTERVIEW").length;
  const offer = applications.filter((a) => a.status === "OFFER").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  const successRate = total === 0 ? 0 : (offer * 100) / total;

  const chartData = [
    { name: "Applied", value: applied },
    { name: "Interview", value: interview },
    { name: "Offer", value: offer },
    { name: "Rejected", value: rejected },
  ];

  return (
    <div className={ui.container}>
      <h1 className={ui.title}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard title="Total" value={total} />
        <StatsCard title="Applied" value={applied} />
        <StatsCard title="Interview" value={interview} />
        <StatsCard title="Offers" value={offer} />
        <StatsCard title="Rejected" value={rejected} />
      </div>

      {/* EMPTY STATE */}
      {total === 0 ? (
        <div className={ui.emptyState}>
          No applications yet. Start by adding one 🚀
        </div>
      ) : (
        <>
          {/* Success Rate */}
          <div className={`${ui.card} mt-6`}>
            <h2 className={ui.subtitle}>
              Success Rate: {successRate.toFixed(2)}%
            </h2>
          </div>

          {/* Chart */}
          <ApplicationChart data={chartData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
