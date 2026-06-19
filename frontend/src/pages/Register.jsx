import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      const user = await register({ ...form, location: userLocation });
      navigate(user.role === "employer" ? "/dashboard" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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

          <h2 className="font-headline-sm font-bold text-primary mb-4">{t("reg_title")}</h2>
          <p className="font-body-md text-on-surface-variant mb-6">{t("reg_subtitle")}</p>
          
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-error-container border border-error/20 text-error text-sm font-medium animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection (Segmented Control) */}
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
                  {t("reg_creating")}
                </>
              ) : (
                <>
                  Complete Registration
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
