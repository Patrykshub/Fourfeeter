import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

interface IPageSectionProps {
  header: ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
  isAdmin: boolean;
  onAdd: () => void;
  children: ReactNode;
}

export const PageSection = ({
  header,
  isEmpty,
  emptyMessage,
  isAdmin,
  onAdd,
  children,
}: IPageSectionProps) => (
  <section>
    {header}
    {isEmpty ? (
      <EmptyState message={emptyMessage} isAdmin={isAdmin} onAdd={onAdd} />
    ) : (
      children
    )}
  </section>
);
