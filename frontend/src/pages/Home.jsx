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
    // Always request fresh location on mount
    if ("geolocation" in navigator) {
      setLocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          setLocationStatus("granted");
          localStorage.setItem("rozgarsetu_location", JSON.stringify(loc));
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fall back to saved location if fresh GPS fails
          const saved = localStorage.getItem("rozgarsetu_location");
          if (saved) {
            setLocation(JSON.parse(saved));
            setLocationStatus("granted");
          } else {
            setLocationStatus("denied");
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // Browser doesn't support geolocation, try cache
      const saved = localStorage.getItem("rozgarsetu_location");
      if (saved) {
        setLocation(JSON.parse(saved));
        setLocationStatus("granted");
      } else {
        setLocationStatus("denied");
      }
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

  const handleFindWorkers = () => {
    const params = new URLSearchParams();
    if (selectedSkills.length > 0) params.set("skill", selectedSkills.join(","));
    if (location) {
      params.set("lat", location.lat);
      params.set("lng", location.lng);
    }
    navigate(`/workers?${params.toString()}`);
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

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-5">
          <button
            onClick={handleFindJobs}
            className="group relative flex-1 w-full max-w-xs px-8 py-4 sm:py-5 rounded-full bg-dark-900 text-white font-bold text-lg sm:text-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 hover:bg-black active:scale-95 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {selectedSkills.length > 0
                ? `${selectedSkills.length} ${t("home_find_skill_jobs")}`
                : t("home_find_jobs_btn")}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
          
          <button
            onClick={handleFindWorkers}
            className="group flex-1 w-full max-w-xs px-8 py-4 sm:py-5 rounded-full bg-white text-dark-900 border border-dark-200 font-bold text-lg sm:text-xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-200 active:scale-95 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2 group-hover:text-primary-600 transition-colors">
              {t("nav_workers")}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-dark-950 text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-900/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              {t("home_how_title")}
            </h2>
            <p className="text-dark-400 text-lg">A simple and seamless process to connect workers and employers locally.</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 lg:gap-10">
            {[
              {
                title: t("home_step1_title"),
                desc: t("home_step1_desc"),
                icon: "🎯",
                step: "01"
              },
              {
                title: t("home_step2_title"),
                desc: t("home_step2_desc"),
                icon: "📍",
                step: "02"
              },
              {
                title: t("home_step3_title"),
                desc: t("home_step3_desc"),
                icon: "🤝",
                step: "03"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative text-center p-8 lg:p-10 rounded-[2.5rem] bg-dark-900/50 border border-dark-800 backdrop-blur-sm hover:bg-dark-800/80 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-6 left-8 text-5xl font-black text-dark-800/50 group-hover:text-primary-900/30 transition-colors select-none">
                  {item.step}
                </div>
                
                <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 flex items-center justify-center text-4xl mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 drop-shadow-lg">{item.icon}</span>
                </div>
                
                <h3 className="relative z-10 text-xl lg:text-2xl font-bold mb-3 text-white group-hover:text-primary-100 transition-colors">{item.title}</h3>
                <p className="relative z-10 text-dark-400 leading-relaxed font-medium group-hover:text-dark-300">{item.desc}</p>
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
