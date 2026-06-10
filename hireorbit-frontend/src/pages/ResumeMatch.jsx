import { useEffect, useState } from "react";
import api from "../api/apiService";

const ResumeMatch = () => {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = () => {
    api
      .get("/analysis/history")
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCheck = () => {
    if (!resume || !job) {
      alert("Enter both fields");
      return;
    }

    setLoading(true);

    api
      .post("/analysis/resume-match", { resume, job })
      .then((res) => {
        setResult(res.data);
        fetchHistory();
      })
      .catch((error) =>
        alert(error.response?.data?.message || error.response?.data || "Resume analysis failed"),
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow mb-6 text-center">
        <h1 className="text-2xl font-bold">Resume Analyzer</h1>
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

      {loading && (
        <div className="text-center mt-6 text-gray-500 animate-pulse">
          Processing your resume...
        </div>
      )}

      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Match Score: {result.matchScore}%
          </h2>

          <div className="mb-6">
            <div className="w-full bg-gray-200 h-4 rounded">
              <div
                className={`h-4 rounded ${
                  result.matchScore >= 80
                    ? "bg-green-500"
                    : result.matchScore >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${result.matchScore}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded text-sm space-y-3">
            <p className="text-xs font-semibold text-blue-600">
              {result.aiPowered ? "AI-powered analysis" : "Rule-based fallback analysis"}
            </p>
            <p>
              <b>Detected Role:</b> {result.detectedRole}
            </p>
            <p>
              <b>Matched Skills:</b>{" "}
              {result.matchedSkills.length > 0
                ? result.matchedSkills.join(", ")
                : "None"}
            </p>
            <p>
              <b>Missing Skills:</b>{" "}
              {result.missingSkills.length > 0
                ? result.missingSkills.join(", ")
                : "None"}
            </p>
            <p>
              <b>Analysis:</b> {result.analysis}
            </p>
            {result.suggestions?.length > 0 && (
              <div>
                <b>Suggestions:</b>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  {result.suggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.improvedSummary && (
              <p>
                <b>Improved Summary:</b> {result.improvedSummary}
              </p>
            )}
            {result.coverLetter && (
              <div>
                <b>Cover Letter Draft:</b>
                <p className="mt-1 whitespace-pre-wrap">{result.coverLetter}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
          <div className="grid gap-3">
            {history.map((item) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{item.detectedRole}</p>
                  <p className="text-blue-600 font-bold">{item.matchScore}%</p>
                </div>
                <p className="text-sm text-gray-600">{item.analysis}</p>
                {item.aiPowered && (
                  <p className="text-xs text-blue-600 mt-1">AI-powered</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeMatch;
