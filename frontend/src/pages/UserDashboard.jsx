
import { Link } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7FA] p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#0F2A44]">
            Citizen Services Portal
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            How can we assist you today?
          </p>
        </div>

        {/* The Two Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Option 1: File Complaint */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              📢
            </div>
            <h2 className="text-xl font-semibold text-[#0F2A44] mb-2">
              File a New Complaint
            </h2>
            <p className="text-slate-500 mb-6">
              Report civic issues like garbage, potholes, or water problems in your area.
            </p>
            <Link
              to="/complaint"
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
            >
              Report Issue
            </Link>
          </div>

          {/* Option 2: My Complaints */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              📋
            </div>
            <h2 className="text-xl font-semibold text-[#0F2A44] mb-2">
              Track My Complaints
            </h2>
            <p className="text-slate-500 mb-6">
              Check the status of your reported issues and view officer responses.
            </p>
            <Link
              to="/my-complaints"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              View History
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;