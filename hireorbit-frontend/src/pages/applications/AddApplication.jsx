import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "../../components/applications/ApplicationForm";
import { useApplication } from "../../context/applicationContextValue";
import { useToast } from "../../context/ToastContext";

const AddApplication = () => {
  const navigate = useNavigate();
  const { addApplication } = useApplication();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    status: "APPLIED",
    jobUrl: "",
    location: "",
    salaryRange: "",
    source: "",
    employmentType: "",
    followUpDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addApplication(form)
      .then(() => {
        showSuccess("Job application created!");
        navigate("/applications");
      })
      .catch((err) => {
        showError(
          err.response?.data?.message ||
            err.response?.data ||
            "Error adding application",
        );
      });
  };

  return (
    <ApplicationForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Add Application"
    />
  );
};

export default AddApplication;
