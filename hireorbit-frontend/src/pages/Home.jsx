import { Link } from "react-router-dom";
import {
  FaBrain,
  FaBriefcase,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";

const features = [
  {
    title: "Pipeline Dashboard",
    description: "Track application status, offers, interviews, and follow-ups.",
    icon: FaChartLine,
  },
  {
    title: "Application CRM",
    description: "Keep company, role, salary, source, and notes in one workflow.",
    icon: FaBriefcase,
  },
  {
    title: "Interview Rounds",
    description: "Manage interview stages and keep every opportunity updated.",
    icon: FaCalendarCheck,
  },
  {
    title: "AI Resume Match",
    description: "Compare your resume with job descriptions and get suggestions.",
    icon: FaBrain,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-medium text-blue-700 shadow-sm">
            Job search command center
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            HireOrbit
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A focused workspace to manage applications, interviews, follow-ups,
            and resume matching from one polished dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create account
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">This week</p>
              <h2 className="text-2xl font-bold text-slate-950">Job Pipeline</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              Active
            </span>
          </div>

          <div className="grid gap-3">
            {["Applied", "Interview", "Offer", "Follow-up"].map((label, index) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-4"
              >
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-2xl font-bold text-slate-950">
                  {[12, 4, 1, 3][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <Icon className="mb-4 text-xl text-blue-600" />
                <h3 className="font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
