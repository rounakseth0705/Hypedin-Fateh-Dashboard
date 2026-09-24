// import React, { useState, useEffect } from "react";
// import API from "./config/api.js";

// const AdminTasks = () => {
//   const [activeTab, setActiveTab] = useState("active"); // 'active' | 'review' | 'completed'

//   // States for Active Tasks
//   const [tasks, setTasks] = useState([]);
//   const [loadingTasks, setLoadingTasks] = useState(true);
//   const [tasksError, setTasksError] = useState("");

//   // States for Submissions (Review & Completed)
//   const [submissions, setSubmissions] = useState([]);
//   const [loadingSubmissions, setLoadingSubmissions] = useState(true);
//   const [submissionsError, setSubmissionsError] = useState("");

//   const fetchTasks = async () => {
//     setLoadingTasks(true);
//     setTasksError("");

//     try {
//       const response = await API.get("/admin/getTasks");
//       const { success, message, tasks: fetchedTasks } = response.data;

//       if (success) {
//         setTasks(fetchedTasks || []);
//       } else {
//         setTasksError(message || "Failed to fetch tasks.");
//       }
//     } catch (error) {
//       setTasksError(
//         error.response?.data?.message ||
//           "Something went wrong while fetching tasks."
//       );
//     } finally {
//       setLoadingTasks(false);
//     }
//   };

//   const fetchSubmissions = async () => {
//     setLoadingSubmissions(true);
//     setSubmissionsError("");

//     try {
//       const response = await API.get("/admin/getSubmissions");
//       const { success, message, submissions: fetchedSubmissions } = response.data;

//       if (success) {
//         setSubmissions(fetchedSubmissions || []);
//       } else {
//         setSubmissionsError(message || "Failed to fetch submissions.");
//       }
//     } catch (error) {
//       setSubmissionsError(
//         error.response?.data?.message ||
//           "Something went wrong while fetching submissions."
//       );
//     } finally {
//       setLoadingSubmissions(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//     fetchSubmissions();
//   }, []);

//   // Filter Submissions based on status
//   const reviewSubmissions = submissions.filter(
//     (sub) => sub.status === "Pending" || sub.status === "Rejected"
//   );

//   const completedSubmissions = submissions.filter(
//     (sub) => sub.status === "Approved"
//   );

//   const handleRefresh = () => {
//     if (activeTab === "active") {
//       fetchTasks();
//     } else {
//       fetchSubmissions();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f6f9] flex justify-center pt-8 sm:pt-12 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
//       <div className="w-full max-w-4xl">
//         {/* Header Banner */}
//         <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
//               Active Tasks & Submissions
//             </h1>
//             <p className="text-sm text-slate-500">
//               View active tasks, review ambassador submissions, and inspect completed deliverables.
//             </p>
//           </div>

//           <button
//             onClick={handleRefresh}
//             disabled={loadingTasks || loadingSubmissions}
//             className="self-start sm:self-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
//           >
//             {loadingTasks || loadingSubmissions ? "Refreshing..." : "Refresh Data"}
//           </button>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
//           <button
//             onClick={() => setActiveTab("active")}
//             className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${
//               activeTab === "active"
//                 ? "border-blue-600 text-blue-600"
//                 : "border-transparent text-slate-500 hover:text-slate-800"
//             }`}
//           >
//             Active Tasks ({tasks.length})
//           </button>

//           <button
//             onClick={() => setActiveTab("review")}
//             className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${
//               activeTab === "review"
//                 ? "border-blue-600 text-blue-600"
//                 : "border-transparent text-slate-500 hover:text-slate-800"
//             }`}
//           >
//             Review Submissions ({reviewSubmissions.length})
//           </button>

//           <button
//             onClick={() => setActiveTab("completed")}
//             className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors duration-200 ${
//               activeTab === "completed"
//                 ? "border-blue-600 text-blue-600"
//                 : "border-transparent text-slate-500 hover:text-slate-800"
//             }`}
//           >
//             Completed Tasks ({completedSubmissions.length})
//           </button>
//         </div>

//         {/* TAB 1: ACTIVE TASKS */}
//         {activeTab === "active" && (
//           <>
//             {tasksError && (
//               <div className="p-4 rounded-xl text-sm font-medium mb-6 bg-red-50 text-red-800 border border-red-200">
//                 {tasksError}
//               </div>
//             )}

