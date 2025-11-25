import React, {useContext, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useNotify} from "../components/NotificationBus";

interface NavLinkItem {
  label: string;
  to: string;
}

const NAV_LINKS: NavLinkItem[] = [
  {label: "Dashboard", to: "/"},
  {label: "Receipts", to: "/receipts"},
];

export default function Navbar() {
  const {user, logout} = useContext(AuthContext);
  const nav = useNavigate();
  const location = useLocation();
  const notify = useNotify();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Common notify call
  const handleProtectedClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    to: string
  ) => {
    if (!user) {
      e.preventDefault();
      notify({
        title: "Login Required",
        message: "Please log in to access this section.",
      });
      return false;
    }
    return true;
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO + BRAND */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
            SR
          </div>
          <div>
            <div className="text-lg font-semibold">Smart Receipts</div>
            <div className="text-xs text-gray-500 -mt-1">Tax & Expense</div>
          </div>
        </Link>

        {/* MOBILE: Hamburger Toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden p-2 rounded-md border text-slate-700"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={(e) => handleProtectedClick(e, item.to)}
              className={`text-sm transition ${
                isActive(item.to)
                  ? "text-brand-600 font-semibold border-b-2 border-brand-600 pb-1"
                  : "text-slate-700 hover:text-brand-500"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* WEB USER SECTION */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700 font-medium border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {user.name || user.email}
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm text-slate-700 hover:text-brand-500"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* MOBILE NAVIGATION DROPDOWN */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 flex flex-col gap-3 border-t bg-white">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={(e) => {
                const allow = handleProtectedClick(e, item.to);
                if (allow) setOpen(false);
              }}
              className={`text-sm ${
                isActive(item.to)
                  ? "text-brand-600 font-semibold"
                  : "text-slate-700 hover:text-brand-500"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* MOBILE USER SECTION */}
          {user ? (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm text-slate-700 font-medium border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {user.name || user.email}
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-700 hover:text-brand-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
