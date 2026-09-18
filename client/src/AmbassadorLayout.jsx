import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AmbassadorSidebar from "./AmbassadorSidebar.jsx";

export default function AmbassadorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f4f9]">
      
      {/* Mobile Header (Visible only on mobile) */}
      <header className="md:hidden flex items-center p-4 bg-white border-b border-[#dadce0] sticky top-0 z-30">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#202124]">
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-4 font-bold text-[#202124]">Ambassador Portal</span>
      </header>

      {/* Sidebar - controlled by state */}
      <AmbassadorSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area - responsive padding */}
      <main className="md:pl-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}