import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { SKILLS } from "../components/SkillSelector";

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: [],
    salary: "",
    phone: user?.phone || "",
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingEdit, setFetchingEdit] = useState(!!editId);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");

  // Load existing job data if editing
  useEffect(() => {
    if (editId) {
      const loadJob = async () => {
        try {
          const res = await API.get(`/jobs/${editId}`);
          const j = res.data;
          setForm({
            title: j.title || "",
            description: j.description || "",
            skills: j.skills || [],
            salary: j.salary?.toString() || "",
            phone: j.phone || user?.phone || "",
          });
          setLocation(j.location || null);
        } catch (err) {
          setError("Failed to load job for editing");
        } finally {
          setFetchingEdit(false);
        }
      };
      loadJob();
    }
  }, [editId, user]);

  // Get location
  useEffect(() => {
    const saved = localStorage.getItem("rozgarsetu_location");
    if (saved) {
      setLocation(JSON.parse(saved));
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          localStorage.setItem("rozgarsetu_location", JSON.stringify(loc));
        },
        () => {} // ignore error
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = (skillName) => {
    if (skillName && !form.skills.includes(skillName)) {
      setForm({ ...form, skills: [...form.skills, skillName] });
    }
    setSkillInput("");
  };

  const removeSkill = (skillName) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skillName) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }

    if (!location) {
      setError("Location is required. Please enable location access.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        location,
      };

      if (editId) {
        await API.put(`/jobs/${editId}`, payload);
      } else {
        await API.post("/jobs", payload);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEdit) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl p-8 border border-dark-100 space-y-4">
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      <h1 className="text-3xl font-extrabold text-dark-900 mb-2">
        {editId ? "Edit Job" : "Post a New Job"}
      </h1>
      <p className="text-dark-400 mb-8">
        Fill in the details below to {editId ? "update" : "create"} your job listing
      </p>

      <div className="bg-white rounded-2xl shadow-lg border border-dark-100 p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-600 text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="job-title" className="block text-sm font-semibold text-dark-700 mb-1.5">
              Job Title *
            </label>
            <input
              id="job-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Electrician needed for house wiring"
              className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="job-desc" className="block text-sm font-semibold text-dark-700 mb-1.5">
              Description *
            </label>
            <textarea
              id="job-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the job in detail — what work is needed, timing, any requirements..."
              className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-2">
              Skills Required *
            </label>
            {/* Selected Skills */}
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-100"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="ml-1 text-primary-400 hover:text-primary-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Quick Skill Buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              {SKILLS.filter((s) => !form.skills.includes(s.name))
                .slice(0, 8)
                .map((skill) => (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => addSkill(skill.name)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-dark-50 text-dark-600 border border-dark-200 hover:border-primary-300 hover:text-primary-600 transition-all flex items-center gap-1"
                  >
                    <span>{skill.icon}</span> {skill.name}
                  </button>
                ))}
            </div>
            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput.trim());
                  }
                }}
                placeholder="Or type a custom skill..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput.trim())}
                className="px-4 py-2.5 rounded-xl bg-dark-100 text-dark-600 font-semibold text-sm hover:bg-dark-200 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Payment */}
          <div>
            <label htmlFor="job-salary" className="block text-sm font-semibold text-dark-700 mb-1.5">
              {t("post_payment_label")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-dark-400">₹</span>
              <input
                id="job-salary"
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                required
                min="1"
                placeholder={t("post_payment_placeholder")}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="job-phone" className="block text-sm font-semibold text-dark-700 mb-1.5">
              Contact Phone *
            </label>
            <input
              id="job-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+91 9876543210"
              className="w-full px-4 py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">
              Location
            </label>
            <div className="p-4 rounded-xl bg-dark-50 border border-dark-200">
              {location ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent-700">Location captured</p>
                    <p className="text-xs text-dark-400">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-dark-400">
                  📍 Enable browser location to auto-detect job location
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {editId ? "Updating..." : "Posting..."}
              </span>
            ) : (
              editId ? "Update Job" : "Post Job"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
