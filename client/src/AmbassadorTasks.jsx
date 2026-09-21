// import React, { useState, useEffect } from "react";
// import { 
//   ChevronDown, 
//   ChevronUp, 
//   Lock, 
//   Unlock, 
//   Calendar, 
//   Send, 
//   Loader2,
//   Info,
//   X,
//   CheckCircle2,
//   XCircle,
//   Award,
//   Target,
//   FileText,
//   Upload,
//   Plus,
//   Trash2,
//   Link as LinkIcon
// } from "lucide-react";
// import API from "./config/api.js";

// // --- Task Submission Modal ---
// function SubmitTaskModal({ task, onClose, onSuccess }) {
//   const [urls, setUrls] = useState([""]); // Array of URLs (Max 2)
//   const [files, setFiles] = useState([]);
//   const [fileError, setFileError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   if (!task) return null;

//   const requiresMedia = task.isImageAllowed || task.isVideoAllowed;

//   // Determine accepted file types strictly based on task permissions
//   const getAcceptAttribute = () => {
//     if (task.isImageAllowed && task.isVideoAllowed) return "image/*,video/*";
//     if (task.isImageAllowed) return "image/*";
//     if (task.isVideoAllowed) return "video/*";
//     return "";
//   };

//   // URL Field Handlers
//   const handleUrlChange = (index, value) => {
//     const updatedUrls = [...urls];
//     updatedUrls[index] = value;
//     setUrls(updatedUrls);
//   };

//   const addUrlField = () => {
//     if (urls.length < 2) {
//       setUrls([...urls, ""]);
//     }
//   };

//   const removeUrlField = (index) => {
//     setUrls(urls.filter((_, i) => i !== index));
//   };

