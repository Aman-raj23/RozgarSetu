import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import JobCard from "../components/JobCard";
import VoiceSearch from "../components/VoiceSearch";
import { SKILLS } from "../components/SkillSelector";
import { useLanguage } from "../context/LanguageContext";

export default function Jobs() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get("skill") || "");

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const location = JSON.parse(localStorage.getItem("rozgarsetu_location") || "null");
      const userLat = lat || location?.lat;
      const userLng = lng || location?.lng;

      let response;
      if (userLat && userLng) {
        // Use nearby endpoint with recommendation engine
        const params = { lat: userLat, lng: userLng, radius: 50 };
        const skillFilter = selectedSkill || searchText;
        if (skillFilter) params.skill = skillFilter;
        response = await API.get("/jobs/nearby", { params });
      } else {
        // No location — get all jobs, pass skill filter if present
        const params = {};
        if (selectedSkill) params.skill = selectedSkill;
        response = await API.get("/jobs", { params });
      }

      let results = response.data;

      // Client-side text search filtering if needed
      if (searchText && !selectedSkill) {
        const lower = searchText.toLowerCase();
        results = results.filter(
          (j) =>
            j.title?.toLowerCase().includes(lower) ||
            j.skills?.some((s) => s.toLowerCase().includes(lower)) ||
            j.description?.toLowerCase().includes(lower)
        );
      }

      // Client-side skill filtering as a safety net
      if (selectedSkill && !userLat) {
        const skillLower = selectedSkill.toLowerCase();
        results = results.filter((j) =>
          j.skills?.some((s) => s.toLowerCase() === skillLower)
        );
      }

      setJobs(results);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [lat, lng, selectedSkill, searchText]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleVoiceResult = (text) => {
    setSearchText(text);
    setSelectedSkill("");
    setSearchParams((prev) => {
      prev.set("search", text);
      prev.delete("skill");
      return prev;
    });
  };

  const handleSkillFilter = (skillName) => {
    const newSkill = selectedSkill === skillName ? "" : skillName;
    setSelectedSkill(newSkill);
    setSearchText("");
    setSearchParams((prev) => {
      if (newSkill) {
        prev.set("skill", newSkill);
      } else {
        prev.delete("skill");
      }
      prev.delete("search");
      return prev;
    });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedSkill("");
    setSearchParams((prev) => {
      if (searchText) {
        prev.set("search", searchText);
      } else {
        prev.delete("search");
      }
      prev.delete("skill");
      return prev;
    });
    fetchJobs();
  };

  const jobCountText = () => {
    if (loading) return t("jobs_searching");
    if (jobs.length === 0) return t("jobs_none");
    return `${jobs.length} ${jobs.length !== 1 ? t("jobs_jobs") : t("jobs_job")} ${t("jobs_found")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-900">
          {t("jobs_title")}
        </h1>
        <p className="mt-2 text-dark-500">{jobCountText()}</p>
      </div>

      {/* Search Bar + Voice */}
      <div className="bg-white rounded-2xl shadow-sm border border-dark-100 p-4 sm:p-6 mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder={t("jobs_search_placeholder")}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all shadow-sm"
          >
            {t("jobs_search_btn")}
          </button>
          <VoiceSearch onResult={handleVoiceResult} />
        </form>
      </div>

      {/* Skill Filters (horizontal scroll) */}
      <div className="mb-8 overflow-x-auto pb-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => {
              setSelectedSkill("");
              setSearchText("");
              setSearchParams({});
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              !selectedSkill
                ? "bg-primary-500 text-white shadow-sm"
                : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
            }`}
          >
            {t("jobs_all")}
          </button>
          {SKILLS.map((skill) => (
            <button
              key={skill.name}
              onClick={() => handleSkillFilter(skill.name)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedSkill === skill.name
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-white text-dark-600 border border-dark-200 hover:border-primary-300"
              }`}
            >
              <span>{skill.icon}</span>
              {t(`skill_${skill.name}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-600 font-medium animate-fade-in">
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-dark-100">
              <div className="skeleton h-5 w-3/4 mb-3" />
              <div className="skeleton h-8 w-1/3 mb-3" />
              <div className="flex gap-2 mb-4">
                <div className="skeleton h-6 w-16" />
                <div className="skeleton h-6 w-20" />
              </div>
              <div className="skeleton h-4 w-1/2 mb-4" />
              <div className="flex gap-2">
                <div className="skeleton h-11 flex-1" />
                <div className="skeleton h-11 flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Cards */}
      {!loading && jobs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <JobCard key={job._id} job={job} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-dark-100 flex items-center justify-center text-4xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-dark-800 mb-2">{t("jobs_empty_title")}</h3>
          <p className="text-dark-400 max-w-md mx-auto">
            {t("jobs_empty_desc")}
          </p>
        </div>
      )}
    </div>
  );
}
