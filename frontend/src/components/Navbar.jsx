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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-blue-600">
          Smart Grievance
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {!isAuthenticated ? (
            <>
              <Link className="text-slate-600 hover:text-blue-600" to="/login">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link className="hover:text-blue-600" to="/complaint">
                New Complaint
              </Link>
              <Link className="hover:text-blue-600" to="/my-complaints">
                My Complaints
              </Link>

              {role === "admin" && (
                <Link className="hover:text-blue-600" to="/admin">
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 transition"
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
