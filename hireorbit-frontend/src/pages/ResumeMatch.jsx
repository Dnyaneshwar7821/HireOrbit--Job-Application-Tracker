import { useState } from "react";
import api from "../api/apiService";

const ResumeMatch = () => {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!resume || !job) {
      alert("Enter both fields");
      return;
    }

    setLoading(true);

    api
      .post("/analysis/resume-match", { resume, job })
      .then((res) => {
        const text = res.data;

        const score = text.match(/Match Score: (\d+)%/)?.[1] || 0;
        const role = text.match(/Detected Role: (.*)/)?.[1] || "Unknown";

        setResult({ text, score });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow mb-6 text-center">
        <h1 className="text-2xl font-bold">📄 Resume Analyzer</h1>
        <p className="text-sm opacity-80">
          Analyze your resume against job description
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          placeholder="Paste Resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          className="p-4 border rounded-lg h-48 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <textarea
          placeholder="Paste Job Description..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
          className="p-4 border rounded-lg h-48 focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleCheck}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-6 text-gray-500 animate-pulse">
          Processing your resume...
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          {/* SCORE HEADER */}
          <h2 className="text-xl font-semibold mb-4 text-center">
            Match Score: {result.score}%
          </h2>

          {/* PROGRESS BAR */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 h-4 rounded">
              <div
                className={`h-4 rounded ${
                  result.score >= 80
                    ? "bg-green-500"
                    : result.score >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* RESULT TEXT */}
          <div className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
            {result.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeMatch;
