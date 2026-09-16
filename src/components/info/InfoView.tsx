import { Compass, Footprints, Mountain, Plane, ArrowRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { motion } from "motion/react";
import type { IInfoEntry, IProduct } from "../../types";
import { AdminActions } from "../common/AdminActions";
import { AddNewButton } from "../common/AddNewButton";
import { staggerContainer, fadeInUp, heroFadeIn } from "../../lib/motionVariants";
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
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-12 py-10 lg:grid-cols-12 lg:gap-10"
      >
        <motion.div variants={staggerContainer} className="lg:col-span-5">
          <motion.div variants={fadeInUp}>
            {DASH}
            <p className="mt-4 text-sm text-gray-300">
              {intl.formatMessage({ id: "info.greeting" })}
            </p>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="mt-3 text-3xl font-bold leading-tight sm:text-4xl"
          >
            <FormattedMessage id="info.headline1" values={{ accent }} />
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-md text-sm leading-relaxed text-gray-400"
          >
            {intl.formatMessage({ id: "info.paragraph1" })}
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-10">
            <motion.div variants={fadeInUp}>{DASH}</motion.div>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"
            >
              <FormattedMessage id="info.headline2" values={{ accent }} />
            </motion.h2>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="border-t border-white/10 pt-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
        >
          <div className="flex items-center gap-2">
            {DASH}
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {intl.formatMessage({ id: "info.drivesTitle" })}
            </h2>
          </div>
          <motion.div
            variants={staggerContainer}
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {DRIVES.map((drive) => (
              <InfoDriveCard
                key={drive.number}
                icon={drive.icon}
                number={drive.number}
                title={intl.formatMessage({ id: drive.titleId })}
                description={intl.formatMessage({ id: drive.descId })}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="border-t border-white/10 pt-8 lg:col-span-2 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
        >
          <div className="flex items-center gap-2">
            {DASH}
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {intl.formatMessage({ id: "info.nowTitle" })}
            </h2>
          </div>

          <motion.ul variants={staggerContainer} className="mt-6 space-y-3">
            {entries.map((entry) => (
              <motion.li
                key={entry.id}
                variants={fadeInUp}
                className="flex items-start gap-2"
              >
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
              </motion.li>
            ))}
          </motion.ul>

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
        </motion.div>
      </motion.section>

      <motion.div
        variants={heroFadeIn}
        initial="hidden"
        animate="show"
        className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center"
      >
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
      </motion.div>

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
