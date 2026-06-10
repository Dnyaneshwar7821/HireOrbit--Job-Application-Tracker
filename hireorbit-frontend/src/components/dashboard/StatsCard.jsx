const StatsCard = ({ title, value, onClick }) => {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`group rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          : ""
      }`}
      type={onClick ? "button" : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </h2>
        </div>
        {onClick && (
          <span className="text-slate-300 transition group-hover:text-blue-500">
            &rarr;
          </span>
        )}
      </div>
    </Component>
  );
};

export default StatsCard;
