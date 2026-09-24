// import React, { useState, useEffect } from "react";
// import API from "./config/api.js";
// import { Mail, MessageSquare, Loader2, AlertCircle, Clock, Send, X, Paperclip, Image as ImageIcon } from "lucide-react";
// import toast from "react-hot-toast";

// const AdminInbox = () => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Broadcast Modal States
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [broadcastContent, setBroadcastContent] = useState("");
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [sending, setSending] = useState(false);
//   const [sendError, setSendError] = useState(null);

//   useEffect(() => {
//     fetchInboxMessages();
//   }, []);

//   const fetchInboxMessages = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await API.get("/inboxMessages/getMessages");

//       if (response.data?.success) {
//         setMessages(response.data.messages || []);
//       } else {
//         const errMsg = response.data?.message || "Failed to fetch messages.";
//         setError(errMsg);
//         toast.error(errMsg);
//       }
//     } catch (err) {
//       const errMsg = err.response?.data?.message || "An error occurred while loading messages.";
//       setError(errMsg);
//       toast.error(errMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     if (imageFiles.length + selectedFiles.length > 3) {
//       toast.error("You can upload a maximum of 3 images.");
//       return;
//     }

//     const validFiles = [];
//     const newPreviews = [];

//     for (const file of selectedFiles) {
//       if (!file.type.startsWith("image/")) {
//         toast.error(`${file.name} is not a valid image file.`);
//         continue;
//       }
//       validFiles.push(file);
//       newPreviews.push(URL.createObjectURL(file));
//     }

//     setImageFiles((prev) => [...prev, ...validFiles]);
//     setImagePreviews((prev) => [...prev, ...newPreviews]);
//   };

//   const handleRemoveImage = (index) => {
//     setImageFiles((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleResetImages = () => {
//     setImageFiles([]);
//     setImagePreviews([]);
//   };

//   const handleSendBroadcast = async (e) => {
//     e.preventDefault();
//     if (!broadcastContent.trim() && imageFiles.length === 0) return;

//     try {
//       setSending(true);
//       setSendError(null);

//       const formData = new FormData();
//       formData.append("message", broadcastContent.trim() ? broadcastContent : "");
//       imageFiles.forEach((file) => {
//         formData.append("images", file);
//       });

//       const response = await API.post("/inboxMessages/sendMessage", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.data?.success) {
//         toast.success(response.data?.message || "Broadcast message sent successfully!");
//         setBroadcastContent("");
//         handleResetImages();
//         setIsModalOpen(false);
//         fetchInboxMessages(); // Refresh messages list
//       } else {
//         const errMsg = response.data?.message || "Failed to send message.";
//         setSendError(errMsg);
//         toast.error(errMsg);
//       }
//     } catch (err) {
//       const errMsg = err.response?.data?.message || "An error occurred while sending the message.";
//       setSendError(errMsg);
//       toast.error(errMsg);
//     } finally {
//       setSending(false);
//     }
//   };

//   // Helper to convert Google Drive viewing URLs into direct image render URLs
//   const getDriveImageUrl = (url) => {
//     if (!url) return "";
//     const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
//     if (match && match[1]) {
//       return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
//     }
//     return url;
//   };

//   // Helper to parse text and turn URLs starting with http:// or https:// into clickable links
//   const renderFormattedContent = (content) => {
//     if (!content) return "No content provided.";

//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     const parts = content.split(urlRegex);

