import { useIntl } from 'react-intl'
import { motion } from 'motion/react'
import { fadeInUp } from '../../lib/motionVariants'

export const HomeComingSoonCard = () => {
  const intl = useIntl()

  return (
    <motion.div
      variants={fadeInUp}
      className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-white/15 p-6 text-center text-sm text-gray-500"
    >
      {intl.formatMessage({ id: 'home.comingSoon' })}
    </motion.div>
  )
}
