import { createContext, useContext } from "react";

export const ApplicationContext = createContext();

export const useApplication = () => useContext(ApplicationContext);
