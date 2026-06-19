import { useLanguage } from "../context/LanguageContext";

const SKILLS = [
  { name: "Electrician", icon: "electrical_services" },
  { name: "Plumber", icon: "water_damage" },
  { name: "Painter", icon: "format_paint" },
  { name: "Carpenter", icon: "carpenter" },
  { name: "Farming", icon: "agriculture" },
  { name: "Cooking", icon: "restaurant" },
  { name: "Driving", icon: "directions_car" },
  { name: "Cleaning", icon: "cleaning_services" },
  { name: "Construction", icon: "architecture" },
  { name: "Tailoring", icon: "design_services" },
  { name: "Gardening", icon: "yard" },
  { name: "Security", icon: "security" },
];

export default function SkillSelector({ onSelect, selected = [] }) {
  const { t } = useLanguage();

  const handleClick = (skillName) => {
    onSelect?.(skillName);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {SKILLS.map((skill, idx) => {
        const isSelected = selected.includes(skill.name);
        return (
          <button
            key={skill.name}
            onClick={() => handleClick(skill.name)}
            style={{ animationDelay: `${idx * 40}ms` }}
            className={`group relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl border transition-all duration-300 ease-out active:scale-[0.97] animate-fade-in-up ${
              isSelected
                ? "bg-primary-container border-primary shadow-md scale-[1.04]"
                : "bg-surface-container-lowest border-outline-variant/50 hover:shadow-md hover:border-primary/30 hover:bg-surface-container-low hover:scale-[1.03]"
            }`}
          >
            {/* Icon container */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                isSelected
                  ? "bg-primary text-on-primary"
                  : "bg-primary-container/10 text-primary group-hover:bg-primary-container group-hover:text-on-primary-container"
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{skill.icon}</span>
            </div>

            {/* Label */}
            <span
              className={`text-sm font-semibold text-center leading-tight transition-colors ${
                isSelected ? "text-on-primary-container" : "text-on-surface"
              }`}
            >
              {t(`skill_${skill.name}`)}
            </span>

            {/* Selected checkmark */}
            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center animate-fade-in shadow-lg z-20 bg-secondary-container">
                <span className="material-symbols-outlined text-on-secondary-container text-sm">check</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { SKILLS };
