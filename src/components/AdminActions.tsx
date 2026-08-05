import { Edit2, Trash2 } from 'lucide-react'

interface IAdminActionsProps {
  onEdit: () => void
  onDelete: () => void
  compact?: boolean
  className?: string
}

const AdminActions = ({ onEdit, onDelete, compact = false, className = '' }: IAdminActionsProps) => {
  if (compact) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <button onClick={onEdit} className="p-1 rounded bg-black/20">
          <Edit2 size={16} />
        </button>
        <button onClick={onDelete} className="p-1 rounded bg-black/20">
          <Trash2 size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <button onClick={onEdit} className="btn-admin">
        <Edit2 className="inline-block mr-2" /> Edytuj
      </button>
      <button onClick={onDelete} className="btn-admin">
        <Trash2 className="inline-block mr-2" /> Usuń
      </button>
    </div>
  )
}

export { AdminActions }
