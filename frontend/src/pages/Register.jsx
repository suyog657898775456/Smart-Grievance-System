import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Backend integration later (Django)
    console.log("REGISTER DATA:", form);

    // Simulate successful registration
    alert("Registration successful! Please login.");

    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#F5F7FA] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-[#0F2A44]">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Register to raise and track civic complaints
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-2
                         text-sm focus:ring-2 focus:ring-[#1ABC9C]
                         focus:border-[#1ABC9C] focus:outline-none"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-2
                         text-sm focus:ring-2 focus:ring-[#1ABC9C]
                         focus:border-[#1ABC9C] focus:outline-none"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              className="w-full rounded-xl border border-slate-300 px-4 py-2
                         text-sm focus:ring-2 focus:ring-[#1ABC9C]
                         focus:border-[#1ABC9C] focus:outline-none"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F2A44] text-white py-3 rounded-xl
                       font-medium hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-slate-600 mt-6">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-[#1ABC9C] font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
