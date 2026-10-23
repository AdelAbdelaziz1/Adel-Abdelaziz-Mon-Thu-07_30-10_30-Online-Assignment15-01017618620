import Navbar from "../component/Navbar/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <Navbar />
      </header>

      <Outlet />
    </>
  );
}