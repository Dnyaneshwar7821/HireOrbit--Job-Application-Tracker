const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold text-blue-600">{value}</h2>
    </div>
  );
};

export default StatsCard;
