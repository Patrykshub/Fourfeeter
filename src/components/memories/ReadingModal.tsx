import { useEffect } from "react";

interface IReadingModalProps {
  image: string;
  title: string;
  content: string;
  date: string;
  isTranslated: boolean;
  untranslatedLabel: string;
  onClose: () => void;
}

const ReadingModal = ({
  image,
  title,
  content,
  date,
  isTranslated,
  untranslatedLabel,
  onClose,
}: IReadingModalProps) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      onClick={onClose}
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

        <div className="max-w-3xl mx-auto mt-10 text-center">
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
  );
};

export { ReadingModal };
