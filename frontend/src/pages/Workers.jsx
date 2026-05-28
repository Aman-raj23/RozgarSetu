import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import WorkerCard from "../components/WorkerCard";
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

  // Fetch on mount and when filters change
  useEffect(() => {
    // debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchWorkers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedSkill, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-dark-900 mb-2">
            {t("workers_title")}
          </h1>
          <p className="text-dark-500">
            Find and hire skilled workers in your area.
          </p>
        </div>
        
        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("workers_search_placeholder")}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      {/* Skills Filter */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedSkill("")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedSkill === ""
                ? "bg-dark-900 text-white shadow-md"
                : "bg-white text-dark-600 border border-dark-200 hover:border-dark-300"
            }`}
          >
            All Workers
          </button>
          {SKILLS.map((skill) => (
            <button
              key={skill.name}
              onClick={() => setSelectedSkill(skill.name)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                selectedSkill === skill.name
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300 hover:text-primary-600"
              }`}
            >
              <span>{skill.icon}</span> {t(`skill_${skill.name}`) || skill.name}
            </button>
          ))}
        </div>
      </div>

      {/* Worker Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-dark-100 p-5 h-48 skeleton" />
          ))}
        </div>
      ) : workers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workers.map((worker) => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dark-100 border-dashed">
          <div className="text-5xl mb-4">👷</div>
          <h3 className="text-xl font-bold text-dark-900 mb-2">{t("workers_empty")}</h3>
          <button 
            onClick={() => { setSearch(""); setSelectedSkill(""); }}
            className="text-primary-600 font-semibold hover:text-primary-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
