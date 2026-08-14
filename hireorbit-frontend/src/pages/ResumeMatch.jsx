import { useEffect, useRef, useState } from "react";
import api from "../api/apiService";
import { useTheme } from "../context/ThemeContext";

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

  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 4500);
  };

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
      showError("Failed to parse document. Please paste the resume text manually.");
    } finally {
      setUploading(false);
    }
  };

  const handleCheck = () => {
    if (loading) return;

    if (!resume || !job) {
      showError("Please provide both resume and job description.");
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
        showError(
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
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 relative font-sans">
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm font-semibold shadow-md flex items-center justify-between animate-bounce">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="text-xs font-bold text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          AI Resume & ATS Analyzer
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Optimize your resume for ATS algorithms and tailor application content with Google Gemini AI
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Resume Input + Drag & Drop Upload */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              1. Resume Content
            </label>
            <label className={`cursor-pointer text-xs px-3 py-1 rounded-lg font-bold transition border ${
              isDark
                ? "bg-indigo-950/80 text-indigo-300 border-indigo-800 hover:bg-indigo-900"
                : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            }`}>
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
            <p className="text-xs text-emerald-400 font-semibold">
              ✓ Loaded text from <span className="font-bold">{uploadedFileName}</span>
            </p>
          )}

          <textarea
            placeholder="Paste your Resume text here or click Upload PDF/Word..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className={`w-full p-4 border rounded-2xl h-56 outline-none text-sm transition focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Job Description Input + Tone Selector */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              2. Job Description
            </label>
            <div className={`flex items-center space-x-1 p-1 rounded-xl border ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
            }`}>
              <span className={`text-[11px] font-bold px-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Tone:
              </span>
              {["Professional", "Startup", "Technical"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition ${
                    tone === t
                      ? "bg-blue-600 text-white shadow-md"
                      : isDark
                      ? "text-slate-400 hover:text-slate-200"
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
            className={`w-full p-4 border rounded-2xl h-56 outline-none text-sm transition focus:ring-2 focus:ring-blue-500 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/20 disabled:opacity-50 transition transform active:scale-95 cursor-pointer"
        >
          {loading ? "Analyzing Alignment & ATS Compatibility..." : "🚀 Analyze Resume Alignment"}
        </button>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className={`flex justify-between items-center p-4 rounded-2xl border ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-100 border-slate-200 text-slate-900"
          }`}>
            <span className="text-xs font-bold text-blue-400">
              {result.aiPowered ? "✨ Gemini 1.5 Flash AI Engine" : "⚡ Heuristic Rule Analysis"}
            </span>
            <button
              onClick={handleDownloadPdf}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md"
            >
              📥 Download PDF Report
            </button>
          </div>

          {/* Report Container */}
          <div
            ref={reportRef}
            className={`p-6 md:p-8 rounded-3xl shadow-xl space-y-6 border ${
              isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Scores Overview */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-slate-800/80">
              {/* Job Match Score */}
              <div className={`p-5 rounded-2xl border text-center ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <p className={`text-xs uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Job Match Score
                </p>
                <p
                  className={`text-4xl font-extrabold mt-2 ${
                    result.matchScore >= 80
                      ? "text-emerald-400"
                      : result.matchScore >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {result.matchScore}%
                </p>
              </div>

              {/* ATS Compatibility Score */}
              <div className={`p-5 rounded-2xl border text-center ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <p className={`text-xs uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  ATS Readability Score
                </p>
                <p className="text-4xl font-extrabold mt-2 text-blue-400">
                  {result.atsScore || result.matchScore}%
                </p>
              </div>
            </div>

            {/* Skill Match Heatmap */}
            <div className="space-y-4">
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                🎯 Keyword & Skill Heatmap
              </h3>

              {/* Matched Skills (Green) */}
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  🟢 Matched Skills ({result.matchedSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-emerald-950/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-800"
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
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                  🔴 Missing Target Skills ({result.missingSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        onClick={() => handleCopy(`Added ${skill} experience to resume`, skill)}
                        className="bg-red-950/80 text-red-300 text-xs font-bold px-3 py-1 rounded-lg border border-red-800 cursor-pointer hover:bg-red-900 transition"
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

            {/* Analysis & Suggestions */}
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                💡 Strategic Analysis & Recommendations
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.analysis}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeMatch;
