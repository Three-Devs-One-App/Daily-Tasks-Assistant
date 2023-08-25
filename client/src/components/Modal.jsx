const Modal = ({ children }) => {
  return (
    <div id="modal_overlay">
      <div id="modal_wrapper">{children}</div>
    </div>
  );
};
export default Modal;
