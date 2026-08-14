const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 text-center backdrop-blur-md">
      <p className="text-xs text-slate-500 font-medium">
        &copy; {new Date().getFullYear()} HireOrbit • AI-Powered Job Application Tracker & Career Command Center
      </p>
    </footer>
  );
};

export default Footer;
