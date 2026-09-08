import { useIntl } from "react-intl";

interface IAddNewButtonProps {
  isAdmin: boolean;
  onClick: () => void;
  label?: string;
}

export const AddNewButton = ({ isAdmin, onClick, label }: IAddNewButtonProps) => {
  const intl = useIntl();

  if (!isAdmin) return null;

  return (
    <button onClick={onClick} className="flex items-center gap-2 text-neon">
      {label ?? intl.formatMessage({ id: "common.addNew" })}
    </button>
  );
};
