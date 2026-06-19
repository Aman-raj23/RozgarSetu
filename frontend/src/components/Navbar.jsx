import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

export default function Navbar() {
  const { user, logout, setUser } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = user?.notifications?.filter(n => !n.read).length || 0;

  const handleNotificationsClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      try {
        const res = await API.put("/auth/notifications/read");
        const updatedUser = { ...user, notifications: res.data.notifications };
        setUser(updatedUser);
        sessionStorage.setItem("rozgarsetu_user", JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Failed to mark notifications read", err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "hi" : "en");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ─── Top App Bar ─── */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 shadow-sm bg-surface transition-colors">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <span className="material-symbols-outlined text-primary text-3xl icon-fill">handshake</span>
          <span className="font-semibold text-xl md:text-2xl text-primary tracking-tight">RozgarSetu</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 h-full">
          <Link
            to="/"
            className={`h-full flex items-center px-4 text-sm font-semibold transition-colors hover:bg-surface-container-high ${
              isActive("/") ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"
            }`}
          >
            {t("nav_home")}
          </Link>
          {(!user || user.role !== "employer") && (
            <Link
              to="/jobs"
              className={`h-full flex items-center px-4 text-sm font-semibold transition-colors hover:bg-surface-container-high ${
                isActive("/jobs") || location.pathname.startsWith("/jobs/")
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant"
              }`}
            >
              {t("nav_find_jobs")}
            </Link>
          )}
          <Link
            to="/workers"
            className={`h-full flex items-center px-4 text-sm font-semibold transition-colors hover:bg-surface-container-high ${
              isActive("/workers") || location.pathname.startsWith("/workers/")
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant"
            }`}
          >
            {t("nav_workers")}
          </Link>
          {user?.role === "employer" && (
            <>
              <Link
                to="/dashboard"
                className={`h-full flex items-center px-4 text-sm font-semibold transition-colors hover:bg-surface-container-high ${
                  isActive("/dashboard") ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"
                }`}
              >
                {t("nav_dashboard")}
              </Link>
              <Link
                to="/post-job"
                className={`h-full flex items-center px-4 text-sm font-semibold transition-colors hover:bg-surface-container-high ${
                  isActive("/post-job") ? "text-primary border-b-2 border-primary" : "text-on-surface-variant"
                }`}
              >
                {t("nav_post_job")}
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-outline-variant hover:bg-surface-container-high transition-colors text-sm font-semibold text-on-surface-variant"
            title="Switch language"
          >
            <span className="material-symbols-outlined text-lg">language</span>
            <span className="hidden md:inline">{lang === "en" ? "हिंदी" : "English"}</span>
            <span className="md:hidden">{lang === "en" ? "HI" : "EN"}</span>
          </button>

          {/* Notifications (Worker only) */}
          {user?.role === "worker" && (
            <div className="relative hidden md:block">
              <button
                onClick={handleNotificationsClick}
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-on-error bg-error rounded-full border-2 border-surface">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden z-50 animate-fade-in-up">
                  <div className="p-4 border-b border-outline-variant font-bold text-on-surface flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {user.notifications?.length > 0 ? (
                      [...user.notifications].reverse().map((n, i) => (
                        <div key={i} className={`p-4 border-b border-surface-container last:border-0 ${!n.read ? "bg-primary-fixed/30" : ""}`}>
                          <p className="text-sm text-on-surface">{n.message}</p>
                          <p className="text-xs text-on-surface-variant mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-on-surface-variant text-sm">No notifications yet</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-outline-variant">
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="text-on-primary-container text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-on-surface leading-tight">{user.name}</p>
                  <p className="text-xs text-on-surface-variant capitalize">{user.role === "worker" ? t("profile_worker") : t("profile_employer")}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm text-on-surface-variant hover:text-error hover:bg-error-container transition-all"
              >
                {t("nav_logout")}
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-medium transition-all text-sm"
              >
                {t("nav_login")}
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg bg-secondary-container text-on-secondary-container hover:brightness-95 font-semibold transition-all shadow-sm text-sm"
              >
                {t("nav_register")}
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </header>

      {/* ─── Mobile Menu Dropdown ─── */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full z-40 animate-slide-down bg-surface-container-lowest border-b border-outline-variant shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="w-full text-left px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base border border-outline-variant mb-2 flex items-center gap-3"
            >
              <span className="material-symbols-outlined">language</span>
              {lang === "en" ? "🇮🇳 हिंदी में देखें" : "🇬🇧 View in English"}
            </button>

            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base">
              <span className="material-symbols-outlined">home</span>
              {t("nav_home")}
            </Link>
            {(!user || user.role !== "employer") && (
              <Link to="/jobs" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base">
                <span className="material-symbols-outlined">work</span>
                {t("nav_find_jobs")}
              </Link>
            )}
            <Link to="/workers" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base">
              <span className="material-symbols-outlined">groups</span>
              {t("nav_workers")}
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base">
                  <span className="material-symbols-outlined">person</span>
                  {t("nav_profile")}
                </Link>
                {user.role === "employer" && (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base">
                      <span className="material-symbols-outlined">dashboard</span>
                      {t("nav_dashboard")}
                    </Link>
                    <Link to="/post-job" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-semibold text-base text-center mt-2 justify-center">
                      <span className="material-symbols-outlined">add</span>
                      {t("nav_post_job")}
                    </Link>
                  </>
                )}

                {user.role === "worker" && (
                  <div className="mt-2 border-t border-outline-variant pt-2">
                    <button
                      onClick={handleNotificationsClick}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base"
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined">notifications</span>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-error text-on-error text-xs px-2 py-1 rounded-full font-bold">{unreadCount}</span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="px-4 py-2 max-h-60 overflow-y-auto bg-surface-container-low rounded-lg mx-2 my-2">
                        {user.notifications?.length > 0 ? (
                          [...user.notifications].reverse().map((n, i) => (
                            <div key={i} className="py-2 border-b border-outline-variant last:border-0">
                              <p className="text-sm text-on-surface">{n.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-on-surface-variant text-sm text-center">No notifications</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 mt-2 border-t border-outline-variant">
                  <p className="px-4 text-sm text-on-surface-variant">{t("nav_logged_in_as")} <span className="font-semibold text-on-surface">{user.name}</span></p>
                  <button onClick={handleLogout} className="w-full mt-2 px-4 py-3 rounded-lg text-error hover:bg-error-container font-medium text-base text-left flex items-center gap-3">
                    <span className="material-symbols-outlined">logout</span>
                    {t("nav_logout")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container-high font-medium text-base">
                  <span className="material-symbols-outlined">login</span>
                  {t("nav_login")}
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-semibold text-base text-center mt-2 justify-center">
                  <span className="material-symbols-outlined">person_add</span>
                  {t("nav_register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
