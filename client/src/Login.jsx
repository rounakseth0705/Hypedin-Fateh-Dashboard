import { useContext, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import API from "./config/api.js";
import Fateh from "./assets/fateh.jpeg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/AuthContext.jsx";

/**
 * Fateh Student Ambassador — Login
 * -----------------------------------------------
 * Styled to match GSAPDashboardReplica: #f0f4f9 page background, white
 * rounded-2xl bordered cards, #1a73e8 blue accent, #5f6368 / #202124 text.
 */

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      // const response = await API.post("/auth/login", {
      //   email,
      //   password,
      // },{ withCredentials: true });

      // // Handle successful login (e.g., save token, redirect, etc.)
      // if (response.data.user.role === "Ambassador") {
      //   navigate("/ambassador");
      // } else if (response.data.user.role === "Admin") {
      //   navigate("/adminDashboard");
      // }

      await login(email,password);
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-[#1f1f1f] font-sans flex flex-col items-center px-4 py-12">
      {/* Brand header */}
      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <a href="https://www.fateheducation.com/" rel="noopener" target="_blank">
          <img src={Fateh} className="h-30 w-fit" alt="Fateh Logo" />
        </a>
        <span className="font-semibold text-sm text-[#5f6368] flex items-center gap-1.5">
          Fateh Campus Ambassador <span className="text-[#1a73e8] font-bold">2026</span>
        </span>
      </div>

      <div className="w-full max-w-sm bg-[#f0f4f9] rounded-2xl border border-[#dadce0] shadow-xs p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-[#202124]">Welcome back</h1>
          <p className="text-xs text-[#5f6368] mt-1">Sign in to access your ambassador dashboard.</p>
        </div>

        {formError && (
          <div className="mb-5 flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Form fields fieldset disabled during submit */}
          <fieldset disabled={submitting} className="space-y-5 disabled:opacity-60">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#5f6368] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6368]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                  }}
                  className={`w-full bg-white rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#202124] placeholder:text-[#9aa0a6] outline-none border transition-shadow ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-transparent focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#5f6368]">
                  Password
                </label>
                {/* <a href="#" className="text-xs font-semibold text-[#1a73e8] hover:underline underline-offset-2">
                  Forgot password?
                </a> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6368]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((er) => ({ ...er, password: undefined }));
                  }}
                  className={`w-full bg-white rounded-lg pl-9 pr-10 py-2.5 text-sm text-[#202124] placeholder:text-[#9aa0a6] outline-none border transition-shadow ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-transparent focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-xs text-[#5f6368] font-medium select-none cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#dadce0] text-[#1a73e8] focus:ring-[#1a73e8]/30"
              />
              Keep me signed in
            </label>
          </fieldset>

          {/* Submit Button with Loading Indicator */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1765cc] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Signing in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}