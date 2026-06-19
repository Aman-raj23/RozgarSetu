import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import VoiceSearch from "../components/VoiceSearch";
import { SKILLS } from "../components/SkillSelector";

export default function Jobs() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get("skill") || "");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("rozgarsetu_location");
    if (saved) setLocation(JSON.parse(saved));

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) setLocation({ lat: parseFloat(lat), lng: parseFloat(lng) });
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (location) {
        params.lat = location.lat;
        params.lng = location.lng;
      }
      if (selectedSkill) params.skill = selectedSkill;
      if (search) params.search = search;

      const endpoint = location ? "/jobs/nearby" : "/jobs";
      const res = await API.get(endpoint, { params });
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedSkill, search, location]);

  const handleVoiceResult = (text) => {
    setSearch(text);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 py-3 bg-surface sticky top-16 z-40 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-12 rounded-full border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container focus:border-secondary-container text-base"
            placeholder={t("jobs_search_placeholder")}
            type="text"
          />
          <VoiceSearch
            onResult={handleVoiceResult}
            className="absolute right-2 top-1/2 -translate-y-1/2 [&_button]:p-2 [&_button]:rounded-full"
          />
        </div>
      </div>

      <main className="flex-1 max-w-[1280px] mx-auto w-full flex flex-col md:flex-row gap-8 px-4 md:px-8 py-8">
        {/* ─── Sidebar Filters (Desktop) ─── */}
        <aside className="hidden md:flex w-64 flex-shrink-0 flex-col gap-6 bg-surface-container-lowest p-5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30 h-fit sticky top-24">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-xl text-primary">Filters</h2>
            <button
              onClick={() => { setSelectedSkill(""); setSearch(""); }}
              className="text-secondary text-xs font-medium underline"
            >
              Clear All
            </button>
          </div>

          {/* Search */}
          <div>
            <h3 className="text-sm font-semibold text-on-surface mb-2">Search</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-secondary-container focus:border-secondary-container text-sm"
                placeholder={t("jobs_search_placeholder")}
                type="text"
              />
            </div>
            <VoiceSearch onResult={handleVoiceResult} className="mt-2" />
          </div>

          {/* Skills Filter */}
          <div className="pt-4 border-t border-surface-variant">
            <h3 className="text-sm font-semibold text-on-surface mb-3">Skills</h3>
            <div className="flex flex-col gap-1.5">
              <label
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedSkill === "" ? "bg-surface-container-high" : "hover:bg-surface-container"
                }`}
              >
                <input
                  type="radio"
                  name="skill"
                  checked={selectedSkill === ""}
                  onChange={() => setSelectedSkill("")}
                  className="w-4 h-4 text-secondary border-outline-variant focus:ring-secondary"
                />
                <span className="text-sm text-on-surface font-medium">{t("jobs_all")}</span>
              </label>
              {SKILLS.map((skill) => (
                <label
                  key={skill.name}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedSkill === skill.name ? "bg-surface-container-high" : "hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="radio"
                    name="skill"
                    checked={selectedSkill === skill.name}
                    onChange={() => setSelectedSkill(skill.name)}
                    className="w-4 h-4 text-secondary border-outline-variant focus:ring-secondary"
                  />
                  <span className="material-symbols-outlined text-lg text-on-surface-variant">{skill.icon}</span>
                  <span className="text-sm text-on-surface flex-1">{t(`skill_${skill.name}`) || skill.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── Job Listings ─── */}
        <section className="flex-1 flex flex-col gap-5">
          {/* Header */}
          <div className="hidden md:flex justify-between items-end mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">{t("jobs_title")}</h1>
              <p className="text-on-surface-variant mt-1">
                {!loading && `${jobs.length} ${jobs.length === 1 ? t("jobs_job") : t("jobs_jobs")} ${t("jobs_found")}`}
              </p>
            </div>
          </div>

          {/* Mobile Skills Chips */}
          <div className="md:hidden overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => setSelectedSkill("")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedSkill === ""
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant"
                }`}
              >
                {t("jobs_all")}
              </button>
              {SKILLS.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkill(selectedSkill === skill.name ? "" : skill.name)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    selectedSkill === skill.name
                      ? "bg-secondary-container text-on-secondary-container shadow-md"
                      : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-primary/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{skill.icon}</span>
                  {t(`skill_${skill.name}`) || skill.name}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5 h-64 skeleton" />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {jobs.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 border-dashed">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4 block">work_off</span>
              <h3 className="text-xl font-bold text-on-surface mb-2">{t("jobs_empty_title")}</h3>
              <p className="text-on-surface-variant mb-6 max-w-md mx-auto">{t("jobs_empty_desc")}</p>
              <button
                onClick={() => { setSearch(""); setSelectedSkill(""); }}
                className="text-secondary font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="hidden md:flex w-full px-4 py-8 flex-col gap-4 bg-primary text-on-primary mt-auto">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xl font-bold text-on-primary">RozgarSetu</span>
            <p className="text-sm text-on-primary/80 mt-1">© {new Date().getFullYear()} RozgarSetu. Built for Bharat.</p>
          </div>
          <div className="flex gap-6">
            <a className="text-xs text-on-primary/80 hover:text-secondary-container transition-all" href="#">Contact Us</a>
            <a className="text-xs text-on-primary/80 hover:text-secondary-container transition-all" href="#">Safety Tips</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
