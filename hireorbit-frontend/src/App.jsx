import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

const JobBoard = lazy(() => import("./pages/jobs/JobBoard"));
const AddApplication = lazy(() => import("./pages/applications/AddApplication"));
const AllApplications = lazy(() =>
  import("./pages/applications/AllApplications"),
);
const UpdateApplication = lazy(() =>
  import("./pages/applications/UpdateApplication"),
);
const ApplicationDetails = lazy(() =>
  import("./pages/applications/ApplicationDetails"),
);

const AddInterview = lazy(() => import("./pages/interview/AddInterview"));
const InterviewList = lazy(() => import("./pages/interview/InterviewList"));

const Profile = lazy(() => import("./pages/profile/Profile"));
const ResumeMatch = lazy(() => import("./pages/ResumeMatch"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminJobs = lazy(() => import("./pages/admin/AdminJobs"));
const AdminJobApplicants = lazy(() =>
  import("./pages/admin/AdminJobApplicants"),
);

import Layout from "./components/common/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Public Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Public & Authenticated Job Board */}
        <Route element={<Layout />}>
          <Route path="/jobs" element={<JobBoard />} />
        </Route>

        {/* Protected User Panel */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Applications Tracker */}
            <Route path="/applications" element={<AllApplications />} />
            <Route path="/applications/add" element={<AddApplication />} />
            <Route
              path="/applications/update/:id"
              element={<UpdateApplication />}
            />
            <Route path="/applications/:id" element={<ApplicationDetails />} />

            {/* Interviews */}
            <Route
              path="/interviews/:applicationId"
              element={<InterviewList />}
            />
            <Route
              path="/interviews/add/:applicationId"
              element={<AddInterview />}
            />

            {/* RESUME ANALYSIS */}
            <Route path="/resume-match" element={<ResumeMatch />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Protected Admin Panel */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route
              path="/admin/jobs/:jobId/applicants"
              element={<AdminJobApplicants />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
