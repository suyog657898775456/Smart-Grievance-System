import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">
        {children}
      </main>
    </div>
  );
}
