import { forwardRef } from 'react';

const Modal = forwardRef(({ id, title, children, showCloseButton = true }, ref) => (
  <dialog id={id} ref={ref} className="modal" aria-modal="true">
    <div className="modal-box">
      {title && <h3 className="font-bold text-lg">{title}</h3>}
      <div className="py-4">{children}</div>
      {/* Default close button, can be hidden via prop */}
      {showCloseButton && (
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btnSpecial">Close</button>
          </form>
        </div>
      )}
    </div>
  </dialog>
));

export default Modal;
