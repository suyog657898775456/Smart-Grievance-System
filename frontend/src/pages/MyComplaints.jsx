import { useEffect, useState } from "react";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setComplaints([
      {
        id: 1,
        description: "Garbage not collected",
        status: "Pending",
        created_at: "2026-01-28",
        latitude: 18.5204,
        longitude: 73.8567,
      },
      {
        id: 2,
        description: "Water leakage near road",
        status: "In Progress",
        created_at: "2026-01-27",
        latitude: 18.5314,
        longitude: 73.8446,
      },
      {
        id: 3,
        description: "Street light not working",
        status: "Resolved",
        created_at: "2026-01-25",
        latitude: 18.5167,
        longitude: 73.8560,
      },
    ]);
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          My Complaints
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Search, track progress, and view complaint locations
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

      {/* Complaints */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-sm">
          No complaints match your search.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
            >
              {/* Text */}
              <div className="mb-4">
                <p className="font-medium text-slate-800">
                  {c.description}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Submitted on {c.created_at}
                </p>
              </div>

              {/* Timeline */}
              <StatusTimeline status={c.status} />

              {/* Map Preview */}
              <div className="mt-5 rounded-lg overflow-hidden border border-slate-200">
                <iframe
                  title="map"
                  width="100%"
                  height="180"
                  loading="lazy"
                  className="w-full"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.longitude - 0.005}%2C${c.latitude - 0.005}%2C${c.longitude + 0.005}%2C${c.latitude + 0.005}&layer=mapnik&marker=${c.latitude}%2C${c.longitude}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🔹 Timeline */
function StatusTimeline({ status }) {
  const steps = ["Submitted", "In Progress", "Resolved"];
  const current =
    status === "Pending" ? "Submitted" : status;

  return (
    <div className="flex items-center justify-between mt-4">
      {steps.map((step, index) => {
        const active = steps.indexOf(step) <= steps.indexOf(current);

        return (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-semibold
                ${active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}
            >
              {index + 1}
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 rounded
                  ${active ? "bg-blue-600" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
