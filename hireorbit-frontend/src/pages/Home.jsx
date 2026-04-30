import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white flex flex-col justify-center items-center px-4">
      {/* HERO */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4">HireOrbit 🚀</h1>

        <p className="text-lg opacity-90 mb-8">
          Track applications, manage interviews, and analyze your resume — all
          in one place.
        </p>

        {/* CTA */}
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Register
          </Link>
        </div>
      </div>

      {/* FEATURES */}
      <div className="mt-16 grid md:grid-cols-4 gap-6 max-w-6xl w-full">
        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h3 className="font-bold text-lg mb-2">📊 Dashboard</h3>
          <p className="text-sm">
            Visualize your job progress with real-time stats.
          </p>
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h3 className="font-bold text-lg mb-2">📝 Applications</h3>
          <p className="text-sm">
            Manage all your job applications in one place.
          </p>
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h3 className="font-bold text-lg mb-2">🎯 Interviews</h3>
          <p className="text-sm">
            Track interview rounds and auto-update status.
          </p>
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg text-center">
          <h3 className="font-bold text-lg mb-2">📄 Resume Analyzer</h3>
          <p className="text-sm">
            Compare your resume with job descriptions and get match insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
