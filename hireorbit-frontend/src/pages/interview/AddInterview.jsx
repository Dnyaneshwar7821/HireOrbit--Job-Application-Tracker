import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { interviewService } from "../../api/interviewService";
import { useApplication } from "../../context/applicationContextValue";
import InterviewForm from "../../components/interview/InterviewForm";

const AddInterview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { fetchApplications } = useApplication();

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

      alert("Interview added");
      navigate(`/interviews/${applicationId}`);
    } catch {
      alert("Error adding interview");
    }
  };

  return (
    <InterviewForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Add"
    />
  );
};

export default AddInterview;
