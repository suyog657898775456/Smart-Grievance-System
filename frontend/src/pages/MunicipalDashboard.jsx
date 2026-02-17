import { useEffect, useState } from "react";
import { fetchDashboardData } from "../services/api";

const MunicipalDashboard = () => {
  // --- TEMPORARY: HARDCODE USER FOR TESTING ---
  // Change this value to "WATER" or "ROADS" to test different views!
  const currentUser = {
    name: "Staff Member 1",
    role: "STAFF",
    department: "SANITATION",
  };
  // ---------------------------------------------

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // We pass the department to our fake API
        const data = await fetchDashboardData(currentUser.department);
        setComplaints(data.complaints);
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser.department]); // Re-run if we change department (for testing)

  if (loading)
    return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dynamic Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {currentUser.department} DASHBOARD
        </h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
          Logged in as: {currentUser.name}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          color="bg-blue-500"
        />
        <StatCard title="Pending" value={stats.pending} color="bg-orange-500" />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          color="bg-green-500"
        />
      </div>

      {/* Complaints List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Recent Complaints</h2>
        </div>
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Issue</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {complaints.length > 0 ? (
              complaints.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">#{c.id}</td>
                  <td className="p-4">{c.category}</td>
                  <td className="p-4">{c.location}</td>
                  <td className="p-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="p-4">{c.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No complaints found for {currentUser.department}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Small Helper Components for clean code ---

const StatCard = ({ title, value, color }) => (
  <div className={`${color} text-white p-6 rounded-lg shadow-md`}>
    <h3 className="text-lg opacity-90">{title}</h3>
    <p className="text-4xl font-bold mt-2">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: "bg-red-100 text-red-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Resolved: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100"}`}
    >
      {status}
    </span>
  );
};

export default MunicipalDashboard;
