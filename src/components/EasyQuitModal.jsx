import { forwardRef } from 'react';

const EasyQuitModal = forwardRef(({ id, title, children }, ref) => (
  <>
    <dialog id={id} ref={ref} className="modal" aria-modal="true">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <div className="pt-4">{children}</div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </>
));

export default EasyQuitModal;