const StatsCard = ({ title, value, onClick }) => {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`bg-white p-5 rounded-xl shadow hover:shadow-lg transition text-left ${
        onClick ? "cursor-pointer focus:ring-2 focus:ring-blue-400 outline-none" : ""
      }`}
      type={onClick ? "button" : undefined}
    >
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-blue-600">{value}</h2>
    </Component>
  );
};

export default StatsCard;
