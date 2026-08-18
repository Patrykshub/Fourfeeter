import { LOCALE_LABELS, SUPPORTED_LOCALES } from "../../i18n/utils";
import type { SupportedLocale } from "../../i18n/utils";

interface ILocaleTabsProps {
  activeTab: SupportedLocale;
  onChange: (locale: SupportedLocale) => void;
}

export const LocaleTabs = ({ activeTab, onChange }: ILocaleTabsProps) => (
  <div className="flex gap-2">
    {SUPPORTED_LOCALES.map((localeOption) => (
      <button
        key={localeOption}
        type="button"
        onClick={() => onChange(localeOption)}
        className={`px-3 py-1 rounded text-sm ${
          activeTab === localeOption ? "bg-neon text-black" : "bg-black/20"
        }`}
      >
        {LOCALE_LABELS[localeOption]}
      </button>
    ))}
  </div>
);
