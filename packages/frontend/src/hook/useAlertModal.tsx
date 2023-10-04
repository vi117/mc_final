import { useRef, useState } from "react";
import AlertModal from "../component/AlertModal";

/**
 * Creates and returns an alert modal hook.
 *
 * @return {{AlertModal: () => JSX.Element, showAlertModal: (title: string, msg: string) => Promise<void>}} An object containing the AlertModal component and the showAlertModal function.
 * @example
 * ```tsx
 * const { AlertModal, showAlertModal } = useAlertModal();
 * ...
 * return <>
 *   <AlertModal />
 *   ...
 *   <button onClick={async ()=>{
 *      await showAlertModal("title", "msg")
 *    }}/>
 * </>
 * ```
 */

export function useAlertModal() {
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const promiseResolveRef = useRef<() => void>(() => {});

  return {
    AlertModal: () => {
      return (
        <AlertModal
          title={title}
          msg={msg}
          showModal={showModal}
          onHide={() => {
            setShowModal(false);
            promiseResolveRef.current();
          }}
        />
      );
    },
    showAlertModal: (title: string, msg: string) => {
      if (showModal) {
        promiseResolveRef.current();
        promiseResolveRef.current = () => {};
      }
      const promise = new Promise<void>((resolve) => {
        promiseResolveRef.current = resolve;
      });
      setShowModal(true);
      setTitle(title);
      setMsg(msg);
      return promise;
    },
  };
}

export default useAlertModal;
