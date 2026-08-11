import { useIntl } from "react-intl";
import { useLocale } from "../../i18n/LocaleContext";
import type { SupportedLocale } from "../../i18n/utils";
import { LabeledSelect } from "./LabeledSelect";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  "pl-PL": "PL",
  "en-GB": "EN",
  "de-DE": "DE",
};

const LanguagePicker = () => {
  const intl = useIntl();
  const { locale, setLocale } = useLocale();

  return (
    <LabeledSelect
      label={intl.formatMessage({ id: "footer.language" })}
      value={locale}
      onChange={(value) => setLocale(value as SupportedLocale)}
      options={(Object.keys(LOCALE_LABELS) as SupportedLocale[]).map((option) => ({
        value: option,
        label: LOCALE_LABELS[option],
      }))}
    />
  );
};

export { LanguagePicker };
