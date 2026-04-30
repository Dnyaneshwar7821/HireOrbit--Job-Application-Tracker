import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationForm from "../../components/applications/ApplicationForm";
import { useApplication } from "../../context/ApplicationContext";

const AddApplication = () => {
  const navigate = useNavigate();
  const { addApplication } = useApplication();

  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    status: "APPLIED",
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
        alert("Application added");
        navigate("/applications");
      })
      .catch((err) => {
        alert(err.response?.data || "Error adding application");
      });
  };

  return (
    <ApplicationForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Add"
    />
  );
};

export default AddApplication;
