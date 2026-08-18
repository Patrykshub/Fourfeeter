import { useIntl } from "react-intl";

interface IAddNewButtonProps {
  isAdmin: boolean;
  onClick: () => void;
}

export const AddNewButton = ({ isAdmin, onClick }: IAddNewButtonProps) => {
  const intl = useIntl();

  if (!isAdmin) return null;

  return (
    <button onClick={onClick} className="flex items-center gap-2 text-neon">
      {intl.formatMessage({ id: "common.addNew" })}
    </button>
  );
};
