import StatsCard from "../../components/dashboard/StatsCard";
import { useApplication } from "../../context/applicationContextValue";
import ApplicationChart, {
  MonthlyApplicationChart,
} from "../../components/dashboard/ApplicationChart";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBrain, FaBriefcase, FaCalendarAlt, FaRocket } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const Dashboard = () => {
  const { applications } = useApplication();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
      darkColor: "text-emerald-400",
      lightColor: "text-emerald-600",
      path: "/applications?status=OFFER",
    },
    {
      title: "Interviews Scheduled",
      value: interviewsScheduled,
      badge: "In Progress",
      darkColor: "text-amber-400",
      lightColor: "text-amber-600",
      path: "/applications?status=INTERVIEW&view=kanban",
    },
    {
      title: "Offers Received",
      value: offer,
      badge: "Secured",
      darkColor: "text-emerald-400",
      lightColor: "text-emerald-600",
      path: "/applications?status=OFFER",
    },
  ];

  const upcomingFollowUpsList = applications
    .filter((a) => a.followUpDate)
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
    .slice(0, 3);

  return (
    <div className={`space-y-8 p-4 sm:p-6 max-w-7xl mx-auto font-sans min-h-[85vh] ${
      isDark ? "text-slate-100" : "text-slate-900"
    }`}>
      {/* Hero Welcome Banner */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-2xl transition-colors duration-200 ${
        isDark
          ? "border-slate-800/90 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white"
          : "border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/20"
      }`}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold backdrop-blur-md ${
              isDark
                ? "border-blue-500/30 bg-blue-950/60 text-blue-400"
                : "border-white/30 bg-white/20 text-white"
            }`}>
              <FaRocket />
              Career Command Center Active
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Welcome back, <span className={isDark ? "bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent" : "text-white"}>{user?.name || "Job Seeker"}</span> 👋
            </h1>
            <p className={`text-sm max-w-xl leading-relaxed ${isDark ? "text-slate-300" : "text-blue-100"}`}>
              Track your recruitment pipeline, monitor upcoming interviews, and optimize your resume with Gemini AI.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/applications/add")}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold shadow-xl transition transform active:scale-95 ${
                isDark
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25"
                  : "bg-white text-blue-700 hover:bg-slate-100 shadow-slate-900/20"
              }`}
            >
              <FaPlus /> Add Application
            </button>

            <button
              onClick={() => navigate("/resume-match")}
              className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs font-extrabold transition shadow-xl ${
                isDark
                  ? "border-purple-800/80 bg-purple-950/80 hover:bg-purple-900 text-purple-200 shadow-purple-900/20"
                  : "border-white/40 bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <FaBrain /> Run AI Resume Matcher
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
        <div className={`relative rounded-3xl border p-12 text-center shadow-xl space-y-5 overflow-hidden transition-colors duration-200 ${
          isDark
            ? "border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950/90 text-white"
            : "border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
        }`}>
          <div className="relative z-10 space-y-4">
            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg ${
              isDark
                ? "bg-blue-600/10 border border-blue-500/20 text-blue-400"
                : "bg-blue-50 border border-blue-200 text-blue-600"
            }`}>
              <FaBriefcase />
            </div>
            <h3 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
              No Job Applications Tracked Yet
            </h3>
            <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
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
                  className={`rounded-2xl border p-5 text-left transition shadow-xl ${
                    isDark
                      ? "border-slate-800 bg-slate-900/90 text-white hover:border-slate-700"
                      : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 shadow-slate-200/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {card.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isDark
                        ? "bg-slate-800 text-slate-300 border-slate-700"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {card.badge}
                    </span>
                  </div>
                  <h2 className={`text-3xl font-black ${isDark ? card.darkColor : card.lightColor}`}>
                    {card.value}
                  </h2>
                </button>
              ))}
            </div>

            {/* Upcoming Follow-ups widget */}
            <div className={`md:col-span-4 rounded-2xl border p-5 shadow-xl space-y-3 ${
              isDark ? "border-slate-800 bg-slate-900/90 text-white" : "border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
            }`}>
              <div className={`flex justify-between items-center border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                <span className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  <FaCalendarAlt className="text-blue-500" /> Upcoming Follow-ups
                </span>
                <span className={`text-[10px] font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {upcomingFollowUpsList.length} Scheduled
                </span>
              </div>

              {upcomingFollowUpsList.length === 0 ? (
                <p className={`text-xs py-4 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  No upcoming follow-up dates set.
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingFollowUpsList.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className={`w-full flex items-center justify-between rounded-xl border p-3 transition text-left ${
                        isDark
                          ? "border-slate-800/80 bg-slate-950/70 hover:border-slate-700"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div>
                        <p className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{app.companyName}</p>
                        <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{app.jobRole}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
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
            <div className={`rounded-2xl border p-6 shadow-xl ${
              isDark ? "border-slate-800 bg-slate-900/90 text-white" : "border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
            }`}>
              <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Application Distribution</h3>
              <ApplicationChart data={chartData} />
            </div>

            <div className={`rounded-2xl border p-6 shadow-xl ${
              isDark ? "border-slate-800 bg-slate-900/90 text-white" : "border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
            }`}>
              <h3 className={`text-base font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Monthly Application Activity</h3>
              <MonthlyApplicationChart data={monthlyData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
