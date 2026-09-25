import React, { useState, useEffect } from "react";
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Trash2,
  CheckCircle2,
  XCircle,
  CheckCircle,
  X
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

  // Deleting State & Modal Controls
  const [deletingId, setDeletingId] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  // Toast Notification Auto-Dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchAmbassadors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/admin/getAmbassadors", { withCredentials: true });
      if (response.data?.success) {
        setAmbassadors(response.data?.ambassadors || []);
      } else {
        setError(response.data?.message || "Failed to fetch ambassadors list.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch ambassadors list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Safe Filter Logic updated for userId schema
  const filteredData = ambassadors.filter((item) => {
    const search = searchQuery.toLowerCase();
    const name = item.userId?.name?.toLowerCase() || "";
    const email = item.userId?.email?.toLowerCase() || "";
    const college = item.college?.toLowerCase() || "";
    const city = item.city?.toLowerCase() || "";

    return (
      name.includes(search) ||
      email.includes(search) ||
      college.includes(search) ||
      city.includes(search)
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

  // Handle Delete Confirmation Modal Trigger
  const handleOpenDeleteModal = (e, ambassador) => {
    e.stopPropagation();
    setSelectedForDelete(ambassador);
  };

  // Perform Delete Action
  const confirmDelete = async () => {
    if (!selectedForDelete) return;

    const targetId = selectedForDelete._id || selectedForDelete.userId?._id;
    setDeletingId(targetId);

    try {
      const response = await API.delete(`/admin/deleteAmbassador/${targetId}`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        // Remove ambassador from local state
        setAmbassadors((prev) => prev.filter((item) => (item._id || item.userId?._id) !== targetId));
        setToast({
          type: "success",
          message: response.data?.message || "Ambassador deleted successfully.",
        });
      } else {
        setToast({
          type: "error",
          message: response.data?.message || "Failed to delete ambassador.",
        });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "An error occurred while deleting.",
      });
    } finally {
      setDeletingId(null);
      setSelectedForDelete(null);
    }
  };

  return (
    <div className="p-8 relative">
      {/* Notification Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedForDelete && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-[#dadce0] animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#202124] mb-2">Delete Ambassador</h3>
            <p className="text-sm text-[#5f6368] mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-[#202124]">
                {selectedForDelete.userId?.email || "this ambassador"}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                disabled={Boolean(deletingId)}
                onClick={() => setSelectedForDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#dadce0] text-sm font-semibold text-[#5f6368] hover:bg-[#f8f9fa] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={Boolean(deletingId)}
                onClick={confirmDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">College</th>
                    <th className="py-4 px-6">City</th>
                    <th className="py-4 px-6">Submissions</th>
                    <th className="py-4 px-6 text-center">Logged In</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dadce0]">
                  {currentItems.length > 0 ? (
                    currentItems.map((amb, index) => {
                      const id = amb._id || amb.userId?._id || index;
                      const isDeletingThis = deletingId === id;

                      return (
                        <tr key={id} className="hover:bg-[#f8f9fa] transition-colors">
                          {/* Email Column */}
                          <td className="py-4 px-6">
                            <div className="font-semibold text-[#202124] text-sm">
                              {amb.userId?.email || "N/A"}
                            </div>
                            {amb.userId?.name && (
                              <div className="text-[11px] text-[#5f6368]">
                                {amb.userId.name}
                              </div>
                            )}
                          </td>

                          {/* College */}
                          <td className="py-4 px-6 text-sm text-[#202124]">
                            {amb.college || "N/A"}
                          </td>

                          {/* City */}
                          <td className="py-4 px-6 text-sm text-[#202124]">
                            {amb.city || "N/A"}
                          </td>

                          {/* Task Submitted Count */}
                          <td className="py-4 px-6 text-sm">
                            <span className="inline-flex items-center gap-1 font-medium text-[#202124]">
                              <strong className="text-[#1a73e8]">{amb.taskSubmitted ?? 0}</strong> tasks submitted
                            </span>
                          </td>

                          {/* Logged In Column (hasChangePassword) */}
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                amb.userId?.hasChangePassword
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {amb.userId?.hasChangePassword ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" /> Yes
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" /> No
                                </>
                              )}
                            </span>
                          </td>

                          {/* Delete Action */}
                          <td className="py-4 px-6 text-center">
                            <button
                              disabled={isDeletingThis}
                              onClick={(e) => handleOpenDeleteModal(e, amb)}
                              title="Delete Ambassador"
                              className="p-2 text-[#5f6368] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isDeletingThis ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-sm text-[#5f6368]">
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
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30 transition-colors"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="p-2 rounded-lg hover:bg-[#dadce0] disabled:opacity-30 transition-colors"
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