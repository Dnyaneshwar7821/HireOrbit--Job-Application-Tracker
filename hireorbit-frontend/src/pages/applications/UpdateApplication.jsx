import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplication } from "../../context/applicationContextValue";
import ApplicationForm from "../../components/applications/ApplicationForm";
import { useToast } from "../../context/ToastContext";

const UpdateApplicationForm = ({ application, updateApplication }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({
    companyName: application.companyName,
    jobRole: application.jobRole,
    status: application.status,
    jobUrl: application.jobUrl || "",
    location: application.location || "",
    salaryRange: application.salaryRange || "",
    source: application.source || "",
    employmentType: application.employmentType || "",
    followUpDate: application.followUpDate || "",
    notes: application.notes || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateApplication(application.id, form);
      showSuccess("Application updated successfully!");
      navigate("/applications");
    } catch {
      showError("Failed to update application");
    }
  };

  return (
    <ApplicationForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Update Application"
    />
  );
};

const UpdateApplication = () => {
  const { id } = useParams();
  const { applications, updateApplication } = useApplication();
  const application = applications.find((app) => app.id === Number(id));

  if (!application) {
    return <p className="p-4 text-gray-500">Loading...</p>;
  }

  return (
    <UpdateApplicationForm
      key={application.id}
      application={application}
      updateApplication={updateApplication}
    />
  );
};

export default UpdateApplication;
