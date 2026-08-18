interface IEmptyStateProps {
  message: string;
  isAdmin: boolean;
  onAdd: () => void;
}

export const EmptyState = ({ message, isAdmin, onAdd }: IEmptyStateProps) => (
  <div className="text-center text-gray-400 py-16">
    {message}
    {isAdmin && (
      <div className="mt-4">
        <button onClick={onAdd} className="btn-admin">
          Dodaj nowy
        </button>
      </div>
    )}
  </div>
);
