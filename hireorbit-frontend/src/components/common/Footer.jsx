const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/70 py-4 text-center">
      <p className="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} HireOrbit. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
