// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   LogOut,
//   Lock,
//   Unlock,
//   Calendar,
//   Target,
//   Loader2,
//   AlertCircle,
//   FileText,
//   Image,
//   Video,
//   Award,
//   CheckCircle2,
//   Percent
// } from "lucide-react";
// import API from "./config/api.js";
// import { UserContext } from "./context/AuthContext.jsx";

// export default function AmbassadorDashboard() {
//   const navigate = useNavigate();

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { ambassador } = useContext(UserContext);
  
//   const [activePhaseId, setActivePhaseId] = useState(1);

//   // Ambassador details retrieved from login session
//   const [ambassador, setAmbassador] = useState(() => {
//     try {
//       const savedUser = localStorage.getItem("ambassador") || localStorage.getItem("user");
//       return savedUser ? JSON.parse(savedUser) : null;
//     } catch {
//       return null;
//     }
//   });

//   // Define phases with exact start and end dates
//   const phases = [
//     {
//       id: 1,
//       title: "Month 1",
//       startDate: new Date("2026-09-16T00:00:00"),
//       endDate: new Date("2026-10-16T23:59:59"),
//       dateRangeStr: "16 Sep 2026 - 16 Oct 2026",
//     },
//     {
//       id: 2,
//       title: "Month 2",
//       startDate: new Date("2026-10-20T00:00:00"),
//       endDate: new Date("2026-11-20T23:59:59"),
//       dateRangeStr: "To Be Declared",
//     },
//     {
//       id: 3,
//       title: "Month 3",
//       startDate: new Date("2026-11-09T00:00:00"),
//       endDate: new Date("2026-12-10T23:59:59"),
//       dateRangeStr: "To Be Declared",
//     },
//   ];

//   const getPhaseStatus = (phase) => {
//     const currentDate = new Date();
//     const allPhasesNotArrived = phases.every((p) => currentDate < p.startDate);

//     if (allPhasesNotArrived && phase.id === 1) {
//       return { isLocked: false, isCurrent: true };
//     }

//     const isLocked = currentDate < phase.startDate;
//     const isCurrent = currentDate >= phase.startDate && currentDate <= phase.endDate;

//     return { isLocked, isCurrent };
//   };

//   useEffect(() => {
//     const fetchTasks = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await API.get("/ambassador/getTasks", { withCredentials: true });
//         if (response.data?.success) {
//           setTasks(response.data.tasks || []);
//           if (response.data.ambassador) {
//             setAmbassador(response.data.ambassador);
//           }
//         } else {
//           setError(response.data?.message || "Failed to load tasks.");
//         }
//       } catch (err) {
//         setError(
//           err.response?.data?.message || err.message || "An error occurred while fetching tasks."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   // Filter tasks based ONLY on the selected Phase
//   const filteredTasks = tasks.filter((task) => task.taskMonth === activePhaseId);

//   return (
//     <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] font-sans pb-16">
//       {/* Top Navigation Header */}
//       <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] px-6 py-3 shadow-xs">
//         <div className="max-w-7xl mx-auto flex items-center justify-center">
//           <h2 className="text-base sm:text-lg font-bold text-[#3c4043]">
//             Fateh Campus Ambassador <span className="text-[#1a73e8] font-bold">2026</span>
//           </h2>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
//         <div className="flex flex-col items-center justify-center my-6">
//           <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-white border-4 border-[#1a73e8] shadow-md transition-transform hover:scale-105">
//             <div className="flex flex-col items-center justify-center text-center p-2">
//               <Percent className="w-6 h-6 text-[#1a73e8] mb-0.5" />
//               <span className="text-3xl font-extrabold text-[#202124] tracking-tight">
//                 {((ambassador?.taskCompleted || 0) / filteredTasks.length) * 100}
//               </span>
//               <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368] mt-0.5">
//                 Task Submission Percentage
//               </span>
//             </div>
//           </div>

//           {ambassador?.taskCompleted !== undefined && (
//             <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#5f6368] bg-white px-3.5 py-1.5 rounded-full border border-[#dadce0] shadow-2xs">
//               <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
//               <span>Tasks Completed:</span>
//               <span className="text-[#1a73e8] font-bold">{ambassador.taskCompleted}</span>
//             </div>
//           )}
          
//         </div>

//         {/* Banner Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-[#dadce0] p-6 shadow-xs">
//           <div>
//             <h1 className="text-2xl font-bold text-[#202124]">Ambassador Task Dashboard</h1>
//             <p className="text-xs text-[#5f6368] mt-1">
//               Track your assigned deliverables, targets.
//             </p>
//           </div>
//         </div>

