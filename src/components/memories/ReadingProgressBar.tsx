interface IReadingProgressBarProps {
  progress: number;
}

const ReadingProgressBar = ({ progress }: IReadingProgressBarProps) => (
  <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-[60]">
    <div
      className="h-full bg-neon transition-[width] duration-150"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export { ReadingProgressBar };
