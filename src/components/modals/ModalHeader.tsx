interface IModalHeaderProps {
  title: string
  onClose: () => void
}

export const ModalHeader = ({ title, onClose }: IModalHeaderProps) => (
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <button onClick={onClose} className="p-1">✕</button>
  </div>
)
