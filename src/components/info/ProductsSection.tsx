import { useIntl } from "react-intl";
import type { IProduct } from "../../types";
import { AddNewButton } from "../common/AddNewButton";
import { EmptyState } from "../common/EmptyState";
import { ProductCard } from "./ProductCard";

interface IProductsSectionProps {
  products: IProduct[];
  isAdmin: boolean;
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ProductsSection = ({
  products,
  isAdmin,
  onEdit,
  onDelete,
  onAdd,
}: IProductsSectionProps) => {
  const intl = useIntl();

  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg uppercase tracking-wide text-neon">
          {intl.formatMessage({ id: "products.sectionTitle" })}
        </h2>
        <AddNewButton isAdmin={isAdmin} onClick={onAdd} />
      </div>

      {products.length === 0 ? (
        <EmptyState
          message={intl.formatMessage({ id: "products.emptyState" })}
          isAdmin={isAdmin}
          onAdd={onAdd}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={isAdmin}
              onEdit={() => onEdit(product)}
              onDelete={() => onDelete(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
