import { FaArrowRight } from "react-icons/fa";

const cardStyles = {
  Total: {
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    valueColor: "text-white",
    borderColor: "hover:border-blue-500/50",
  },
  Applied: {
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    valueColor: "text-cyan-400",
    borderColor: "hover:border-cyan-500/50",
  },
  Interview: {
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    valueColor: "text-amber-400",
    borderColor: "hover:border-amber-500/50",
  },
  Offers: {
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    valueColor: "text-emerald-400",
    borderColor: "hover:border-emerald-500/50",
  },
  Rejected: {
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    valueColor: "text-red-400",
    borderColor: "hover:border-red-500/50",
  },
  "Follow-ups": {
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    valueColor: "text-purple-400",
    borderColor: "hover:border-purple-500/50",
  },
};

const StatsCard = ({ title, value, onClick }) => {
  const Component = onClick ? "button" : "div";
  const style = cardStyles[title] || cardStyles.Total;

  return (
    <Component
      onClick={onClick}
      className={`group relative rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-left shadow-xl transition-all duration-300 ${
        onClick
          ? `cursor-pointer hover:-translate-y-1.5 ${style.borderColor} hover:shadow-2xl`
          : ""
      }`}
      type={onClick ? "button" : undefined}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${style.badgeColor}`}>
          {title}
        </span>
        {onClick && (
          <span className="text-slate-600 transition duration-300 group-hover:text-white group-hover:translate-x-1">
            <FaArrowRight className="text-xs" />
          </span>
        )}
      </div>

      <div className="mt-3">
        <h2 className={`text-3xl font-black tracking-tight ${style.valueColor}`}>
          {value}
        </h2>
      </div>
    </Component>
  );
};

export default StatsCard;
