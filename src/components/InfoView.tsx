import { useIntl } from 'react-intl'
import type { IInfoEntry } from '../types'
import { AdminActions } from './AdminActions'
import { EmptyState } from './EmptyState'
import { PageBanner } from './PageBanner'

interface IInfoViewProps {
  entries: IInfoEntry[]
  isAdmin: boolean
  onEdit: (entry: IInfoEntry) => void
  onDelete: (id: string) => void
  onAdd: () => void
  banner: string | null
  onChangeBanner: (url: string) => void
}

const InfoView = ({ entries, isAdmin, onEdit, onDelete, onAdd, banner, onChangeBanner }: IInfoViewProps) => {
  const intl = useIntl()

  const header = (
    <PageBanner image={banner} isAdmin={isAdmin} onChangeImage={onChangeBanner}>
      <div className="flex justify-between items-center">
        <h2 className="uppercase text-sm text-gray-300">
          {intl.formatMessage({ id: 'info.heading' })}
        </h2>
        {isAdmin && (
          <button onClick={onAdd} className="flex items-center gap-2 text-neon">
            {intl.formatMessage({ id: 'common.addNew' })}
          </button>
        )}
      </div>
    </PageBanner>
  )

  if (entries.length === 0) {
    return (
      <section>
        {header}
        <EmptyState
          message={intl.formatMessage({ id: 'info.emptyState' })}
          isAdmin={isAdmin}
          onAdd={onAdd}
        />
      </section>
    )
  }

  return (
    <section>
      {header}

      <div className="border-y border-white/10 divide-y divide-white/10">
        {entries.map((entry) => (
          <article key={entry.id} className="flex items-center gap-4 py-4">
            <span className="shrink-0 w-32 text-xs uppercase tracking-wide text-neon truncate">
              {entry.label}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate">{entry.value}</p>
            </div>
            {isAdmin && (
              <AdminActions compact onEdit={() => onEdit(entry)} onDelete={() => onDelete(entry.id)} />
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export { InfoView }
