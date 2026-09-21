import React from "react";
import { Users, ListTodo, PlusCircle, LogOut, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "./config/api";

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Ambassadors", path: "/adminDashboard", icon: Users },
    { name: "Tasks", path: "/adminDashboard/tasks", icon: ListTodo },
    { name: "Create Task", path: "/adminDashboard/createTask", icon: PlusCircle },
    { name: "Inbox", path: "/adminDashboard/inbox", icon: Inbox },
  ];

  const handleLogout = async () => {
    localStorage.clear();
    await API.post("/auth/logout");
    navigate("/");
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#dadce0] 
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Content (Header + Navigation) */}
        <div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 text-[#5f6368]"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6 border-b border-[#dadce0]">
            <h2 className="text-lg font-bold text-[#202124]">Admin Panel</h2>
          </div>

          <nav className="py-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 768) onClose(); // Close on click mobile
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-[#5f6368] hover:bg-[#f1f3f4]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pinned Logout Button at Bottom */}
        <div className="p-4 border-t border-[#dadce0]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}