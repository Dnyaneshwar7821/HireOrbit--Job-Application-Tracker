import { useEffect, useRef, useState } from "react";
import api from "../api/apiService";
import { useTheme } from "../context/ThemeContext";
import {
  FaMagic,
  FaFileUpload,
  FaCopy,
  FaCheck,
  FaFilePdf,
  FaBrain,
  FaRocket,
  FaLightbulb,
  FaBullseye,
  FaUserTie,
  FaCode,
  FaBolt,
  FaHistory,
} from "react-icons/fa";

const sampleResume = `SENIOR FULL STACK DEVELOPER
Email: alex.developer@example.com | Phone: (555) 019-2831 | Location: San Francisco, CA

SUMMARY
Passionate Full Stack Engineer with 5+ years of experience architecting high-scalability web applications using React, Node.js, TypeScript, PostgreSQL, and AWS. Proven track record of optimizing database performance by 40% and deploying microservices handling 1M+ daily active users.

SKILLS
Frontend: React, TypeScript, TailwindCSS, Next.js, Redux Toolkit, HTML5/CSS3
Backend: Node.js, Express, Java Spring Boot, REST APIs, GraphQL, PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS (EC2, S3, CloudFront), Docker, Kubernetes, CI/CD GitHub Actions
Testing & Tools: Jest, Cypress, Git, JIRA, Agile/Scrum

EXPERIENCE
Senior Software Engineer — TechCorp Inc. (2022 - Present)
• Led a cross-functional team of 6 engineers to re-architect client dashboard using React and TailwindCSS, improving page load speed by 55%.
• Designed RESTful APIs and PostgreSQL query pipelines processing over 2M transactions daily with 99.99% uptime.
• Integrated automated CI/CD pipelines reducing deployment cycle time from 2 hours to 15 minutes.

Software Developer — CloudScale Solutions (2019 - 2022)
• Developed responsive frontend UI components using React and Redux, scaling to 500k monthly users.
• Implemented JWT-based authentication and role-based access control (RBAC) security protocols.`;

const sampleJD = `Senior Full Stack Developer — High Growth SaaS Startup
Location: Remote (US/Canada) | Salary: $130,000 - $160,000 + Equity

We are looking for a Senior Full Stack Engineer to build out our next-generation career analytics platform.

RESPONSIBILITIES:
• Architect, build, and deploy high-performance frontend components using React, TypeScript, and modern CSS frameworks.
• Build scalable Node.js microservices and integrate PostgreSQL databases.
• Work closely with product managers and AI researchers to embed Google Gemini AI capabilities into web interfaces.
• Optimize application latency, SEO, and ATS compatibility.

REQUIREMENTS:
• 4+ years of professional full-stack web development experience.
• Strong mastery of React, Node.js, TypeScript, and SQL databases.
• Experience with cloud deployments (AWS or GCP), Docker, and REST APIs.
• Excellent communication skills and passion for building user-centric SaaS applications.`;

