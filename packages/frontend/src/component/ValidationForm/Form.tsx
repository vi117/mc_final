import { RefObject, useCallback, useRef } from "react";
import { ValidateError, ValidationFormContext } from "./context";

export function Form(
  { children, onValidateChange }: {
    children: React.ReactNode;
    onValidateChange?: (errors: ValidateError[]) => void;
  },
) {
  const arrayRef = useRef<ValidateError[]>([]);
  //   const [state, setState] = useState<ValidateError[]>([]);
  const addError = useCallback(
    (name: string, ref: RefObject<HTMLInputElement>, message: string) => {
      const state = arrayRef.current;
      const setState = (s: ValidateError[]) => {
        arrayRef.current = s;
      };
      let newState;
      if (state.find((error) => error.name === name)) {
        newState = state.map((error) => {
          if (error.name === name) {
            return {
              ...error,
              ref: ref,
              message: message,
            };
          }
          return error;
        });
        setState(newState);
      } else {
        newState = [...state, {
          name: name,
          ref: ref,
          message: message,
        }];
        setState(newState);
      }
      onValidateChange?.(newState);
    },
    [arrayRef, onValidateChange],
  );
  const removeError = useCallback(
    (name: string) => {
      const state = arrayRef.current;
      const setState = (s: ValidateError[]) => {
        arrayRef.current = s;
      };
      const newState = state.filter((error) => error.name !== name);
      setState(newState);
      onValidateChange?.(newState);
    },
    [arrayRef, onValidateChange],
  );
  console.log("render");
  return (
    // <>
    //   {children}
    // </>
    <ValidationFormContext.Provider
      value={{
        errors: arrayRef.current,
        addError,
        removeError,
      }}
    >
      {children}
    </ValidationFormContext.Provider>
  );
}
