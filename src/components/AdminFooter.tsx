import { Lock, LogOut } from "lucide-react";
import { FontPicker } from "./FontPicker";
import type { FontOption } from "../hooks/useFontPreference";

interface IAdminFooterProps {
  isAdmin: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  font: FontOption;
  onFontChange: (font: FontOption) => void;
}

const AdminFooter = ({
  isAdmin,
  onLogout,
  onLoginClick,
  font,
  onFontChange,
}: IAdminFooterProps) => {
  return (
    <footer className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
      <div className="bg-black/30 px-4 py-2 rounded-full flex items-center gap-2 sm:gap-3 max-w-full">
        {isAdmin ? (
          <button
            onClick={onLogout}
            title="Wyloguj"
            className="flex items-center gap-2 shrink-0"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            title="Admin"
            className="flex items-center gap-2 shrink-0"
          >
            <Lock size={20} />
          </button>
        )}

        <FontPicker font={font} onChange={onFontChange} />
      </div>
    </footer>
  );
};

export { AdminFooter };