//         {/* Phase Timeline Cards */}
//         <section className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Calendar className="w-4 h-4 text-[#1a73e8]" />
//             <h2 className="text-sm font-bold uppercase tracking-wider text-[#5f6368]">Program Timeline & Months</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {phases.map((phase) => {
//               const { isLocked, isCurrent } = getPhaseStatus(phase);
//               const isActive = activePhaseId === phase.id;

//               return (
//                 <button
//                   key={phase.id}
//                   disabled={isLocked}
//                   onClick={() => {
//                     if (!isLocked) {
//                       setActivePhaseId(phase.id);
//                     }
//                   }}
//                   className={`relative text-left p-5 rounded-2xl border transition-all cursor-pointer ${
//                     isLocked
//                       ? "bg-[#f8f9fa] border-[#dadce0] opacity-60 cursor-not-allowed"
//                       : isActive
//                       ? "bg-white border-[#1a73e8] ring-2 ring-[#1a73e8]/20 shadow-sm"
//                       : "bg-white border-[#dadce0] hover:border-[#1a73e8]/50 shadow-xs"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span
//                       className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
//                         isLocked
//                           ? "bg-gray-200 text-gray-600"
//                           : isCurrent
//                           ? "bg-blue-100 text-[#1a73e8]"
//                           : "bg-emerald-100 text-emerald-700"
//                       }`}
//                     >
//                       {phase.title}
//                     </span>
//                     {isLocked ? <Lock className="w-4 h-4 text-gray-400" /> : <Unlock className="w-4 h-4 text-[#1a73e8]" />}
//                   </div>
//                   <div className="text-sm font-semibold text-[#202124]">{phase.dateRangeStr}</div>
//                 </button>
//               );
//             })}
//           </div>
//         </section>

//         {/* Tasks Section */}
//         <section className="bg-white rounded-2xl border border-[#dadce0] shadow-xs overflow-hidden">
//           <div className="p-6 border-b border-[#dadce0] flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold text-[#202124]">Month {activePhaseId} Tasks</h3>
//               <p className="text-xs text-[#5f6368] mt-0.5">
//                 View your active deliverables and submit reports.
//               </p>
//             </div>
//             <span className="text-xs font-semibold text-[#1a73e8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
//               Month {activePhaseId}
//             </span>
//           </div>

//           {loading && (
//             <div className="flex flex-col items-center justify-center py-16 gap-3">
//               <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
//               <p className="text-xs font-medium text-[#5f6368]">Fetching task deliverables...</p>
//             </div>
//           )}

//           {!loading && error && (
//             <div className="m-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-xs text-red-600">
//               <AlertCircle className="w-5 h-5 shrink-0" />
//               <p>{error}</p>
//             </div>
//           )}

//           {!loading && !error && filteredTasks.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
//               <FileText className="w-10 h-10 text-[#9aa0a6] mb-3" />
//               <h4 className="text-sm font-bold text-[#202124]">No tasks found</h4>
//               <p className="text-xs text-[#5f6368] max-w-sm mt-1">
//                 There are currently no tasks configured for Month {activePhaseId}.
//               </p>
//             </div>
//           )}

//           {/* Task Data Table */}
//           {!loading && !error && filteredTasks.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
//                     <th className="py-3.5 px-6">Task Title</th>
//                     <th className="py-3.5 px-6">Periodicity</th>
//                     <th className="py-3.5 px-6">Target</th>
//                     <th className="py-3.5 px-6">Allowed Media</th>
//                     <th className="py-3.5 px-6 text-right">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#dadce0] text-xs text-[#202124]">
//                   {filteredTasks.map((task, idx) => (
//                     <tr key={task._id || idx} onClick={() => navigate("/ambassador/tasks")} className="hover:bg-[#f0f4f9]/50 transition-colors cursor-pointer">
//                       <td className="py-4 px-6 max-w-xs">
//                         <div className="font-bold text-[#202124] text-sm">{task.title}</div>
//                         {task.activity && <div className="text-[#5f6368] text-[11px] mt-0.5 line-clamp-1">{task.activity}</div>}
//                       </td>
//                       <td className="py-4 px-6">
//                         <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f3f4] text-[#3c4043] font-medium text-[11px]">
//                           {task.periodicity || "N/A"}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-1.5 text-[#5f6368]">
//                           <Target className="w-3.5 h-3.5 text-[#1a73e8]" />
//                           <span className="font-semibold text-[#202124]">{task.target || "No Minimum"}</span>
//                         </div>
//                       </td>
//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-2">
//                           {task.isImageAllowed && (
//                             <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
//                               <Image className="w-3 h-3" /> Image
//                             </span>
//                           )}
//                           {task.isVideoAllowed && (
//                             <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
//                               <Video className="w-3 h-3" /> Video
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="py-4 px-6 text-right font-bold text-[#1a73e8] text-sm">
//                         Pending
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }


// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   LogOut,
//   Lock,
//   Unlock,
//   Calendar,
//   Target,
//   Loader2,
//   AlertCircle,
//   FileText,
//   Image,
//   Video,
//   Award,
//   CheckCircle2,
//   Percent
// } from "lucide-react";
// import API from "./config/api.js";
// import { UserContext } from "./context/AuthContext.jsx";

// export default function AmbassadorDashboard() {
//   const navigate = useNavigate();

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { ambassador } = useContext(UserContext);
  
//   const [activePhaseId, setActivePhaseId] = useState(1);

//   // Ambassador details retrieved from login session
//   const [ambassadorData, setAmbassadorData] = useState(() => {
//     try {
//       const savedUser = localStorage.getItem("ambassador") || localStorage.getItem("user");
//       return savedUser ? JSON.parse(savedUser) : null;
//     } catch {
//       return null;
//     }
//   });

//   // Define phases with exact start and end dates
//   const phases = [
//     {
//       id: 1,
//       title: "Month 1",
//       startDate: new Date("2026-09-16T00:00:00"),
//       endDate: new Date("2026-10-16T23:59:59"),
//       dateRangeStr: "16 Sep 2026 - 16 Oct 2026",
//     },
//     {
//       id: 2,
//       title: "Month 2",
//       startDate: new Date("2026-10-20T00:00:00"),
//       endDate: new Date("2026-11-20T23:59:59"),
//       dateRangeStr: "To Be Declared",
//     },
//     {
//       id: 3,
//       title: "Month 3",
//       startDate: new Date("2026-11-09T00:00:00"),
//       endDate: new Date("2026-12-10T23:59:59"),
//       dateRangeStr: "To Be Declared",
//     },
//   ];

//   const getPhaseStatus = (phase) => {
//     const currentDate = new Date();
//     const allPhasesNotArrived = phases.every((p) => currentDate < p.startDate);

//     if (allPhasesNotArrived && phase.id === 1) {
//       return { isLocked: false, isCurrent: true };
//     }

//     const isLocked = currentDate < phase.startDate;
//     const isCurrent = currentDate >= phase.startDate && currentDate <= phase.endDate;

//     return { isLocked, isCurrent };
//   };

//   useEffect(() => {
//     const fetchTasks = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await API.get("/ambassador/getTasks", { withCredentials: true });
//         if (response.data?.success) {
//           setTasks(response.data.tasks || []);
//           if (response.data.ambassador) {
//             setAmbassadorData(response.data.ambassador);
//           }
//         } else {
//           setError(response.data?.message || "Failed to load tasks.");
//         }
//       } catch (err) {
//         setError(
//           err.response?.data?.message || err.message || "An error occurred while fetching tasks."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   // Filter tasks based ONLY on the selected Phase
//   const filteredTasks = tasks.filter((task) => task.taskMonth === activePhaseId);

//   return (
//     <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] font-sans pb-16">
//       {/* Top Navigation Header */}
//       <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] px-6 py-3 shadow-xs">
//         <div className="max-w-7xl mx-auto flex items-center justify-center">
//           <h2 className="text-base sm:text-lg font-bold text-[#3c4043]">
//             Fateh Campus Ambassador <span className="text-[#1a73e8] font-bold">2026</span>
//           </h2>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
//         <div className="flex flex-col items-center justify-center my-6">
//           <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-white border-4 border-[#1a73e8] shadow-md transition-transform hover:scale-105">
//             <div className="flex flex-col items-center justify-center text-center p-2">
//               <Percent className="w-6 h-6 text-[#1a73e8] mb-0.5" />
//               <span className="text-3xl font-extrabold text-[#202124] tracking-tight">
//                 {((ambassador?.taskCompleted || 0) / filteredTasks.length) * 100}
//               </span>
//               <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368] mt-0.5">
//                 Task Submission Percentage
//               </span>
//             </div>
//           </div>