const tones = [
  { id: "Professional", label: "Professional", icon: FaUserTie, desc: "Corporate & Executive" },
  { id: "Startup", label: "Startup", icon: FaRocket, desc: "Disruptive & Dynamic" },
  { id: "Technical", label: "Technical", icon: FaCode, desc: "Engineering & In-Depth" },
];

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
  const [loadingStep, setLoadingStep] = useState(0);

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

  const handleFillSample = () => {
    setResume(sampleResume);
    setJob(sampleJD);
  };

  const handleCheck = () => {
    if (loading) return;

    if (!resume || !job) {
      showError("Please provide both resume text and job description.");
      return;
    }

    setLoading(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 900);

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
      .finally(() => {
        clearInterval(stepInterval);
        setLoading(false);
        setLoadingStep(0);
      });
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 font-sans min-h-[85vh]">
      {/* Error Toast */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center justify-between animate-bounce">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="text-xs font-bold hover:text-red-300">✕</button>
        </div>
      )}

      {/* Hero Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-8 sm:p-10 shadow-2xl text-center transition-colors duration-200 ${
          isDark
            ? "border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white"
            : "border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/20"
        }`}
      >
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-extrabold backdrop-blur-md">
            <FaMagic className="text-amber-300 animate-spin" />
            <span>Gemini 1.5 Flash AI ATS Engine</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            AI Resume & ATS Optimization Engine
          </h1>

          <p className="text-sm opacity-90 leading-relaxed max-w-xl mx-auto">
            Scan your resume against job postings to calculate ATS compatibility, extract missing keywords, and generate tailored cover letters instantly.
          </p>

          {/* Quick Demo Autofill Button */}
          <div className="pt-2">
            <button
              onClick={handleFillSample}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 px-5 py-2.5 text-xs font-bold text-white transition backdrop-blur-md shadow-lg"
            >
              <FaBolt className="text-amber-300" /> Try Sample Developer Resume & Job Description
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Input Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Step 1: Resume Input Card */}
        <div
          className={`rounded-3xl border p-6 shadow-xl space-y-3 transition-colors duration-200 ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <span>1. Resume Content</span>
            </label>

            <label
              className={`cursor-pointer text-xs px-3.5 py-1.5 rounded-xl font-bold transition border flex items-center gap-1.5 ${
                isDark
                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-800 hover:bg-indigo-900"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              <FaFileUpload className="text-xs" />
              <span>{uploading ? "Extracting..." : "Upload PDF / Word"}</span>
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
            <p className="text-xs text-emerald-500 font-bold">
              ✓ File loaded: <span className="underline">{uploadedFileName}</span>
            </p>
          )}

          <textarea
            placeholder="Paste your Resume text here or upload PDF/Word file above..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className={`w-full p-4 rounded-2xl h-64 border outline-none text-sm transition focus:ring-2 focus:ring-blue-500 leading-relaxed ${
              isDark
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
            <span>Character count: {resume.length.toLocaleString()}</span>
            {resume.length > 100 && <span className="text-emerald-500 font-bold">✓ Ready for analysis</span>}
          </div>
        </div>

        {/* Step 2: Job Description & Tone Selector */}
        <div
          className={`rounded-3xl border p-6 shadow-xl space-y-3 transition-colors duration-200 ${
            isDark
              ? "bg-slate-900/90 border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-blue-500">
              2. Job Description & Tone
            </label>
            <span className="text-[11px] text-slate-400 font-semibold">Cover Letter Tone</span>
          </div>

          {/* Tone Selector Pills */}
          <div className="grid grid-cols-3 gap-2">
            {tones.map((t) => {
              const Icon = t.icon;
              const isSelected = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                      : isDark
                      ? "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="text-xs mb-1" />
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>

          <textarea
            placeholder="Paste target Job Description here..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className={`w-full p-4 rounded-2xl h-52 border outline-none text-sm transition focus:ring-2 focus:ring-blue-500 leading-relaxed ${
              isDark
                ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
            <span>Character count: {job.length.toLocaleString()}</span>
            {job.length > 100 && <span className="text-emerald-500 font-bold">✓ Target JD detected</span>}
          </div>
        </div>
      </div>

      {/* Action Button & AI Processing Progress */}
      <div className="text-center space-y-4">
        <button
          onClick={handleCheck}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider px-10 py-4 shadow-2xl shadow-blue-600/30 disabled:opacity-50 transition transform active:scale-95 cursor-pointer"
        >
          <FaBrain className="text-base" />
          {loading ? "Analyzing Alignment & ATS Compatibility..." : "🚀 Analyze Resume Alignment"}
        </button>

        {/* Loading Multi-step Progress Bar */}
        {loading && (
          <div className={`max-w-md mx-auto p-4 rounded-2xl border space-y-2 text-xs font-semibold animate-pulse ${
            isDark ? "bg-slate-900 border-slate-800 text-blue-400" : "bg-white border-slate-200 text-blue-600 shadow-lg"
          }`}>
            <div className="flex items-center justify-center gap-2">
              <FaMagic className="animate-spin text-amber-400" />
              <span>
                {loadingStep === 1 && "Step 1/3: Extracting keywords and parsing text..."}
                {loadingStep === 2 && "Step 2/3: Gemini 1.5 AI calculating ATS compatibility..."}
                {loadingStep === 3 && "Step 3/3: Drafting tailored recommendations & cover letter..."}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                style={{ width: `${(loadingStep / 3) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-5 rounded-3xl border shadow-xl ${
              isDark
                ? "bg-slate-900/90 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ✨
              </span>
              <div>
                <p className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">
                  {result.aiPowered ? "Gemini 1.5 Flash AI Engine" : "Heuristic Rule Engine"}
                </p>
                <p className="text-sm font-black">Target Role: {result.detectedRole}</p>
              </div>
            </div>

            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-5 py-2.5 transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <FaFilePdf /> Download PDF Report
            </button>
          </div>

          {/* PDF Report Container */}
          <div
            ref={reportRef}
            className={`p-6 sm:p-8 rounded-3xl shadow-2xl space-y-8 border ${
              isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/60"
            }`}
          >
            {/* Scores Overview */}
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-slate-800/60 dark:border-slate-800 border-slate-200">
              {/* Job Match Score */}
              <div
                className={`p-6 rounded-3xl border text-center space-y-2 transition ${
                  isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <p className={`text-xs uppercase font-extrabold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Overall Job Match Score
                </p>
                <p
                  className={`text-5xl font-black ${
                    result.matchScore >= 80
                      ? "text-emerald-400"
                      : result.matchScore >= 50
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {result.matchScore}%
                </p>
                <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
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

              {/* ATS Readability Score */}
              <div
                className={`p-6 rounded-3xl border text-center space-y-2 transition ${
                  isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <p className={`text-xs uppercase font-extrabold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  ATS Readability & Parsing Score
                </p>
                <p className="text-5xl font-black text-blue-500">
                  {result.atsScore || result.matchScore}%
                </p>
                <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${result.atsScore || result.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Keyword & Skill Heatmap */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FaBullseye className="text-blue-500" /> Keyword & Skill Match Heatmap
              </h3>

              {/* Matched Skills */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                  🟢 Matched Skills ({result.matchedSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-emerald-500/10 text-emerald-400 text-xs font-extrabold px-3.5 py-1.5 rounded-xl border border-emerald-500/20"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">None detected</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  🔴 Missing Target Skills ({result.missingSkills?.length || 0}) — Click to copy
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        onClick={() => handleCopy(`Added ${skill} experience to resume`, skill)}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-extrabold px-3.5 py-1.5 rounded-xl border border-red-500/20 cursor-pointer transition"
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

            {/* Strategic Recommendations */}
            <div className="space-y-3 border-t pt-6 border-slate-800/60 dark:border-slate-800 border-slate-200">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <FaLightbulb className="text-amber-400" /> Strategic Analysis & Recommendations
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {result.analysis}
              </p>
            </div>

            {/* Tailored Resume Summary */}
            {result.improvedSummary && (
              <div className="space-y-3 border-t pt-6 border-slate-800/60 dark:border-slate-800 border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    ✨ Optimized Resume Summary
                  </h3>
                  <button
                    onClick={() => handleCopy(result.improvedSummary, "summary")}
                    className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-500 font-bold px-3 py-1.5 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
                  >
                    {copiedField === "summary" ? <FaCheck /> : <FaCopy />}
                    <span>{copiedField === "summary" ? "Copied!" : "Copy Summary"}</span>
                  </button>
                </div>
                <p className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  {result.improvedSummary}
                </p>
              </div>
            )}

            {/* Tailored Cover Letter */}
            {result.coverLetter && (
              <div className="space-y-3 border-t pt-6 border-slate-800/60 dark:border-slate-800 border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    ✉️ Tailored Cover Letter ({tone} Tone)
                  </h3>
                  <button
                    onClick={() => handleCopy(result.coverLetter, "coverLetter")}
                    className="inline-flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-500 font-bold px-3 py-1.5 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer"
                  >
                    {copiedField === "coverLetter" ? <FaCheck /> : <FaCopy />}
                    <span>{copiedField === "coverLetter" ? "Copied!" : "Copy Cover Letter"}</span>
                  </button>
                </div>
                <div className={`p-5 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}>
                  {result.coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis History Bar */}
      {history.length > 0 && (
        <div
          className={`rounded-3xl border p-6 shadow-xl space-y-4 ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          }`}
        >
          <h2 className="text-base font-extrabold flex items-center gap-2">
            <FaHistory className="text-blue-500" /> Recent Analysis Runs
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {history.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                  isDark
                    ? "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div>
                  <p className="font-bold text-xs">{item.detectedRole || "Target Role"}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-black text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
                  {item.matchScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeMatch;
