import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";

interface IPageSectionProps {
  banner: string | null;
  isAdmin: boolean;
  onChangeBanner: (url: string) => void;
  onAdd: () => void;
  headerExtra?: ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

export const PageSection = ({
  banner,
  isAdmin,
  onChangeBanner,
  onAdd,
  headerExtra,
  isEmpty,
  emptyMessage,
  children,
}: IPageSectionProps) => (
  <section>
    <PageHeader banner={banner} isAdmin={isAdmin} onChangeBanner={onChangeBanner} onAdd={onAdd}>
      {headerExtra}
    </PageHeader>
    {isEmpty ? (
      <EmptyState message={emptyMessage} isAdmin={isAdmin} onAdd={onAdd} />
    ) : (
      children
    )}
  </section>
);
