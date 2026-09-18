import React, { useContext, useEffect } from "react";
import { UserContext } from "./context/AuthContext.jsx";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  CheckCircle2, 
  Award,
  ShieldCheck 
} from "lucide-react";

const Profile = () => {
  const { user, ambassador } = useContext(UserContext);
  
  useEffect(() => {
    console.log(user);
    console.log(ambassador);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-[#202124]">
      {/* Header Banner */}
      <div className="bg-white border border-[#dadce0] rounded-2xl p-6 md:p-8 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#1a73e8]" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar / Icon Container */}
          <div className="w-20 h-20 bg-[#e8f0fe] text-[#1a73e8] rounded-2xl flex items-center justify-center border border-blue-100 shrink-0 shadow-inner">
            <User className="w-10 h-10" />
          </div>

          {/* User Basic Info */}
          <div className="text-center sm:text-left flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-[#202124]">
                {user?.name || "Ambassador Name"}
              </h1>
            </div>
            
            <p className="text-sm text-[#5f6368] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
              <Mail className="w-4 h-4 text-[#5f6368]" />
              {user?.email || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Section for Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details Card */}
        <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#dadce0] pb-3">
            <div className="p-2 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
              <User className="w-5 h-5 text-[#5f6368]" />
            </div>
            <h2 className="text-lg font-bold text-[#202124]">Personal Details</h2>
          </div>

          <div className="space-y-4">
            {/* Contact Phone */}
            <div className="flex items-center gap-3 p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
              <div className="p-2 bg-white rounded-lg border border-[#dadce0] text-[#5f6368]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
                  Phone Number
                </p>
                <p className="text-sm font-semibold text-[#202124]">
                  {user?.phoneNo || "N/A"}
                </p>
              </div>
            </div>

            {/* College */}
            <div className="flex items-center gap-3 p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
              <div className="p-2 bg-white rounded-lg border border-[#dadce0] text-[#5f6368]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
                  College / University
                </p>
                <p className="text-sm font-semibold text-[#202124]">
                  {ambassador?.college || "N/A"}
                </p>
              </div>
            </div>

            {/* City */}
            <div className="flex items-center gap-3 p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
              <div className="p-2 bg-white rounded-lg border border-[#dadce0] text-[#5f6368]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
                  Location / City
                </p>
                <p className="text-sm font-semibold text-[#202124]">
                  {ambassador?.city || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Performance & Activity Card */}
        <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#dadce0] pb-3">
            <div className="p-2 bg-[#e8f0fe] rounded-lg">
              <Award className="w-5 h-5 text-[#1a73e8]" />
            </div>
            <h2 className="text-lg font-bold text-[#202124]">Activity & Performance</h2>
          </div>

          <div className="flex flex-col justify-center h-[calc(100%-60px)] space-y-4">
            {/* Tasks Completed Metric Card */}
            <div className="p-5 bg-gradient-to-br from-[#f8f9fa] to-[#e8f0fe] rounded-xl border border-[#dadce0] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                  Total Tasks Completed
                </p>
                <p className="text-3xl font-black text-[#202124]">
                  {ambassador?.taskCompleted ?? 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>

            {/* Program Info Note */}
            <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0] text-xs text-[#5f6368] leading-relaxed">
              Keep completing your weekly assigned tasks to improve your performance.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;