//   // File Change Handler (Max 4 Files)
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     if (selectedFiles.length > 4) {
//       setFileError("You can upload a maximum of 4 files.");
//       e.target.value = "";
//       setFiles([]);
//       return;
//     }
//     setFileError("");
//     setFiles(selectedFiles);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     // Filter out empty URL strings
//     const proofURLs = urls.map((u) => u.trim()).filter((u) => u.length > 0);

//     try {
//       if (requiresMedia && files.length > 0) {
//         const formData = new FormData();
//         files.forEach((file) => formData.append("files", file));
//         proofURLs.forEach((link) => formData.append("proofURLs", link));

//         await API.post(`/ambassador/submitTask/${task._id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//       } else {
//         await API.post(
//           `/ambassador/submitTask/${task._id}`,
//           { proofURLs },
//           { withCredentials: true }
//         );
//       }

//       setSuccess(true);
//       setTimeout(() => {
//         if (onSuccess) onSuccess();
//         onClose();
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit task. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//       <div className="bg-white w-full max-w-lg rounded-2xl border border-[#dadce0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
//         {/* Modal Header */}
//         <div className="p-6 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
//           <div>
//             <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-md">
//               Submit Deliverable
//             </span>
//             <h2 className="text-xl font-bold text-[#202124] mt-1">{task.title}</h2>
//           </div>
//           <button 
//             onClick={onClose}
//             className="p-1.5 rounded-lg text-[#5f6368] hover:bg-gray-200 hover:text-[#202124] transition-colors cursor-pointer"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Modal Body / Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
//           {/* Dynamic Link Inputs (Max 2) */}
//           <div className="space-y-3">
//             <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
//               <LinkIcon className="w-3.5 h-3.5 text-[#1a73e8]" /> Submission URLs / Proof Links
//             </label>

//             {urls.map((url, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <input
//                   type="url"
//                   placeholder={`https://example.com/proof-link-${index + 1}`}
//                   className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all text-sm"
//                   value={url}
//                   onChange={(e) => handleUrlChange(index, e.target.value)}
//                 />
//                 {urls.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => removeUrlField(index)}
//                     className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors shrink-0 cursor-pointer"
//                     title="Remove link"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             ))}

//             {urls.length < 2 && (
//               <button
//                 type="button"
//                 onClick={addUrlField}
//                 className="flex items-center gap-1.5 text-xs font-bold text-[#1a73e8] hover:underline pt-1 cursor-pointer"
//               >
//                 <Plus className="w-4 h-4" /> Add another link
//               </button>
//             )}
//           </div>

//           {/* Conditional Media Upload Field */}
//           {requiresMedia && (
//             <div className="space-y-1.5">
//               <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
//                 <Upload className="w-3.5 h-3.5 text-[#1a73e8]" /> Upload Proof Attachments (Max 4)
//               </label>
//               <div className="border-2 border-dashed border-[#dadce0] hover:border-[#1a73e8] rounded-xl p-4 transition-colors text-center">
//                 <input
//                   type="file"
//                   multiple
//                   accept={getAcceptAttribute()}
//                   onChange={handleFileChange}
//                   className="hidden"
//                   id="task-file-input"
//                 />
//                 <label 
//                   htmlFor="task-file-input" 
//                   className="cursor-pointer flex flex-col items-center gap-1 text-sm text-[#5f6368]"
//                 >
//                   <Upload className="w-6 h-6 text-[#1a73e8]" />
//                   <span className="font-semibold text-[#1a73e8]">Click to upload files</span>
//                   <span className="text-xs text-gray-400">
//                     Allowed: {[task.isImageAllowed && "Images", task.isVideoAllowed && "Videos"].filter(Boolean).join(" & ")} (Up to 4 files)
//                   </span>
//                 </label>
//               </div>

//               {/* Selected File List */}
//               {files.length > 0 && (
//                 <div className="space-y-1 mt-2">
//                   <p className="text-xs font-bold text-[#5f6368]">Selected ({files.length}/4):</p>
//                   <ul className="text-xs text-[#202124] space-y-1">
//                     {files.map((file, idx) => (
//                       <li key={idx} className="flex items-center gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#dadce0]">
//                         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
//                         <span className="truncate">{file.name}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {fileError && <p className="text-xs font-semibold text-red-600">{fileError}</p>}
//             </div>
//           )}

//           {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
//           {success && (
//             <p className="text-emerald-600 text-sm font-medium flex items-center gap-2">
//               <CheckCircle2 className="w-4 h-4" /> Task submitted successfully!
//             </p>
//           )}

//           {/* Modal Actions */}
//           <div className="pt-3 border-t border-[#dadce0] flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-5 py-2.5 rounded-xl border border-[#dadce0] text-sm font-bold text-[#5f6368] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || !!fileError}
//               className="flex items-center gap-2 bg-[#1a73e8] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1557b0] transition-colors disabled:opacity-50 cursor-pointer"
//             >
//               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
//               {loading ? "Submitting..." : "Submit Task"}
//             </button>
//           </div>
//         </form>

//       </div>
//     </div>
//   );
// }

// // --- Task Details Modal ---
// function TaskDetailsModal({ task, onClose, onSubmitClick }) {
//   if (!task) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//       <div className="bg-white w-full max-w-lg rounded-2xl border border-[#dadce0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
//         {/* Modal Header */}
//         <div className="p-6 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
//           <div className="flex items-center gap-2.5">
//             <div className="p-2 bg-[#e8f0fe] rounded-lg">
//               <Info className="w-5 h-5 text-[#1a73e8]" />
//             </div>
//             <h2 className="text-xl font-bold text-[#202124]">Task Details</h2>
//           </div>
//           <button 
//             onClick={onClose}
//             className="p-1.5 rounded-lg text-[#5f6368] hover:bg-gray-200 hover:text-[#202124] transition-colors cursor-pointer"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6 space-y-5 overflow-y-auto">
//           {/* Title & Badge */}
//           <div>
//             <div className="flex items-center gap-2 mb-1.5">
//               <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-md">
//                 {task.periodicity || "Task"}
//               </span>
//             </div>
//             <h3 className="text-xl font-bold text-[#202124]">{task.title}</h3>
//           </div>

//           {/* Description with whitespace-pre-line to respect newline characters (\n) */}
//           {task.description && (
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1">
//                 <FileText className="w-3.5 h-3.5" /> Description
//               </label>
//               <p className="text-sm text-[#202124] leading-relaxed bg-[#f8f9fa] p-3.5 rounded-xl border border-[#dadce0] whitespace-pre-wrap">
//                 {task.description}
//               </p>
//             </div>
//           )}

//           {/* Activity with whitespace-pre-line */}
//           <div className="space-y-1">
//             <label className="text-xs font-bold text-[#5f6368] uppercase">HOW TO SUBMIT</label>
//             <p className="text-sm text-[#3c4043] leading-relaxed whitespace-pre-wrap">
//               {task.activity || "N/A"}
//             </p>
//           </div>

//           {/* Things to Avoid with whitespace-pre-line */}
//           <div className="space-y-1">
//             <label className="text-xs font-bold text-[#5f6368] uppercase">THINGS TO AVOID</label>
//             <p className="text-sm text-[#3c4043] leading-relaxed whitespace-pre-wrap">
//               {task.thingsToAvoid || "N/A"}
//             </p>
//           </div>

//           {/* Target with whitespace-pre-line */}
//           {task.target && (
//             <div className="space-y-1">
//               <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1">
//                 <Target className="w-3.5 h-3.5" /> Target
//               </label>
//               <p className="text-sm text-[#3c4043] bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-xl whitespace-pre-wrap">
//                 {task.target}
//               </p>
//             </div>
//           )}

//           {/* Allowed Submissions */}
//           <div className="pt-2 border-t border-[#dadce0]">
//             {(task.isImageAllowed || task.isVideoAllowed) && (
//               <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0] flex flex-col items-center justify-center gap-1.5">
//                 <p className="text-[11px] font-bold text-[#5f6368] uppercase">Allowed Formats</p>
//                 <div className="flex items-center gap-6 text-xs font-medium text-[#202124]">
//                   <span className="flex items-center gap-1.5">
//                     {task.isImageAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
//                     Image
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     {task.isVideoAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
//                     Video
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="p-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between">
//           <button
//             onClick={onClose}
//             className="px-5 py-2 rounded-xl text-sm font-bold text-[#5f6368] hover:bg-gray-200 transition-colors cursor-pointer"
//           >
//             Close
//           </button>
          
//           <button
//             onClick={() => onSubmitClick(task)}
//             className="flex items-center gap-2 bg-[#202124] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black shadow-md transition-all cursor-pointer"
//           >
//             <Send className="w-4 h-4" />
//             SUBMIT TASK
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// // --- Main AmbassadorTasks Component ---
// export default function AmbassadorTasks() {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedPhases, setExpandedPhases] = useState({ 1: true });
  
//   // Modal States
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [submittingTask, setSubmittingTask] = useState(null);

//   const phases = [
//     {
//       id: 1,
//       title: "Month 1",
//       dateRange: "16 Sep 2026 - 16 Oct 2026",
//       startDate: new Date("2026-09-16"),
//     },
//     {
//       id: 2,
//       title: "Month 2",
//       dateRange: "To Be Declared",
//       startDate: new Date("2026-10-20"),
//     },
//     {
//       id: 3,
//       title: "Month 3",
//       dateRange: "To Be Declared",
//       startDate: new Date("2026-11-20"),
//     },
//   ];

//   const fetchTasks = async () => {
//     try {
//       const response = await API.get("/ambassador/getTasks");
//       setTasks(response.data.tasks || []);
//     } catch (err) {
//       setError("Failed to load tasks.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const togglePhase = (id) => {
//     setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   const isLocked = (phase) => {
//     if (phase.id === 1) return false; 
//     return new Date() < phase.startDate;
//   };

//   const handleOpenSubmitFromInfo = (task) => {
//     setSelectedTask(null);
//     setSubmittingTask(task);
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-screen">
//       <Loader2 className="w-10 h-10 animate-spin text-[#1a73e8]" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
//       {/* Centered Minimal Navbar */}
//       <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] px-4 py-3 flex items-center justify-center shadow-xs">
//         <h2 className="text-base sm:text-lg font-bold text-[#3c4043]">
//           Fateh Campus Ambassador <span className="text-[#1a73e8] font-bold">2026</span>
//         </h2>
//       </header>

//       {/* Main Content Area */}
//       <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1 overflow-x-hidden">
//         <TaskDetailsModal 
//           task={selectedTask} 
//           onClose={() => setSelectedTask(null)}
//           onSubmitClick={handleOpenSubmitFromInfo}
//         />

//         <SubmitTaskModal 
//           task={submittingTask}
//           onClose={() => setSubmittingTask(null)}
//           onSuccess={fetchTasks}
//         />

//         <div className="mb-6">
//           <h2 className="text-3xl font-extrabold text-[#202124]">Tasks</h2>
//           <p className="text-base text-[#5f6368] mt-1">Manage your ongoing deliverables and campaign submissions.</p>
//         </div>

//         {phases.map((phase) => {
//           const locked = isLocked(phase);
//           const expanded = expandedPhases[phase.id];
//           const phaseTasks = tasks.filter(t => t.taskMonth === phase.id);

//           return (
//             <div key={phase.id} className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
//               <div className={`p-6 flex items-center justify-between ${locked ? 'bg-[#f8f9fa]' : 'bg-white'}`}>
//                 <div className="flex items-center gap-5">
//                   <div className={`p-3 rounded-xl ${locked ? 'bg-gray-200' : 'bg-blue-50'}`}>
//                     {locked ? <Lock className="w-6 h-6 text-gray-500" /> : <Unlock className="w-6 h-6 text-[#1a73e8]" />}
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-xl text-[#202124]">{phase.title}</h3>
//                     <p className="text-sm text-[#5f6368] font-medium flex items-center gap-1.5 mt-0.5">
//                       <Calendar className="w-4 h-4" /> {phase.dateRange}
//                     </p>
//                   </div>
//                 </div>

//                 {!locked && (
//                   <button 
//                     onClick={() => togglePhase(phase.id)}
//                     className="text-sm font-bold text-[#1a73e8] hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0"
//                   >
//                     {expanded ? <><ChevronUp className="w-5 h-5"/> COLLAPSE</> : <><ChevronDown className="w-5 h-5"/> EXPAND</>}
//                   </button>
//                 )}
//               </div>

//               {expanded && !locked && (
//                 <div className="border-t border-[#dadce0] divide-y divide-[#dadce0]">
//                   {phaseTasks.length > 0 ? (
//                     phaseTasks.map((task) => (
//                       <div 
//                         key={task._id} 
//                         onClick={() => setSelectedTask(task)}
//                         className="p-6 sm:p-8 hover:bg-[#f8f9fa] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 overflow-hidden"
//                       >
//                         {/* Text Container */}
//                         <div className="flex-1 min-w-0 pr-2">
//                           <div className="mb-2">
//                             <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-3 py-1 rounded-md">
//                               {task.periodicity || "Task"}
//                             </span>
//                           </div>
//                           <h4 className="font-bold text-lg text-[#202124] truncate">{task.title}</h4>
//                           {task.description && (
//                             <p className="text-sm text-[#5f6368] mt-1.5 leading-relaxed line-clamp-2 whitespace-pre-line">
//                               {task.description}
//                             </p>
//                           )}
//                         </div>

//                         {/* Action Buttons Container */}
//                         <div className="flex items-center gap-3 shrink-0 self-start sm:self-center pt-2 sm:pt-0">
//                           {/* Info Button */}
//                           <button 
//                             type="button" 
//                             title="Task Information"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSelectedTask(task);
//                             }}
//                             className="p-3 rounded-xl border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] hover:border-[#1a73e8] transition-all cursor-pointer shrink-0"
//                           >
//                             <Info className="w-5 h-5" />
//                           </button>

//                           {/* Submit Button */}
//                           <button 
//                             type="button"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSubmittingTask(task);
//                             }}
//                             className="flex items-center justify-center gap-2 bg-[#202124] text-white px-5 sm:px-6 py-3 rounded-xl font-bold text-sm hover:bg-black shadow-md transition-all cursor-pointer shrink-0"
//                           >
//                             <Send className="w-4 h-4" />
//                             <span>SUBMIT TASK</span>
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="p-10 text-center text-sm text-[#5f6368]">No tasks available for this month.</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </main>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Unlock, 
  Calendar, 
  Send, 
  Loader2,
  Info,
  X,
  CheckCircle2,
  XCircle,
  Award,
  Target,
  FileText,
  Upload,
  Plus,
  Trash2,
  Link as LinkIcon
} from "lucide-react";
import API from "./config/api.js";

// --- Task Submission Modal ---
function SubmitTaskModal({ task, onClose, onSuccess }) {
  const [urls, setUrls] = useState([""]); // Array of URLs (Max 2)
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (task) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [task]);

  if (!task) return null;

  const requiresMedia = task.isImageAllowed || task.isVideoAllowed;

  // Determine accepted file types strictly based on task permissions
  const getAcceptAttribute = () => {
    if (task.isImageAllowed && task.isVideoAllowed) return "image/*,video/*";
    if (task.isImageAllowed) return "image/*";
    if (task.isVideoAllowed) return "video/*";
    return "";
  };

  // URL Field Handlers
  const handleUrlChange = (index, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
  };

  const addUrlField = () => {
    if (urls.length < 2) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrlField = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  // File Change Handler (Max 4 Files)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 4) {
      setFileError("You can upload a maximum of 4 files.");
      e.target.value = "";
      setFiles([]);
      return;
    }
    setFileError("");
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Filter out empty URL strings
    const proofURLs = urls.map((u) => u.trim()).filter((u) => u.length > 0);

    try {
      if (requiresMedia && files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        proofURLs.forEach((link) => formData.append("proofURLs", link));

        await API.post(`/ambassador/submitTask/${task._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        await API.post(
          `/ambassador/submitTask/${task._id}`,
          { proofURLs },
          { withCredentials: true }
        );
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#dadce0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa] shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-md">
              Submit Deliverable
            </span>
            <h2 className="text-xl font-bold text-[#202124] mt-1">{task.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5f6368] hover:bg-gray-200 hover:text-[#202124] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Dynamic Link Inputs (Max 2) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#1a73e8]" /> Submission URLs / Proof Links
            </label>

            {urls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder={`https://example.com/proof-link-${index + 1}`}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all text-sm"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(index)}
                    className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors shrink-0 cursor-pointer"
                    title="Remove link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {urls.length < 2 && (
              <button
                type="button"
                onClick={addUrlField}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1a73e8] hover:underline pt-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add another link
              </button>
            )}
          </div>

          {/* Conditional Media Upload Field */}
          {requiresMedia && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#1a73e8]" /> Upload Proof Attachments (Max 4)
              </label>
              <div className="border-2 border-dashed border-[#dadce0] hover:border-[#1a73e8] rounded-xl p-4 transition-colors text-center">
                <input
                  type="file"
                  multiple
                  accept={getAcceptAttribute()}
                  onChange={handleFileChange}
                  className="hidden"
                  id="task-file-input"
                />
                <label 
                  htmlFor="task-file-input" 
                  className="cursor-pointer flex flex-col items-center gap-1 text-sm text-[#5f6368]"
                >
                  <Upload className="w-6 h-6 text-[#1a73e8]" />
                  <span className="font-semibold text-[#1a73e8]">Click to upload files</span>
                  <span className="text-xs text-gray-400">
                    Allowed: {[task.isImageAllowed && "Images", task.isVideoAllowed && "Videos"].filter(Boolean).join(" & ")} (Up to 4 files)
                  </span>
                </label>
              </div>

              {/* Selected File List */}
              {files.length > 0 && (
                <div className="space-y-1 mt-2">
                  <p className="text-xs font-bold text-[#5f6368]">Selected ({files.length}/4):</p>
                  <ul className="text-xs text-[#202124] space-y-1">
                    {files.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#dadce0]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {fileError && <p className="text-xs font-semibold text-red-600">{fileError}</p>}
            </div>
          )}

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          {success && (
            <p className="text-emerald-600 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Task submitted successfully!
            </p>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#dadce0] flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#dadce0] text-sm font-bold text-[#5f6368] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!fileError}
              className="flex items-center gap-2 bg-[#1a73e8] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1557b0] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "Submitting..." : "Submit Task"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// --- Task Details Modal ---
function TaskDetailsModal({ task, onClose, onSubmitClick }) {
  // Lock body scroll while modal is active
  useEffect(() => {
    if (task) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [task]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#dadce0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa] shrink-0">
          <div className="flex items-center gap-2.5">
            {/* <div className="p-2 bg-[#e8f0fe] rounded-lg">
              <Info className="w-5 h-5 text-[#1a73e8]" />
            </div> */}
            <h2 className="text-xl font-bold text-[#202124]">Task Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5f6368] hover:bg-gray-200 hover:text-[#202124] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Title & Badge */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-md">
                {task.periodicity || "Task"}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#202124]">{task.title}</h3>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Description
              </label>
              <p className="text-sm text-[#202124] leading-relaxed bg-[#f8f9fa] p-3.5 rounded-xl border border-[#dadce0] whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Activity */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6368] uppercase">HOW TO SUBMIT</label>
            <p className="text-sm text-[#3c4043] leading-relaxed whitespace-pre-wrap">
              {task.activity || "N/A"}
            </p>
          </div>

          {/* Things to Avoid */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5f6368] uppercase">THINGS TO AVOID</label>
            <p className="text-sm text-[#3c4043] leading-relaxed whitespace-pre-wrap">
              {task.thingsToAvoid || "N/A"}
            </p>
          </div>

          {/* Target */}
          {task.target && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Target
              </label>
              <p className="text-sm text-[#3c4043] bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-xl whitespace-pre-wrap">
                {task.target}
              </p>
            </div>
          )}

          {/* Allowed Submissions */}
          {(task.isImageAllowed || task.isVideoAllowed) && (
            <div className="pt-2 border-t border-[#dadce0]">
              <div className="p-3 bg-[#f8f9fa] rounded-xl border border-[#dadce0] flex flex-col items-center justify-center gap-1.5">
                <p className="text-[11px] font-bold text-[#5f6368] uppercase">Allowed Formats</p>
                <div className="flex items-center gap-6 text-xs font-medium text-[#202124]">
                  <span className="flex items-center gap-1.5">
                    {task.isImageAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                    Image
                  </span>
                  <span className="flex items-center gap-1.5">
                    {task.isVideoAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                    Video
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold text-[#5f6368] hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button
            onClick={() => onSubmitClick(task)}
            className="flex items-center gap-2 bg-[#202124] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            SUBMIT TASK
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Main AmbassadorTasks Component ---
export default function AmbassadorTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({ 1: true });
  
  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);
  const [submittingTask, setSubmittingTask] = useState(null);

  const phases = [
    {
      id: 1,
      title: "Month 1",
      dateRange: "16 Sep 2026 - 16 Oct 2026",
      startDate: new Date("2026-09-16"),
    },
    {
      id: 2,
      title: "Month 2",
      dateRange: "To Be Declared",
      startDate: new Date("2026-10-20"),
    },
    {
      id: 3,
      title: "Month 3",
      dateRange: "To Be Declared",
      startDate: new Date("2026-11-20"),
    },
  ];

  const fetchTasks = async () => {
    try {
      const response = await API.get("/ambassador/getTasks");
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const togglePhase = (id) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isLocked = (phase) => {
    if (phase.id === 1) return false; 
    return new Date() < phase.startDate;
  };

  const handleOpenSubmitFromInfo = (task) => {
    setSelectedTask(null);
    setSubmittingTask(task);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-[#1a73e8]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans overflow-x-hidden">
      {/* Centered Minimal Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] px-4 py-3 flex items-center justify-center shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-[#3c4043]">
          Fateh Campus Ambassador <span className="text-[#1a73e8] font-bold">2026</span>
        </h2>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1 overflow-x-hidden">
        <TaskDetailsModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onSubmitClick={handleOpenSubmitFromInfo}
        />

        <SubmitTaskModal 
          task={submittingTask}
          onClose={() => setSubmittingTask(null)}
          onSuccess={fetchTasks}
        />

        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-[#202124]">Tasks</h2>
          <p className="text-base text-[#5f6368] mt-1">Manage your ongoing deliverables and campaign submissions.</p>
        </div>

        {phases.map((phase) => {
          const locked = isLocked(phase);
          const expanded = expandedPhases[phase.id];
          const phaseTasks = tasks.filter(t => t.taskMonth === phase.id);

          return (
            <div key={phase.id} className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
              <div className={`p-6 flex items-center justify-between ${locked ? 'bg-[#f8f9fa]' : 'bg-white'}`}>
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl ${locked ? 'bg-gray-200' : 'bg-blue-50'}`}>
                    {locked ? <Lock className="w-6 h-6 text-gray-500" /> : <Unlock className="w-6 h-6 text-[#1a73e8]" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#202124]">{phase.title}</h3>
                    <p className="text-sm text-[#5f6368] font-medium flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-4 h-4" /> {phase.dateRange}
                    </p>
                  </div>
                </div>

                {!locked && (
                  <button 
                    onClick={() => togglePhase(phase.id)}
                    className="text-sm font-bold text-[#1a73e8] hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                  >
                    {expanded ? <><ChevronUp className="w-5 h-5"/> COLLAPSE</> : <><ChevronDown className="w-5 h-5"/> EXPAND</>}
                  </button>
                )}
              </div>

              {expanded && !locked && (
                <div className="border-t border-[#dadce0] divide-y divide-[#dadce0]">
                  {phaseTasks.length > 0 ? (
                    phaseTasks.map((task) => (
                      <div 
                        key={task._id} 
                        onClick={() => setSelectedTask(task)}
                        className="p-6 sm:p-8 hover:bg-[#f8f9fa] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 overflow-hidden"
                      >
                        {/* Text Container */}
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="mb-2">
                            <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-3 py-1 rounded-md">
                              {task.periodicity || "Task"}
                            </span>
                          </div>
                          <h4 className="font-bold text-lg text-[#202124] truncate">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-[#5f6368] mt-1.5 leading-relaxed line-clamp-2 whitespace-pre-line">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons Container */}
                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center pt-2 sm:pt-0">
                          {/* Info Button */}
                          <button 
                            type="button" 
                            title="Task Information"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                            className="p-3 rounded-xl border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] hover:border-[#1a73e8] transition-all cursor-pointer shrink-0"
                          >
                            <Info className="w-5 h-5" />
                          </button>

                          {/* Submit Button */}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubmittingTask(task);
                            }}
                            className="flex items-center justify-center gap-2 bg-[#202124] text-white px-5 sm:px-6 py-3 rounded-xl font-bold text-sm hover:bg-black shadow-md transition-all cursor-pointer shrink-0"
                          >
                            <Send className="w-4 h-4" />
                            <span>SUBMIT TASK</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-sm text-[#5f6368]">No tasks available for this month.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}