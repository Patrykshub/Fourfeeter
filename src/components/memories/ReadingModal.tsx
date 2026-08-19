import { useEffect, useState, type UIEvent } from "react";
import { X } from "lucide-react";
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

  return (
    <>
      <ReadingProgressBar progress={progress} />

      <div
        onClick={onClose}
        onScroll={handleScroll}
        className="fixed inset-0 bg-black/80 backdrop-blur-md overflow-y-auto z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl mx-auto px-4 py-12"
        >
          <img
            src={image}
            alt={title}
            className="w-full h-80 sm:h-[28rem] lg:h-[34rem] object-cover rounded-xl"
          />

          <div className="max-w-3xl mx-auto mt-10 mb-6 text-center">
            <div className="text-sm text-neon font-medium">{date}</div>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">{title}</h2>
            {!isTranslated && (
              <span className="mt-2 inline-block text-xs text-amber-400">
                {untranslatedLabel}
              </span>
            )}
            <p className="mt-8 text-gray-200 text-xl sm:text-2xl leading-relaxed whitespace-pre-wrap text-center">
              {content}
            </p>
          </div>
        </div>
      </div>

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
