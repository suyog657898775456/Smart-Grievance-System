import API from "./api";

// Get logged-in user's complaints
export const fetchUserComplaints = async () => {
  const res = await API.get("grievances/");
  return res.data;
};

// Create new complaint
export const createComplaint = async (data) => {
  const res = await API.post("grievances/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
