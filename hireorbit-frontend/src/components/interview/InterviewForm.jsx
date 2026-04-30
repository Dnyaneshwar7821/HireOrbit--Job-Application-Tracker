const InterviewForm = ({ form, onChange, onSubmit, buttonText }) => {
  return (
    <div className="flex justify-center items-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {buttonText} Interview
        </h2>

        <input
          type="text"
          name="roundName"
          value={form.roundName}
          onChange={onChange}
          placeholder="Round Name (HR / Technical)"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <select
          name="result"
          value={form.result}
          onChange={onChange}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="PENDING">PENDING</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;