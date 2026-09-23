import React, { useState, useEffect } from "react";
import API from "./config/api.js";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await API.get("/admin/getTasks");
      const { success, message, tasks: fetchedTasks } = response.data;

      if (success) {
        setTasks(fetchedTasks || []);
      } else {
        setErrorMsg(message || "Failed to fetch tasks.");
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          "Something went wrong while connecting to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex justify-center pt-8 sm:pt-12 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="w-full max-w-4xl">
        {/* Header Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              Admin Tasks
            </h1>
            <p className="text-sm text-slate-500">
              View and manage assigned deliverables and active program tasks.
            </p>
          </div>

          <button
            onClick={fetchTasks}
            disabled={loading}
            className="self-start sm:self-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Tasks"}
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-4 rounded-xl text-sm font-medium mb-6 bg-red-50 text-red-800 border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 animate-pulse"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              i
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              No Tasks Available
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              There are currently no tasks found in the system. Check back later or create a new task.
            </p>
          </div>
        ) : (
          /* Task List */
          <div className="flex flex-col gap-4">
            {tasks.map((task, index) => (
              <div
                key={task._id || task.id || index}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {task.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                    Task #{index + 1}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {task.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasks;