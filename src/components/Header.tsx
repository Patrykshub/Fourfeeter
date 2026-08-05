import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useIntl } from "react-intl";
import { NAV_CATEGORIES as CATEGORIES } from "../lib/categories";
import type { Category } from "../lib/categories";
import type { LocaleKey } from "../i18n/utils";
import { navigate, useRouter } from "../router/useRouter";
import { CATEGORY_PATHS } from "../router/routes";

const CATEGORY_LABEL_IDS: Record<Category, LocaleKey> = {
  HOME: "nav.home",
  MEMORIES: "nav.memories",
  INFO: "nav.info",
};

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { pathname } = useRouter();
  const intl = useIntl();

  const select = (category: Category) => {
    navigate(CATEGORY_PATHS[category]);
    setMenuOpen(false);
  };

  const isActive = (category: Category) => pathname === CATEGORY_PATHS[category];

  return (
    <header className="pt-8 pb-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
          <div className="logo text-4xl sm:text-5xl font-semibold tracking-tight">Fourfeeter</div>
          <nav className="hidden md:flex justify-center gap-8 mt-4 uppercase text-sm text-gray-300">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => select(category)}
                className={isActive(category) ? "text-white" : "hover:text-white"}
              >
                {intl.formatMessage({ id: CATEGORY_LABEL_IDS[category] })}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:hidden absolute right-4 top-6">
          <button
            aria-label={intl.formatMessage({ id: "nav.menuAriaLabel" })}
            onClick={() => setMenuOpen((s) => !s)}
            className="p-2 rounded-md bg-black/20"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="mt-6 h-0.5 bg-neon/40 neon-border" />

      {isMenuOpen && (
        <div className="mt-4 p-4 rounded bg-black/20 md:hidden">
          <nav className="flex flex-col gap-3 uppercase text-sm text-gray-300">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => select(category)}
                className={`text-left ${isActive(category) ? "text-white" : ""}`}
              >
                {intl.formatMessage({ id: CATEGORY_LABEL_IDS[category] })}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export { Header };
