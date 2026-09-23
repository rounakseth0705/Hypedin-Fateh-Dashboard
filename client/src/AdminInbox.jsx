import React, { useState, useEffect } from "react";
import API from "./config/api.js";
import { Mail, MessageSquare, Loader2, AlertCircle, Clock, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Broadcast Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcastContent, setBroadcastContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

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

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastContent.trim()) return;

    try {
      setSending(true);
      setSendError(null);

      const response = await API.post("/inboxMessages/sendMessage", {
        message: broadcastContent,
      });

      if (response.data?.success) {
        toast.success(response.data?.message || "Broadcast message sent successfully!");
        setBroadcastContent("");
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
                {msg.createdAt && (
                  <div className="flex items-center gap-1 text-xs text-[#5f6368]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Message Title */}
              {(msg.title || msg.subject) && (
                <h3 className="text-lg font-bold text-[#202124]">
                  {msg.title || msg.subject}
                </h3>
              )}

              {/* Message Content */}
              <div className="text-sm text-[#202124] leading-relaxed whitespace-pre-wrap bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0]">
                {renderFormattedContent(msg.content || msg.message)}
              </div>
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
                onClick={() => setIsModalOpen(false)}
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
                  required
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Type your broadcast message here..."
                  className="w-full p-3 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#dadce0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !broadcastContent.trim()}
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