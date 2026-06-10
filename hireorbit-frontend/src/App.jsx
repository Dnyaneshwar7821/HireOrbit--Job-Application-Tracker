import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));

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

import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Applications */}
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
      </Routes>
    </Suspense>
  );
}

export default App;
