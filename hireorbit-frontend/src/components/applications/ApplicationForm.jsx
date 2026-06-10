import { ui } from "../../styles/ui";

const ApplicationForm = ({ form, onChange, onSubmit, buttonText }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <form onSubmit={onSubmit} className={`${ui.card} w-full max-w-3xl`}>
        {/* TITLE */}
        <h2 className="text-xl font-bold mb-4 text-center">
          {buttonText} Application
        </h2>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={onChange}
            placeholder="Company Name"
            className={ui.input}
            required
          />

          <input
            type="text"
            name="jobRole"
            value={form.jobRole}
            onChange={onChange}
            placeholder="Job Role"
            className={ui.input}
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className={ui.input}
          >
            <option value="APPLIED">APPLIED</option>
            <option value="INTERVIEW">INTERVIEW</option>
            <option value="OFFER">OFFER</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <input
            type="url"
            name="jobUrl"
            value={form.jobUrl}
            onChange={onChange}
            placeholder="Job URL"
            className={ui.input}
          />

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Location"
            className={ui.input}
          />

          <input
            type="text"
            name="salaryRange"
            value={form.salaryRange}
            onChange={onChange}
            placeholder="Salary Range"
            className={ui.input}
          />

          <input
            type="text"
            name="source"
            value={form.source}
            onChange={onChange}
            placeholder="Source"
            className={ui.input}
          />

          <select
            name="employmentType"
            value={form.employmentType}
            onChange={onChange}
            className={ui.input}
          >
            <option value="">Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>

          <input
            type="date"
            name="followUpDate"
            value={form.followUpDate}
            onChange={onChange}
            className={ui.input}
          />
        </div>

        <textarea
          name="notes"
          value={form.notes}
          onChange={onChange}
          placeholder="Notes, recruiter details, next steps..."
          className={`${ui.input} mt-3 h-28`}
        />

        {/* BUTTON */}
        <button type="submit" className={`w-full mt-4 ${ui.buttonPrimary}`}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
