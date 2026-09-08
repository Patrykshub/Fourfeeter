import type { ReactNode } from "react";
import type {
  IPageBannerDescriptions,
  PageBannerKey,
} from "../../model/services/PageBannerService";
import { PageDescription } from "./PageDescription";
import { PageHeader } from "./PageHeader";

interface IPageSectionDescription {
  pageKey: PageBannerKey;
  description: string | null;
  descriptions: IPageBannerDescriptions;
  onChangeDescriptions: (next: IPageBannerDescriptions) => void;
}

interface IPageSectionProps {
  banner: string | null;
  isAdmin: boolean;
  onChangeBanner: (url: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  pageDescription?: IPageSectionDescription;
  children: ReactNode;
}

export const PageSection = ({
  banner,
  isAdmin,
  onChangeBanner,
  onAdd,
  addLabel,
  pageDescription,
  children,
}: IPageSectionProps) => (
  <section>
    <PageHeader
      banner={banner}
      isAdmin={isAdmin}
      onChangeBanner={onChangeBanner}
      onAdd={onAdd}
      addLabel={addLabel}
    >
      {pageDescription && (
        <PageDescription {...pageDescription} isAdmin={isAdmin} />
      )}
    </PageHeader>
    {children}
  </section>
);
