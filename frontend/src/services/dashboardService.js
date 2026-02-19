import API from "./api";

// Municipal officer dashboard stats
export const fetchDashboardData = async () => {
  const res = await API.get("dashboard/");
  return res.data;
};

// Admin dashboard
export const fetchAdminDashboard = async () => {
  const res = await API.get("dashboard/admin/");
  return res.data;
};
