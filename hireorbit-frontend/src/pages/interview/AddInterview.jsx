import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { interviewService } from "../../api/interviewService";
import { useApplication } from "../../context/applicationContextValue";
import InterviewForm from "../../components/interview/InterviewForm";
import { useToast } from "../../context/ToastContext";

const AddInterview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { fetchApplications } = useApplication();
  const { showSuccess, showError } = useToast();

  const [form, setForm] = useState({
    roundName: "",
    result: "PENDING",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await interviewService.addInterview(applicationId, form);
      await fetchApplications();
      showSuccess("Interview round added!");
      navigate(`/interviews/${applicationId}`);
    } catch {
      showError("Error adding interview round");
    }
  };

  return (
    <InterviewForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Add Interview Round"
    />
  );
};

export default AddInterview;
