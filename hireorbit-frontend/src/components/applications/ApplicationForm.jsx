import { ui } from "../../styles/ui";

const ApplicationForm = ({ form, onChange, onSubmit, buttonText }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <form onSubmit={onSubmit} className={`${ui.card} w-96`}>
        {/* TITLE */}
        <h2 className="text-xl font-bold mb-4 text-center">
          {buttonText} Application
        </h2>

        {/* COMPANY */}
        <input
          type="text"
          name="companyName"
          value={form.companyName}
          onChange={onChange}
          placeholder="Company Name"
          className={`${ui.input} mb-3`}
          required
        />

        {/* ROLE */}
        <input
          type="text"
          name="jobRole"
          value={form.jobRole}
          onChange={onChange}
          placeholder="Job Role"
          className={`${ui.input} mb-3`}
          required
        />

        {/* STATUS */}
        <select
          name="status"
          value={form.status}
          onChange={onChange}
          className={`${ui.input} mb-4`}
        >
          <option value="APPLIED">APPLIED</option>
        </select>

        {/* BUTTON */}
        <button type="submit" className={`w-full ${ui.buttonPrimary}`}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
