import React, { useState, useEffect } from "react";
import API from "./config/api.js";
import { Mail, MessageSquare, Loader2, AlertCircle, Clock } from "lucide-react";

const AmbassadorInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(response.data?.message || "Failed to fetch messages.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while loading messages."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-[#202124]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-[#dadce0] pb-4">
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
                {msg.content || msg.message || "No content provided."}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AmbassadorInbox;