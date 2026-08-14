import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Layout = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen flex-col font-sans transition-colors duration-200 ${
        theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <Navbar />
      <main className="w-full flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
