import { Fragment } from "react";
import { useIntl } from "react-intl";
import type { IInfoEntry } from "../types";
import { AdminActions } from "./AdminActions";
import { EmptyState } from "./EmptyState";
import { PageBanner } from "./PageBanner";
import { PageDescription } from "./PageDescription";

interface IInfoViewProps {
  entries: IInfoEntry[];
  isAdmin: boolean;
  onEdit: (entry: IInfoEntry) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  banner: string | null;
  onChangeBanner: (url: string) => void;
  description: string | null;
  onChangeDescription: (text: string) => void;
}

const InfoView = ({
  entries,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  banner,
  onChangeBanner,
  description,
  onChangeDescription,
}: IInfoViewProps) => {
  const intl = useIntl();

  const header = (
    <>
      <PageBanner
        image={banner}
        isAdmin={isAdmin}
        onChangeImage={onChangeBanner}
      >
        <div className="flex justify-between items-center">
          <h2 className="uppercase text-sm text-gray-300">
            {intl.formatMessage({ id: "info.heading" })}
          </h2>
          {isAdmin && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 text-neon"
            >
              {intl.formatMessage({ id: "common.addNew" })}
            </button>
          )}
        </div>
      </PageBanner>
      <PageDescription
        description={description}
        isAdmin={isAdmin}
        onChangeDescription={onChangeDescription}
      />
    </>
  );

  if (entries.length === 0) {
    return (
      <section>
        {header}
        <EmptyState
          message={intl.formatMessage({ id: "info.emptyState" })}
          isAdmin={isAdmin}
          onAdd={onAdd}
        />
      </section>
    );
  }

  return (
    <section>
      {header}

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
    </section>
  );
};

export { InfoView };
