import axios from "axios";

// Updated URL provided by your friend
const API_URL = "http://127.0.0.1:8000/api/grievances/citizen/";

export const fetchUserComplaints = async () => {
  try {
    const response = await axios.get(API_URL);

    // DRF results often come in response.data or response.data.results
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error fetching from Django:", error);
    throw error;
  }
};
