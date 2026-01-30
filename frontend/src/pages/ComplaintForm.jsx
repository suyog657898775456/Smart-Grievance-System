import { useState } from "react";

export default function ComplaintForm() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const complaintData = {
      description,
      image,
      location,
    };

    console.log("COMPLAINT DATA:", complaintData);
  };

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Register a Complaint
          </h2>
          <p className="text-sm text-slate-500">
            Report issues with exact location for faster resolution
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Problem Description
            </label>
            <textarea
              rows="4"
              className="w-full rounded-lg border border-slate-300 px-3 py-2
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>

            <button
              type="button"
              onClick={getLocation}
              className="w-full border border-blue-600 text-blue-600
                         py-2 rounded-lg hover:bg-blue-50 transition"
            >
              {loadingLocation
                ? "Detecting location..."
                : "Use Current Location"}
            </button>

            {location.latitude && location.longitude && (
              <p className="text-xs text-green-600 mt-2">Location captured ✔</p>
            )}
          </div>

          {/* Manual Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Area / Landmark (optional)
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-300 px-3 py-2
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Near bus stop, street name, area..."
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Image (optional)
            </label>
            <label
              className="flex items-center justify-center border-2 border-dashed
                              border-slate-300 rounded-lg px-4 py-3 cursor-pointer
                              hover:border-blue-500 transition text-sm"
            >
              <input
                type="file"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image ? image.name : "Click to upload image"}
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg
                       hover:bg-blue-700 transition font-medium"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}
