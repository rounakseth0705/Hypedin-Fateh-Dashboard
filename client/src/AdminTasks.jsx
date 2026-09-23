import React, { useState, useEffect } from "react";
import API from "./config/api.js";

const AdminTasks = () => {
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'review' | 'completed'

  // States for Active Tasks
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");

  // States for Submissions (Review & Completed)
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [submissionsError, setSubmissionsError] = useState("");

  const fetchTasks = async () => {
    setLoadingTasks(true);
    setTasksError("");

    try {
      const response = await API.get("/admin/getTasks");
      const { success, message, tasks: fetchedTasks } = response.data;

      if (success) {
        setTasks(fetchedTasks || []);
      } else {
        setTasksError(message || "Failed to fetch tasks.");
      }
    } catch (error) {
      setTasksError(
        error.response?.data?.message ||
          "Something went wrong while fetching tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    setSubmissionsError("");

    try {
      const response = await API.get("/admin/getSubmissions");
      const { success, message, submissions: fetchedSubmissions } = response.data;

      if (success) {
        setSubmissions(fetchedSubmissions || []);
      } else {
        setSubmissionsError(message || "Failed to fetch submissions.");
      }
    } catch (error) {
      setSubmissionsError(
        error.response?.data?.message ||
          "Something went wrong while fetching submissions."
      );
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchSubmissions();
  }, []);

  // Filter Submissions based on status
  const reviewSubmissions = submissions.filter(
    (sub) => sub.status === "Pending" || sub.status === "Rejected"
  );

  const completedSubmissions = submissions.filter(
    (sub) => sub.status === "Approved"
  );

  const handleRefresh = () => {
    if (activeTab === "active") {
      fetchTasks();
    } else {
      fetchSubmissions();
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex justify-center pt-8 sm:pt-12 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="w-full max-w-4xl">
        {/* Header Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              Active Tasks & Submissions
            </h1>
            <p className="text-sm text-slate-500">
              View active tasks, review ambassador submissions, and inspect completed deliverables.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loadingTasks || loadingSubmissions}
            className="self-start sm:self-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
          >
            {loadingTasks || loadingSubmissions ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${
              activeTab === "active"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Tasks ({tasks.length})
          </button>

          <button
            onClick={() => setActiveTab("review")}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${
              activeTab === "review"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Review Submissions ({reviewSubmissions.length})
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${
              activeTab === "completed"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Completed Tasks ({completedSubmissions.length})
          </button>
        </div>

        {/* TAB 1: ACTIVE TASKS */}
        {activeTab === "active" && (
          <>
            {tasksError && (
              <div className="p-4 rounded-xl text-sm font-medium mb-6 bg-red-50 text-red-800 border border-red-200">
                {tasksError}
              </div>
            )}

            {loadingTasks ? (
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
              <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  No Active Tasks
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  There are currently no active tasks in the system.
                </p>
              </div>
            ) : (
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
          </>
        )}

        {/* TAB 2: REVIEW SUBMISSIONS (Pending / Rejected) */}
        {activeTab === "review" && (
          <SubmissionsList
            submissions={reviewSubmissions}
            loading={loadingSubmissions}
            emptyTitle="No Submissions to Review"
            emptyDesc="All submissions have been reviewed or none are pending/rejected."
          />
        )}

        {/* TAB 3: COMPLETED TASKS (Approved) */}
        {activeTab === "completed" && (
          <SubmissionsList
            submissions={completedSubmissions}
            loading={loadingSubmissions}
            emptyTitle="No Completed Submissions"
            emptyDesc="There are no approved submissions yet."
          />
        )}
      </div>
    </div>
  );
};

// Sub-component to render Submissions (Review Submissions & Completed Tasks)
const SubmissionsList = ({ submissions, loading, emptyTitle, emptyDesc }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 animate-pulse"
          >
            <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">{emptyTitle}</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {submissions.map((item, index) => {
        const ambassador = item.ambassadorId?.userId || {};
        const task = item.taskId || {};
        const proofURLs = item.proofURLs || [];

        return (
          <div
            key={item._id || item.id || index}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200"
          >
            {/* Header / Status */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {task.title || "Untitled Task"}
                </h3>
                <p className="text-xs text-slate-500">
                  Ambassador: <span className="font-semibold text-slate-700">{ambassador.name || "N/A"}</span>
                </p>
              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${
                  item.status === "Approved"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : item.status === "Rejected"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {item.status || "Pending"}
              </span>
            </div>

            {/* Ambassador Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100">
              <div>
                <span className="font-medium text-slate-500">Email:</span> {ambassador.email || "N/A"}
              </div>
              <div>
                <span className="font-medium text-slate-500">Phone:</span> {ambassador.phoneNo || "N/A"}
              </div>
            </div>

            {/* Proof URLs */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Proof URLs:</p>
              {proofURLs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No proof links attached.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {proofURLs.map((url, uIdx) => (
                    <a
                      key={uIdx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md truncate max-w-xs transition-colors"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminTasks;