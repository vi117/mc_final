import { useRef, useState } from "react";
import ConfirmModal from "../component/ConfirmModal";

/**
 * Creates and returns an confirm modal hook.
 *
 * @return {{ConfirmModal: () => JSX.Element, showConfirmModal: (title: string, msg: string) => Promise<void>}}
 * An object containing the AlertModal component and the showAlertModal function.
 * @example
 * ```tsx
 * const { ConfirmModal, showConfirmModal } = useAlertModal();
 * ...
 * return <>
 *   <ConfirmModal />
 *   ...
 *   <button onClick={async ()=>{
 *      const v = await showConfirmModal("title", "msg")
 *      if (v) {
 *        ...
 *      }
 *      ...
 *     }}/>
 * </>
 * ```
 */

export function useConfirmModal() {
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const promiseResolveRef = useRef<(value: boolean) => void>(() => {});

  return {
    ConfirmModal: () => {
      return (
        <ConfirmModal
          title={title}
          msg={msg}
          showModal={showModal}
          onCancel={() => {
            setShowModal(false);
            promiseResolveRef.current(false);
          }}
          onConfirm={() => {
            setShowModal(false);
            promiseResolveRef.current(true);
          }}
        />
      );
    },
    showConfirmModal: (title: string, msg: string) => {
      if (showModal) {
        promiseResolveRef.current(false);
        promiseResolveRef.current = () => {};
      }
      const promise = new Promise<boolean>((resolve) => {
        promiseResolveRef.current = resolve;
      });
      setShowModal(true);
      setTitle(title);
      setMsg(msg);
      return promise;
    },
  };
}

export default useConfirmModal;
