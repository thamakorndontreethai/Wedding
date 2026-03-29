import '../../index.css';
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  dialogClassName = '',
  surfaceClassName = '',
  bodyClassName = '',
}) => {
  if (!isOpen) return null;
  return (
    <div className="app-modal" role="dialog" aria-modal="true">
      <div className={`app-modal__dialog ${dialogClassName}`.trim()}>
        <div className="app-modal__pattern" />
        <div className={`app-modal__surface ${surfaceClassName}`.trim()}>
          <div className="app-modal__header">
            <h2 className="app-modal__title">{title}</h2>
            <button type="button" onClick={onClose} className="app-modal__close" aria-label="Close">&times;</button>
          </div>
          <div className={`app-modal__body ${bodyClassName}`.trim()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;