import { useState } from "react";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError(t("reg_invalid_email"));
      return;
    }

    // Validate phone number (10-digit Indian mobile)
    const cleanPhone = form.phone.replace(/[\s\-\+]/g, "");
    const phoneRegex = /^(\+?91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError(t("reg_invalid_phone"));
      return;
    }

    setLoading(true);

    try {
      // Get location
      let location = { lat: 0, lng: 0 };
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
          });
        });
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        localStorage.setItem("rozgarsetu_location", JSON.stringify(location));
      } catch {
        // Location denied — continue without it
      }

      const user = await register({ ...form, location });
      navigate(user.role === "employer" ? "/dashboard" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-dark-50 to-accent-50/30">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-xl shadow-accent-500/20">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900">{t("reg_title")}</h1>
          <p className="mt-2 text-dark-400">{t("reg_subtitle")}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-dark-100 p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-600 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-2">{t("reg_role")}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "worker" })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    form.role === "worker"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-dark-200 text-dark-500 hover:border-dark-300"
                  }`}
                >
                  <span className="text-2xl block mb-1">👷</span>
                  <span className="font-bold text-sm">{t("reg_worker")}</span>
                  <span className="block text-xs text-dark-400">{t("reg_worker_desc")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "employer" })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    form.role === "employer"
                      ? "border-accent-500 bg-accent-50 text-accent-700"
                      : "border-dark-200 text-dark-500 hover:border-dark-300"
                  }`}
                >
                  <span className="text-2xl block mb-1">🔍</span>
                  <span className="font-bold text-sm">{t("reg_hirer")}</span>
                  <span className="block text-xs text-dark-400">{t("reg_hirer_desc")}</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg-name" className="block text-sm font-semibold text-dark-700 mb-1.5">
                {t("reg_name")}
              </label>
              <input
                id="reg-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder={t("reg_name_placeholder")}
                className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-dark-700 mb-1.5">
                {t("reg_email")}
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder={t("reg_email_placeholder")}
                className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-sm font-semibold text-dark-700 mb-1.5">
                {t("reg_phone")}
              </label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder={t("reg_phone_placeholder")}
                className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-dark-700 mb-1.5">
                {t("reg_password")}
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder={t("reg_password_placeholder")}
                className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-lg shadow-lg shadow-accent-500/20 hover:from-accent-600 hover:to-accent-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("reg_creating")}
                </span>
              ) : (
                t("reg_btn")
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            {t("reg_has_account")}{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
              {t("reg_login_link")} →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
