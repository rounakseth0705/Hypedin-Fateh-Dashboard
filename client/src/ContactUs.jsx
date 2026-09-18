import React, { useState } from "react";
import { User, Mail, Phone, MessageSquare, Send } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    query: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send button currently does nothing
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-[#dadce0] shadow-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-[#202124]">Contact Us</h1>
        <p className="text-sm text-[#5f6368] mt-2">
          Have questions or need support? Reach out to us below.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#1a73e8]" /> Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all text-sm"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#1a73e8]" /> Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="youremail@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all text-sm"
          />
        </div>

        {/* Phone Number Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#1a73e8]" /> Phone Number
          </label>
          <input
            type="tel"
            name="phoneNo"
            required
            placeholder="+91 9354549513"
            value={formData.phoneNo}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all text-sm"
          />
        </div>

        {/* Query Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#5f6368] uppercase flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#1a73e8]" /> Query
          </label>
          <textarea
            name="query"
            rows={4}
            required
            placeholder="How can we help you?"
            value={formData.query}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#dadce0] focus:ring-2 focus:ring-[#1a73e8] outline-none transition-all text-sm resize-none"
          />
        </div>

        {/* Send Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#1a73e8] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1557b0] shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" /> Send Query
          </button>
        </div>
      </form>
    </div>
  );
}