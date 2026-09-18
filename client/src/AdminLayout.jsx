import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react"; // Import Menu icon
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f4f9]">
      {/* Mobile Header - Visible only on mobile */}
      <header className="md:hidden flex items-center p-4 bg-white border-b border-[#dadce0]">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu className="w-6 h-6 text-[#202124]" />
        </button>
        <span className="ml-4 font-bold text-[#202124]">Admin Panel</span>
      </header>

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="md:pl-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}