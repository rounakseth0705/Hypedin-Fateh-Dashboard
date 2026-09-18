import React, { useState, useEffect } from "react";
import { Loader2, Gift, Lock, Award, AlertCircle } from "lucide-react";
import API from "./config/api.js";

export default function AmbassadorRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/ambassador/getRewards");
      if (response.data?.success) {
        setRewards(response.data.rewards || []);
      } else {
        setError(response.data?.message || "Failed to load rewards.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch rewards. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8f9fa]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a73e8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Centered Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dadce0] px-4 py-3 flex items-center justify-center shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-[#3c4043]">
          Fateh Student Ambassador <span className="text-[#1a73e8] font-bold">2026</span>
        </h2>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
        {/* Title Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#202124]">Rewards</h2>
          <p className="text-base text-[#5f6368] mt-1">
            Unlock exclusive perks, certificates, and incentives as you complete campaign goals.
          </p>
        </div>

        {/* Rewards Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5f6368]">
            <Award className="w-4 h-4 text-[#1a73e8]" />
            <span>Available Rewards & Milestones</span>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : rewards.length === 0 ? (
            <div className="bg-white border border-[#dadce0] rounded-2xl p-12 text-center text-[#5f6368] shadow-xs">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base font-semibold">No rewards available at the moment.</p>
              <p className="text-xs text-gray-400 mt-1">Check back later for upcoming milestone perks!</p>
            </div>
          ) : (
            /* Cards Grid styled like the Timeline & Phases section in image */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward, index) => (
                <div
                  key={reward._id || index}
                  className="bg-[#f8f9fa] border border-[#dadce0] hover:border-[#1a73e8] rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-xs relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      {/* Badge / Pill */}
                      <span className="inline-block text-[11px] font-bold bg-[#e8f0fe] text-[#1a73e8] px-3 py-1 rounded-full uppercase tracking-wider">
                        Reward
                      </span>
                      {/* Reward Title */}
                      <h3 className="text-base font-bold text-[#202124] pt-1 leading-snug">
                        {reward.title}
                      </h3>
                    </div>

                    {/* Lock / Gift Icon */}
                    <div className="p-2 bg-white rounded-xl border border-[#dadce0] shadow-2xs text-[#5f6368] group-hover:text-[#1a73e8] group-hover:border-[#1a73e8] transition-colors shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Reward Dependency / Requirement */}
                  {reward.dependency && (
                    <div className="mt-4 pt-3 border-t border-[#dadce0]/60">
                      <p className="text-xs text-[#5f6368] font-medium leading-relaxed">
                        <span className="font-semibold text-[#202124]">Requirement:</span> {reward.dependency}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}