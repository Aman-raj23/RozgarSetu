import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-dark-50 to-primary-50/30">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900">{t("login_title")}</h1>
          <p className="mt-2 text-dark-400">{t("login_subtitle")}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-dark-100 p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-600 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-dark-700 mb-1.5">
                {t("login_email")}
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder={t("login_email_placeholder")}
                className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-dark-700 mb-1.5">
                {t("login_password")}
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder={t("login_password_placeholder")}
                className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg shadow-lg shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("login_logging_in")}
                </span>
              ) : (
                t("login_btn")
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            {t("login_no_account")}{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
              {t("login_register_link")} →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
