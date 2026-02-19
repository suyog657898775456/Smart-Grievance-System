import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "Road",
    location: null,
  });

  // 📍 Get GPS location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        () => alert("Please enable location permission"),
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("department", formData.department);

    if (image) data.append("image", image);

    if (formData.location) {
      data.append("latitude", formData.location.lat);
      data.append("longitude", formData.location.lng);
    }

    try {
      await api.post("grievances/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsSuccess(true);
      setTimeout(() => navigate("/user-dashboard"), 2000);
    } catch (error) {
      console.error("Upload failed", error.response?.data);
      alert("Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold">Complaint Registered!</h2>
        <p className="text-gray-500">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-bold">Report an Issue</h2>

      <input
        type="text"
        placeholder="Issue Title"
        required
        disabled={isSubmitting}
        className="w-full border p-2 rounded disabled:bg-gray-100"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <select
        disabled={isSubmitting}
        className="w-full border p-2 rounded"
        onChange={(e) =>
          setFormData({ ...formData, department: e.target.value })
        }
      >
        <option value="Road">Road</option>
        <option value="Water">Water</option>
        <option value="Light">Light</option>
        <option value="Sewage">Sewage</option>
        <option value="Garbage">Garbage</option>
      </select>

      <textarea
        placeholder="Describe the issue..."
        disabled={isSubmitting}
        className="w-full border p-2 rounded h-32"
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <div className="border-2 border-dashed p-4 text-center rounded">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !formData.location}
        className={`w-full py-3 rounded font-bold text-white transition ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Uploading..." : "Submit Report"}
      </button>
    </form>
  );
};

export default ComplaintForm;
