import { useIntl } from "react-intl";
import { useLocale } from "../i18n/LocaleContext";
import type { SupportedLocale } from "../i18n/utils";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  "pl-PL": "PL",
  "en-GB": "EN",
  "de-DE": "DE",
};

const LanguagePicker = () => {
  const intl = useIntl();
  const { locale, setLocale } = useLocale();

  return (
    <label className="flex items-center gap-1 text-xs text-gray-400">
      <span className="hidden sm:inline">
        {intl.formatMessage({ id: "footer.language" })}
      </span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as SupportedLocale)}
        className="bg-black/20 rounded px-1 py-1 text-xs text-gray-200"
      >
        {(Object.keys(LOCALE_LABELS) as SupportedLocale[]).map((option) => (
          <option key={option} value={option}>
            {LOCALE_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  );
};

export { LanguagePicker };
