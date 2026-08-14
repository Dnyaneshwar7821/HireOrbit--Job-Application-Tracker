import { ui } from "../../styles/ui";

const InterviewForm = ({ form, onChange, onSubmit, buttonText }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <form
        onSubmit={onSubmit}
        className={`${ui.card} w-full max-w-md space-y-4`}
      >
        <h2 className="text-xl font-extrabold text-white text-center">
          {buttonText} Interview Round
        </h2>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Round Name
          </label>
          <input
            type="text"
            name="roundName"
            value={form.roundName}
            onChange={onChange}
            placeholder="e.g. Technical Round 1 / HR Screening"
            className={ui.input}
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Result Status
          </label>
          <select
            name="result"
            value={form.result}
            onChange={onChange}
            className={ui.input}
          >
            <option value="PENDING">PENDING</option>
            <option value="PASS">PASS</option>
            <option value="FAIL">FAIL</option>
          </select>
        </div>

        <button
          type="submit"
          className={`${ui.buttonPrimary} w-full py-3`}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;