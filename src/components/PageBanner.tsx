import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import { ImagePicker } from './ImagePicker'

interface IPageBannerProps {
  image: string | null
  isAdmin: boolean
  onChangeImage: (url: string) => void
  children: ReactNode
  description?: string | null
  onChangeDescription?: (text: string) => void
}

const PageBanner = ({
  image,
  isAdmin,
  onChangeImage,
  children,
  description,
  onChangeDescription,
}: IPageBannerProps) => {
  const intl = useIntl()

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-[#071018] bg-cover bg-center mb-8 min-h-[160px] sm:min-h-[220px] flex flex-col justify-end"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {image && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
      )}

      <div className="relative p-4 sm:p-6 space-y-3 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
        {children}

        {!isAdmin && description && (
          <p className="text-sm text-gray-200 whitespace-pre-wrap">{description}</p>
        )}

        {isAdmin && (
          <div className="pt-2 border-t border-white/10">
            <span className="block text-xs text-gray-300 mb-1">
              {intl.formatMessage({ id: 'pageBanner.sectionBackground' })}
            </span>
            <ImagePicker value={image ?? ''} onChange={onChangeImage} />

            {onChangeDescription && (
              <div className="pt-2 mt-2 border-t border-white/10">
                <span className="block text-xs text-gray-300 mb-1">
                  {intl.formatMessage({ id: 'pageBanner.description' })}
                </span>
                <textarea
                  value={description ?? ''}
                  onChange={(e) => onChangeDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded bg-black/20 p-2 text-sm text-white placeholder-gray-400"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { PageBanner }