//           {ambassador?.taskCompleted !== undefined && (
//             <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#5f6368] bg-white px-3.5 py-1.5 rounded-full border border-[#dadce0] shadow-2xs">
//               <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
//               <span>Tasks Completed:</span>
//               <span className="text-[#1a73e8] font-bold">{ambassador.taskCompleted}</span>
//             </div>
//           )}
          
//         </div>

//         {/* Banner Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-[#dadce0] p-6 shadow-xs">
//           <div>
//             <h1 className="text-2xl font-bold text-[#202124]">Ambassador Task Dashboard</h1>
//             <p className="text-xs text-[#5f6368] mt-1">
//               Track your assigned deliverables, targets.
//             </p>
//           </div>
//         </div>

//         {/* Phase Timeline Cards */}
//         <section className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Calendar className="w-4 h-4 text-[#1a73e8]" />
//             <h2 className="text-sm font-bold uppercase tracking-wider text-[#5f6368]">Program Timeline & Months</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {phases.map((phase) => {
//               const { isLocked, isCurrent } = getPhaseStatus(phase);
//               const isActive = activePhaseId === phase.id;

//               return (
//                 <button
//                   key={phase.id}
//                   disabled={isLocked}
//                   onClick={() => {
//                     if (!isLocked) {
//                       setActivePhaseId(phase.id);
//                     }
//                   }}
//                   className={`relative text-left p-5 rounded-2xl border transition-all cursor-pointer ${
//                     isLocked
//                       ? "bg-[#f8f9fa] border-[#dadce0] opacity-60 cursor-not-allowed"
//                       : isActive
//                       ? "bg-white border-[#1a73e8] ring-2 ring-[#1a73e8]/20 shadow-sm"
//                       : "bg-white border-[#dadce0] hover:border-[#1a73e8]/50 shadow-xs"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span
//                       className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
//                         isLocked
//                           ? "bg-gray-200 text-gray-600"
//                           : isCurrent
//                           ? "bg-blue-100 text-[#1a73e8]"
//                           : "bg-emerald-100 text-emerald-700"
//                       }`}
//                     >
//                       {phase.title}
//                     </span>
//                     {isLocked ? <Lock className="w-4 h-4 text-gray-400" /> : <Unlock className="w-4 h-4 text-[#1a73e8]" />}
//                   </div>
//                   <div className="text-sm font-semibold text-[#202124]">{phase.dateRangeStr}</div>
//                 </button>
//               );
//             })}
//           </div>
//         </section>

//         {/* Tasks Section */}
//         <section className="bg-white rounded-2xl border border-[#dadce0] shadow-xs overflow-hidden">
//           <div className="p-6 border-b border-[#dadce0] flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold text-[#202124]">Month {activePhaseId} Tasks</h3>
//               <p className="text-xs text-[#5f6368] mt-0.5">
//                 View your active deliverables and submit reports.
//               </p>
//             </div>
//             <span className="text-xs font-semibold text-[#1a73e8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
//               Month {activePhaseId}
//             </span>
//           </div>

//           {loading && (
//             <div className="flex flex-col items-center justify-center py-16 gap-3">
//               <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
//               <p className="text-xs font-medium text-[#5f6368]">Fetching task deliverables...</p>
//             </div>
//           )}

//           {!loading && error && (
//             <div className="m-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-xs text-red-600">
//               <AlertCircle className="w-5 h-5 shrink-0" />
//               <p>{error}</p>
//             </div>
//           )}

//           {!loading && !error && filteredTasks.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
//               <FileText className="w-10 h-10 text-[#9aa0a6] mb-3" />
//               <h4 className="text-sm font-bold text-[#202124]">No tasks found</h4>
//               <p className="text-xs text-[#5f6368] max-w-sm mt-1">
//                 There are currently no tasks configured for Month {activePhaseId}.
//               </p>
//             </div>
//           )}

//           {/* Task Data Table */}
//           {!loading && !error && filteredTasks.length > 0 && (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
//                     <th className="py-3.5 px-6">Task Title</th>
//                     <th className="py-3.5 px-6">Periodicity</th>
//                     <th className="py-3.5 px-6">Target</th>
//                     <th className="py-3.5 px-6">Allowed Media</th>
//                     <th className="py-3.5 px-6 text-right">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-[#dadce0] text-xs text-[#202124]">
//                   {filteredTasks.map((task, idx) => {
//                     const isCompleted = ambassador?.completedTasks?.includes(task._id);

