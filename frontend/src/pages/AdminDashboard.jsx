import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext"; // Import Context
import StatusBadge from "../components/StatusBadge";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext); // Get logged-in admin's info
  const [grievances, setGrievances] = useState([]);

  // Use the department from the logged-in user's profile
  const adminDept = user?.department || "General";

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user, adminDept]);

  const fetchAdminData = async () => {
    try {
      const response = await api.get("grievances/admin/");
      // Filter logic: Only show grievances matching this Admin's department
      const filtered = response.data.filter((g) => g.department === adminDept);
      setGrievances(filtered);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`grievances/admin/${id}/`, { status: newStatus });
      fetchAdminData();
      alert(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {adminDept} Admin Portal
        </h1>
        <div className="text-sm text-gray-500">
          Logged in as: <span className="font-semibold">{user?.username}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Title
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Update Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grievances.length > 0 ? (
              grievances.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-900 font-medium">
                    {g.title}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={g.status} />
                  </td>
                  <td className="p-4">
                    <select
                      className="border rounded p-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => updateStatus(g.id, e.target.value)}
                      defaultValue={g.status}
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">Working</option>
                      <option value="resolved">Done</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-10 text-center text-gray-400">
                  No grievances currently assigned to the {adminDept}{" "}
                  department.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
