import type { FC, ReactNode } from 'react'
import { motion } from 'motion/react'

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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className={['fixed inset-0 bg-black/60 flex items-center justify-center p-4', className]
      .filter(Boolean)
      .join(' ')}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`bg-surface ${MAX_WIDTH_CLASSES[maxWidth]} w-full rounded-lg p-6`}
    >
      {children}
    </motion.div>
  </motion.div>
)
