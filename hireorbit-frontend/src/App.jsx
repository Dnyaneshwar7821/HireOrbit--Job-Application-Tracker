import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";

import AddApplication from "./pages/applications/AddApplication";
import AllApplications from "./pages/applications/AllApplications";
import UpdateApplication from "./pages/applications/UpdateApplication";
import ApplicationDetails from "./pages/applications/ApplicationDetails";

import AddInterview from "./pages/interview/AddInterview";
import InterviewList from "./pages/interview/InterviewList";

import Profile from "./pages/profile/Profile";
import ResumeMatch from "./pages/ResumeMatch";

import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
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
  );
}

export default App;
