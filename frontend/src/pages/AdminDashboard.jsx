import { useEffect, useState } from "react";
import { fetchAllComplaints } from "../services/api"; // 👈 Import the API

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Added loading state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch from our Central Service
      const data = await fetchAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Failed to load admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchesSearch = c.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-[#F5F7FA] min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0F2A44]">
          Admin – Complaint Management
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor, filter, and track all reported civic issues
        </p>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4">
        <input
          placeholder="Search complaints..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">ID</th>
              <th className="px-4 py-3 text-left font-medium">Description</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Location</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-t border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-4 py-3 font-medium text-[#0F2A44]">
                  #{c.id}
                </td>

                <td className="px-4 py-3">
                  <p className="font-medium text-[#2C3E50]">{c.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.date}</p>
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>

                <td className="px-4 py-3">
                  <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-200">
                    <iframe
                      title={`map-${c.id}`}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.longitude - 0.004}%2C${c.latitude - 0.004}%2C${c.longitude + 0.004}%2C${c.latitude + 0.004}&layer=mapnik&marker=${c.latitude}%2C${c.longitude}`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <p className="font-medium text-[#2C3E50]">{c.description}</p>
            <p className="text-sm text-slate-500 mt-1">
              #{c.id} • {c.date}
            </p>
            <div className="mt-2">
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
              <iframe
                title={`map-mobile-${c.id}`}
                width="100%"
                height="160"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.longitude - 0.004}%2C${c.latitude - 0.004}%2C${c.longitude + 0.004}%2C${c.latitude + 0.004}&layer=mapnik&marker=${c.latitude}%2C${c.longitude}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔹 Status Badge (Kept exactly as you designed it) */
function StatusBadge({ status }) {
  let style = "bg-slate-100 text-slate-600";
  if (status === "Pending") style = "bg-[#F4B400]/20 text-[#E67E22]";
  if (status === "In Progress") style = "bg-[#1ABC9C]/20 text-[#1ABC9C]";
  if (status === "Resolved") style = "bg-[#2ECC71]/20 text-[#2ECC71]";

  return (
    <span className={`${style} px-3 py-1 rounded-full text-xs font-medium`}>
      {status}
    </span>
  );
}