//                     return (
//                       <tr key={task._id || idx} onClick={() => navigate("/ambassador/tasks")} className="hover:bg-[#f0f4f9]/50 transition-colors cursor-pointer">
//                         <td className="py-4 px-6 max-w-xs">
//                           <div className="font-bold text-[#202124] text-sm">{task.title}</div>
//                           {task.activity && <div className="text-[#5f6368] text-[11px] mt-0.5 line-clamp-1">{task.activity}</div>}
//                         </td>
//                         <td className="py-4 px-6">
//                           <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f3f4] text-[#3c4043] font-medium text-[11px]">
//                             {task.periodicity || "N/A"}
//                           </span>
//                         </td>
//                         <td className="py-4 px-6">
//                           <div className="flex items-center gap-1.5 text-[#5f6368]">
//                             <Target className="w-3.5 h-3.5 text-[#1a73e8]" />
//                             <span className="font-semibold text-[#202124]">{task.target || "No Minimum"}</span>
//                           </div>
//                         </td>
//                         <td className="py-4 px-6">
//                           <div className="flex items-center gap-2">
//                             {task.isImageAllowed && (
//                               <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
//                                 <Image className="w-3 h-3" /> Image
//                               </span>
//                             )}
//                             {task.isVideoAllowed && (
//                               <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
//                                 <Video className="w-3 h-3" /> Video
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className={`py-4 px-6 text-right font-bold text-sm ${isCompleted ? "text-emerald-600" : "text-[#1a73e8]"}`}>
//                           {isCompleted ? "Completed" : "Pending"}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Lock,
  Unlock,
  Calendar,
  Target,
  Loader2,
  AlertCircle,
  FileText,
  Image,
  Video,
  Award,
  CheckCircle2,
  Percent,
  Link as LinkIcon
} from "lucide-react";
import API from "./config/api.js";
import { UserContext } from "./context/AuthContext.jsx";