//     return parts.map((part, index) => {
//       if (part.match(urlRegex)) {
//         return (
//           <a
//             key={index}
//             href={part}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-[#1a73e8] underline font-medium hover:text-[#1557b0] break-all"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {part}
//           </a>
//         );
//       }
//       return part;
//     });
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-[#202124]">
//       {/* Header */}
//       <div className="flex items-center justify-between gap-3 mb-6 border-b border-[#dadce0] pb-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-[#e8f0fe] rounded-xl text-[#1a73e8]">
//             <Mail className="w-6 h-6" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-[#202124]">Ambassador Inbox</h1>
//             <p className="text-sm text-[#5f6368]">
//               View announcements and updates from the team.
//             </p>
//           </div>
//         </div>

//         {/* Broadcast Message Button */}
//         <button
//           onClick={() => {
//             setSendError(null);
//             setIsModalOpen(true);
//           }}
//           className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shrink-0"
//         >
//           <Send className="w-4 h-4" />
//           <span>Broadcast Message</span>
//         </button>
//       </div>

//       {/* Main Content Area */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#dadce0]">
//           <Loader2 className="w-8 h-8 text-[#1a73e8] animate-spin mb-3" />
//           <p className="text-sm font-medium text-[#5f6368]">Loading messages...</p>
//         </div>
//       ) : error ? (
//         <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
//           <AlertCircle className="w-5 h-5 shrink-0" />
//           <p className="text-sm font-medium">{error}</p>
//         </div>
//       ) : messages.length === 0 ? (
//         /* Empty State */
//         <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-[#dadce0] text-center">
//           <div className="p-4 bg-[#f8f9fa] rounded-full mb-4 border border-[#dadce0]">
//             <MessageSquare className="w-10 h-10 text-[#5f6368]" />
//           </div>
//           <h3 className="text-lg font-bold text-[#202124] mb-1">No Messages</h3>
//           <p className="text-sm text-[#5f6368] max-w-sm">
//             Your inbox is currently empty. New notifications and broadcast messages will appear here.
//           </p>
//         </div>
//       ) : (
//         /* Straightforward Message Feed (No Selection Sidebar) */
//         <div className="space-y-4">
//           {messages.map((msg, idx) => (
//             <div
//               key={msg._id || idx}
//               className="bg-white border border-[#dadce0] rounded-2xl p-5 shadow-sm space-y-3"
//             >
//               {/* Card Top Details */}
//               <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dadce0] pb-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-md">
//                     Announcement
//                   </span>
//                   <span className="text-xs font-semibold text-[#5f6368]">
//                     From: <span className="text-[#202124]">{msg.sender || "Fateh Campus Ambassador Team"}</span>
//                   </span>
//                 </div>
//                 {msg.createdAt && (
//                   <div className="flex items-center gap-1 text-xs text-[#5f6368]">
//                     <Clock className="w-3.5 h-3.5" />
//                     <span>{new Date(msg.createdAt).toLocaleString()}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Message Title */}
//               {(msg.title || msg.subject) && (
//                 <h3 className="text-lg font-bold text-[#202124]">
//                   {msg.title || msg.subject}
//                 </h3>
//               )}

//               {/* Message Content */}
//               {msg.message && msg.message.trim() !== "" && (
//                 <div className="text-sm text-[#202124] leading-relaxed whitespace-pre-wrap bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0]">
//                   {renderFormattedContent(msg.message)}
//                 </div>
//               )}

//               {/* Display Images from attachmentLinks */}
//               {Array.isArray(msg.attachmentLinks) && msg.attachmentLinks.length > 0 && (
//                 <div className="pt-2">
//                   <p className="text-xs font-semibold text-[#5f6368] uppercase mb-2">Attachments</p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                     {msg.attachmentLinks.map((link, i) => (
//                       <a
//                         key={i}
//                         href={link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="group relative block overflow-hidden rounded-xl border border-[#dadce0] bg-[#f8f9fa] aspect-video"
//                       >
//                         <img
//                           src={getDriveImageUrl(link)}
//                           alt={`Attachment ${i + 1}`}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                         />
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Broadcast Message Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#dadce0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#dadce0]">
//               <h2 className="text-lg font-bold text-[#202124]">Broadcast Message</h2>
//               <button
//                 onClick={() => {
//                   handleResetImages();
//                   setIsModalOpen(false);
//                 }}
//                 className="p-1 rounded-lg text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <form onSubmit={handleSendBroadcast} className="p-4 md:p-5 space-y-4">
//               {sendError && (
//                 <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
//                   <AlertCircle className="w-4 h-4 shrink-0" />
//                   <span>{sendError}</span>
//                 </div>
//               )}

//               <div>
//                 <label className="block text-xs font-semibold uppercase text-[#5f6368] mb-2">
//                   Message Content
//                 </label>
//                 <textarea
//                   rows={5}
//                   value={broadcastContent}
//                   onChange={(e) => setBroadcastContent(e.target.value)}
//                   placeholder="Type your broadcast message here..."
//                   className="w-full p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] resize-none"
//                 />
//               </div>

//               {/* Attachment / Image Area */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-xs font-semibold uppercase text-[#5f6368]">
//                     Attachments (Max 3)
//                   </label>
//                   <span className="text-xs font-medium text-[#5f6368]">
//                     {imageFiles.length}/3
//                   </span>
//                 </div>

//                 <div className="flex flex-wrap gap-2 items-center">
//                   {imagePreviews.map((preview, idx) => (
//                     <div
//                       key={idx}
//                       className="relative border border-[#dadce0] rounded-xl p-1 bg-[#f8f9fa]"
//                     >
//                       <img
//                         src={preview}
//                         alt={`Attachment Preview ${idx + 1}`}
//                         className="h-20 w-20 rounded-lg object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveImage(idx)}
//                         className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-colors"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}

//                   {imageFiles.length < 3 && (
//                     <div>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         id="image-upload"
//                         className="hidden"
//                         onChange={handleImageChange}
//                       />
//                       <label
//                         htmlFor="image-upload"
//                         className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#dadce0] bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#5f6368] rounded-xl text-xs font-medium cursor-pointer transition-colors"
//                       >
//                         <Paperclip className="w-4 h-4 text-[#1a73e8]" />
//                         <span>Attach Image</span>
//                       </label>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Modal Actions */}
//               <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#dadce0]">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     handleResetImages();
//                     setIsModalOpen(false);
//                   }}
//                   className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-xl transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={sending || (!broadcastContent.trim() && imageFiles.length === 0)}
//                   className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#a0c3ff] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
//                 >
//                   {sending ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       <span>Sending...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Send className="w-4 h-4" />
//                       <span>Send</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminInbox;




import React, { useState, useEffect } from "react";
import API from "./config/api.js";
import { Mail, MessageSquare, Loader2, AlertCircle, Clock, Send, X, Paperclip, Image as ImageIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Broadcast Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcastContent, setBroadcastContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchInboxMessages();
  }, []);

  const fetchInboxMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/inboxMessages/getMessages");

      if (response.data?.success) {
        setMessages(response.data.messages || []);
      } else {
        const errMsg = response.data?.message || "Failed to fetch messages.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "An error occurred while loading messages.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setDeletingId(messageId);
      const response = await API.delete(`/inboxMessages/deleteMessage/${messageId}`);

      const { success, message } = response.data || {};

      if (success) {
        toast.success(message || "Message deleted successfully.");
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      } else {
        toast.error(message || "Failed to delete message.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "An error occurred while deleting the message.";
      toast.error(errMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (imageFiles.length + selectedFiles.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file.`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastContent.trim() && imageFiles.length === 0) return;

    try {
      setSending(true);
      setSendError(null);

      const formData = new FormData();
      formData.append("message", broadcastContent.trim() ? broadcastContent : "");
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await API.post("/inboxMessages/sendMessage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        toast.success(response.data?.message || "Broadcast message sent successfully!");
        setBroadcastContent("");
        handleResetImages();
        setIsModalOpen(false);
        fetchInboxMessages(); // Refresh messages list
      } else {
        const errMsg = response.data?.message || "Failed to send message.";
        setSendError(errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "An error occurred while sending the message.";
      setSendError(errMsg);
      toast.error(errMsg);
    } finally {
      setSending(false);
    }
  };

  // Helper to convert Google Drive viewing URLs into direct image render URLs
  const getDriveImageUrl = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
    return url;
  };

  // Helper to parse text and turn URLs starting with http:// or https:// into clickable links
  const renderFormattedContent = (content) => {
    if (!content) return "No content provided.";

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a73e8] underline font-medium hover:text-[#1557b0] break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-[#202124]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 border-b border-[#dadce0] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#e8f0fe] rounded-xl text-[#1a73e8]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#202124]">Ambassador Inbox</h1>
            <p className="text-sm text-[#5f6368]">
              View announcements and updates from the team.
            </p>
          </div>
        </div>

        {/* Broadcast Message Button */}
        <button
          onClick={() => {
            setSendError(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Message</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#dadce0]">
          <Loader2 className="w-8 h-8 text-[#1a73e8] animate-spin mb-3" />
          <p className="text-sm font-medium text-[#5f6368]">Loading messages...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : messages.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-[#dadce0] text-center">
          <div className="p-4 bg-[#f8f9fa] rounded-full mb-4 border border-[#dadce0]">
            <MessageSquare className="w-10 h-10 text-[#5f6368]" />
          </div>
          <h3 className="text-lg font-bold text-[#202124] mb-1">No Messages</h3>
          <p className="text-sm text-[#5f6368] max-w-sm">
            Your inbox is currently empty. New notifications and broadcast messages will appear here.
          </p>
        </div>
      ) : (
        /* Straightforward Message Feed (No Selection Sidebar) */
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className="bg-white border border-[#dadce0] rounded-2xl p-5 shadow-sm space-y-3"
            >
              {/* Card Top Details */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dadce0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-md">
                    Announcement
                  </span>
                  <span className="text-xs font-semibold text-[#5f6368]">
                    From: <span className="text-[#202124]">{msg.sender || "Fateh Campus Ambassador Team"}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {msg.createdAt && (
                    <div className="flex items-center gap-1 text-xs text-[#5f6368]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    disabled={deletingId === msg._id}
                    title="Delete Message"
                    className="p-1.5 text-[#5f6368] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === msg._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message Title */}
              {(msg.title || msg.subject) && (
                <h3 className="text-lg font-bold text-[#202124]">
                  {msg.title || msg.subject}
                </h3>
              )}

              {/* Message Content */}
              {msg.message && msg.message.trim() !== "" && (
                <div className="text-sm text-[#202124] leading-relaxed whitespace-pre-wrap bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0]">
                  {renderFormattedContent(msg.message)}
                </div>
              )}

              {/* Display Images from attachmentLinks */}
              {Array.isArray(msg.attachmentLinks) && msg.attachmentLinks.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-[#5f6368] uppercase mb-2">Attachments</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {msg.attachmentLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block overflow-hidden rounded-xl border border-[#dadce0] bg-[#f8f9fa] aspect-video"
                      >
                        <img
                          src={getDriveImageUrl(link)}
                          alt={`Attachment ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Message Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#dadce0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#dadce0]">
              <h2 className="text-lg font-bold text-[#202124]">Broadcast Message</h2>
              <button
                onClick={() => {
                  handleResetImages();
                  setIsModalOpen(false);
                }}
                className="p-1 rounded-lg text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSendBroadcast} className="p-4 md:p-5 space-y-4">
              {sendError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-[#5f6368] mb-2">
                  Message Content
                </label>
                <textarea
                  rows={5}
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Type your broadcast message here..."
                  className="w-full p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] resize-none"
                />
              </div>

              {/* Attachment / Image Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase text-[#5f6368]">
                    Attachments (Max 3)
                  </label>
                  <span className="text-xs font-medium text-[#5f6368]">
                    {imageFiles.length}/3
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {imagePreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative border border-[#dadce0] rounded-xl p-1 bg-[#f8f9fa]"
                    >
                      <img
                        src={preview}
                        alt={`Attachment Preview ${idx + 1}`}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {imageFiles.length < 3 && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="image-upload"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#dadce0] bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#5f6368] rounded-xl text-xs font-medium cursor-pointer transition-colors"
                      >
                        <Paperclip className="w-4 h-4 text-[#1a73e8]" />
                        <span>Attach Image</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#dadce0]">
                <button
                  type="button"
                  onClick={() => {
                    handleResetImages();
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || (!broadcastContent.trim() && imageFiles.length === 0)}
                  className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#a0c3ff] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInbox;