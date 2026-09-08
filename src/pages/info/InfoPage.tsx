import { useIntl } from "react-intl";
import { AnimatePresence } from "motion/react";
import { useInfoEntries } from "../../hooks/useInfoEntries";
import { useInfoEntryEditor } from "../../hooks/useInfoEntryEditor";
import { useProducts } from "../../hooks/useProducts";
import { useProductEditor } from "../../hooks/useProductEditor";
import { usePageBanner } from "../../hooks/usePageBanner";
import { useAppContext } from "../../router/AppContext";
import { InfoView } from "../../components/info/InfoView";
import { InfoEntryModal } from "../../components/info/InfoEntryModal";
import { ProductEntryModal } from "../../components/info/ProductEntryModal";
import { ConfirmDialog } from "../../components/modals/ConfirmDialog";

export const InfoPage = () => {
  const intl = useIntl();
  const { isAdmin } = useAppContext();
  const { entries, saveEntry, deleteEntry } = useInfoEntries();
  const {
    editing,
    isFormOpen,
    pendingDeleteId,
    openEditor,
    closeEditor,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
  } = useInfoEntryEditor({ saveEntry, deleteEntry });
  const { products, saveProduct, deleteProduct } = useProducts();
  const {
    editing: editingProduct,
    isFormOpen: isProductFormOpen,
    pendingDeleteId: pendingDeleteProductId,
    openEditor: openProductEditor,
    closeEditor: closeProductEditor,
    handleSave: handleSaveProduct,
    handleDelete: handleDeleteProduct,
    confirmDelete: confirmDeleteProduct,
    cancelDelete: cancelDeleteProduct,
  } = useProductEditor({ saveProduct, deleteProduct });
  const { banner, setBanner, description, descriptions, setDescriptions } =
    usePageBanner("info");

  return (
    <>
      <InfoView
        entries={entries}
        isAdmin={isAdmin}
        onEdit={openEditor}
        onDelete={handleDelete}
        onAdd={() => openEditor()}
        banner={banner}
        onChangeBanner={setBanner}
        description={description}
        descriptions={descriptions}
        onChangeDescriptions={setDescriptions}
        products={products}
        onEditProduct={openProductEditor}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={() => openProductEditor()}
      />

      <AnimatePresence>
        {isFormOpen && (
          <InfoEntryModal
            key="info-entry-modal"
            entry={editing}
            onClose={closeEditor}
            onSave={handleSave}
          />
        )}

        {isProductFormOpen && (
          <ProductEntryModal
            key="product-entry-modal"
            product={editingProduct}
            onClose={closeProductEditor}
            onSave={handleSaveProduct}
          />
        )}

        {pendingDeleteId && (
          <ConfirmDialog
            key="confirm-delete-info"
            title={intl.formatMessage({ id: "common.delete" })}
            message={intl.formatMessage({ id: "confirm.deleteInfoEntry" })}
            confirmLabel={intl.formatMessage({ id: "common.delete" })}
            cancelLabel={intl.formatMessage({ id: "common.cancel" })}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}

        {pendingDeleteProductId && (
          <ConfirmDialog
            key="confirm-delete-product"
            title={intl.formatMessage({ id: "common.delete" })}
            message={intl.formatMessage({ id: "confirm.deleteProduct" })}
            confirmLabel={intl.formatMessage({ id: "common.delete" })}
            cancelLabel={intl.formatMessage({ id: "common.cancel" })}
            onConfirm={confirmDeleteProduct}
            onCancel={cancelDeleteProduct}
          />
        )}
      </AnimatePresence>
    </>
  );
};
