import { useIntl } from "react-intl";
import { useInfoEntries } from "../../hooks/useInfoEntries";
import { useInfoEntryEditor } from "../../hooks/useInfoEntryEditor";
import { usePageBanner } from "../../hooks/usePageBanner";
import { useAppContext } from "../../router/AppContext";
import { InfoView } from "../../components/InfoView";
import { InfoEntryModal } from "../../components/InfoEntryModal";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const InfoPage = () => {
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
  const { banner, setBanner, description, setDescription } = usePageBanner("info");

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
        onChangeDescription={setDescription}
      />

      {isFormOpen && (
        <InfoEntryModal entry={editing} onClose={closeEditor} onSave={handleSave} />
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title={intl.formatMessage({ id: "common.delete" })}
          message={intl.formatMessage({ id: "confirm.deleteInfoEntry" })}
          confirmLabel={intl.formatMessage({ id: "common.delete" })}
          cancelLabel={intl.formatMessage({ id: "common.cancel" })}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export { InfoPage };
