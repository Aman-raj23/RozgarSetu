import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await API.put("/auth/profile", { name, phone });
      // Update localStorage with new user data
      const updatedUser = res.data.user;
      sessionStorage.setItem("rozgarsetu_user", JSON.stringify(updatedUser));
      // Force page reload to reflect changes in AuthContext
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setEditing(false);
    setError("");
    setMessage("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-dark-500">{t("nav_login")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-900">
          {t("profile_title")}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-dark-100 overflow-hidden">
        {/* Top gradient */}
        <div className="h-2 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500" />

        {/* Avatar section */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-dark-900">{user.name}</h2>
          <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 capitalize">
            {user.role === "worker" ? t("profile_worker") : t("profile_employer")}
          </span>
        </div>

        {/* Info / Edit form */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Success/Error messages */}
          {message && (
            <div className="p-3 rounded-xl bg-accent-50 border border-accent-200 text-accent-700 text-sm font-medium animate-fade-in">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-600 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_name")}
            </label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            ) : (
              <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
                {user.name}
              </p>
            )}
          </div>

          {/* Email (read only) */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_email")}
            </label>
            <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
              {user.email}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_phone")}
            </label>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            ) : (
              <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
                {user.phone}
              </p>
            )}
          </div>

          {/* Role (read only) */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_role")}
            </label>
            <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium capitalize">
              {user.role === "worker" ? t("profile_worker") : t("profile_employer")}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-dark-100 space-y-3">
            {editing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-base shadow-lg shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {saving ? t("profile_saving") : t("profile_save")}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3.5 rounded-xl bg-dark-100 text-dark-700 font-bold text-base hover:bg-dark-200 active:scale-[0.98] transition-all"
                >
                  {t("profile_cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-base shadow-lg shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all"
              >
                {t("profile_edit")}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-danger-600 font-bold text-base hover:bg-red-50 hover:border-danger-500/30 active:scale-[0.98] transition-all"
            >
              {t("profile_logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
