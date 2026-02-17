import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // 👈 Import Context
import { loginUser } from "../services/api"; // 👈 Import API

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get the global login function

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Call the API (Simulated or Real)
      const userData = await loginUser(form.email, form.password);

      // 2. Save User to Context
      login(userData);

      // 3. Redirect based on Role
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else if (userData.role === "STAFF") {
        navigate("/municipal-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#F5F7FA] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-[#0F2A44]">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Login to access your grievance dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0F2A44] text-white py-3 rounded-xl font-medium transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-slate-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#1ABC9C] font-medium hover:underline"
          >
            Register
          </Link>
        </p>

        {/* 🧪 TEST CREDENTIALS BOX (Remove later) */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
          <p className="font-bold mb-2 text-slate-700 uppercase tracking-wider">
            🧪 Quick Test Login
          </p>
          <div className="space-y-2">
            <button
              onClick={() =>
                setForm({ email: "admin@city.com", password: "admin123" })
              }
              className="block w-full text-left hover:text-[#0F2A44] hover:bg-white p-2 rounded transition"
            >
              👮‍♂️ <b>Admin:</b> admin@city.com
            </button>
            <button
              onClick={() =>
                setForm({ email: "staff@city.com", password: "staff123" })
              }
              className="block w-full text-left hover:text-[#0F2A44] hover:bg-white p-2 rounded transition"
            >
              👷 <b>Staff:</b> staff@city.com
            </button>
            <button
              onClick={() =>
                setForm({ email: "citizen@gmail.com", password: "citizen123" })
              }
              className="block w-full text-left hover:text-[#0F2A44] hover:bg-white p-2 rounded transition"
            >
              🧑‍🤝‍🧑 <b>Citizen:</b> citizen@gmail.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
