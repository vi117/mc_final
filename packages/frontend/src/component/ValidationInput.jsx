import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import classes from "./ValidationInput.module.css";

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 *
 * @param {Object} props - The input object containing the following properties:
 * @param {ReactNode} props.children - The child components.
 * @param {string} props.className - The CSS class name.
 * @param {string} props.name - The name of the input.
 * @param {string} [props.type] - The type of the input.
 * @param {string} props.value - The value of the input.
 * @param {(value: string)=>void} props.onChange - The function called when the input value changes.
 * @param {number} [props.minLength] - The minimum length of the input value.
 * @param {string} [props.minMessage] - The error message for the minimum length validation.
 * @param {RegExp} [props.pattern] - The regular expression to validate the input.
 * @param {string} [props.patternMessage] - The error message for the regular expression validation.
 * @param {((value: string) => boolean)} [props.validate] - The synchronous validation function.
 * it returns true when the validation is successful. returns false or throws an error when the validation fails.
 * @param {string} [props.validateMessage] - The error message for synchronous validation.
 * @param {(value: string, signal: AbortSignal) => Promise<boolean>} [props.validateAsync] - The asynchronous validation function.
 * @param {string} [props.validateAsyncMessage] - The error message for asynchronous validation.
 * @param {string} props.placeholder - The placeholder text for the input.
 * @param {function} props.onClick - The function called when the input is clicked.
 * @return {ReactNode} - The rendered JSX of the ValidationInput component.
 */
export function ValidationInput({
  children,
  className,
  name,
  type,
  value,
  onChange,

  minLength,
  minMessage,

  pattern,
  patternMessage,

  validate,
  validateMessage,

  validateAsync,
  validateAsyncMessage,

  placeholder,
  onClick,
}) {
  /**
   * checkSyncAndMessage - Checks the input value and returns an error message if it is not valid.
   * @param {string} value
   * @return {string|undefined}
   */
  const checkSyncAndMessage = useCallback(
    (value) => {
      if (minLength !== undefined && value.length < minLength) {
        return minMessage;
      }
      if (pattern !== undefined && !pattern.test(value)) {
        return patternMessage;
      }
      try {
        if (validate !== undefined && !validate(value)) {
          return validateMessage;
        }
      } catch (e) {
        if (e instanceof Error) {
          return e.message;
        } else {
          throw e;
        }
      }
      return undefined;
    },
    [minLength, pattern, validate, validateMessage, minMessage, patternMessage],
  );

  const checkSync = useCallback((value) => {
    return checkSyncAndMessage(value) === undefined;
  }, [checkSyncAndMessage]);

  const [isValid, setIsValid] = useState(
    checkSync(value),
  );
  const [errorMessage, setErrorMessage] = useState("");
  const isEmpty = value === undefined || value?.length === 0;

  useEffect(() => {
    const v = checkSyncAndMessage(value);
    setIsValid(v === undefined);
    if (v !== undefined) {
      setErrorMessage(v);
    }

    // sync check 통과했을 때 validateAsync가 있으면 시도.
    if (v === undefined && !isEmpty && validateAsync) {
      const abortController = new AbortController();

      (async () => {
        try {
          const result = await validateAsync(value, abortController.signal);
          setIsValid(result);
          console.log(result);
          if (!result) {
            setErrorMessage(validateAsyncMessage);
          } else {
            setErrorMessage("");
          }
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") {
            // do nothing
          } else {
            throw e;
          }
        }
      })();
      return () => abortController.abort();
    }
  }, [
    checkSyncAndMessage,
    validateAsync,
    validateAsyncMessage,
    value,
    isEmpty,
  ]);

  return (
    <>
      <ValidationInputLabel>{name}</ValidationInputLabel>
      <Form.Control
        className={clsx(className, {
          [classes.label_error]: !isValid && !isEmpty,
        })}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onClick={onClick}
      >
        {children}
      </Form.Control>
      {(!isValid && !isEmpty)
        ? <div className="error-message">#{errorMessage}</div>
        : null}
    </>
  );
}

function ValidationInputLabel({ children }) {
  return (
    <Form.Label
      className={classes.label}
    >
      {children}
    </Form.Label>
  );
}
