import '../../index.css';
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 backdrop-blur-[2px] p-4">
      <div className="relative overflow-hidden w-full max-w-md rounded-2xl border border-stone-300/80 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(20,20,20,0.08)_0.45px,transparent_0.45px)] bg-[length:3px_3px] opacity-35" />
        <div className="relative p-6 bg-[radial-gradient(circle_at_18%_20%,#fdecc8_0%,#f9f7f0_35%,#f3f1ea_100%)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl leading-none font-semibold text-stone-900 tracking-tight">{title}</h2>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-800 text-2xl leading-none">&times;</button>
          </div>
          <div className="text-stone-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;