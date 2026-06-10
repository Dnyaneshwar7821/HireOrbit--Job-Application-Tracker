import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="w-full flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
