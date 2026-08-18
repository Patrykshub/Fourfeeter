import type { FC, ReactNode } from 'react'

type TModalShellMaxWidth = 'sm' | '2xl'

interface IModalShellProps {
  maxWidth?: TModalShellMaxWidth
  className?: string
  children: ReactNode
}

const MAX_WIDTH_CLASSES: Record<TModalShellMaxWidth, string> = {
  sm: 'max-w-sm',
  '2xl': 'max-w-2xl',
}

export const ModalShell: FC<IModalShellProps> = ({ maxWidth = 'sm', className, children }) => (
  <div
    className={['fixed inset-0 bg-black/60 flex items-center justify-center p-4', className]
      .filter(Boolean)
      .join(' ')}
  >
    <div className={`bg-[#061018] ${MAX_WIDTH_CLASSES[maxWidth]} w-full rounded-lg p-6`}>
      {children}
    </div>
  </div>
)
