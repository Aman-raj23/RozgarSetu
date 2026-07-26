import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Handle Requesting Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setSuccess(res.data.message || t("forgot_subtitle"));
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resetting Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/reset-password", {
        email,
        otp: otp.trim(),
        newPassword,
      });
      setSuccess(res.data.message || t("reset_success"));
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please check your OTP.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">RozgarSetu</h1>
          <p className="text-lg opacity-90">
            Account Security & Recovery. We help you stay connected with nearby opportunities effortlessly.
          </p>
        </div>
      </section>

      {/* ─── Form Section ─── */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-surface-container-lowest">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 md:p-8 border border-surface-container-high animate-fade-in-up">
          
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-label-md font-semibold text-primary hover:underline mb-6 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {t("forgot_back_to_login")}
          </Link>

          <h2 className="font-headline-sm font-bold text-primary mb-2">
            {step === 1 ? t("forgot_title") : t("reset_title")}
          </h2>
          <p className="font-body-md text-on-surface-variant mb-6">
            {step === 1 ? (
              t("forgot_subtitle")
            ) : (
              <>
                {t("reset_subtitle")} <strong className="text-primary">{email}</strong>
              </>
            )}
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-error-container border border-error/20 text-error text-sm font-medium animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-sm icon-fill">error</span>
              {error}
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-6 p-3 rounded-xl bg-tertiary-container border border-tertiary/20 text-on-tertiary-container text-sm font-medium animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-sm icon-fill">check_circle</span>
              {success}
            </div>
          )}

          {/* STEP 1: Enter Email to Send OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block font-label-sm text-on-surface-variant mb-1">
                  {t("login_email")}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">mail</span>
                  <input
                    id="forgot-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("login_email_placeholder")}
                    className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:brightness-95 text-on-primary font-label-lg rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("forgot_sending")}
                  </>
                ) : (
                  <>
                    {t("forgot_send_btn")}
                    <span className="material-symbols-outlined text-sm">send</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter OTP & New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP Field */}
              <div>
                <label htmlFor="reset-otp" className="block font-label-sm text-on-surface-variant mb-1">
                  {t("reset_otp_label")}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">pin</span>
                  <input
                    id="reset-otp"
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface tracking-widest font-mono text-lg"
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="reset-new-password" className="block font-label-sm text-on-surface-variant mb-1">
                  {t("reset_new_password_label")}
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">lock</span>
                  <input
                    id="reset-new-password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder={t("reset_new_password_placeholder")}
                    className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setSuccess("");
                  }}
                  className="flex-1 h-12 bg-surface-container border border-outline-variant text-on-surface font-label-md rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  Change Email
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-secondary hover:brightness-95 text-on-secondary font-label-lg rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      {t("reset_btn")}
                      <span className="material-symbols-outlined text-sm">key</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </section>
    </div>
  );
}
