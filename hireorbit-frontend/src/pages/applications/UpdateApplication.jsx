import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplication } from "../../context/ApplicationContext";
import ApplicationForm from "../../components/applications/ApplicationForm";

const UpdateApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { applications, updateApplication } = useApplication();

  const [form, setForm] = useState({
    companyName: "",
    jobRole: "",
    status: "APPLIED",
  });

  useEffect(() => {
    const app = applications.find((a) => a.id === parseInt(id));
    if (app) setForm(app);
  }, [id, applications]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateApplication(id, form);
      alert("Updated successfully");
      navigate("/applications");
    } catch {
      alert("Update failed");
    }
  };

  return (
    <ApplicationForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Update"
    />
  );
};

export default UpdateApplication;
