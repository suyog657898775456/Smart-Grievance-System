import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/grievances/citizen/";

export const fetchUserComplaints = async () => {
  try {
    const token = localStorage.getItem("access"); // must match login storage key

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // DRF pagination check
    return response.data.results || response.data;

  } catch (error) {
    console.error("Error fetching from Django:", error.response?.data || error);
    throw error;
  }
};