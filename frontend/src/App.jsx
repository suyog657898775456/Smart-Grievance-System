import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComplaintForm from "./pages/ComplaintForm";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import MunicipalDashboard from "./pages/MunicipalDashboard";
import UserDashboard from "./pages/UserDashboard"; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Citizen Routes */}
            <Route path="/user-dashboard" element={<UserDashboard />} /> 
            <Route path="/complaint" element={<ComplaintForm />} />
            <Route path="/my-complaints" element={<MyComplaints />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/municipal-dashboard" element={<MunicipalDashboard />} />
            
            <Route path="/" element={<Login />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

