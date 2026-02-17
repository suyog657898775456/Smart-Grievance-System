import axios from "axios";

// =========================================================
// 1. AXIOS SETUP (For Future Real Backend)
// =========================================================
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Django backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// =========================================================
// 2. MOCK DATA SWITCH (Set to FALSE when Backend is ready)
// =========================================================
const USE_MOCK_DATA = true;

// =========================================================
// 3. API FUNCTIONS
// =========================================================

/**
 * 🔐 LOGIN USER
 */
export const loginUser = async (email, password) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "admin@city.com" && password === "admin123") {
          resolve({
            id: 1,
            name: "Commissioner",
            email,
            role: "ADMIN",
            token: "admin-token",
          });
        } else if (email === "staff@city.com" && password === "staff123") {
          resolve({
            id: 2,
            name: "Sanitation Officer",
            email,
            role: "STAFF",
            department: "SANITATION",
            token: "staff-token",
          });
        } else if (email === "citizen@gmail.com" && password === "citizen123") {
          resolve({
            id: 3,
            name: "Rohan Kumar",
            email,
            role: "CITIZEN",
            token: "citizen-token",
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  } else {
    const response = await api.post("/auth/login/", { email, password });
    return response.data;
  }
};

/**
 * 📝 SUBMIT COMPLAINT (The missing function!)
 */
export const submitComplaint = async (formData) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Mock API Received Data:", Object.fromEntries(formData));
        resolve({
          success: true,
          message: "Complaint submitted successfully!",
        });
      }, 1000);
    });
  } else {
    // Note: Multipart header is handled automatically by axios when passing FormData
    const response = await api.post("/complaints/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
};

/**
 * 📊 STAFF DASHBOARD DATA
 */
export const fetchDashboardData = async (userDepartment) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          complaints: [
            {
              id: 101,
              category: "Garbage",
              location: "Market Yard",
              status: "Pending",
              date: "2023-10-24",
            },
            {
              id: 102,
              category: "Drainage",
              location: "Sector 4",
              status: "Resolved",
              date: "2023-10-23",
            },
          ],
          stats: { total: 12, pending: 4, resolved: 8 },
        });
      }, 600);
    });
  } else {
    const response = await api.get("/municipal/dashboard/");
    return response.data;
  }
};

/**
 * 👤 CITIZEN MY COMPLAINTS
 */
export const fetchUserComplaints = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            description: "Garbage not collected",
            status: "Pending",
            created_at: "2026-01-28",
            latitude: 18.52,
            longitude: 73.85,
          },
          {
            id: 2,
            description: "Water leakage",
            status: "Resolved",
            created_at: "2026-01-25",
            latitude: 18.53,
            longitude: 73.84,
          },
        ]);
      }, 500);
    });
  } else {
    const response = await api.get("/complaints/my-history/");
    return response.data;
  }
};

/**
 * 👮 ADMIN DASHBOARD DATA
 */
export const fetchAllComplaints = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 101,
            description: "Major Pothole",
            status: "Pending",
            date: "2026-01-29",
            latitude: 18.51,
            longitude: 73.85,
          },
          {
            id: 102,
            description: "Street Light Broken",
            status: "Resolved",
            date: "2026-01-28",
            latitude: 18.52,
            longitude: 73.86,
          },
        ]);
      }, 600);
    });
  } else {
    const response = await api.get("/admin/all-complaints/");
    return response.data;
  }
};
