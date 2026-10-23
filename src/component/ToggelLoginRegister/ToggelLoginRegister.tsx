import { NavLink } from "react-router";

export default function ToggelLoginRegister() {
  return (
    <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-center">
      <NavLink
        to="/auth/login"
        className={({ isActive }) =>
          `rounded-lg py-2 text-sm font-extrabold transition ${
            isActive
              ? "bg-white text-[#00298d] shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`
        }
      >
        Login
      </NavLink>
      <NavLink
        to="/auth/register"
        className={({ isActive }) =>
          `rounded-lg py-2 text-sm font-extrabold transition ${
            isActive
              ? "bg-white text-[#00298d] shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`
        }
      >
        Register
      </NavLink>
    </div>
  );
}
