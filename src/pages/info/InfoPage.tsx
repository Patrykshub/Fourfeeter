import { useInfoEntries } from "../../hooks/useInfoEntries";
import { useInfoEntryEditor } from "../../hooks/useInfoEntryEditor";
import { usePageBanner } from "../../hooks/usePageBanner";
import { useAppContext } from "../../router/AppContext";
import { InfoView } from "../../components/InfoView";
import { InfoEntryModal } from "../../components/InfoEntryModal";

const InfoPage = () => {
  const { isAdmin } = useAppContext();
  const { entries, saveEntry, deleteEntry } = useInfoEntries();
  const { editing, isFormOpen, openEditor, closeEditor, handleSave, handleDelete } =
    useInfoEntryEditor({ saveEntry, deleteEntry });
  const { banner, setBanner } = usePageBanner("info");

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
      />

      {isFormOpen && (
        <InfoEntryModal entry={editing} onClose={closeEditor} onSave={handleSave} />
      )}
    </>
  );
};

export { InfoPage };
