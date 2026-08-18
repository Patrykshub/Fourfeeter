import type { ReactNode } from "react";
import type { IPageBannerDescriptions, PageBannerKey } from "../../model/services/PageBannerService";
import { EmptyState } from "./EmptyState";
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
  onAdd: () => void;
  pageDescription?: IPageSectionDescription;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

export const PageSection = ({
  banner,
  isAdmin,
  onChangeBanner,
  onAdd,
  pageDescription,
  isEmpty,
  emptyMessage,
  children,
}: IPageSectionProps) => (
  <section>
    <PageHeader banner={banner} isAdmin={isAdmin} onChangeBanner={onChangeBanner} onAdd={onAdd}>
      {pageDescription && <PageDescription {...pageDescription} isAdmin={isAdmin} />}
    </PageHeader>
    {isEmpty ? (
      <EmptyState message={emptyMessage} isAdmin={isAdmin} onAdd={onAdd} />
    ) : (
      children
    )}
  </section>
);