//             {loadingTasks ? (
//               <div className="flex flex-col gap-4">
//                 {[1, 2, 3].map((n) => (
//                   <div
//                     key={n}
//                     className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 animate-pulse"
//                   >
//                     <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
//                     <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
//                     <div className="h-4 bg-slate-100 rounded w-2/3"></div>
//                   </div>
//                 ))}
//               </div>
//             ) : tasks.length === 0 ? (
//               <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm">
//                 <h3 className="text-lg font-semibold text-slate-800 mb-1">
//                   No Active Tasks
//                 </h3>
//                 <p className="text-sm text-slate-500 max-w-sm mx-auto">
//                   There are currently no active tasks in the system.
//                 </p>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-4">
//                 {tasks.map((task, index) => (
//                   <div
//                     key={task._id || task.id || index}
//                     className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200"
//                   >
//                     <div className="flex items-start justify-between gap-4 mb-2">
//                       <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
//                         {task.title}
//                       </h3>
//                       <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
//                         Task #{index + 1}
//                       </span>
//                     </div>
//                     <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
//                       {task.description}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {/* TAB 2: REVIEW SUBMISSIONS (Pending / Rejected) */}
//         {activeTab === "review" && (
//           <SubmissionsList
//             submissions={reviewSubmissions}
//             loading={loadingSubmissions}
//             emptyTitle="No Submissions to Review"
//             emptyDesc="All submissions have been reviewed or none are pending/rejected."
//           />
//         )}

//         {/* TAB 3: COMPLETED TASKS (Approved) */}
//         {activeTab === "completed" && (
//           <SubmissionsList
//             submissions={completedSubmissions}
//             loading={loadingSubmissions}
//             emptyTitle="No Completed Submissions"
//             emptyDesc="There are no approved submissions yet."
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// // Sub-component to render Submissions (Review Submissions & Completed Tasks)
// const SubmissionsList = ({ submissions, loading, emptyTitle, emptyDesc }) => {
//   if (loading) {
//     return (
//       <div className="flex flex-col gap-4">
//         {[1, 2, 3].map((n) => (
//           <div
//             key={n}
//             className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 animate-pulse"
//           >
//             <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
//             <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
//             <div className="h-4 bg-slate-100 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (submissions.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-slate-200 shadow-sm">
//         <h3 className="text-lg font-semibold text-slate-800 mb-1">{emptyTitle}</h3>
//         <p className="text-sm text-slate-500 max-w-sm mx-auto">{emptyDesc}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       {submissions.map((item, index) => {
//         const ambassador = item.ambassadorId?.userId || {};
//         const task = item.taskId || {};
//         const proofURLs = item.proofURLs || [];

//         return (
//           <div
//             key={item._id || item.id || index}
//             className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200"
//           >
//             {/* Header / Status */}
//             <div className="flex items-start justify-between gap-4 mb-3">
//               <div>
//                 <h3 className="text-base sm:text-lg font-bold text-slate-900">
//                   {task.title || "Untitled Task"}
//                 </h3>
//                 <p className="text-xs text-slate-500">
//                   Ambassador: <span className="font-semibold text-slate-700">{ambassador.name || "N/A"}</span>
//                 </p>
//               </div>

//               <span
//                 className={`text-xs font-semibold px-2.5 py-1 rounded-md border shrink-0 ${
//                   item.status === "Approved"
//                     ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                     : item.status === "Rejected"
//                     ? "bg-red-50 text-red-700 border-red-200"
//                     : "bg-amber-50 text-amber-700 border-amber-200"
//                 }`}
//               >
//                 {item.status || "Pending"}
//               </span>
//             </div>

//             {/* Ambassador Details */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100">
//               <div>
//                 <span className="font-medium text-slate-500">Email:</span> {ambassador.email || "N/A"}
//               </div>
//               <div>
//                 <span className="font-medium text-slate-500">Phone:</span> {ambassador.phoneNo || "N/A"}
//               </div>
//             </div>

//             {/* Proof URLs */}
//             <div>
//               <p className="text-xs font-semibold text-slate-700 mb-2">Proof URLs:</p>
//               {proofURLs.length === 0 ? (
//                 <p className="text-xs text-slate-400 italic">No proof links attached.</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {proofURLs.map((url, uIdx) => (
//                     <a
//                       key={uIdx}
//                       href={url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md truncate max-w-xs transition-colors"
//                     >
//                       {url}
//                     </a>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default AdminTasks;



