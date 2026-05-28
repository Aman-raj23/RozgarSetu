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
            className={`group relative flex flex-col items-center justify-center gap-3 p-4 sm:p-6 rounded-[2rem] transition-all duration-300 active:scale-95 overflow-hidden ${
              isSelected
                ? "bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-2 ring-primary-500 scale-105 z-10"
                : "bg-white shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 border border-dark-100/50"
            }`}
          >
            {isSelected && (
              <div className="absolute inset-0 bg-primary-50/50 z-0" />
            )}
            
            <div
              className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-3xl sm:text-4xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out`}
            >
              <span className="drop-shadow-md">{skill.icon}</span>
            </div>
            
            <span
              className={`relative z-10 text-sm sm:text-base font-bold text-center tracking-wide transition-colors ${
                isSelected ? "text-primary-700" : "text-dark-600 group-hover:text-dark-900"
              }`}
            >
              {t(`skill_${skill.name}`)}
            </span>
            
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center animate-fade-in z-10 shadow-md">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
