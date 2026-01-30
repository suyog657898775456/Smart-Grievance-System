import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ComplaintForm from "./pages/ComplaintForm";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
