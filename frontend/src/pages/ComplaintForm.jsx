import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 For redirection
import { submitComplaint } from "../services/api"; // 👈 Import API

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // Loading state for the submit button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: "",
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  // 📍 Get GPS location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          ...location,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      () => {
        alert("Unable to fetch location");
        setLoadingLocation(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Prepare Data using FormData (Required for Image Uploads)
    const formData = new FormData();
    formData.append("description", description);
    formData.append("latitude", location.latitude || "");
    formData.append("longitude", location.longitude || "");
    formData.append("address", location.address);
    if (image) {
      formData.append("image", image);
    }

    try {
      // 2. Send to API
      await submitComplaint(formData);

      // 3. Success Feedback & Redirect
      alert("Complaint Registered Successfully!");
      navigate("/my-complaints"); // Redirect to history page
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center px-4 py-10 bg-[#F5F7FA] min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#0F2A44]">
            Register a Complaint
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Submit civic issues with accurate location for faster resolution
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Problem Description
            </label>
            <textarea
              rows="4"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] focus:outline-none resize-none"
              placeholder="Describe the issue clearly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">
              Location
            </label>

            <button
              type="button"
              onClick={getLocation}
              className={`w-full flex items-center justify-center gap-2 border border-[#1ABC9C] text-[#1ABC9C] py-2.5 rounded-xl font-medium hover:bg-[#1ABC9C]/10 transition ${loadingLocation ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={loadingLocation}
            >
              {loadingLocation
                ? "Detecting location..."
                : "📍 Use Current Location"}
            </button>

            {location.latitude && location.longitude && (
              <p className="text-xs text-[#2ECC71] mt-2">
                Location captured successfully: {location.latitude.toFixed(4)},{" "}
                {location.longitude.toFixed(4)} ✔
              </p>
            )}
          </div>

          {/* Manual Address */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-1">
              Area / Landmark (optional)
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#1ABC9C] focus:border-[#1ABC9C] focus:outline-none"
              placeholder="Near bus stop, street name, area..."
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#2C3E50] mb-2">
              Upload Image (optional)
            </label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl px-4 py-6 cursor-pointer text-sm text-slate-500 hover:border-[#1ABC9C] hover:text-[#1ABC9C] transition">
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <span className="mb-1">📷 Click to upload image</span>
              {image && (
                <span className="text-xs text-[#2C3E50] mt-1 font-semibold">
                  Selected: {image.name}
                </span>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#0F2A44] text-white py-3 rounded-xl font-medium transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
          >
            {isSubmitting ? "Submitting Complaint..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
