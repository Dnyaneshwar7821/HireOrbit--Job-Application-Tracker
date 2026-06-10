import StatsCard from "../../components/dashboard/StatsCard";
import { useApplication } from "../../context/applicationContextValue";
import ApplicationChart, {
  MonthlyApplicationChart,
} from "../../components/dashboard/ApplicationChart";
import { ui } from "../../styles/ui";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { applications } = useApplication();
  const navigate = useNavigate();

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

  const summaryCards = [
    {
      title: "Success Rate",
      value: `${successRate.toFixed(2)}%`,
      path: "/applications?status=OFFER",
    },
    {
      title: "Interviews Scheduled",
      value: interviewsScheduled,
      path: "/applications?status=INTERVIEW&view=kanban",
    },
    {
      title: "Offers Received",
      value: offer,
      path: "/applications?status=OFFER",
    },
  ];

  return (
    <div className={ui.container}>
      <h1 className={ui.title}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total"
          value={total}
          onClick={() => navigate("/applications")}
        />
        <StatsCard
          title="Applied"
          value={applied}
          onClick={() => navigate("/applications?status=APPLIED")}
        />
        <StatsCard
          title="Interview"
          value={interview}
          onClick={() => navigate("/applications?status=INTERVIEW")}
        />
        <StatsCard
          title="Offers"
          value={offer}
          onClick={() => navigate("/applications?status=OFFER")}
        />
        <StatsCard
          title="Rejected"
          value={rejected}
          onClick={() => navigate("/applications?status=REJECTED")}
        />
        <StatsCard
          title="Follow-ups"
          value={followUps}
          onClick={() => navigate("/applications?sort=followUp")}
        />
      </div>

      {/* EMPTY STATE */}
      {total === 0 ? (
        <div className={ui.emptyState}>
          No applications yet. Start by adding one.
        </div>
      ) : (
        <>
          {/* Success Rate */}
          <div className={`${ui.card} mt-6 grid md:grid-cols-3 gap-4`}>
            {summaryCards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => navigate(card.path)}
                className="text-left rounded-lg p-3 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <p className="text-gray-500">{card.title}</p>
                <h2 className={ui.subtitle}>{card.value}</h2>
              </button>
            ))}
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
