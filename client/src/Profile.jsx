// import React, { useContext, useEffect, useState } from "react";
// import { UserContext } from "./context/AuthContext.jsx";
// import API from "./config/api.js";
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Building2,
//   CheckCircle2, 
//   Award,
//   Lock,
//   X,
//   Eye,
//   EyeOff,
//   Loader2
// } from "lucide-react";
// import toast from "react-hot-toast";

// const Profile = () => {
//   const { user, ambassador } = useContext(UserContext);
  
//   // Modal & Password State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Password Visibility States
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     console.log(user);
//     console.log(ambassador);
//   }, []);

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//     setShowCurrentPassword(false);
//     setShowNewPassword(false);
//     setShowConfirmPassword(false);
//   };

//   const handleChangePassword = async () => {
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       toast.error("Please fill in all password fields");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("New Password and Confirm New Password doesn't match");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await API.put("/auth/changePassword", {
//         currentPassword,
//         newPassword,
//       });

//       const data = res.data;

//       if (data.success) {
//         toast.success(data.message);
//         handleCloseModal();
//       } else {
//         toast.error(data.message || "Failed to change password");
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-[#202124]">
//       {/* Header Banner */}
//       <div className="bg-white border border-[#dadce0] rounded-2xl p-6 md:p-8 mb-6 shadow-sm relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-2 bg-[#1a73e8]" />
        
//         {/* Top Right Change Password Button */}
//         <div className="flex justify-end mb-4 sm:mb-0 sm:absolute sm:top-6 sm:right-6">
//           <button
//             type="button"
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#1a73e8] border border-[#dadce0] rounded-xl text-xs font-semibold transition-colors duration-150 shadow-sm"
//           >
//             <Lock className="w-3.5 h-3.5" />
//             Change Password
//           </button>
//         </div>

//         <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
//           {/* Avatar / Icon Container */}
//           <div className="w-20 h-20 bg-[#e8f0fe] text-[#1a73e8] rounded-2xl flex items-center justify-center border border-blue-100 shrink-0 shadow-inner">
//             <User className="w-10 h-10" />
//           </div>

//           {/* User Basic Info */}
//           <div className="text-center sm:text-left flex-1 space-y-1">
//             <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
//               <h1 className="text-2xl font-bold text-[#202124]">
//                 {user?.name || "Ambassador Name"}
//               </h1>
//             </div>
            
//             <p className="text-sm text-[#5f6368] flex items-center justify-center sm:justify-start gap-1.5 pt-1">
//               <Mail className="w-4 h-4 text-[#5f6368]" />
//               {user?.email || "N/A"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Grid Section for Profile Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* Personal Details Card */}
//         <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm space-y-5">
//           <div className="flex items-center gap-2.5 border-b border-[#dadce0] pb-3">
//             <div className="p-2 bg-[#f8f9fa] rounded-lg border border-[#dadce0]">
//               <User className="w-5 h-5 text-[#5f6368]" />
//             </div>
//             <h2 className="text-lg font-bold text-[#202124]">Personal Details</h2>
//           </div>

//           <div className="space-y-4">
//             {/* Contact Phone */}
//             <div className="flex items-center gap-3 p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
//               <div className="p-2 bg-white rounded-lg border border-[#dadce0] text-[#5f6368]">
//                 <Phone className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
//                   Phone Number
//                 </p>
//                 <p className="text-sm font-semibold text-[#202124]">
//                   {user?.phoneNo || "N/A"}
//                 </p>
//               </div>
//             </div>

//             {/* College */}
//             <div className="flex items-center gap-3 p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
//               <div className="p-2 bg-white rounded-lg border border-[#dadce0] text-[#5f6368]">
//                 <Building2 className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
//                   College / University
//                 </p>
//                 <p className="text-sm font-semibold text-[#202124]">
//                   {ambassador?.college || "N/A"}
//                 </p>
//               </div>
//             </div>

//             {/* City */}
//             <div className="flex items-center gap-3 p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
//               <div className="p-2 bg-white rounded-lg border border-[#dadce0] text-[#5f6368]">
//                 <MapPin className="w-4 h-4" />
//               </div>
//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368]">
//                   Location / City
//                 </p>
//                 <p className="text-sm font-semibold text-[#202124]">
//                   {ambassador?.city || "N/A"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Program Performance & Activity Card */}
//         <div className="bg-white border border-[#dadce0] rounded-2xl p-6 shadow-sm space-y-5">
//           <div className="flex items-center gap-2.5 border-b border-[#dadce0] pb-3">
//             <div className="p-2 bg-[#e8f0fe] rounded-lg">
//               <Award className="w-5 h-5 text-[#1a73e8]" />
//             </div>
//             <h2 className="text-lg font-bold text-[#202124]">Activity & Performance</h2>
//           </div>

//           <div className="flex flex-col justify-center h-[calc(100%-60px)] space-y-4">
//             {/* Tasks Completed Metric Card */}
//             <div className="p-5 bg-gradient-to-br from-[#f8f9fa] to-[#e8f0fe] rounded-xl border border-[#dadce0] flex items-center justify-between">
//               <div className="space-y-1">
//                 <p className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
//                   Total Tasks Completed
//                 </p>
//                 <p className="text-3xl font-black text-[#202124]">
//                   {ambassador?.taskCompleted ?? 0}
//                 </p>
//               </div>
//               <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 shadow-sm">
//                 <CheckCircle2 className="w-7 h-7" />
//               </div>
//             </div>

//             {/* Program Info Note */}
//             <div className="p-3.5 bg-[#f8f9fa] rounded-xl border border-[#dadce0] text-xs text-[#5f6368] leading-relaxed">
//               Keep completing your weekly assigned tasks to improve your performance.
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* Change Password Modal Popup */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//           <div className="bg-white border border-[#dadce0] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
//             {/* Header & Close Button */}
//             <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-2 bg-[#e8f0fe] text-[#1a73e8] rounded-lg">
//                   <Lock className="w-5 h-5" />
//                 </div>
//                 <h3 className="text-lg font-bold text-[#202124]">Secure Account</h3>
//               </div>
//               <button
//                 type="button"
//                 disabled={loading}
//                 onClick={handleCloseModal}
//                 className="p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Form Fields */}
//             <div className="space-y-4">
//               {/* Current Password */}
//               <div className="space-y-1">
//                 <label className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
//                   Current Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showCurrentPassword ? "text" : "password"}
//                     disabled={loading}
//                     value={currentPassword}
//                     onChange={(e) => setCurrentPassword(e.target.value)}
//                     placeholder="Enter current password"
//                     className="w-full px-3.5 py-2.5 pr-10 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm focus:outline-none focus:border-[#1a73e8] text-[#202124] disabled:opacity-60"
//                   />
//                   <button
//                     type="button"
//                     disabled={loading}
//                     onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] transition-colors disabled:opacity-50"
//                   >
//                     {showCurrentPassword ? (
//                       <EyeOff className="w-4 h-4" />
//                     ) : (
//                       <Eye className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* New Password */}
//               <div className="space-y-1">
//                 <label className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showNewPassword ? "text" : "password"}
//                     disabled={loading}
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     placeholder="Enter new password"
//                     className="w-full px-3.5 py-2.5 pr-10 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm focus:outline-none focus:border-[#1a73e8] text-[#202124] disabled:opacity-60"
//                   />
//                   <button
//                     type="button"
//                     disabled={loading}
//                     onClick={() => setShowNewPassword(!showNewPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] transition-colors disabled:opacity-50"
//                   >
//                     {showNewPassword ? (
//                       <EyeOff className="w-4 h-4" />
//                     ) : (
//                       <Eye className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm New Password */}
//               <div className="space-y-1">
//                 <label className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
//                   Confirm New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     disabled={loading}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     placeholder="Confirm new password"
//                     className="w-full px-3.5 py-2.5 pr-10 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm focus:outline-none focus:border-[#1a73e8] text-[#202124] disabled:opacity-60"
//                   />
//                   <button
//                     type="button"
//                     disabled={loading}
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] transition-colors disabled:opacity-50"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="w-4 h-4" />
//                     ) : (
//                       <Eye className="w-4 h-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Actions */}
//             <div className="flex justify-center pt-2 border-t border-[#dadce0]">
//               <button
//                 type="button"
//                 disabled={loading}
//                 onClick={handleChangePassword}
//                 className="flex items-center justify-center gap-2 min-w-[150px] px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     <span>Changing...</span>
//                   </>
//                 ) : (
//                   <span>Change Password</span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;



import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/AuthContext.jsx";
import API from "./config/api.js";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  CheckCircle2, 
  Award,
  Lock,
  X,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, ambassador } = useContext(UserContext);
  
  // Modal & Password State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    console.log(user);
    console.log(ambassador);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New Password and Confirm New Password doesn't match");
      return;
    }

    try {
      setLoading(true);
      const res = await API.put("/auth/changePassword", {
        currentPassword,
        newPassword,
      });

      const data = res.data;

      if (data.success) {
        toast.success(data.message);
        handleCloseModal();
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-[#202124]">
      {/* Header Banner */}
      <div className="bg-white border border-[#dadce0] rounded-2xl p-6 md:p-8 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#1a73e8]" />
        
        {/* Top Right Change Password Button */}
        <div className="flex justify-end mb-4 sm:mb-0 sm:absolute sm:top-6 sm:right-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#1a73e8] border border-[#dadce0] rounded-xl text-xs font-semibold transition-colors duration-150 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            Change Password
          </button>
        </div>

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
            {/* Total Tasks Submitted */}
            <div className="p-5 bg-gradient-to-br from-[#f8f9fa] to-[#e8f0fe] rounded-xl border border-[#dadce0] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                  Total Tasks Submitted
                </p>
                <p className="text-3xl font-black text-[#202124]">
                  {ambassador?.taskSubmitted ?? 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 text-[#1a73e8] rounded-xl border border-blue-200 shadow-sm">
                <Award className="w-7 h-7" />
              </div>
            </div>

            {/* Total Tasks Approved */}
            <div className="p-5 bg-gradient-to-br from-[#f8f9fa] to-[#e8f0fe] rounded-xl border border-[#dadce0] flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                  Total Tasks Approved
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

      {/* Change Password Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-[#dadce0] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header & Close Button */}
            <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#e8f0fe] text-[#1a73e8] rounded-lg">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#202124]">Secure Account</h3>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={handleCloseModal}
                className="p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    disabled={loading}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm focus:outline-none focus:border-[#1a73e8] text-[#202124] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] transition-colors disabled:opacity-50"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    disabled={loading}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm focus:outline-none focus:border-[#1a73e8] text-[#202124] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] transition-colors disabled:opacity-50"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#f8f9fa] border border-[#dadce0] rounded-xl text-sm focus:outline-none focus:border-[#1a73e8] text-[#202124] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-center pt-2 border-t border-[#dadce0]">
              <button
                type="button"
                disabled={loading}
                onClick={handleChangePassword}
                className="flex items-center justify-center gap-2 min-w-[150px] px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Changing...</span>
                  </>
                ) : (
                  <span>Change Password</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;