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
  const [locationStatus, setLocationStatus] = useState("idle");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
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
      const saved = localStorage.getItem("rozgarsetu_location");
      if (saved) {
        setLocation(JSON.parse(saved));
        setLocationStatus("granted");
      } else {
        setLocationStatus("denied");
      }
    }
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchText.trim())}`);
    }
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
    <div className="min-h-screen flex flex-col">
      {/* ─── Hero Section ─── */}
      <section className="relative rounded-none md:rounded-2xl md:mx-8 md:mt-6 overflow-hidden bg-primary text-on-primary min-h-[420px] flex flex-col justify-center px-6 md:px-12 py-12 shadow-md">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            alt=""
            className="w-full h-full object-cover opacity-20 object-center"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8HDYw3m18KHGeyhw8eO1Qkj2ZiYzOz5s11EkpzFCAbUOPbLif52mTyEyDMVSeRv6AXmvH8M_qH4I-KyfwuXLESOwVIfzl0ytpahIfr-cbhuh5i6EePcvQY63mzhu5VI3axWWKUEi6zS_1vEXgk8QURujKoi7guq-LmTUPkNL4TymHhFd9fmUIsqcCQGHBkR-Y9UKjD45rODFTJ3MecDyiy3ny3qZrqYx5UJMAxzLWSMIUq_M0l01wQYCAJ0xODWBExWskgY3KlTNQ"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-[40px] font-bold leading-tight tracking-tight mb-4">
            {t("home_title_1")} <br />{t("home_title_2")}
          </h1>
          <p className="text-lg text-on-primary/90 mb-8 max-w-lg leading-relaxed">
            {t("home_subtitle")}
          </p>

          {/* Role Switcher */}
          <div className="bg-surface-container-lowest/10 backdrop-blur-sm p-1 rounded-xl inline-flex w-full md:w-auto mb-8 border border-outline-variant/30">
            <button
              onClick={handleFindJobs}
              className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-semibold text-sm shadow-sm transition-all text-center"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">handyman</span>
              I am a Worker
            </button>
            <button
              onClick={handleFindWorkers}
              className="flex-1 md:flex-none px-6 py-3 rounded-lg text-on-primary/80 hover:bg-surface-container-lowest/5 font-semibold text-sm transition-all text-center"
            >
              <span className="material-symbols-outlined text-lg align-middle mr-1">storefront</span>
              I want to Hire
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-xl w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-12 pr-14 py-4 rounded-xl bg-surface-container-lowest text-on-surface text-base border-0 focus:ring-2 focus:ring-secondary focus:outline-none placeholder:text-on-surface-variant/60 shadow-lg"
              placeholder={t("jobs_search_placeholder")}
              type="text"
            />
            <VoiceSearch
              onResult={handleVoiceResult}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </form>
        </div>
      </section>

      {/* ─── Location Status Bar ─── */}
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-8 mt-6">
        <div className="elevation-1 rounded-xl p-4 flex items-center gap-3 border border-outline-variant/30">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${locationStatus === "granted" ? "bg-tertiary-fixed text-tertiary" : "bg-surface-container text-on-surface-variant"
            }`}>
            <span className="material-symbols-outlined">my_location</span>
          </div>
          <div className="flex-1">
            {locationStatus === "granted" ? (
              <>
                <p className="text-sm font-semibold text-primary">
                  {locationName || t("home_location_enabled")}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {locationName ? t("home_location_enabled") : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                </p>
              </>
            ) : locationStatus === "loading" ? (
              <p className="text-sm text-on-surface-variant">{t("home_location_loading")}</p>
            ) : locationStatus === "denied" ? (
              <>
                <p className="text-sm font-semibold text-error">{t("home_location_denied")}</p>
                <p className="text-xs text-on-surface-variant">{t("home_location_denied_sub")}</p>
              </>
            ) : (
              <button onClick={requestLocation} className="text-sm font-semibold text-secondary hover:underline">
                {t("home_enable_location")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Popular Skills (Bento Grid) ─── */}
      <section className="max-w-[1280px] mx-auto w-full px-4 md:px-8 mt-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-on-background">{t("home_what_can_you_do")}</h2>
            <p className="text-on-surface-variant mt-1">{t("home_select_skills_sub")}</p>
          </div>
        </div>
        <SkillSelector onSelect={handleSkillSelect} selected={selectedSkills} />

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
          <button
            onClick={handleFindJobs}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-secondary-container text-on-secondary-container font-semibold text-base hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span className="material-symbols-outlined">work</span>
            {selectedSkills.length > 0
              ? `${selectedSkills.length} ${t("home_find_skill_jobs")}`
              : t("home_find_jobs_btn")}
          </button>
          <span className="hidden sm:inline text-on-surface-variant text-sm font-medium">or</span>
          <button
            onClick={handleFindWorkers}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-surface-container-lowest border-2 border-primary text-primary font-semibold text-base hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span className="material-symbols-outlined">groups</span>
            {t("nav_workers")}
          </button>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="mt-16 py-16 bg-primary text-on-primary">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("home_how_title")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12">
            {[
              { title: t("home_step1_title"), desc: t("home_step1_desc"), icon: "tune", num: "01" },
              { title: t("home_step2_title"), desc: t("home_step2_desc"), icon: "location_on", num: "02" },
              { title: t("home_step3_title"), desc: t("home_step3_desc"), icon: "call", num: "03" },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative animate-fade-in-up p-8 rounded-xl transition-all duration-300 hover:-translate-y-2"
                style={{
                  animationDelay: `${i * 150}ms`,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="absolute top-6 right-8 text-5xl font-black select-none text-on-primary/5">
                  {item.num}
                </div>
                <div className="w-14 h-14 rounded-xl bg-on-primary/10 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl text-on-primary">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-on-primary mb-3">{item.title}</h3>
                <p className="text-on-primary/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-full px-4 md:px-8 py-8 flex flex-col gap-4 bg-primary text-on-primary mt-auto">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="RozgarSetu Logo" className="w-7 h-7 object-contain rounded bg-white p-0.5" />
              <span className="text-xl font-bold text-on-primary">RozgarSetu</span>
            </div>
            <p className="text-sm text-on-primary/80">© {new Date().getFullYear()} RozgarSetu — {t("home_footer")}</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8">
            <a className="text-xs text-on-primary/80 hover:text-secondary-container transition-all" href="#">Contact Us</a>
            <a className="text-xs text-on-primary/80 hover:text-secondary-container transition-all" href="#">Safety Tips</a>
            <a className="text-xs text-on-primary/80 hover:text-secondary-container transition-all" href="#">Jobs Directory</a>
            <a className="text-xs text-on-primary/80 hover:text-secondary-container transition-all" href="#">Workers Directory</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
