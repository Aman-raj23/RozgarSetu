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
    salaryPeriod: "day",
    phone: user?.phone || "",
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingEdit, setFetchingEdit] = useState(!!editId);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");

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
            salaryPeriod: j.salaryPeriod || "day",
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

  useEffect(() => {
    if (editId) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(loc);
          localStorage.setItem("rozgarsetu_location", JSON.stringify(loc));
        },
        () => {
          const saved = localStorage.getItem("rozgarsetu_location");
          if (saved) setLocation(JSON.parse(saved));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      const saved = localStorage.getItem("rozgarsetu_location");
      if (saved) setLocation(JSON.parse(saved));
    }
  }, [editId]);

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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 space-y-4 shadow-sm">
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in-up">
      <h1 className="font-display-sm md:font-display-md font-bold text-primary mb-2">
        {editId ? "Edit Job" : "Post a New Job"}
      </h1>
      <p className="font-body-lg text-on-surface-variant mb-8">
        Fill in the details below to {editId ? "update" : "create"} your job listing
      </p>

      <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error-container border border-error/20 text-error font-body-md animate-fade-in flex items-center gap-2">
            <span className="material-symbols-outlined icon-fill">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="job-title" className="block font-label-lg font-bold text-on-surface">
                Job Title <span className="text-error">*</span>
              </label>
              <span className={`font-label-sm font-semibold transition-colors ${form.title.length >= 25 ? "text-error" : "text-on-surface-variant"}`}>
                {form.title.length}/25
              </span>
            </div>
            <input
              id="job-title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={25}
              required
              placeholder="e.g. Electrician needed"
              className="w-full h-12 px-4 rounded-lg bg-surface border border-outline-variant focus-ring font-body-md text-on-surface"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="job-desc" className="block font-label-lg font-bold text-on-surface mb-2">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              id="job-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the job in detail — what work is needed, timing, any requirements..."
              className="w-full p-4 rounded-lg bg-surface border border-outline-variant focus-ring font-body-md text-on-surface resize-y"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-label-lg font-bold text-on-surface mb-2">
              Skills Required <span className="text-error">*</span>
            </label>

            {/* Selected Skills */}
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-lg bg-surface-container-low border border-outline-variant border-dashed">
                {form.skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-label-sm font-semibold bg-chip-green text-chip-green-text border border-chip-green-border"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="ml-1 text-chip-green-text hover:text-error transition-colors flex items-center"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
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
                    className="px-3 py-1.5 rounded-full font-label-sm font-medium bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-1.5 border border-transparent hover:border-outline-variant"
                  >
                    <span className="material-symbols-outlined text-sm">{skill.icon}</span>
                    {skill.name}
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
                className="flex-1 h-12 px-4 rounded-lg bg-surface border border-outline-variant focus-ring font-body-md text-on-surface"
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput.trim())}
                className="h-12 px-6 rounded-lg bg-secondary-container text-on-secondary-container font-label-lg font-bold hover:brightness-95 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Payment */}
          <div>
            <label htmlFor="job-salary" className="block font-label-lg font-bold text-on-surface mb-2">
              {t("post_payment_label")} <span className="text-error">*</span>
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-4 font-headline-sm font-bold text-secondary">₹</span>
                <input
                  id="job-salary"
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder={t("post_payment_placeholder")}
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-surface border border-outline-variant focus-ring font-body-md text-on-surface font-bold text-lg"
                />
              </div>
              <div className="relative">
                <select
                  name="salaryPeriod"
                  value={form.salaryPeriod}
                  onChange={handleChange}
                  className="h-12 pl-4 pr-10 rounded-lg bg-surface border border-outline-variant focus-ring font-body-md text-on-surface font-bold min-w-[140px] appearance-none cursor-pointer"
                >
                  <option value="day">{t("per_day")}</option>
                  <option value="month">{t("per_month")}</option>
                  <option value="annum">{t("per_annum")}</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">keyboard_arrow_down</span>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="job-phone" className="block font-label-lg font-bold text-on-surface mb-2">
              Contact Phone <span className="text-error">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">call</span>
              <input
                id="job-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+91 9876543210"
                className="w-full h-12 pl-10 pr-4 rounded-lg bg-surface border border-outline-variant focus-ring font-body-md text-on-surface"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-label-lg font-bold text-on-surface mb-2">
              Location
            </label>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              {location ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined icon-fill">location_on</span>
                  </div>
                  <div>
                    <p className="font-label-lg font-bold text-secondary">Location captured</p>
                    <p className="font-body-sm text-on-surface-variant mt-0.5">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
                  <span className="material-symbols-outlined text-lg">location_off</span>
                  Enable browser location to auto-detect job location
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-lg bg-primary hover:brightness-95 text-on-primary font-label-lg font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {editId ? "Updating..." : "Posting..."}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">publish</span>
                {editId ? "Update Job" : "Post Job"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
