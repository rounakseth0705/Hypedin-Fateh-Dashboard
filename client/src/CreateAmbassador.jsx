// import React, { useState, useEffect } from "react";
// import API from "./config/api";

// const CITIES = [
//   "Bengaluru",
//   "Delhi NCR",
//   "Chennai",
//   "Mumbai",
//   "Hyderabad",
// ];

// const CreateAmbassador = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phoneNo: "",
//     city: "Bengaluru",
//     college: "",
//     POCPhoneNo: "",
//   });

//   const [pocList, setPocList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [responseMsg, setResponseMsg] = useState({ type: "", text: "" });

//   useEffect(() => {
//     const fetchPOCs = async () => {
//       try {
//         const response = await API.get("/admin/getPOCs");
//         const { success, POCs } = response.data;

//         if (success && Array.isArray(POCs)) {
//           setPocList(POCs);
//           if (POCs.length > 0) {
//             setFormData((prev) => ({
//               ...prev,
//               POCPhoneNo: POCs[0].phoneNo || POCs[0].POCPhoneNo || "",
//             }));
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch POCs:", error);
//       }
//     };

//     fetchPOCs();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Restrict phone fields to digits only and max 10 characters
//     if (name === "phoneNo" || name === "POCPhoneNo") {
//       const cleanValue = value.replace(/\D/g, "");
//       if (cleanValue.length > 10) return;
//       setFormData((prev) => ({ ...prev, [name]: cleanValue }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation for exactly 10 digits
//     if (formData.phoneNo.length !== 10) {
//       setResponseMsg({
//         type: "error",
//         text: "Phone Number must be exactly 10 digits.",
//       });
//       return;
//     }

//     if (formData.POCPhoneNo.length !== 10) {
//       setResponseMsg({
//         type: "error",
//         text: "POC Phone Number must be exactly 10 digits.",
//       });
//       return;
//     }

//     setLoading(true);
//     setResponseMsg({ type: "", text: "" });

//     try {
//       const response = await API.post("/admin/createAmbassador", formData);
//       const { success, message } = response.data;

//       if (success) {
//         setResponseMsg({
//           type: "success",
//           text: message || "Ambassador created successfully!",
//         });
//         // Reset form
//         setFormData({
//           name: "",
//           email: "",
//           phoneNo: "",
//           city: "Bengaluru",
//           college: "",
//           POCPhoneNo: pocList.length > 0 ? (pocList[0].phoneNo || pocList[0].POCPhoneNo || "") : "",
//         });
//       } else {
//         setResponseMsg({
//           type: "error",
//           text: message || "Failed to create ambassador.",
//         });
//       }
//     } catch (error) {
//       setResponseMsg({
//         type: "error",
//         text:
//           error.response?.data?.message ||
//           "Something went wrong while connecting to server.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f6f9] flex justify-center pt-8 sm:pt-12 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
//       <div className="w-full max-w-2xl">
//         {/* Header Banner */}
//         <div className="mb-6 text-center sm:text-left">
//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
//             Create Ambassador
//           </h1>
//           <p className="text-sm text-slate-500">
//             Add a new campus ambassador to the portal and assign program parameters.
//           </p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 w-full">
//           {/* Alert Box */}
//           {responseMsg.text && (
//             <div
//               className={`p-3 sm:p-4 rounded-lg text-sm font-medium mb-6 border ${
//                 responseMsg.type === "success"
//                   ? "bg-emerald-50 text-emerald-800 border-emerald-200"
//                   : "bg-red-50 text-red-800 border-red-200"
//               }`}
//             >
//               {responseMsg.text}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
//               {/* Full Name */}
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Enter full name"
//                   required
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               {/* Email */}
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="example@domain.com"
//                   required
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               {/* Phone Number */}
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   name="phoneNo"
//                   value={formData.phoneNo}
//                   onChange={handleChange}
//                   placeholder="10-digit phone number"
//                   maxLength={10}
//                   required
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               {/* City Dropdown */}
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700">
//                   City <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
//                 >
//                   {CITIES.map((c) => (
//                     <option key={c} value={c}>
//                       {c}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* College */}
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700">
//                   College Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="college"
//                   value={formData.college}
//                   onChange={handleChange}
//                   placeholder="Enter college name"
//                   required
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//               </div>

//               {/* POC Phone Number Dropdown */}
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-xs font-semibold text-slate-700">
//                   POC Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="POCPhoneNo"
//                   value={formData.POCPhoneNo}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
//                 >
//                   {pocList.length === 0 ? (
//                     <option value="">No POCs available</option>
//                   ) : (
//                     pocList.map((poc, idx) => {
//                       const phone = poc.phoneNo || poc.POCPhoneNo || "";
//                       return (
//                         <option key={poc._id || poc.id || idx} value={phone}>
//                           {phone} {poc.name ? `(${poc.name})` : ""}
//                         </option>
//                       );
//                     })
//                   )}
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end pt-2">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-6 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
//               >
//                 {loading ? "Creating..." : "Create Ambassador"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAmbassador;



import React, { useState, useEffect } from "react";
import API from "./config/api";
import toast from "react-hot-toast";

const CITIES = [
  "Bengaluru",
  "Delhi NCR",
  "Chennai",
  "Mumbai",
  "Hyderabad",
];

const CreateAmbassador = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    city: "Bengaluru",
    college: "",
    POCPhoneNo: "",
  });

  const [pocList, setPocList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPOCs = async () => {
      try {
        const response = await API.get("/admin/getPOCs");
        const { success, POCs } = response.data;

        if (success && Array.isArray(POCs)) {
          setPocList(POCs);
          if (POCs.length > 0) {
            setFormData((prev) => ({
              ...prev,
              POCPhoneNo: POCs[0].phoneNo || POCs[0].POCPhoneNo || "",
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch POCs:", error);
      }
    };

    fetchPOCs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict phone fields to digits only and max 10 characters
    if (name === "phoneNo" || name === "POCPhoneNo") {
      const cleanValue = value.replace(/\D/g, "");
      if (cleanValue.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for exactly 10 digits
    if (formData.phoneNo.length !== 10) {
      toast.error("Phone Number must be exactly 10 digits.");
      return;
    }

    if (formData.POCPhoneNo.length !== 10) {
      toast.error("POC Phone Number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/admin/createAmbassador", formData);
      const { success, message } = response.data;

      if (success) {
        toast.success(message || "Ambassador created successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phoneNo: "",
          city: "Bengaluru",
          college: "",
          POCPhoneNo: pocList.length > 0 ? (pocList[0].phoneNo || pocList[0].POCPhoneNo || "") : "",
        });
      } else {
        toast.error(message || "Failed to create ambassador.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while connecting to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex justify-center pt-8 sm:pt-12 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="w-full max-w-2xl">
        {/* Header Banner */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Create Ambassador
          </h1>
          <p className="text-sm text-slate-500">
            Add a new campus ambassador to the portal and assign program parameters.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* City Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* College */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* POC Phone Number Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  POC Phone Number <span className="text-red-500">*</span>
                </label>
                <select
                  name="POCPhoneNo"
                  value={formData.POCPhoneNo}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
                >
                  {pocList.length === 0 ? (
                    <option value="">No POCs available</option>
                  ) : (
                    pocList.map((poc, idx) => {
                      const phone = poc.phoneNo || poc.POCPhoneNo || "";
                      return (
                        <option key={poc._id || poc.id || idx} value={phone}>
                          {phone} {poc.name ? `(${poc.name})` : ""}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-6 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Creating..." : "Create Ambassador"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAmbassador;