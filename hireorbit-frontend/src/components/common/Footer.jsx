import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`border-t py-6 text-center backdrop-blur-md transition-colors duration-200 ${
        isDark
          ? "border-slate-800/80 bg-slate-950/90 text-slate-500"
          : "border-slate-200 bg-white/90 text-slate-600 shadow-sm"
      }`}
    >
      <p className="text-xs font-medium">
        &copy; {new Date().getFullYear()} HireOrbit • AI-Powered Job Application Tracker & Career Command Center
      </p>
    </footer>
  );
};

export default Footer;
