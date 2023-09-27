import { useRef, useState } from "react";
import AlertModal from "../component/AlertModal";

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
