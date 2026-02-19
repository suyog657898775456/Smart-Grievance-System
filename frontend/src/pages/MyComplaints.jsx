import { useEffect, useState } from "react";
import { fetchUserComplaints } from "../services/grievanceService";


export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Add loading state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadData();
  }, []);

  // 🔄 Fetch data from the Service (Mock or Real)
  const loadData = async () => {
    try {
      const data = await fetchUserComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Failed to load complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading your complaints...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 bg-[#F5F7FA] min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0F2A44]">My Complaints</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track progress and view complaint locations
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

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 shadow-sm">
          No complaints match your search.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              {/* Description & Date */}
              <div className="mb-4">
                <p className="font-medium text-[#2C3E50] text-lg">
                  {c.description}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Submitted on {c.created_at}
                </p>
              </div>

              {/* Status Timeline */}
              <StatusTimeline status={c.status} />

              {/* Map Preview */}
              {c.latitude && c.longitude && (
                <div className="mt-5 rounded-xl overflow-hidden border border-slate-200">
                  <iframe
                    title={`map-${c.id}`}
                    width="100%"
                    height="180"
                    loading="lazy"
                    className="w-full"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.longitude - 0.005}%2C${c.latitude - 0.005}%2C${c.longitude + 0.005}%2C${c.latitude + 0.005}&layer=mapnik&marker=${c.latitude}%2C${c.longitude}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🔹 Status Timeline Component (Unchanged) */
function StatusTimeline({ status }) {
  const steps = ["Submitted", "In Progress", "Resolved"];
  // Map "Pending" in DB to "Submitted" for UI
  const current = status === "Pending" ? "Submitted" : status;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      {steps.map((step, index) => {
        const stepIndex = steps.indexOf(step);
        const currentIndex = steps.indexOf(current);
        const active = stepIndex <= currentIndex;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold z-10 transition-colors duration-300
                    ${active ? "bg-[#1ABC9C] text-white" : "bg-slate-200 text-slate-500"}`}
              >
                {index + 1}
              </div>
              {/* Step Label */}
              <span
                className={`text-xs mt-2 absolute top-8 w-20 text-center ${active ? "text-[#1ABC9C] font-medium" : "text-slate-400"}`}
              >
                {step}
              </span>
            </div>

            {/* Connecting Line */}
            {index !== steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 rounded -mt-6 transition-colors duration-300
                  ${stepIndex < currentIndex ? "bg-[#1ABC9C]" : "bg-slate-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
