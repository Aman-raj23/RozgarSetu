import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === "employer" ? "/dashboard" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Welcome to RozgarSetu</h1>
          <p className="text-lg opacity-90">Connecting local talent with trusted employers across Bharat. Simple, secure, and built for you.</p>
        </div>
      </section>

      {/* ─── Form Section ─── */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-surface-container-lowest">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-6 md:p-8 border border-surface-container-high animate-fade-in-up">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-surface-container-highest mb-8">
            <div className="flex-1 py-3 text-center font-label-lg font-bold text-primary border-b-2 border-primary transition-colors cursor-default">
              Login
            </div>
            <Link to="/register" className="flex-1 py-3 text-center font-label-lg text-on-surface-variant hover:text-primary border-b-2 border-transparent transition-colors">
              Register
            </Link>
          </div>

          <h2 className="font-headline-sm font-bold text-primary mb-4">{t("login_title")}</h2>
          <p className="font-body-md text-on-surface-variant mb-6">{t("login_subtitle")}</p>
          
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-error-container border border-error/20 text-error text-sm font-medium animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block font-label-sm text-on-surface-variant mb-1">
                {t("login_email")}
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">mail</span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder={t("login_email_placeholder")}
                  className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="font-label-sm text-on-surface-variant">
                  {t("login_password")}
                </label>
                <Link
                  to="/forgot-password"
                  className="font-label-sm text-primary font-semibold hover:underline transition-colors"
                >
                  {t("login_forgot_password")}
                </Link>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-lg">lock</span>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder={t("login_password_placeholder")}
                  className="w-full h-12 pl-10 pr-4 bg-surface rounded-lg border border-outline-variant focus-ring font-body-md text-on-surface"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-secondary hover:brightness-95 text-on-secondary font-label-lg rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("login_logging_in")}
                </>
              ) : (
                <>
                  {t("login_btn")}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
