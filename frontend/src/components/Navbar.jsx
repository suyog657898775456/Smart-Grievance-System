import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F2A44] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-lg font-semibold tracking-wide hover:opacity-90"
        >
          Smart Urban Grievance
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-slate-200 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#1ABC9C] text-white px-4 py-2 rounded-xl
                           hover:opacity-90 transition shadow-sm"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/complaint"
                className="text-slate-200 hover:text-white transition"
              >
                Raise Complaint
              </Link>

              <Link
                to="/my-complaints"
                className="text-slate-200 hover:text-white transition"
              >
                My Complaints
              </Link>

              {role === "admin" && (
                <Link
                  to="/admin"
                  className="text-amber-300 hover:text-amber-400 transition"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={logout}
                className="text-red-300 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
