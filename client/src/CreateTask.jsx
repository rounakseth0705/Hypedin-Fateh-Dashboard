import React, { useState } from "react";
import { PlusCircle, Loader2, CheckCircle2 } from "lucide-react";
import API from "./config/api";

export default function CreateTask() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activity: "",
    belongsTo: "Ambassador", // Default option
    periodicity: "Weekly",
    target: "",
    isImageAllowed: false,
    isVideoAllowed: false,
    taskMonth: "",
    taskWeek: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        points: parseInt(formData.points) || 0,
        taskMonth: parseInt(formData.taskMonth) || 1,
        taskWeek: parseInt(formData.taskWeek) || 1
      };

      await API.post("/admin/createTask", payload, { withCredentials: true });

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        activity: "",
        belongsTo: "Ambassador",
        periodicity: "Weekly",
        target: "",
        isImageAllowed: false,
        isVideoAllowed: false,
        taskMonth: "",
        taskWeek: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="max-w-2xl w-full px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#202124]">Create New Task</h1>
          <p className="text-sm text-[#5f6368]">Configure new deliverables for your ambassadors or POCs.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#dadce0] p-6 shadow-sm space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5f6368] uppercase">Task Title</label>
            <input
              required
              className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5f6368] uppercase">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide general instructions or details about the task..."
              className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Phase and Week Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5f6368] uppercase">Phase (Month)</label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all"
                value={formData.taskMonth}
                onChange={(e) => setFormData({ ...formData, taskMonth: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5f6368] uppercase">Week</label>
              <input
                type="number"
                min="1"
                max="4"
                required
                className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all"
                value={formData.taskWeek}
                onChange={(e) => setFormData({ ...formData, taskWeek: e.target.value })}
              />
            </div>
          </div>

          {/* Task Activity Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5f6368] uppercase">Task Activity Description</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            />
          </div>

          {/* Optional Target Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#5f6368] uppercase">Target (Optional)</label>
            <textarea
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            />
          </div>

          {/* Third Row: Belongs To, Periodicity, Points */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5f6368] uppercase">Belongs To</label>
              <select
                className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all bg-white text-sm"
                value={formData.belongsTo}
                onChange={(e) => setFormData({ ...formData, belongsTo: e.target.value })}
              >
                <option value="Ambassador">Ambassador</option>
                <option value="POC">POC</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5f6368] uppercase">Periodicity</label>
              <select
                className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all bg-white text-sm"
                value={formData.periodicity}
                onChange={(e) => setFormData({ ...formData, periodicity: e.target.value })}
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="One-time">One-time</option>
              </select>
            </div>
            {/* <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5f6368] uppercase">Points</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all text-sm"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              />
            </div> */}
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#1a73e8]"
                checked={formData.isImageAllowed}
                onChange={(e) => setFormData({ ...formData, isImageAllowed: e.target.checked })}
              />
              <span className="text-sm text-[#202124]">Allow Images</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#1a73e8]"
                checked={formData.isVideoAllowed}
                onChange={(e) => setFormData({ ...formData, isVideoAllowed: e.target.checked })}
              />
              <span className="text-sm text-[#202124]">Allow Videos</span>
            </label>
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          {success && <p className="text-emerald-600 text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Task created successfully!</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1a73e8] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#1557b0] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}