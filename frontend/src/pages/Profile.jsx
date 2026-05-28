import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import { SKILLS } from "../components/SkillSelector";

const AVATAR_COLORS = ["#ee7a14", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];

export default function Profile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  
  // Worker fields
  const [experience, setExperience] = useState(user?.experience || 0);
  const [pastCompany, setPastCompany] = useState(user?.pastCompany || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || AVATAR_COLORS[0]);
  const [skillInput, setSkillInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = { name, phone };
      if (user?.role === "worker") {
        payload.experience = experience;
        payload.pastCompany = pastCompany;
        payload.skills = skills;
        payload.bio = bio;
        payload.avatarColor = avatarColor;
      }
      const res = await API.put("/auth/profile", payload);
      // Update localStorage with new user data
      const updatedUser = res.data.user;
      sessionStorage.setItem("rozgarsetu_user", JSON.stringify(updatedUser));
      // Force page reload to reflect changes in AuthContext
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setExperience(user?.experience || 0);
    setPastCompany(user?.pastCompany || "");
    setSkills(user?.skills || []);
    setBio(user?.bio || "");
    setAvatarColor(user?.avatarColor || AVATAR_COLORS[0]);
    setSkillInput("");
    setEditing(false);
    setError("");
    setMessage("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const addSkill = (skillName) => {
    if (skillName && !skills.includes(skillName)) {
      setSkills([...skills, skillName]);
    }
    setSkillInput("");
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter((s) => s !== skillName));
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-dark-500">{t("nav_login")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-900">
          {t("profile_title")}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-dark-100 overflow-hidden">
        {/* Top gradient */}
        <div className="h-2 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500" />

        {/* Avatar section */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-black/10 transition-colors"
            style={{ 
              background: user?.role === "worker" ? avatarColor : "linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))",
              ...(user?.role !== "worker" && {
                "--tw-gradient-from": "#60a5fa",
                "--tw-gradient-to": "#2563eb"
              })
            }}
          >
            <span className="text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {editing && user?.role === "worker" && (
            <div className="flex gap-2 mt-4">
              {AVATAR_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${avatarColor === color ? "scale-110 border-dark-900" : "border-transparent hover:scale-110"}`}
                  style={{ backgroundColor: color }}
                  title="Select Color"
                />
              ))}
            </div>
          )}
          <h2 className="mt-4 text-xl font-bold text-dark-900">{user.name}</h2>
          <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 capitalize">
            {user.role === "worker" ? t("profile_worker") : t("profile_employer")}
          </span>
        </div>

        {/* Info / Edit form */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Success/Error messages */}
          {message && (
            <div className="p-3 rounded-xl bg-accent-50 border border-accent-200 text-accent-700 text-sm font-medium animate-fade-in">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-600 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_name")}
            </label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            ) : (
              <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
                {user.name}
              </p>
            )}
          </div>

          {/* Email (read only) */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_email")}
            </label>
            <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
              {user.email}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_phone")}
            </label>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              />
            ) : (
              <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
                {user.phone}
              </p>
            )}
          </div>

          {/* Role (read only) */}
          <div>
            <label className="block text-sm font-semibold text-dark-500 mb-1.5">
              {t("profile_role")}
            </label>
            <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium capitalize">
              {user.role === "worker" ? t("profile_worker") : t("profile_employer")}
            </p>
          </div>

          {/* Worker Specific Fields */}
          {user.role === "worker" && (
            <div className="space-y-5 pt-4 border-t border-dark-100">
              <h3 className="text-lg font-bold text-dark-900">Worker Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-dark-500 mb-1.5">
                    {t("worker_exp")}
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      min="0"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    />
                  ) : (
                    <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
                      {user.experience || 0} years
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-500 mb-1.5">
                    {t("worker_company")}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={pastCompany}
                      onChange={(e) => setPastCompany(e.target.value)}
                      placeholder="e.g. L&T Construction"
                      className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    />
                  ) : (
                    <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 font-medium">
                      {user.pastCompany || "None"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-500 mb-2">
                  {t("worker_skills")}
                </label>
                {editing ? (
                  <div>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                            {s}
                            <button type="button" onClick={() => removeSkill(s)} className="ml-1 text-primary-400 hover:text-primary-700">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {SKILLS.filter((s) => !skills.includes(s.name)).slice(0, 6).map((skill) => (
                        <button key={skill.name} type="button" onClick={() => addSkill(skill.name)} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-dark-50 text-dark-600 border border-dark-200 hover:border-primary-300 hover:text-primary-600 transition-all flex items-center gap-1">
                          <span>{skill.icon}</span> {skill.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput.trim()); } }} placeholder="Add custom skill..." className="flex-1 px-4 py-2.5 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 text-sm" />
                      <button type="button" onClick={() => addSkill(skillInput.trim())} className="px-4 py-2.5 rounded-xl bg-dark-100 text-dark-600 font-semibold text-sm hover:bg-dark-200">Add</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.length > 0 ? user.skills.map((s) => (
                      <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-100">{s}</span>
                    )) : (
                      <span className="text-sm text-dark-400">No skills added</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark-500 mb-1.5">
                  {t("worker_bio")}
                </label>
                {editing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder={t("worker_bio_placeholder")}
                    className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
                  />
                ) : (
                  <p className="px-4 py-3 rounded-xl bg-dark-50 border border-dark-100 text-dark-800 whitespace-pre-wrap">
                    {user.bio || <span className="text-dark-400 italic">No bio provided</span>}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-dark-100 space-y-3">
            {editing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-base shadow-lg shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  {saving ? t("profile_saving") : t("profile_save")}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3.5 rounded-xl bg-dark-100 text-dark-700 font-bold text-base hover:bg-dark-200 active:scale-[0.98] transition-all"
                >
                  {t("profile_cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-base shadow-lg shadow-primary-500/20 hover:from-primary-600 hover:to-primary-700 active:scale-[0.98] transition-all"
              >
                {t("profile_edit")}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-xl bg-dark-50 border border-dark-200 text-danger-600 font-bold text-base hover:bg-red-50 hover:border-danger-500/30 active:scale-[0.98] transition-all"
            >
              {t("profile_logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
