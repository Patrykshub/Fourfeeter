import { useEffect, useRef, useState, type UIEvent } from "react";
import { X } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { ReadingProgressBar } from "./ReadingProgressBar";

interface IReadingModalProps {
  image: string;
  title: string;
  content: string;
  date: string;
  isTranslated: boolean;
  untranslatedLabel: string;
  closeLabel: string;
  onClose: () => void;
}

export const ReadingModal = ({
  image,
  title,
  content,
  date,
  isTranslated,
  untranslatedLabel,
  closeLabel,
  onClose,
}: IReadingModalProps) => {
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollable = el.scrollHeight - el.clientHeight;
    setProgress(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0);
  };

  const { scrollY } = useScroll({ container: scrollRef });
  const heroScale = useTransform(scrollY, [0, 350], [1, 1.25]);
  const heroBlur = useTransform(scrollY, [0, 350], [0, 12]);
  const heroFilter = useMotionTemplate`blur(${heroBlur}px)`;
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0.15]);
  const heroTitleY = useTransform(scrollY, [0, 300], [0, -140]);
  const heroTitleOpacity = useTransform(scrollY, [0, 220], [1, 0]);

  return (
    <>
      <ReadingProgressBar progress={progress} />

      <motion.div
        ref={scrollRef}
        onClick={onClose}
        onScroll={handleScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md overflow-y-auto z-50"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-4 py-12"
        >
          <div className="relative w-full h-80 sm:h-[28rem] lg:h-[34rem] rounded-xl overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              loading="lazy"
              decoding="async"
              style={{
                scale: heroScale,
                filter: heroFilter,
                opacity: heroOpacity,
              }}
              className="w-full h-full object-cover"
            />
            <motion.div
              style={{ y: heroTitleY, opacity: heroTitleOpacity }}
              className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
            >
              <h1 className="text-white text-4xl sm:text-6xl font-bold text-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {title}
              </h1>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto mt-10 mb-6 text-center">
            <div className="text-6xl text-neon font-medium">{date}</div>
            {!isTranslated && (
              <span className="mt-2 inline-block text-xs text-amber-400">
                {untranslatedLabel}
              </span>
            )}
            <p className="mt-6 text-gray-200 text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap text-center">
              {content}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <button
        onClick={onClose}
        aria-label={closeLabel}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 p-4 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm z-50"
      >
        <X size={32} className="text-neon" />
      </button>
    </>
  );
};
