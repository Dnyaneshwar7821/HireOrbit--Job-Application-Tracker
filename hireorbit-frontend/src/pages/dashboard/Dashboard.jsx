import StatsCard from "../../components/dashboard/StatsCard";
import { useApplication } from "../../context/applicationContextValue";
import ApplicationChart, {
  MonthlyApplicationChart,
} from "../../components/dashboard/ApplicationChart";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBrain, FaBriefcase, FaCalendarAlt, FaRocket } from "react-icons/fa";

const Dashboard = () => {
  const { applications } = useApplication();
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

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
      value: `${successRate.toFixed(1)}%`,
      badge: "Conversion",
      color: "text-emerald-400",
      path: "/applications?status=OFFER",
    },
    {
      title: "Interviews Scheduled",
      value: interviewsScheduled,
      badge: "In Progress",
      color: "text-amber-400",
      path: "/applications?status=INTERVIEW&view=kanban",
    },
    {
      title: "Offers Received",
      value: offer,
      badge: "Secured",
      color: "text-emerald-400",
      path: "/applications?status=OFFER",
    },
  ];

  const upcomingFollowUpsList = applications
    .filter((a) => a.followUpDate)
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
    .slice(0, 3);

  return (
    <div className="space-y-8 p-4 sm:p-6 max-w-7xl mx-auto font-sans text-slate-100 min-h-[85vh]">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/60 px-3.5 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md">
              <FaRocket className="text-blue-400" />
              Career Command Center Active
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Welcome back, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">{user?.name || "Job Seeker"}</span> 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your recruitment pipeline, monitor upcoming interviews, and optimize your resume with Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/applications/add")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-blue-600/25 transition transform active:scale-95"
            >
              <FaPlus /> Add Application
            </button>

            <button
              onClick={() => navigate("/resume-match")}
              className="flex items-center gap-2 rounded-xl border border-purple-800/80 bg-purple-950/80 hover:bg-purple-900 px-5 py-3 text-xs font-extrabold text-purple-200 transition shadow-xl shadow-purple-900/20"
            >
              <FaBrain className="text-purple-400" /> Run AI Resume Matcher
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <div className="relative rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-12 text-center shadow-2xl space-y-5 overflow-hidden backdrop-blur-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 text-3xl shadow-lg shadow-blue-500/10">
              <FaBriefcase />
            </div>
            <h3 className="text-2xl font-extrabold text-white">No Job Applications Tracked Yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Start building your recruitment pipeline by adding your target companies, salary expectations, and interview rounds.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("/applications/add")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-blue-600/30 transition transform active:scale-95"
              >
                <FaPlus /> Add Your First Application
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Performance Cards & Follow-ups */}
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 grid sm:grid-cols-3 gap-4">
              {summaryCards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-left transition hover:border-slate-700 hover:bg-slate-900 shadow-xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {card.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {card.badge}
                    </span>
                  </div>
                  <h2 className={`text-3xl font-black ${card.color}`}>
                    {card.value}
                  </h2>
                </button>
              ))}
            </div>

            {/* Upcoming Follow-ups widget */}
            <div className="md:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FaCalendarAlt className="text-blue-400" /> Upcoming Follow-ups
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {upcomingFollowUpsList.length} Scheduled
                </span>
              </div>

              {upcomingFollowUpsList.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No upcoming follow-up dates set.
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingFollowUpsList.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className="w-full flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 hover:border-slate-700 transition text-left"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{app.companyName}</p>
                        <p className="text-[11px] text-slate-400">{app.jobRole}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        {app.followUpDate}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4">Application Distribution</h3>
              <ApplicationChart data={chartData} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4">Monthly Application Activity</h3>
              <MonthlyApplicationChart data={monthlyData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
