import { Lock, LogOut } from "lucide-react";
import { useIntl } from "react-intl";
import { LanguagePicker } from "./LanguagePicker";

interface IAdminFooterProps {
  isAdmin: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const AdminFooter = ({
  isAdmin,
  onLogout,
  onLoginClick,
}: IAdminFooterProps) => {
  const intl = useIntl();

  return (
    <footer className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
      <div className="bg-black/30 px-4 py-2 rounded-full flex items-center gap-2 sm:gap-3 max-w-full">
        {isAdmin ? (
          <button
            onClick={onLogout}
            title={intl.formatMessage({ id: "footer.logout" })}
            className="flex items-center gap-2 shrink-0"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            title={intl.formatMessage({ id: "footer.adminLogin" })}
            className="flex items-center gap-2 shrink-0"
          >
            <Lock size={20} />
          </button>
        )}

        <LanguagePicker />
      </div>
    </footer>
  );
};
