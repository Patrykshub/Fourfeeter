import type { ReactNode } from "react";
import { AddNewButton } from "./AddNewButton";
import { PageBanner } from "./PageBanner";

interface IPageHeaderProps {
  banner: string | null;
  isAdmin: boolean;
  onChangeBanner: (url: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  children?: ReactNode;
}

export const PageHeader = ({
  banner,
  isAdmin,
  onChangeBanner,
  onAdd,
  addLabel,
  children,
}: IPageHeaderProps) => (
  <>
    <PageBanner image={banner} isAdmin={isAdmin} onChangeImage={onChangeBanner}>
      {onAdd && <AddNewButton isAdmin={isAdmin} onClick={onAdd} label={addLabel} />}
    </PageBanner>
    {children}
  </>
);
