import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkillSelector from "../components/SkillSelector";
import VoiceSearch from "../components/VoiceSearch";
import { useLanguage } from "../context/LanguageContext";
import { getLocationName } from "../utils/geocode";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | granted | denied

  useEffect(() => {
    // Try to get saved location
    const saved = localStorage.getItem("rozgarsetu_location");
    if (saved) {
      setLocation(JSON.parse(saved));
      setLocationStatus("granted");
    }
  }, []);

  // Resolve location name from coordinates
  useEffect(() => {
    if (location) {
      getLocationName(location.lat, location.lng).then((name) => {
        if (name) setLocationName(name);
      });
    }
  }, [location]);

  const requestLocation = () => {
    setLocationStatus("loading");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          setLocationStatus("granted");
          localStorage.setItem("rozgarsetu_location", JSON.stringify(loc));
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationStatus("denied");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationStatus("denied");
    }
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleVoiceResult = (text) => {
    navigate(`/jobs?search=${encodeURIComponent(text)}`);
  };

  const handleFindJobs = () => {
    const params = new URLSearchParams();
    if (selectedSkills.length > 0) params.set("skill", selectedSkills.join(","));
    if (location) {
      params.set("lat", location.lat);
      params.set("lng", location.lng);
    }
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm font-medium text-primary-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              {t("home_badge")}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              {t("home_title_1")}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                {t("home_title_2")}
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
              {t("home_subtitle")}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 mt-10">
              <div>
                <p className="text-3xl font-bold text-white">12+</p>
                <p className="text-sm text-dark-400">{t("home_stat_skills")}</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">10km</p>
                <p className="text-sm text-dark-400">{t("home_stat_radius")}</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-dark-400">{t("home_stat_free")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 72C120 64 240 48 360 42.7C480 37 600 43 720 48C840 53 960 59 1080 56C1200 53 1320 43 1380 37L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Location + Voice Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-dark-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Location */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${locationStatus === "granted"
                  ? "bg-accent-50 text-accent-600"
                  : "bg-dark-100 text-dark-400"
                }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                {locationStatus === "granted" ? (
                  <>
                    <p className="text-sm font-semibold text-accent-700">
                      {locationName || t("home_location_enabled")}
                    </p>
                    <p className="text-xs text-dark-400">
                      {locationName ? t("home_location_enabled") : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                    </p>
                  </>
                ) : locationStatus === "loading" ? (
                  <p className="text-sm text-dark-500">{t("home_location_loading")}</p>
                ) : locationStatus === "denied" ? (
                  <>
                    <p className="text-sm font-semibold text-danger-600">{t("home_location_denied")}</p>
                    <p className="text-xs text-dark-400">{t("home_location_denied_sub")}</p>
                  </>
                ) : (
                  <button
                    onClick={requestLocation}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {t("home_enable_location")}
                  </button>
                )}
              </div>
            </div>

            {/* Voice Search */}
            <VoiceSearch onResult={handleVoiceResult} />
          </div>
        </div>
      </section>

      {/* Skill Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark-900">
            {t("home_what_can_you_do")}
          </h2>
          <p className="mt-2 text-dark-500">
            {t("home_select_skills_sub")}
          </p>
        </div>

        <SkillSelector onSelect={handleSkillSelect} selected={selectedSkills} />

        {/* Find Jobs Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleFindJobs}
            className="px-10 py-4 sm:px-14 sm:py-5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg sm:text-xl shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30 hover:from-primary-600 hover:to-primary-700 active:scale-95 transition-all"
          >
            {selectedSkills.length > 0
              ? `${selectedSkills.length} ${t("home_find_skill_jobs")}`
              : t("home_find_jobs_btn")}
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-dark-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t("home_how_title")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: t("home_step1_title"),
                desc: t("home_step1_desc"),
                icon: "🎯",
              },
              {
                title: t("home_step2_title"),
                desc: t("home_step2_desc"),
                icon: "📍",
              },
              {
                title: t("home_step3_title"),
                desc: t("home_step3_desc"),
                icon: "📞",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl mb-5 shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-dark-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 text-dark-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} RozgarSetu — {t("home_footer")}
          </p>
        </div>
      </footer>
    </div>
  );
}
