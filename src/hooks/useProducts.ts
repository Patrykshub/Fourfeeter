import { useIntl } from "react-intl";
import type { IProduct } from "../types";
import { app } from "../model/Application";
import { useCachedResource } from "./useCachedResource";

export const useProducts = () => {
  const intl = useIntl();
  const [products, writeProducts] = useCachedResource<IProduct[]>("products", () =>
    app().products.fetchProducts(),
  );

  const saveProduct = async (data: Omit<IProduct, "id"> & { id?: string }) => {
    if (data.id) {
      const { id, ...rest } = data;
      const updated = await app().products.updateProduct(id, rest);
      if (updated) {
        writeProducts((prev) =>
          (prev ?? []).map((product) => (product.id === id ? updated : product)),
        );
      } else {
        alert(intl.formatMessage({ id: "error.saveProduct" }));
      }
      return;
    }

    const inserted = await app().products.insertProduct(data);
    if (inserted) {
      writeProducts((prev) => [...(prev ?? []), inserted]);
    } else {
      alert(intl.formatMessage({ id: "error.saveProduct" }));
    }
  };

  const deleteProduct = async (id: string) => {
    const success = await app().products.deleteProduct(id);
    if (success) {
      writeProducts((prev) => (prev ?? []).filter((product) => product.id !== id));
    } else {
      alert(intl.formatMessage({ id: "error.deleteProduct" }));
    }
  };

  return { products: products ?? [], saveProduct, deleteProduct };
};
