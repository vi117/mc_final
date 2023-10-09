import { createContext, RefObject, useContext } from "react";

export interface ValidateError {
  name: string;
  message: string;
  ref: RefObject<HTMLInputElement>;
}

interface IValidationFormContext {
  errors: ValidateError[];
  addError: (
    name: string,
    ref: RefObject<HTMLInputElement>,
    message: string,
  ) => void;
  removeError: (name: string) => void;
}

export const ValidationFormContext = createContext<IValidationFormContext>({
  errors: [],
  addError: (name, _ref, message) => {
    console.log("addError", name, message);
  },
  removeError: (name) => {
    console.log("removeError", name);
  },
});

export const useValidationFormContext = () => {
  return useContext(ValidationFormContext);
};
