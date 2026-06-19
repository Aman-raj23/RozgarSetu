import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";
import { SKILLS } from "../components/SkillSelector";

const AVATAR_COLORS = ["#1b4332", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];

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
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
        <p className="font-body-lg text-on-surface-variant">{t("nav_login")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display-md md:font-display-lg font-bold text-primary">
          {t("profile_title")}
        </h1>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 overflow-hidden">
        {/* Top Background Pattern */}
        <div className="h-24 bg-primary-container relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Avatar section */}
        <div className="flex flex-col items-center pt-6 pb-4 relative -mt-16">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-md border-4 border-surface-container-lowest transition-colors bg-primary text-on-primary text-4xl font-bold"
            style={user?.role === "worker" ? { backgroundColor: avatarColor } : {}}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          
          {editing && user?.role === "worker" && (
            <div className="flex gap-2 mt-4 bg-surface-container rounded-full px-3 py-2 shadow-sm border border-outline-variant/50">
              {AVATAR_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${avatarColor === color ? "scale-110 border-on-surface" : "border-transparent hover:scale-110"}`}
                  style={{ backgroundColor: color }}
                  title="Select Color"
                />
              ))}
            </div>
          )}
          <h2 className="mt-4 font-headline-md font-bold text-on-surface">{user.name}</h2>
          <span className="inline-flex items-center gap-1.5 mt-1 px-4 py-1.5 rounded-full font-label-sm font-semibold bg-secondary-container text-on-secondary-container capitalize">
            {user.role === "worker" ? t("profile_worker") : t("profile_employer")}
          </span>
        </div>

        {/* Info / Edit form */}
        <div className="p-6 md:p-10 space-y-6">
          {/* Success/Error messages */}
          {message && (
            <div className="p-4 rounded-xl bg-tertiary-container border border-tertiary/20 text-on-tertiary-container font-body-md animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-xl icon-fill text-tertiary">check_circle</span>
              {message}
            </div>
          )}
          {error && (
            <div className="p-4 rounded-xl bg-error-container border border-error/20 text-error font-body-md animate-fade-in flex items-center gap-2">
              <span className="material-symbols-outlined text-xl icon-fill text-error">error</span>
              {error}
            </div>
          )}

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block font-label-lg font-bold text-on-surface mb-2">
                {t("profile_name")}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-surface border border-outline-variant text-on-surface focus-ring font-body-md"
                />
              ) : (
                <div className="flex items-center h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-md">
                  {user.name}
                </div>
              )}
            </div>

            {/* Email (read only) */}
            <div>
              <label className="block font-label-lg font-bold text-on-surface mb-2 flex items-center gap-1 text-on-surface-variant">
                {t("profile_email")} <span className="material-symbols-outlined text-sm" title="Read Only">lock</span>
              </label>
              <div className="flex items-center h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-body-md">
                {user.email}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block font-label-lg font-bold text-on-surface mb-2">
                {t("profile_phone")}
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-surface border border-outline-variant text-on-surface focus-ring font-body-md"
                />
              ) : (
                <div className="flex items-center h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-md">
                  {user.phone}
                </div>
              )}
            </div>

            {/* Role (read only) */}
            <div>
              <label className="block font-label-lg font-bold text-on-surface mb-2 flex items-center gap-1 text-on-surface-variant">
                {t("profile_role")} <span className="material-symbols-outlined text-sm" title="Read Only">lock</span>
              </label>
              <div className="flex items-center h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant font-body-md capitalize">
                {user.role === "worker" ? t("profile_worker") : t("profile_employer")}
              </div>
            </div>
          </div>

          {/* Worker Specific Fields */}
          {user.role === "worker" && (
            <div className="space-y-6 pt-6 border-t border-outline-variant mt-6">
              <h3 className="font-headline-sm font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">engineering</span>
                Worker Profile
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-lg font-bold text-on-surface mb-2">
                    {t("worker_exp")}
                  </label>
                  {editing ? (
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full h-12 px-4 rounded-lg bg-surface border border-outline-variant text-on-surface focus-ring font-body-md"
                      />
                      <span className="absolute right-4 text-on-surface-variant font-body-sm">Years</span>
                    </div>
                  ) : (
                    <div className="flex items-center h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-md">
                      {user.experience || 0} years
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-label-lg font-bold text-on-surface mb-2">
                    {t("worker_company")}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={pastCompany}
                      onChange={(e) => setPastCompany(e.target.value)}
                      placeholder="e.g. L&T Construction"
                      className="w-full h-12 px-4 rounded-lg bg-surface border border-outline-variant text-on-surface focus-ring font-body-md"
                    />
                  ) : (
                    <div className="flex items-center h-12 px-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-md">
                      {user.pastCompany || "None"}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-label-lg font-bold text-on-surface mb-3">
                  {t("worker_skills")}
                </label>
                {editing ? (
                  <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant border-dashed">
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-label-sm font-semibold bg-chip-green text-chip-green-text border border-chip-green-border">
                            {s}
                            <button type="button" onClick={() => removeSkill(s)} className="ml-1 text-chip-green-text hover:text-error">
                               <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {SKILLS.filter((s) => !skills.includes(s.name)).slice(0, 6).map((skill) => (
                        <button key={skill.name} type="button" onClick={() => addSkill(skill.name)} className="px-3 py-1.5 rounded-full font-label-sm font-medium bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">{skill.icon}</span> {skill.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput.trim()); } }} placeholder="Add custom skill..." className="flex-1 h-12 px-4 rounded-lg bg-surface border border-outline-variant text-on-surface font-body-md focus-ring" />
                      <button type="button" onClick={() => addSkill(skillInput.trim())} className="px-6 h-12 rounded-lg bg-secondary-container text-on-secondary-container font-label-lg font-bold hover:brightness-95 transition-colors">Add</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skills?.length > 0 ? user.skills.map((s) => (
                      <span key={s} className="px-3 py-1.5 rounded-full font-label-sm font-semibold bg-chip-green text-chip-green-text border border-chip-green-border">{s}</span>
                    )) : (
                      <span className="font-body-md text-on-surface-variant italic">No skills added</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-label-lg font-bold text-on-surface mb-2">
                  {t("worker_bio")}
                </label>
                {editing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder={t("worker_bio_placeholder")}
                    className="w-full p-4 rounded-lg bg-surface border border-outline-variant text-on-surface focus-ring font-body-md resize-none"
                  />
                ) : (
                  <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-md min-h-[100px] whitespace-pre-wrap">
                    {user.bio || <span className="text-on-surface-variant italic">No bio provided</span>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-8 border-t border-outline-variant flex flex-col sm:flex-row gap-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-12 rounded-lg bg-primary hover:brightness-95 text-on-primary font-label-lg font-bold shadow-md disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("profile_saving")}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      {t("profile_save")}
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 h-12 rounded-lg bg-surface-container text-on-surface font-label-lg font-bold hover:bg-surface-container-high transition-all"
                >
                  {t("profile_cancel")}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="w-full sm:w-auto flex-1 h-12 rounded-lg bg-primary hover:brightness-95 text-on-primary font-label-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                {t("profile_edit")}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-8 h-12 rounded-lg bg-error-container text-error border border-error/20 font-label-lg font-bold hover:brightness-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              {t("profile_logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
