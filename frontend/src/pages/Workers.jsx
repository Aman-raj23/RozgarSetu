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

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedSkill) params.skill = selectedSkill;
      if (search) params.search = search;
      
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
  }, [selectedSkill, search]);

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
          <p className="font-body-md text-on-surface-variant mb-6">No workers match your current filters.</p>
          <button 
            onClick={() => { setSearch(""); setSelectedSkill(""); }}
            className="px-6 h-12 rounded-lg bg-secondary text-on-secondary font-label-lg font-bold hover:brightness-95 transition-all shadow-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
