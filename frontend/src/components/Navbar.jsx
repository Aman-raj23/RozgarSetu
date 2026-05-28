import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

export default function Navbar() {
  const { user, logout, setUser } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
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

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <span className="text-xl font-bold text-dark-900 tracking-tight">Rozgar</span>
              <span className="text-xl font-bold text-primary-600 tracking-tight">Setu</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-dark-200 text-dark-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 transition-all"
              title="Switch language"
            >
              {lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
            </button>

            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-dark-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
            >
              {t("nav_home")}
            </Link>
            {(!user || user.role !== "employer") && (
              <Link
                to="/jobs"
                className="px-4 py-2 rounded-lg text-dark-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
              >
                {t("nav_find_jobs")}
              </Link>
            )}

            {user ? (
              <>
                {user.role === "employer" && (
                  <>
                    <Link
                      to="/workers"
                      className="px-4 py-2 rounded-lg text-dark-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
                    >
                      {t("nav_workers")}
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-lg text-dark-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
                    >
                      {t("nav_dashboard")}
                    </Link>
                    <Link
                      to="/post-job"
                      className="px-4 py-2 rounded-lg bg-accent-500 text-white hover:bg-accent-600 font-medium transition-all shadow-sm"
                    >
                      {t("nav_post_job")}
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-dark-200">
                  {user.role === "worker" && (
                    <div className="relative">
                      <button 
                        onClick={handleNotificationsClick}
                        className="p-2 rounded-full text-dark-500 hover:bg-dark-50 hover:text-primary-600 transition-colors relative"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-danger-500 rounded-full border-2 border-white">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      
                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-dark-100 overflow-hidden z-50 animate-fade-in-up">
                          <div className="p-4 border-b border-dark-100 font-bold text-dark-900 flex justify-between items-center">
                            <span>Notifications</span>
                            {unreadCount > 0 && <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full">{unreadCount} New</span>}
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {user.notifications?.length > 0 ? (
                              [...user.notifications].reverse().map((n, i) => (
                                <div key={i} className={`p-4 border-b border-dark-50 last:border-0 ${!n.read ? 'bg-primary-50/50' : ''}`}>
                                  <p className="text-sm text-dark-700">{n.message}</p>
                                  <p className="text-xs text-dark-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                </div>
                              ))
                            ) : (
                              <div className="p-6 text-center text-dark-500 text-sm">No notifications yet</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-dark-800 leading-tight">{user.name}</p>
                      <p className="text-xs text-dark-400 capitalize">{user.role === "worker" ? t("profile_worker") : t("profile_employer")}</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-sm text-dark-500 hover:text-danger-600 hover:bg-red-50 transition-all"
                  >
                    {t("nav_logout")}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-dark-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all"
                >
                  {t("nav_login")}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 font-medium transition-all shadow-sm hover:shadow-md"
                >
                  {t("nav_register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-dark-600 hover:bg-dark-100 transition"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden animate-slide-down border-t border-dark-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="w-full text-left px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg border border-dark-100 mb-2"
            >
              {lang === "en" ? "🇮🇳 हिंदी में देखें" : "🇬🇧 View in English"}
            </button>

            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg">
              {t("nav_home")}
            </Link>
            {(!user || user.role !== "employer") && (
              <Link to="/jobs" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg">
                {t("nav_find_jobs")}
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg">
                  {t("nav_profile")}
                </Link>
                {user.role === "employer" && (
                  <>
                    <Link to="/workers" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg">
                      {t("nav_workers")}
                    </Link>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg">
                      {t("nav_dashboard")}
                    </Link>
                    <Link to="/post-job" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg bg-accent-500 text-white font-medium text-lg text-center mt-2">
                      {t("nav_post_job")}
                    </Link>
                  </>
                )}
                
                {user.role === "worker" && (
                  <div className="mt-2 border-t border-dark-100 pt-2">
                    <button 
                      onClick={handleNotificationsClick}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg"
                    >
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-danger-500 text-white text-xs px-2 py-1 rounded-full font-bold">{unreadCount}</span>
                      )}
                    </button>
                    {showNotifications && (
                      <div className="px-4 py-2 max-h-60 overflow-y-auto bg-dark-50 rounded-lg mx-2 my-2">
                        {user.notifications?.length > 0 ? (
                          [...user.notifications].reverse().map((n, i) => (
                            <div key={i} className="py-2 border-b border-dark-100 last:border-0">
                              <p className="text-sm text-dark-700">{n.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-dark-500 text-sm text-center">No notifications</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 mt-2 border-t border-dark-100">
                  <p className="px-4 text-sm text-dark-400">{t("nav_logged_in_as")} <span className="font-semibold text-dark-700">{user.name}</span></p>
                  <button onClick={handleLogout} className="w-full mt-2 px-4 py-3 rounded-lg text-danger-600 hover:bg-red-50 font-medium text-lg text-left">
                    {t("nav_logout")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-dark-700 hover:bg-primary-50 hover:text-primary-600 font-medium text-lg">
                  {t("nav_login")}
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg bg-primary-500 text-white font-medium text-lg text-center mt-2">
                  {t("nav_register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
