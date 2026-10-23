import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router";
import { House, User, MessageCircle, Menu, Settings } from "lucide-react";
import routeLogo from "../../assets/route.png";
import { useTokenContext } from "../context/TokenContext";
import { UserContext } from "../context/UserContext";
import { getUnreadCount } from "../../services/notification.services";

const navItems = [
  { to: "/home", label: "Feed", Icon: House },
  { to: "/profile", label: "Profile", Icon: User },
  { to: "/notifications", label: "Notifications", Icon: MessageCircle },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { setToken } = useTokenContext();
  const userContext = useContext(UserContext);
  const userDetails = userContext?.userDetails;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userDetails?._id) return;

    async function fetchUnread() {
      try {
        const res = await getUnreadCount();
        console.log("unread:", res);
        const value = res.data?.unreadCount ?? res.data?.count ?? res.data;
        setUnreadCount(typeof value === "number" ? value : 0);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, [userDetails?._id, location.pathname]);

  function handleLogout() {
    localStorage.removeItem("userToken");
    setToken(null);
    userContext?.setUserDetails(null);
    setIsOpen(false);
    navigate("/auth/login");
  }

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
      <div className="flex items-center gap-3">
        <img
          alt="Route Logo"
          className="h-9 w-9 rounded-xl object-cover"
          src={routeLogo}
        />
        <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
          Route Posts
        </p>
      </div>

      <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 ${
                isActive
                  ? "bg-white text-[#1f6fe5]"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
              }`
            }
          >
            <span className="relative">
              <Icon size={20} aria-hidden="true" />
              {to === "/notifications" && unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex min-w-[16px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-black leading-4 text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">{label}</span>
            <span className="sr-only sm:hidden">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100"
        >
          <img
            alt={userDetails?.name}
            className="h-8 w-8 rounded-full object-cover"
            src={userDetails?.photo}
          />
          <span className="hidden max-w-[140px] truncate text-sm font-semibold text-slate-800 md:block">
            {userDetails?.name}
          </span>
          <Menu size={15} className="text-slate-500" aria-hidden="true" />
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            <Link
              to="/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <User size={16} aria-hidden="true" />
              Profile
            </Link>

            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Settings size={16} aria-hidden="true" />
              Settings
            </Link>

            <div className="my-1 border-t border-slate-200" />

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}