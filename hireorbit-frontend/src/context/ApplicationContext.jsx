import { createContext, useContext, useEffect, useState } from "react";
import { applicationService } from "../api/applicationService";

const ApplicationContext = createContext();

export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setApplications([]);
      return;
    }

    try {
      const res = await applicationService.getAllJobs();
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications");
      setApplications([]);
    }
  };

  // initial load
  useEffect(() => {
    fetchApplications();
  }, []);

  // ADD (instant update)
  const addApplication = async (data) => {
    const res = await applicationService.addJob(data);

    setApplications((prev) => [...prev, res.data]);
  };

  // DELETE (instant update)
  const deleteApplication = async (id) => {
    await applicationService.deleteJob(id);

    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // UPDATE (instant update — FIXED ISSUE)
  const updateApplication = async (id, data) => {
    const res = await applicationService.updateJob(id, data);

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? res.data : app))
    );
  };

  //logout support
  const clearApplications = () => {
    setApplications([]);
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        fetchApplications,
        addApplication,
        deleteApplication,
        updateApplication,
        clearApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};