export default function AmbassadorDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { ambassador } = useContext(UserContext);
  
  const [activePhaseId, setActivePhaseId] = useState(1);

  // Ambassador details retrieved from login session
  const [ambassadorData, setAmbassadorData] = useState(() => {
    try {
      const savedUser = localStorage.getItem("ambassador") || localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Define phases with exact start and end dates
  const phases = [
    {
      id: 1,
      title: "Month 1",
      startDate: new Date("2026-09-16T00:00:00"),
      endDate: new Date("2026-10-16T23:59:59"),
      dateRangeStr: "16 Sep 2026 - 16 Oct 2026",
    },
    {
      id: 2,
      title: "Month 2",
      startDate: new Date("2026-10-20T00:00:00"),
      endDate: new Date("2026-11-20T23:59:59"),
      dateRangeStr: "To Be Declared",
    },
    {
      id: 3,
      title: "Month 3",
      startDate: new Date("2026-11-09T00:00:00"),
      endDate: new Date("2026-12-10T23:59:59"),
      dateRangeStr: "To Be Declared",
    },
  ];

  const getPhaseStatus = (phase) => {
    const currentDate = new Date();
    const allPhasesNotArrived = phases.every((p) => currentDate < p.startDate);

    if (allPhasesNotArrived && phase.id === 1) {
      return { isLocked: false, isCurrent: true };
    }

    const isLocked = currentDate < phase.startDate;
    const isCurrent = currentDate >= phase.startDate && currentDate <= phase.endDate;

    return { isLocked, isCurrent };
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get("/ambassador/getTasks", { withCredentials: true });
        if (response.data?.success) {
          setTasks(response.data.tasks || []);
          if (response.data.ambassador) {
            setAmbassadorData(response.data.ambassador);
          }
        } else {
          setError(response.data?.message || "Failed to load tasks.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred while fetching tasks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based ONLY on the selected Phase
  const filteredTasks = tasks.filter((task) => task.taskMonth === activePhaseId);

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] font-sans pb-16">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <h2 className="text-base sm:text-lg font-bold text-[#3c4043]">
            Fateh Campus Ambassador <span className="text-[#1a73e8] font-bold">2026</span>
          </h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-white border-4 border-[#1a73e8] shadow-md transition-transform hover:scale-105">
            <div className="flex flex-col items-center justify-center text-center p-2">
              <Percent className="w-6 h-6 text-[#1a73e8] mb-0.5" />
              <span className="text-3xl font-extrabold text-[#202124] tracking-tight">
                {((ambassador?.taskCompleted || 0) / filteredTasks.length) * 100}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f6368] mt-0.5">
                Task Submission Percentage
              </span>
            </div>
          </div>

          {ambassador?.taskCompleted !== undefined && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#5f6368] bg-white px-3.5 py-1.5 rounded-full border border-[#dadce0] shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tasks Completed:</span>
              <span className="text-[#1a73e8] font-bold">{ambassador.taskCompleted}</span>
            </div>
          )}
          
        </div>

        {/* Banner Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-[#dadce0] p-6 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-[#202124]">Ambassador Task Dashboard</h1>
            <p className="text-xs text-[#5f6368] mt-1">
              Track your assigned deliverables, targets.
            </p>
          </div>
        </div>

        {/* Phase Timeline Cards */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1a73e8]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#5f6368]">Program Timeline & Months</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {phases.map((phase) => {
              const { isLocked, isCurrent } = getPhaseStatus(phase);
              const isActive = activePhaseId === phase.id;

              return (
                <button
                  key={phase.id}
                  disabled={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      setActivePhaseId(phase.id);
                    }
                  }}
                  className={`relative text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    isLocked
                      ? "bg-[#f8f9fa] border-[#dadce0] opacity-60 cursor-not-allowed"
                      : isActive
                      ? "bg-white border-[#1a73e8] ring-2 ring-[#1a73e8]/20 shadow-sm"
                      : "bg-white border-[#dadce0] hover:border-[#1a73e8]/50 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isLocked
                          ? "bg-gray-200 text-gray-600"
                          : isCurrent
                          ? "bg-blue-100 text-[#1a73e8]"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {phase.title}
                    </span>
                    {isLocked ? <Lock className="w-4 h-4 text-gray-400" /> : <Unlock className="w-4 h-4 text-[#1a73e8]" />}
                  </div>
                  <div className="text-sm font-semibold text-[#202124]">{phase.dateRangeStr}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Tasks Section */}
        <section className="bg-white rounded-2xl border border-[#dadce0] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#dadce0] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#202124]">Month {activePhaseId} Tasks</h3>
              <p className="text-xs text-[#5f6368] mt-0.5">
                View your active deliverables and submit reports.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1a73e8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Month {activePhaseId}
            </span>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a73e8]" />
              <p className="text-xs font-medium text-[#5f6368]">Fetching task deliverables...</p>
            </div>
          )}

          {!loading && error && (
            <div className="m-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-xs text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <FileText className="w-10 h-10 text-[#9aa0a6] mb-3" />
              <h4 className="text-sm font-bold text-[#202124]">No tasks found</h4>
              <p className="text-xs text-[#5f6368] max-w-sm mt-1">
                There are currently no tasks configured for Month {activePhaseId}.
              </p>
            </div>
          )}

          {/* Task Data Table */}
          {!loading && !error && filteredTasks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
                    <th className="py-3.5 px-6">Task Title</th>
                    <th className="py-3.5 px-6">Periodicity</th>
                    {/* <th className="py-3.5 px-6">Target</th> */}
                    <th className="py-3.5 px-6">Allowed Media</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dadce0] text-xs text-[#202124]">
                  {filteredTasks.map((task, idx) => {
                    const isCompleted = ambassador?.completedTasks?.includes(task._id);

                    return (
                      <tr key={task._id || idx} onClick={() => navigate("/ambassador/tasks")} className="hover:bg-[#f0f4f9]/50 transition-colors cursor-pointer">
                        <td className="py-4 px-6 max-w-xs">
                          <div className="font-bold text-[#202124] text-sm">{task.title}</div>
                          {task.activity && <div className="text-[#5f6368] text-[11px] mt-0.5 line-clamp-1">{task.description}</div>}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f1f3f4] text-[#3c4043] font-medium text-[11px]">
                            {task.periodicity || "N/A"}
                          </span>
                        </td>
                        {/* <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-[#5f6368]">
                            <Target className="w-3.5 h-3.5 text-[#1a73e8]" />
                            <span className="font-semibold text-[#202124]">{task.target || "No Minimum"}</span>
                          </div>
                        </td> */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {task.isImageAllowed && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <Image className="w-3 h-3" /> Image
                              </span>
                            )}
                            {task.isVideoAllowed && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                <Video className="w-3 h-3" /> Video
                              </span>
                            )}
                            {!task.isImageAllowed && !task.isVideoAllowed && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                <LinkIcon className="w-3 h-3" /> Link
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`py-4 px-6 text-right font-bold text-sm ${isCompleted ? "text-emerald-600" : "text-[#1a73e8]"}`}>
                          {isCompleted ? "Completed" : "Pending"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}