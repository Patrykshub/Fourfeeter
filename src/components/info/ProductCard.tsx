import { ImageOff } from "lucide-react";
import type { IProduct } from "../../types";
import { AdminActions } from "../common/AdminActions";

interface IProductCardProps {
  product: IProduct;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductCard = ({
  product,
  isAdmin,
  onEdit,
  onDelete,
}: IProductCardProps) => {
  const image = product.image ? (
    <img
      src={product.image}
      alt=""
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover"
    />
  ) : (
    <ImageOff className="text-gray-500" />
  );

  return (
    <div className="flex flex-col">
      {product.link ? (
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full aspect-square rounded-lg overflow-hidden bg-black/20 flex items-center justify-center"
        >
          {image}
        </a>
      ) : (
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-black/20 flex items-center justify-center">
          {image}
        </div>
      )}

      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          {product.link ? (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium uppercase tracking-wide text-neon truncate block hover:underline"
            >
              {product.label}
            </a>
          ) : (
            <p className="text-sm font-medium uppercase tracking-wide text-neon truncate">
              {product.label}
            </p>
          )}
          <p className="text-xs text-gray-400 line-clamp-2">{product.value}</p>
        </div>
        {isAdmin && (
          <AdminActions compact onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>
    </div>
  );
};
