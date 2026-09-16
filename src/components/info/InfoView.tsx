import { Compass, Footprints, Mountain, Plane, ArrowRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import type { IInfoEntry, IProduct } from "../../types";
import { AdminActions } from "../common/AdminActions";
import { AddNewButton } from "../common/AddNewButton";
import { ProductsSection } from "./ProductsSection";
import { InfoDriveCard } from "./InfoDriveCard";

interface IInfoViewProps {
  entries: IInfoEntry[];
  isAdmin: boolean;
  onEdit: (entry: IInfoEntry) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  products: IProduct[];
  onEditProduct: (product: IProduct) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: () => void;
}

const DASH = <span className="inline-block h-0.5 w-6 bg-neon align-middle" />;

const accent = (chunks: React.ReactNode) => (
  <span className="text-neon">{chunks}</span>
);

const DRIVES = [
  {
    icon: Footprints,
    number: "01",
    titleId: "info.drive1Title",
    descId: "info.drive1Desc",
  },
  {
    icon: Plane,
    number: "02",
    titleId: "info.drive2Title",
    descId: "info.drive2Desc",
  },
  {
    icon: Mountain,
    number: "03",
    titleId: "info.drive3Title",
    descId: "info.drive3Desc",
  },
  {
    icon: Compass,
    number: "04",
    titleId: "info.drive4Title",
    descId: "info.drive4Desc",
  },
] as const;

export const InfoView = ({
  entries,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
  products,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
}: IInfoViewProps) => {
  const intl = useIntl();

  return (
    <>
      <section className="grid grid-cols-1 gap-12 py-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          {DASH}
          <p className="mt-4 text-sm text-gray-300">
            {intl.formatMessage({ id: "info.greeting" })}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            <FormattedMessage id="info.headline1" values={{ accent }} />
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-400">
            {intl.formatMessage({ id: "info.paragraph1" })}
          </p>

          <div className="mt-10">
            {DASH}
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              <FormattedMessage id="info.headline2" values={{ accent }} />
            </h2>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div className="flex items-center gap-2">
            {DASH}
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {intl.formatMessage({ id: "info.drivesTitle" })}
            </h2>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DRIVES.map((drive) => (
              <InfoDriveCard
                key={drive.number}
                icon={drive.icon}
                number={drive.number}
                title={intl.formatMessage({ id: drive.titleId })}
                description={intl.formatMessage({ id: drive.descId })}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 lg:col-span-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div className="flex items-center gap-2">
            {DASH}
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {intl.formatMessage({ id: "info.nowTitle" })}
            </h2>
          </div>

          <ul className="mt-6 space-y-3">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-0.5 shrink-0 text-neon" />
                <span className="flex-1 text-sm text-gray-300">
                  {entry.label}
                </span>
                {isAdmin && (
                  <AdminActions
                    compact
                    onEdit={() => onEdit(entry)}
                    onDelete={() => onDelete(entry.id)}
                  />
                )}
              </li>
            ))}
          </ul>

          {isAdmin && (
            <div className="mt-3">
              <AddNewButton isAdmin={isAdmin} onClick={onAdd} />
            </div>
          )}

          <div className="mt-8">
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              {intl.formatMessage({ id: "info.nowClosing" })}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm text-white">
          {intl.formatMessage({ id: "info.footerGreeting" })}
          {DASH}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <a href="#" className="hover:text-neon">
            {intl.formatMessage({ id: "info.socialInstagram" })}
          </a>
          <span className="text-gray-600">&middot;</span>
          <a href="#" className="hover:text-neon">
            {intl.formatMessage({ id: "info.socialEmail" })}
          </a>
        </div>
      </div>

      {products.length > 0 && (
        <ProductsSection
          products={products}
          isAdmin={isAdmin}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onAdd={onAddProduct}
        />
      )}
    </>
  );
};
