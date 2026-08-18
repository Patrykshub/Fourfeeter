import { Fragment } from "react";
import { useIntl } from "react-intl";
import type { IInfoEntry } from "../../types";
import type { IPageBannerDescriptions } from "../../model/services/PageBannerService";
import { AddNewButton } from "../common/AddNewButton";
import { AdminActions } from "../common/AdminActions";
import { PageBanner } from "../common/PageBanner";
import { PageSection } from "../common/PageSection";
import { PageDescription } from "../common/PageDescription";

interface IInfoViewProps {
  entries: IInfoEntry[];
  isAdmin: boolean;
  onEdit: (entry: IInfoEntry) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  banner: string | null;
  onChangeBanner: (url: string) => void;
  description: string | null;
  descriptions: IPageBannerDescriptions;
  onChangeDescriptions: (next: IPageBannerDescriptions) => void;
}

export const InfoView = ({
  entries,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  banner,
  onChangeBanner,
  description,
  descriptions,
  onChangeDescriptions,
}: IInfoViewProps) => {
  const intl = useIntl();

  const header = (
    <>
      <PageBanner
        image={banner}
        isAdmin={isAdmin}
        onChangeImage={onChangeBanner}
      >
        <AddNewButton isAdmin={isAdmin} onClick={onAdd} />
      </PageBanner>
      <PageDescription
        pageKey="info"
        description={description}
        descriptions={descriptions}
        isAdmin={isAdmin}
        onChangeDescriptions={onChangeDescriptions}
      />
    </>
  );

  return (
    <PageSection
      header={header}
      isEmpty={entries.length === 0}
      emptyMessage={intl.formatMessage({ id: "info.emptyState" })}
      isAdmin={isAdmin}
      onAdd={onAdd}
    >
      <div className="max-w-md mx-auto grid grid-cols-2 gap-x-4 gap-y-2 py-8">
        {entries.map((entry) => (
          <Fragment key={entry.id}>
            <span className="self-center text-right text-base uppercase tracking-wide text-neon">
              {entry.label}
            </span>
            <div className="flex items-center gap-3">
              <p className="text-base text-gray-200">{entry.value}</p>
              {isAdmin && (
                <AdminActions
                  compact
                  onEdit={() => onEdit(entry)}
                  onDelete={() => onDelete(entry.id)}
                />
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </PageSection>
  );
};
