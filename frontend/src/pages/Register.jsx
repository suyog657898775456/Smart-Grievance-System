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

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Create Account
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
<div className="flex justify-center items-center min-h-[80vh]">
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full max-w-sm p-6">
    <h2 className="text-2xl font-semibold text-center mb-6">
      Welcome Back 👋
    </h2>

    <form className="space-y-4">
      <input
        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Email"
      />
      <input
        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Password"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Login
      </button>
    </form>
  </div>
</div>
