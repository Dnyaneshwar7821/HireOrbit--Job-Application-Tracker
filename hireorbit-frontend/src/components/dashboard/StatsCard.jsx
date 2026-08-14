import { FaArrowRight } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const cardStyles = {
  Total: {
    darkBadge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    lightBadge: "bg-blue-50 text-blue-700 border-blue-200",
    darkValue: "text-white",
    lightValue: "text-slate-900",
    borderColor: "hover:border-blue-500/50",
  },
  Applied: {
    darkBadge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    lightBadge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    darkValue: "text-cyan-400",
    lightValue: "text-cyan-600",
    borderColor: "hover:border-cyan-500/50",
  },
  Interview: {
    darkBadge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    lightBadge: "bg-amber-50 text-amber-800 border-amber-200",
    darkValue: "text-amber-400",
    lightValue: "text-amber-600",
    borderColor: "hover:border-amber-500/50",
  },
  Offers: {
    darkBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    lightBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    darkValue: "text-emerald-400",
    lightValue: "text-emerald-600",
    borderColor: "hover:border-emerald-500/50",
  },
  Rejected: {
    darkBadge: "bg-red-500/10 text-red-400 border-red-500/20",
    lightBadge: "bg-red-50 text-red-700 border-red-200",
    darkValue: "text-red-400",
    lightValue: "text-red-600",
    borderColor: "hover:border-red-500/50",
  },
  "Follow-ups": {
    darkBadge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    lightBadge: "bg-purple-50 text-purple-700 border-purple-200",
    darkValue: "text-purple-400",
    lightValue: "text-purple-600",
    borderColor: "hover:border-purple-500/50",
  },
};

const StatsCard = ({ title, value, onClick }) => {
  const Component = onClick ? "button" : "div";
  const style = cardStyles[title] || cardStyles.Total;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Component
      onClick={onClick}
      className={`group relative rounded-2xl border p-5 text-left shadow-md transition-all duration-300 ${
        isDark
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-slate-200/60"
      } ${
        onClick
          ? `cursor-pointer hover:-translate-y-1.5 ${style.borderColor} hover:shadow-xl`
          : ""
      }`}
      type={onClick ? "button" : undefined}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
            isDark ? style.darkBadge : style.lightBadge
          }`}
        >
          {title}
        </span>
        {onClick && (
          <span
            className={`transition duration-300 group-hover:translate-x-1 ${
              isDark ? "text-slate-600 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"
            }`}
          >
            <FaArrowRight className="text-xs" />
          </span>
        )}
      </div>

      <div className="mt-3">
        <h2
          className={`text-3xl font-black tracking-tight ${
            isDark ? style.darkValue : style.lightValue
          }`}
        >
          {value}
        </h2>
      </div>
    </Component>
  );
};

export default StatsCard;
