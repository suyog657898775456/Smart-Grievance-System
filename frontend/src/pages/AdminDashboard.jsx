import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setComplaints([
      {
        id: 101,
        description: "Garbage not collected",
        status: "Pending",
        date: "2026-01-28",
        latitude: 18.5204,
        longitude: 73.8567,
      },
      {
        id: 102,
        description: "Water leakage near road",
        status: "In Progress",
        date: "2026-01-27",
        latitude: 18.5314,
        longitude: 73.8446,
      },
      {
        id: 103,
        description: "Street light not working",
        status: "Resolved",
        date: "2026-01-25",
        latitude: 18.5167,
        longitude: 73.856,
      },
    ]);
  }, []);

  const filtered = complaints.filter((c) => {
    const matchesSearch = c.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Admin – Complaint Management
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor, filter, and track all reported issues
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          placeholder="Search complaints..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded-lg border border-slate-300 px-3 py-2
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium">#{c.id}</td>

                <td className="px-4 py-3">
                  <p className="font-medium">{c.description}</p>
                  <p className="text-xs text-slate-500">{c.date}</p>
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>

                <td className="px-4 py-3">
                  <div className="w-40 h-24 rounded overflow-hidden border border-slate-200">
                    <iframe
                      title="map"
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
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
          >
            <p className="font-medium">{c.description}</p>
            <p className="text-sm text-slate-500 mt-1">
              #{c.id} • {c.date}
            </p>

            <div className="mt-2">
              <StatusBadge status={c.status} />
            </div>

            <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
              <iframe
                title="map"
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

/* 🔹 Status Badge */
function StatusBadge({ status }) {
  let style = "bg-slate-100 text-slate-600";

  if (status === "Pending") style = "bg-blue-100 text-blue-700";
  if (status === "In Progress") style = "bg-yellow-100 text-yellow-700";
  if (status === "Resolved") style = "bg-green-100 text-green-700";

  return (
    <span className={`${style} px-3 py-1 rounded-full text-xs font-medium`}>
      {status}
    </span>
  );
}
