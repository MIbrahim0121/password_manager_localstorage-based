import { useEffect, useState } from "react";
// Uncomment if using React-Toastify:
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userName, setUserName] = useState("");
    const navigate = useNavigate();
  useEffect(() => {
   
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserName(parsed?.name  ||  parsed.email || "Guest");
      }
    } catch {
      /* ignore parse errors */
    }
  }, []);

  const logout =() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
   

    // If using Toastify:
    toast.info("Logged out.", { autoClose: 1500, position: "top-right" });

    // Redirect to login page
navigate("/login");  };

  return (
    <header className="w-full bg-gradient-to-r from-blue-700  to-indigo-500 text-white shadow-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <NavLink
            to="/home"
            className="text-xl sm:text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity"
          >
            Password Manager
          </NavLink>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {userName ? (
              <span className="hidden sm:inline text-sm sm:text-base font-medium">
                Hi, {userName}
              </span>
            ) : null}

            <button
              onClick={logout}
              className="rounded-md bg-white/20 px-3 py-1.5 text-sm font-semibold hover:bg-white/30 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
