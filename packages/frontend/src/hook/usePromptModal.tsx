import { useRef, useState } from "react";
import { PromptModal } from "../component/DialogModal";

/**
 * Creates and returns an confirm modal hook.
 *
 * @return {{usePromptModal: () => JSX.Element, showusePromptModal: (title: string, msg: string) => Promise<void>}}
 * An object containing the AlertModal component and the showAlertModal function.
 * @example
 * ```tsx
 * const { PromptModal, showPromptModal } = usePromptModal();
 * ...
 * return <>
 *   <PromptModal />
 *   ...
 *   <button onClick={async ()=>{
 *      const v = await showPromptModal("title", "msg")
 *      console.log(v)
 *      ...
 *     }}/>
 * </>
 * ```
 */

export function usePromptModal() {
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const promiseResolveRef = useRef<(value?: string) => void>(() => {});

  return {
    PromptModal: ({
      placeholder = "Enter the text",
    }) => {
      return (
        <PromptModal
          title={title}
          msg={msg}
          showModal={showModal}
          placeholder={placeholder}
          onCancel={() => {
            setShowModal(false);
            promiseResolveRef.current();
          }}
          onConfirm={(v) => {
            setShowModal(false);
            promiseResolveRef.current(v);
          }}
        />
      );
    },
    showPromptModal: (title: string, msg: string) => {
      if (showModal) {
        promiseResolveRef.current();
        promiseResolveRef.current = () => {};
      }
      const promise = new Promise<string | undefined>((resolve) => {
        promiseResolveRef.current = resolve;
      });
      setShowModal(true);
      setTitle(title);
      setMsg(msg);
      return promise;
    },
  };
}

export default usePromptModal;
