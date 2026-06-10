import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#3b82f6", "#facc15", "#22c55e", "#ef4444"];

const ApplicationChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Application Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplicationChart;

export const MonthlyApplicationChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Applications</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
