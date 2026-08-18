import type { ReactNode } from "react";
import { AddNewButton } from "./AddNewButton";
import { PageBanner } from "./PageBanner";

interface IPageHeaderProps {
  banner: string | null;
  isAdmin: boolean;
  onChangeBanner: (url: string) => void;
  onAdd: () => void;
  children?: ReactNode;
}

export const PageHeader = ({
  banner,
  isAdmin,
  onChangeBanner,
  onAdd,
  children,
}: IPageHeaderProps) => (
  <>
    <PageBanner image={banner} isAdmin={isAdmin} onChangeImage={onChangeBanner}>
      <AddNewButton isAdmin={isAdmin} onClick={onAdd} />
    </PageBanner>
    {children}
  </>
);
