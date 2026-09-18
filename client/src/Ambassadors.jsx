import React, { useState, useEffect } from "react";
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  User 
} from "lucide-react";
import API from "./config/api.js";

export default function Ambassadors() {
  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAmbassadors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get("/admin/getAmbassadors", { withCredentials: true });
        // Ensure data is an array
        setAmbassadors(response.data?.ambassadors || []);
      } catch (err) {
        setError("Failed to fetch ambassadors list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAmbassadors();
  }, []);

  // Filter Logic
  const filteredData = ambassadors.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      item.userId?.name?.toLowerCase().includes(search) ||
      item.userId?.email?.toLowerCase().includes(search) ||
      item.college?.toLowerCase().includes(search) ||
      item.city?.toLowerCase().includes(search)
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Helper for status colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Reserve": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#202124]">Ambassadors</h1>
        <p className="text-sm text-[#5f6368]">Manage and view all registered student ambassadors.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-[#9aa0a6]" />
        <input
          type="text"
          placeholder="Search by name, email, college, or city..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent outline-none transition-all text-sm"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
            <p className="text-sm text-[#5f6368]">Loading ambassadors...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-600 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
                    <th className="py-4 px-6">Ambassador</th>
                    <th className="py-4 px-6">College</th>
                    <th className="py-4 px-6">City</th>
                    <th className="py-4 px-6">Performance</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dadce0]">
                  {currentItems.length > 0 ? (
                    currentItems.map((amb) => (
                      <tr key={amb._id} className="hover:bg-[#f8f9fa] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-[#202124] text-sm">{amb.userId?.name || "N/A"}</div>
                          <div className="text-[11px] text-[#5f6368]">{amb.userId?.email || "N/A"}</div>
                        </td>
                        <td className="py-4 px-6 text-sm text-[#202124]">{amb.college}</td>
                        <td className="py-4 px-6 text-sm text-[#202124]">{amb.city}</td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex gap-4">
                            <span><strong className="text-[#1a73e8]">{amb.points}</strong> pts</span>
                            <span><strong className="text-[#1a73e8]">{amb.taskCompleted}</strong> tasks</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(amb.status)}`}>
                            {amb.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-sm text-[#5f6368]">
                        No ambassadors found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
                <span className="text-xs text-[#5f6368]">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}