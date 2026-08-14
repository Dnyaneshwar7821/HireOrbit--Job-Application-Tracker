import { useEffect, useRef, useState } from "react";
import api from "../api/apiService";

const ResumeMatch = () => {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [copiedField, setCopiedField] = useState(null);

  const reportRef = useRef(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fetchHistory = () => {
    api
      .get("/analysis/history")
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/analysis/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResume(res.data.text);
    } catch {
      alert("Failed to parse document. Please paste the resume text manually.");
    } finally {
      setUploading(false);
    }
  };

  const handleCheck = () => {
    if (loading) return;

    if (!resume || !job) {
      alert("Please provide both resume and job description.");
      return;
    }

    setLoading(true);

    api
      .post("/analysis/resume-match", { resume, job, tone })
      .then((res) => {
        setResult(res.data);
        fetchHistory();
      })
      .catch((error) =>
        alert(
          error.response?.data?.message ||
            error.response?.data ||
            error.message ||
            "Resume analysis failed",
        ),
      )
      .finally(() => setLoading(false));
  };

  const handleDownloadPdf = () => {
    if (!result || !reportRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HireOrbit Analysis Report - ${result.detectedRole}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 32px; color: #0f172a; line-height: 1.5; }
            h1, h2, h3 { color: #1e1b4b; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin: 2px; }
            .green { background: #dcfce7; color: #166534; }
            .red { background: #fee2e2; color: #991b1b; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="margin: 0; color: #2563eb;">HireOrbit Resume Analysis Report</h1>
            <p style="color: #64748b; margin-top: 4px;">Target Role: ${result.detectedRole} | Match: ${result.matchScore}% | ATS Score: ${result.atsScore || result.matchScore}%</p>
          </div>
          ${reportRef.current.innerHTML}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          AI Resume & ATS Analyzer
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Optimize your resume for ATS algorithms and tailor application content with Google Gemini AI
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Resume Input + Drag & Drop Upload */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">
              1. Resume Content
            </label>
            <label className="cursor-pointer text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-lg font-semibold transition">
              {uploading ? "Extracting..." : "📄 Upload PDF / Word"}
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {uploadedFileName && (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Loaded text from <span className="font-bold">{uploadedFileName}</span>
            </p>
          )}

          <textarea
            placeholder="Paste your Resume text here or click Upload PDF/Word..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="w-full p-4 border rounded-xl h-56 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-800"
          />
        </div>

        {/* Job Description Input + Tone Selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">
              2. Job Description
            </label>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
              <span className="text-xs text-slate-500 px-1 font-medium">
                Cover Letter Tone:
              </span>
              {["Professional", "Startup", "Technical"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`text-xs px-2 py-0.5 rounded font-semibold transition ${
                    tone === t
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Paste the target Job Description here..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="w-full p-4 border rounded-xl h-56 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-800"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg disabled:opacity-50 transition"
        >
          {loading ? "Analyzing Alignment & ATS Compatibility..." : "🚀 Analyze Resume Alignment"}
        </button>
      </div>

      {loading && (
        <div className="text-center text-slate-500 animate-pulse text-sm">
          Processing document text. Computing ATS diagnostics and generating recommendations...
        </div>
      )}

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl">
            <span className="text-xs font-semibold text-blue-400">
              {result.aiPowered ? "✨ Gemini 1.5 Flash AI Engine" : "⚡ Heuristic Rule Analysis"}
            </span>
            <button
              onClick={handleDownloadPdf}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              📥 Download PDF Report
            </button>
          </div>

          {/* PDF Report Container */}
          <div ref={reportRef} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl space-y-6 border border-slate-200">
            {/* Scores Overview */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
              {/* Job Match Score */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-center">
                <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Job Match Score
                </p>
                <p
                  className={`text-4xl font-extrabold mt-2 ${
                    result.matchScore >= 80
                      ? "text-emerald-600"
                      : result.matchScore >= 50
                        ? "text-amber-500"
                        : "text-red-500"
                  }`}
                >
                  {result.matchScore}%
                </p>
                <div className="w-full bg-slate-200 h-3 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full ${
                      result.matchScore >= 80
                        ? "bg-emerald-500"
                        : result.matchScore >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${result.matchScore}%` }}
                  />
                </div>
              </div>

              {/* ATS Compatibility Score */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-center">
                <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  ATS Readability Score
                </p>
                <p
                  className={`text-4xl font-extrabold mt-2 ${
                    (result.atsScore || result.matchScore) >= 80
                      ? "text-blue-600"
                      : "text-amber-500"
                  }`}
                >
                  {result.atsScore || result.matchScore}%
                </p>
                <div className="w-full bg-slate-200 h-3 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${result.atsScore || result.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Detected Role */}
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-sm">
              <span className="font-bold text-indigo-950">Detected Target Role: </span>
              <span className="font-semibold text-indigo-700">{result.detectedRole}</span>
            </div>

            {/* Skill Match Heatmap */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">
                🎯 Keyword & Skill Heatmap
              </h3>

              {/* Matched Skills (Green) */}
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                  🟢 Matched Skills ({result.matchedSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-300"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">None detected</span>
                  )}
                </div>
              </div>

              {/* Missing Skills (Red) */}
              <div>
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                  🔴 Missing Target Skills ({result.missingSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        onClick={() => handleCopy(`Added ${skill} experience to resume`, skill)}
                        className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full border border-red-300 cursor-pointer hover:bg-red-200 transition"
                        title="Click to copy suggestion"
                      >
                        + {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">None missing</span>
                  )}
                </div>
              </div>
            </div>

            {/* ATS Diagnostics */}
            {result.atsFeedback?.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  📋 ATS Formatting Diagnostics
                </h4>
                <ul className="text-xs space-y-1 text-slate-700">
                  {result.atsFeedback.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analysis & Suggestions */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <h3 className="font-bold text-slate-900 text-base">
                💡 Strategic Analysis & Recommendations
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{result.analysis}</p>

              {result.suggestions?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-sm">
                  <span className="font-bold text-amber-900">Key Recommendations:</span>
                  <ul className="list-disc ml-5 mt-2 text-xs text-amber-800 space-y-1">
                    {result.suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Tailored Summary */}
            {result.improvedSummary && (
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-base">
                    ✨ Tailored Resume Summary
                  </h3>
                  <button
                    onClick={() => handleCopy(result.improvedSummary, "summary")}
                    className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                  >
                    {copiedField === "summary" ? "✓ Copied!" : "📋 Copy Summary"}
                  </button>
                </div>
                <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {result.improvedSummary}
                </p>
              </div>
            )}

            {/* Tailored Cover Letter */}
            {result.coverLetter && (
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-base">
                    ✉️ Generated Cover Letter ({tone} Tone)
                  </h3>
                  <button
                    onClick={() => handleCopy(result.coverLetter, "coverLetter")}
                    className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                  >
                    {copiedField === "coverLetter" ? "✓ Copied!" : "📋 Copy Cover Letter"}
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {result.coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Analysis Runs
          </h2>
          <div className="grid gap-3">
            {history.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{item.detectedRole}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">{item.matchScore}%</span>
                  <p className="text-xs text-slate-400">Match</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeMatch;
