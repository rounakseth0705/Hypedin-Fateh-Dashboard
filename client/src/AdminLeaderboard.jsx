import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import API from "./config/api.js";

export default function AdminLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState("taskCompleted"); // "taskCompleted" or "taskSubmitted"
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchLeaderboard(metric);
  }, [metric]);

  const fetchLeaderboard = async (selectedMetric) => {
    setLoading(true);
    setError(null);
    setExpandedRows({}); // Reset expanded rows on metric change
    
    const endpoint =
      selectedMetric === "taskSubmitted"
        ? "/admin/ambassadorLeaderboard/taskSubmitted"
        : "/admin/ambassadorLeaderboard/taskCompleted";

    try {
      const response = await API.get(endpoint, { withCredentials: true });
      if (response.data?.success) {
        setLeaderboard(response.data?.sortedAmbassadors || []);
      } else {
        setError(response.data?.message || "Failed to fetch leaderboard data.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leaderboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="p-8 relative">
      {/* Header with Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#202124]">Leaderboard</h1>
          <p className="text-sm text-[#5f6368]">View and track top-performing student ambassadors.</p>
        </div>
        <div>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#dadce0] bg-white text-sm font-semibold text-[#202124] focus:ring-2 focus:ring-[#1a73e8] focus:border-transparent outline-none transition-all shadow-sm cursor-pointer"
          >
            <option value="taskCompleted">Task Completed</option>
            <option value="taskSubmitted">Task Submitted</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
            <p className="text-sm text-[#5f6368]">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-600 flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
                  <th className="py-4 px-4 w-16 text-center"></th>
                  <th className="py-4 px-6 w-24">Rank</th>
                  <th className="py-4 px-6">Ambassador</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Tasks Completed</th>
                  <th className="py-4 px-6">Tasks Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dadce0]">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => {
                    const isExpanded = !!expandedRows[index];
                    return (
                      <React.Fragment key={index}>
                        <tr className="hover:bg-[#f8f9fa] transition-colors">
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => toggleRow(index)}
                              className="p-1 rounded-lg hover:bg-gray-200 text-[#5f6368] transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-[#1a73e8]" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-6 font-semibold text-[#202124] text-sm">
                            #{index + 1}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-[#202124] text-sm">
                              {item.userId.name || "N/A"}
                            </div>
                            {item.userId?.email && (
                              <div className="text-[11px] text-[#5f6368] mt-0.5">
                                {item.userId.email}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-[#202124]">
                            {item.userId?.phoneNo || "N/A"}
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className="inline-flex items-center gap-1 font-medium text-[#202124]">
                              <strong className="text-[#1a73e8]">{item.taskCompleted ?? 0}</strong> tasks completed
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className="inline-flex items-center gap-1 font-medium text-[#202124]">
                              <strong className="text-[#1a73e8]">{item.taskSubmitted ?? 0}</strong> tasks submitted
                            </span>
                          </td>
                        </tr>

                        {/* Expanded Row Content */}
                        {isExpanded && (
                          <tr className="bg-[#f8f9fa]/60">
                            <td colSpan="6" className="py-4 px-12">
                              <div className="p-4 bg-white rounded-xl border border-[#dadce0] shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5f6368] mb-2">
                                  {metric === "taskSubmitted" ? "Submitted Tasks" : "Completed Tasks"}
                                </h4>
                                {metric === "taskSubmitted" ? (
                                  Array.isArray(item.submittedTasks) && item.submittedTasks.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[#202124]">
                                      {item.submittedTasks.map((task, tIndex) => (
                                        <li key={tIndex}>{task.title || "Untitled Task"}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-[#5f6368]">No submitted tasks found.</p>
                                  )
                                ) : (
                                  Array.isArray(item.completedTasks) && item.completedTasks.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-sm text-[#202124]">
                                      {item.completedTasks.map((task, tIndex) => (
                                        <li key={tIndex}>{task.title || "Untitled Task"}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-[#5f6368]">No completed tasks found.</p>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-sm text-[#5f6368]">
                      No ambassadors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}