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

  const unreadCount = user?.notifications?.filter((n) => !n.read).length || 0;

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

  const isLinkActive = (path, startsWith) => {
    if (path === "/") return location.pathname === "/";
    if (startsWith) return location.pathname.startsWith(startsWith);
    return location.pathname === path;
  };

  return (
    <>
      {/* ─── Top App Bar ─── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 shadow-xs transition-all duration-300">
        <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/logo.png"
              alt="RozgarSetu Logo"
              className="w-10 h-10 object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-extrabold text-xl md:text-2xl text-primary tracking-tight leading-none">
              Rozgar<span className="text-secondary">Setu</span>
            </span>
          </Link>

          {/* Desktop Nav Links — centered */}
          <nav className="hidden md:flex items-center gap-2 h-full py-2">
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
                isLinkActive("/")
                  ? "bg-primary-fixed/60 text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isLinkActive("/") ? "icon-fill text-primary" : "text-on-surface-variant"
                }`}
              >
                home
              </span>
              <span>{t("nav_home")}</span>
            </Link>

            {/* Find Jobs */}
            {(!user || user.role !== "employer") && (
              <Link
                to="/jobs"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
                  isLinkActive("/jobs", "/jobs")
                    ? "bg-primary-fixed/60 text-primary font-bold"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl ${
                    isLinkActive("/jobs", "/jobs") ? "icon-fill text-primary" : "text-on-surface-variant"
                  }`}
                >
                  work
                </span>
                <span>{t("nav_find_jobs")}</span>
              </Link>
            )}

            {/* Find Workers */}
            <Link
              to="/workers"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
                isLinkActive("/workers", "/workers")
                  ? "bg-primary-fixed/60 text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isLinkActive("/workers", "/workers") ? "icon-fill text-primary" : "text-on-surface-variant"
                }`}
              >
                groups
              </span>
              <span>{t("nav_workers")}</span>
            </Link>

            {/* Help Center */}
            <Link
              to="/help"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
                isLinkActive("/help", "/help")
                  ? "bg-primary-fixed/60 text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isLinkActive("/help", "/help") ? "icon-fill text-primary" : "text-on-surface-variant"
                }`}
              >
                help
              </span>
              <span>{t("nav_help_center")}</span>
            </Link>

            {/* Employer Specific Links */}
            {user?.role === "employer" && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
                    isLinkActive("/dashboard")
                      ? "bg-primary-fixed/60 text-primary font-bold"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isLinkActive("/dashboard") ? "icon-fill text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    dashboard
                  </span>
                  <span>{t("nav_dashboard")}</span>
                </Link>

                <Link
                  to="/post-job"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none ${
                    isLinkActive("/post-job")
                      ? "bg-secondary text-on-secondary"
                      : "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">add_circle</span>
                  <span>{t("nav_post_job")}</span>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-all text-xs md:text-sm font-semibold text-on-surface-variant hover:text-primary active:scale-95 focus:outline-none"
              title="Switch language / भाषा बदलें"
            >
              <span className="material-symbols-outlined text-lg text-primary">translate</span>
              <span className="hidden lg:inline">{lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}</span>
              <span className="lg:hidden uppercase font-bold text-xs">{lang === "en" ? "HI" : "EN"}</span>
            </button>

            {/* Notifications (Worker only) */}
            {user?.role === "worker" && (
              <div className="relative hidden md:block">
                <button
                  onClick={handleNotificationsClick}
                  className="p-2.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all relative active:scale-95 focus:outline-none"
                  title="Notifications"
                >
                  <span className={`material-symbols-outlined text-2xl ${unreadCount > 0 ? "text-primary" : ""}`}>
                    notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center text-[10px] font-black text-on-error bg-error rounded-full ring-2 ring-surface shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-84 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 overflow-hidden z-50 animate-fade-in-up">
                    <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low/50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">notifications_active</span>
                        <span className="font-bold text-on-surface text-sm">Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-bold">
                          {unreadCount} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-surface-container">
                      {user.notifications?.length > 0 ? (
                        [...user.notifications].reverse().map((n, i) => (
                          <div
                            key={i}
                            className={`p-4 transition-colors hover:bg-surface-container-low ${
                              !n.read ? "bg-primary-fixed/25 font-medium" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
                              <div className="flex-1">
                                <p className="text-xs text-on-surface leading-relaxed">{n.message}</p>
                                <p className="text-[10px] text-on-surface-variant mt-1 font-medium">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-on-surface-variant text-sm flex flex-col items-center gap-2">
                          <span className="material-symbols-outlined text-3xl opacity-40">notifications_off</span>
                          <span>No notifications yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-2.5 ml-1 pl-3 border-l border-outline-variant/30">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-surface-container-high/60 transition-all focus:outline-none ${
                    isLinkActive("/profile") ? "bg-surface-container-high font-bold" : ""
                  }`}
                  title="View Profile"
                >
                  <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center font-bold text-sm border border-surface">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-on-surface leading-tight truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium capitalize flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {user.role === "worker" ? t("profile_worker") : t("profile_employer")}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-all focus:outline-none"
                  title={t("nav_logout")}
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span className="hidden xl:inline">{t("nav_logout")}</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-1">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high/70 font-semibold transition-all text-xs md:text-sm focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">login</span>
                  <span>{t("nav_login")}</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold transition-all text-xs md:text-sm active:scale-95 focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  <span>{t("nav_register")}</span>
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all active:scale-95 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu Dropdown ─── */}
      {mobileOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full z-40 animate-slide-down bg-surface/95 backdrop-blur-xl border-b border-outline-variant/40 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="w-full text-left px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high font-semibold text-sm flex items-center justify-between transition-all focus:outline-none"
            >
              <span className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined text-xl">translate</span>
                <span>Language / भाषा</span>
              </span>
              <span className="text-xs bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-bold">
                {lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
              </span>
            </button>

            <div className="h-px bg-outline-variant/30 my-2"></div>

            {/* Links */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none ${
                isLinkActive("/")
                  ? "bg-primary-fixed/60 text-primary font-bold"
                  : "text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isLinkActive("/") ? "icon-fill" : ""}`}>
                home
              </span>
              <span>{t("nav_home")}</span>
            </Link>

            {(!user || user.role !== "employer") && (
              <Link
                to="/jobs"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none ${
                  isLinkActive("/jobs", "/jobs")
                    ? "bg-primary-fixed/60 text-primary font-bold"
                    : "text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isLinkActive("/jobs", "/jobs") ? "icon-fill" : ""}`}>
                  work
                </span>
                <span>{t("nav_find_jobs")}</span>
              </Link>
            )}

            <Link
              to="/workers"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none ${
                isLinkActive("/workers", "/workers")
                  ? "bg-primary-fixed/60 text-primary font-bold"
                  : "text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isLinkActive("/workers", "/workers") ? "icon-fill" : ""}`}>
                groups
              </span>
              <span>{t("nav_workers")}</span>
            </Link>

            <Link
              to="/help"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none ${
                isLinkActive("/help", "/help")
                  ? "bg-primary-fixed/60 text-primary font-bold"
                  : "text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isLinkActive("/help", "/help") ? "icon-fill" : ""}`}>
                help
              </span>
              <span>{t("nav_help_center")}</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none ${
                    isLinkActive("/profile")
                      ? "bg-primary-fixed/60 text-primary font-bold"
                      : "text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${isLinkActive("/profile") ? "icon-fill" : ""}`}>
                    account_circle
                  </span>
                  <span>{t("nav_profile")}</span>
                </Link>

                {user.role === "employer" && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all focus:outline-none ${
                        isLinkActive("/dashboard")
                          ? "bg-primary-fixed/60 text-primary font-bold"
                          : "text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      <span className={`material-symbols-outlined text-xl ${isLinkActive("/dashboard") ? "icon-fill" : ""}`}>
                        dashboard
                      </span>
                      <span>{t("nav_dashboard")}</span>
                    </Link>

                    <Link
                      to="/post-job"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary text-on-secondary font-bold text-sm text-center mt-2 justify-center focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-xl">add_circle</span>
                      <span>{t("nav_post_job")}</span>
                    </Link>
                  </>
                )}

                {user.role === "worker" && (
                  <div className="mt-2 border-t border-outline-variant/30 pt-2">
                    <button
                      onClick={handleNotificationsClick}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-on-surface hover:bg-surface-container-high font-semibold text-sm focus:outline-none"
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="material-symbols-outlined text-xl text-primary">notifications</span>
                        <span>Notifications</span>
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-error text-on-error text-xs px-2.5 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="px-4 py-3 max-h-60 overflow-y-auto bg-surface-container-low rounded-xl mx-2 my-2 border border-outline-variant/20">
                        {user.notifications?.length > 0 ? (
                          [...user.notifications].reverse().map((n, i) => (
                            <div key={i} className="py-2.5 border-b border-outline-variant/20 last:border-0">
                              <p className="text-xs text-on-surface leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-on-surface-variant mt-1 font-medium">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="py-3 text-on-surface-variant text-xs text-center">No notifications</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-3 mt-3 border-t border-outline-variant/30">
                  <div className="px-4 py-2 bg-surface-container-low rounded-xl flex items-center justify-between mb-2">
                    <span className="text-xs text-on-surface-variant">{t("nav_logged_in_as")}</span>
                    <span className="font-bold text-xs text-primary truncate max-w-[150px]">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-xl text-error hover:bg-error-container/40 font-semibold text-sm text-left flex items-center gap-3.5 transition-all focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    <span>{t("nav_logout")}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface hover:bg-surface-container-high font-semibold text-sm focus:outline-none"
                >
                  <span className="material-symbols-outlined text-xl text-primary">login</span>
                  <span>{t("nav_login")}</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm text-center justify-center focus:outline-none"
                >
                  <span className="material-symbols-outlined text-xl">person_add</span>
                  <span>{t("nav_register")}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