import React, { useState, useEffect } from "react";
import API from "./config/api.js";
import toast from "react-hot-toast";

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
  
  // Track action processing state per submission ID
  const [actionLoadingId, setActionLoadingId] = useState(null);

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

      // Handle array payload whether success is explicitly true or implicitly returned
      if (Array.isArray(fetchedSubmissions)) {
        setSubmissions(fetchedSubmissions);
      } else if (success) {
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

  const handleReviewSubmission = async (submissionId, status, feedbackText) => {
    setActionLoadingId(submissionId);
    try {
      const response = await API.put("/admin/reviewSubmission", {
        submissionId,
        adminReview: status, // "Approved" or "Rejected"
        adminFeedback: feedbackText || "",
      });

      const { success, message } = response.data;

      if (success) {
        toast.success(message || `Submission successfully ${status.toLowerCase()}!`);
        // Update local state dynamically
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === submissionId ? { ...sub, status, adminFeedback: feedbackText } : sub
          )
        );
      } else {
        toast.error(message || "Failed to review submission.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while submitting review."
      );
    } finally {
      setActionLoadingId(null);
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

        {/* TAB 2: REVIEW SUBMISSIONS */}
        {activeTab === "review" && (
          <SubmissionsList
            submissions={reviewSubmissions}
            loading={loadingSubmissions}
            error={submissionsError}
            emptyTitle="No Submissions to Review"
            emptyDesc="All submissions have been reviewed or none are pending/rejected."
            onReview={handleReviewSubmission}
            actionLoadingId={actionLoadingId}
          />
        )}

        {/* TAB 3: COMPLETED TASKS */}
        {activeTab === "completed" && (
          <SubmissionsList
            submissions={completedSubmissions}
            loading={loadingSubmissions}
            error={submissionsError}
            emptyTitle="No Completed Submissions"
            emptyDesc="There are no approved submissions yet."
            onReview={handleReviewSubmission}
            actionLoadingId={actionLoadingId}
          />
        )}
      </div>
    </div>
  );
};

// Sub-component to render Submissions List
const SubmissionsList = ({
  submissions,
  loading,
  error,
  emptyTitle,
  emptyDesc,
  onReview,
  actionLoadingId,
}) => {
  if (error) {
    return (
      <div className="p-4 rounded-xl text-sm font-medium mb-6 bg-red-50 text-red-800 border border-red-200">
        {error}
      </div>
    );
  }

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
      {submissions.map((item, index) => (
        <SubmissionCard
          key={item._id || item.id || index}
          item={item}
          onReview={onReview}
          isActionLoading={actionLoadingId === item._id}
        />
      ))}
    </div>
  );
};

// Individual Submission Card component to hold feedback state separately
const SubmissionCard = ({ item, onReview, isActionLoading }) => {
  const [feedback, setFeedback] = useState(item.adminFeedback || "");

  const task = item.taskId || {};
  const ambassadorObj = item.ambassadorId || {};
  const userObj = ambassadorObj.userId || {};
  const proofURLs = item.proofURLs || [];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200">
      {/* Header & Status */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {task.title || "Untitled Task"}
          </h3>
          <p className="text-xs text-slate-500 pt-0.5">
            Ambassador:{" "}
            <span className="font-semibold text-slate-700">
              {userObj.name || ambassadorObj.name || "N/A"}
            </span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
        <div>
          <span className="font-medium text-slate-500">Email:</span>{" "}
          {userObj.email || "N/A"}
        </div>
        <div>
          <span className="font-medium text-slate-500">Phone:</span>{" "}
          {userObj.phoneNo || "N/A"}
        </div>
      </div>

      {/* Proof URLs */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-700 mb-2">
          Submitted Proof URLs:
        </p>
        {proofURLs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No proof links attached.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {proofURLs.map((url, uIdx) => (
              <a
                key={uIdx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg truncate max-w-xs transition-colors"
              >
                {url}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Admin Feedback Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Admin Feedback:
        </label>
        <textarea
          rows={2}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback or review comments for the ambassador..."
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
        />
      </div>

      {/* Actions (Approve / Reject) */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          disabled={isActionLoading || item.status === "Rejected"}
          onClick={() => onReview(item._id, "Rejected", feedback)}
          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isActionLoading ? "Processing..." : "Reject"}
        </button>
        <button
          type="button"
          disabled={isActionLoading || item.status === "Approved"}
          onClick={() => onReview(item._id, "Approved", feedback)}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isActionLoading ? "Processing..." : "Approve"}
        </button>
      </div>
    </div>
  );
};

export default AdminTasks;