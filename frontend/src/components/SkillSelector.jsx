import { useLanguage } from "../context/LanguageContext";

const SKILLS = [
  { name: "Electrician", icon: "⚡", color: "from-amber-400 to-amber-600" },
  { name: "Plumber", icon: "🔧", color: "from-blue-400 to-blue-600" },
  { name: "Painter", icon: "🎨", color: "from-pink-400 to-pink-600" },
  { name: "Carpenter", icon: "🪚", color: "from-orange-400 to-orange-600" },
  { name: "Farming", icon: "🌾", color: "from-green-400 to-green-600" },
  { name: "Cooking", icon: "🍳", color: "from-red-400 to-red-600" },
  { name: "Driving", icon: "🚗", color: "from-indigo-400 to-indigo-600" },
  { name: "Cleaning", icon: "🧹", color: "from-cyan-400 to-cyan-600" },
  { name: "Construction", icon: "🏗️", color: "from-stone-400 to-stone-600" },
  { name: "Tailoring", icon: "🧵", color: "from-purple-400 to-purple-600" },
  { name: "Gardening", icon: "🌿", color: "from-emerald-400 to-emerald-600" },
  { name: "Security", icon: "🛡️", color: "from-slate-400 to-slate-600" },
];

export default function SkillSelector({ onSelect, selected = [] }) {
  const { t } = useLanguage();

  const handleClick = (skillName) => {
    onSelect?.(skillName);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {SKILLS.map((skill) => {
        const isSelected = selected.includes(skill.name);
        return (
          <button
            key={skill.name}
            onClick={() => handleClick(skill.name)}
            className={`group relative flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
              isSelected
                ? "border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10"
                : "border-dark-100 bg-white hover:border-primary-300 hover:shadow-md"
            }`}
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-2xl sm:text-3xl shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all`}
            >
              {skill.icon}
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                isSelected ? "text-primary-700" : "text-dark-600"
              }`}
            >
              {t(`skill_${skill.name}`)}
            </span>
            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center animate-fade-in">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { SKILLS };
