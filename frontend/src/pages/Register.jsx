import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "worker",
  });
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP verification
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { sendOtp, register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // OTP expiry timer (10 minutes)
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // Resend cooldown timer (30 seconds)
  useEffect(() => {
    if (resendCooldown > 0) {
      const interval = setInterval(() => setResendCooldown((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError(t("reg_invalid_email"));
      return;
    }

    const cleanPhone = form.phone.replace(/[\s\-\+]/g, "");
    const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError(t("reg_invalid_phone"));
      return;
    }

    setLoading(true);
    try {
      await sendOtp(form);
      setStep(2);
      setTimer(600); // 10 minutes
      setResendCooldown(30); // 30 second cooldown
      setSuccess("OTP sent to " + form.email + "! Check your inbox.");
      // Focus first OTP input after transition
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await sendOtp(form);
      setOtp(["", "", "", "", "", ""]);
      setTimer(600);
      setResendCooldown(30);
      setSuccess("New OTP sent! Check your email.");
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (timer <= 0) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      let userLocation = { lat: 0, lng: 0 };
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
          });
        });
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        localStorage.setItem("rozgarsetu_location", JSON.stringify(userLocation));
      } catch {
        // Location denied — continue without it
      }

      const user = await register({ ...form, location: userLocation, otp: otpString });
      navigate(user.role === "employer" ? "/dashboard" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-surface">
      {/* ─── Image/Branding Section (Hidden on Mobile) ─── */}
      <section className="hidden md:flex md:w-1/2 bg-primary-container relative overflow-hidden items-center justify-center p-xl">
        <img 
          alt="Rural Market" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgeTGKvpIqLzOzdRoQMpZEMO7cjk9bOJKPIFB7AEmtmMKqWgS2kDycsMLFdpoNAnqjba68mudfuvcp3A0JsrT6CHE4lJKK3Ezx9GoVjGQI_Xht4BFLAoxW31rBNCVvCgimF0ChC0fSkDcRI6bbXJEY6lDlHKc2MERiZk91sxuz8A4JsVUcPbAVDlvUZZxiLZAUgwTsa0pOK_WlA9afrWMvv22RKzff_QyyUeThZTFHyi6Xv62HK10Uu3qbMgqC1fKbqMi2mdwDR5Ir"
        />
        <div className="relative z-10 text-center text-on-primary max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Welcome to RozgarSetu</h1>
          <p className="text-lg opacity-90">Connecting local talent with trusted employers across Bharat. Simple, secure, and built for you.</p>
        </div>
      </section>

      {/* ─── Form Section ─── */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-surface-container-lowest overflow-y-auto">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 md:p-8 border border-surface-container-high animate-fade-in-up my-auto">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-surface-container-highest mb-8">
            <Link to="/login" className="flex-1 py-3 text-center font-label-lg text-on-surface-variant hover:text-primary border-b-2 border-transparent transition-colors">
              Login
            </Link>
            <div className="flex-1 py-3 text-center font-label-lg font-bold text-primary border-b-2 border-primary transition-colors cursor-default">
              Register
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 1 ? "bg-primary text-on-primary" : "bg-primary/10 text-primary"}`}>
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                {step > 1 ? "✓" : "1"}
              </span>
              Details
            </div>
            <div className={`w-8 h-0.5 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-surface-container-highest"}`} />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${step === 2 ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">2</span>
              Verify Email
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container border border-error/20 text-error text-sm font-medium animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {success}
            </div>
          )}

          {/* ═══════════ STEP 1: Registration Form ═══════════ */}
          {step === 1 && (
            <>
              <h2 className="font-headline-sm font-bold text-primary mb-2">{t("reg_title")}</h2>
              <p className="font-body-md text-on-surface-variant mb-6">{t("reg_subtitle")}</p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                
                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block font-label-sm text-on-surface-variant mb-2">{t("reg_role")}</label>
                  <div className="flex bg-surface-container-low rounded-lg p-1 border border-surface-container-high">
                    <label className="flex-1 cursor-pointer relative">
                      <input
                        type="radio"
                        name="role"
                        value="worker"
                        checked={form.role === "worker"}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="h-12 flex items-center justify-center gap-2 rounded-md peer-checked:bg-primary peer-checked:text-on-primary text-on-surface-variant font-label-lg transition-all peer-checked:shadow-sm">
                        <span className="material-symbols-outlined text-xl">handyman</span>
                        {t("reg_worker")}
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer relative">
                      <input
                        type="radio"
                        name="role"
                        value="employer"
                        checked={form.role === "employer"}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="h-12 flex items-center justify-center gap-2 rounded-md peer-checked:bg-primary peer-checked:text-on-primary text-on-surface-variant font-label-lg transition-all peer-checked:shadow-sm">
                        <span className="material-symbols-outlined text-xl">storefront</span>
                        {t("reg_hirer")}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="reg-name" className="block font-label-sm text-on-surface-variant mb-1">
                    {t("reg_name")}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">person</span>
                    <input
                      id="reg-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder={t("reg_name_placeholder")}
                      className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className="block font-label-sm text-on-surface-variant mb-1">
                    {t("reg_email")}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">mail</span>
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder={t("reg_email_placeholder")}
                      className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="reg-phone" className="block font-label-sm text-on-surface-variant mb-1">
                    {t("reg_phone")}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-body-md text-on-surface-variant">+91</span>
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder={t("reg_phone_placeholder")}
                      className="w-full h-12 pl-12 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block font-label-sm text-on-surface-variant mb-1">
                    {t("reg_password")}
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">lock</span>
                    <input
                      id="reg-password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder={t("reg_password_placeholder")}
                      className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-secondary hover:brightness-95 text-on-secondary font-label-lg rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <span className="material-symbols-outlined text-sm">send</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ═══════════ STEP 2: OTP Verification ═══════════ */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">mark_email_read</span>
                </div>
                <h2 className="font-headline-sm font-bold text-on-surface mb-2">Verify Your Email</h2>
                <p className="font-body-md text-on-surface-variant">
                  We've sent a 6-digit code to<br />
                  <strong className="text-on-surface">{form.email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onFocus={(e) => e.target.select()}
                      className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 bg-surface text-on-surface ${
                        digit
                          ? "border-primary shadow-[0_0_0_3px_rgba(238,122,20,0.15)]"
                          : "border-outline-variant focus:border-primary"
                      }`}
                      style={{ caretColor: "#ee7a14" }}
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-base text-on-surface-variant">timer</span>
                  {timer > 0 ? (
                    <span className={`font-semibold ${timer <= 60 ? "text-error" : "text-on-surface-variant"}`}>
                      Code expires in {formatTimer(timer)}
                    </span>
                  ) : (
                    <span className="text-error font-semibold">OTP expired</span>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6 || timer <= 0}
                  className="w-full h-12 bg-secondary hover:brightness-95 text-on-secondary font-label-lg rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Create Account
                      <span className="material-symbols-outlined text-sm">verified</span>
                    </>
                  )}
                </button>

                {/* Resend & Back */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); setSuccess(""); }}
                    className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="text-primary hover:underline font-semibold disabled:text-on-surface-variant disabled:no-underline disabled:cursor-not-allowed transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
