import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import WorkerCard from "../components/WorkerCard";
import VoiceSearch from "../components/VoiceSearch";
import { SKILLS } from "../components/SkillSelector";

export default function Workers() {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all"); // "all" | "nearby"
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  // Get user's location from localStorage or geolocation API
  useEffect(() => {
    const stored = localStorage.getItem("rozgarsetu_location");
    if (stored) {
      try {
        const loc = JSON.parse(stored);
        if (loc.lat && loc.lng) setUserLocation(loc);
      } catch {}
    }
  }, []);

  const requestLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationFilter("all");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        localStorage.setItem("rozgarsetu_location", JSON.stringify(loc));
        setLocationError("");
      },
      () => {
        setLocationError("Location access denied. Showing all workers.");
        setLocationFilter("all");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleLocationFilterChange = (filter) => {
    setLocationFilter(filter);
    if (filter === "nearby" && !userLocation) {
      requestLocation();
    }
  };

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSkill) params.skill = selectedSkill;
      if (search) params.search = search;

      // Add location params if filtering nearby
      if (locationFilter === "nearby" && userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
        params.radius = 10;
      }

      const res = await API.get("/workers", { params });
      setWorkers(res.data);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchWorkers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedSkill, search, locationFilter, userLocation]);

  const handleVoiceResult = (text) => {
    setSearch(text);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display-md md:font-display-lg font-bold text-primary mb-2">
            {t("workers_title")}
          </h1>
          <p className="font-body-lg text-on-surface-variant">
            Find and hire skilled workers in your area.
          </p>
        </div>
        
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("workers_search_placeholder")}
            className="w-full h-12 pl-10 pr-12 rounded-full bg-surface-container-lowest border border-outline-variant focus-ring font-body-md text-on-surface shadow-sm"
          />
          <VoiceSearch
            onResult={handleVoiceResult}
            className="absolute right-2 top-1/2 -translate-y-1/2 [&_button]:p-1.5 [&_button]:rounded-full [&_span]:text-xl"
          />
        </div>
      </div>

      {/* Location Filter Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex bg-surface-container-low rounded-lg p-1 border border-surface-container-high w-fit">
          <button
            onClick={() => handleLocationFilterChange("all")}
            className={`px-4 py-2 rounded-md font-label-md font-semibold transition-all flex items-center gap-1.5 ${
              locationFilter === "all"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-base">public</span>
            All Workers
          </button>
          <button
            onClick={() => handleLocationFilterChange("nearby")}
            className={`px-4 py-2 rounded-md font-label-md font-semibold transition-all flex items-center gap-1.5 ${
              locationFilter === "nearby"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-base">near_me</span>
            Nearby (10 km)
          </button>
        </div>

        {/* Location status indicator */}
        {locationFilter === "nearby" && (
          <div className="flex items-center gap-1.5 text-sm">
            {userLocation ? (
              <span className="flex items-center gap-1 text-tertiary font-medium">
                <span className="material-symbols-outlined text-sm icon-fill">location_on</span>
                Location enabled
              </span>
            ) : locationError ? (
              <span className="flex items-center gap-1 text-error font-medium">
                <span className="material-symbols-outlined text-sm">location_disabled</span>
                {locationError}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-on-surface-variant font-medium">
                <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                Getting location...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Skills Filter */}
      <div className="mb-8 overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedSkill("")}
            className={`px-4 py-2 rounded-full font-label-md font-semibold transition-colors ${
              selectedSkill === ""
                ? "bg-primary text-on-primary shadow-md"
                : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container"
            }`}
          >
            All Workers
          </button>
          {SKILLS.map((skill) => (
            <button
              key={skill.name}
              onClick={() => setSelectedSkill(skill.name)}
              className={`px-4 py-2 rounded-full font-label-md font-semibold transition-colors flex items-center gap-1.5 ${
                selectedSkill === skill.name
                  ? "bg-secondary-container text-on-secondary-container shadow-md"
                  : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-base">{skill.icon}</span> 
              {t(`skill_${skill.name}`) || skill.name}
            </button>
          ))}
        </div>
      </div>

      {/* Worker Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 h-48 skeleton shadow-sm" />
          ))}
        </div>
      ) : workers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workers.map((worker) => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 border-dashed animate-fade-in shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-container text-on-surface flex items-center justify-center">
             <span className="material-symbols-outlined text-4xl">group_off</span>
          </div>
          <h3 className="font-headline-sm font-bold text-primary mb-2">{t("workers_empty")}</h3>
          <p className="font-body-md text-on-surface-variant mb-6">
            {locationFilter === "nearby"
              ? "No workers found within 10 km. Try switching to 'All Workers'."
              : "No workers match your current filters."}
          </p>
          <button 
            onClick={() => { setSearch(""); setSelectedSkill(""); setLocationFilter("all"); }}
            className="px-6 h-12 rounded-lg bg-secondary text-on-secondary font-label-lg font-bold hover:brightness-95 transition-all shadow-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

