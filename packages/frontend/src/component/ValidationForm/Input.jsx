import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useValidationFormContext } from "./context";
import classes from "./Input.module.css";

/**
 * Generates a function comment for the given function body in a markdown code block with the correct language syntax.
 *
 * @param {Object} props - The input object containing the following properties:
 * @param {string} props.className - The CSS class name.
 * @param {string} props.name - The name of the input.
 * @param {string} [props.label] - The label of the input.
 * @param {string} [props.type] - The type of the input.
 * @param {string} props.value - The value of the input.
 * @param {(value: string)=>void} props.onChange - The function called when the input value changes.
 * @param {boolean} [props.required] - Whether the input value must not be empty.
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
  className,
  name,
  label,
  labelClassName = "",
  inputClassName = "",

  type,
  value,
  onChange,

  required,

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
  const ref = useRef(null);
  const { addError, removeError } = useValidationFormContext();
  /**
   * checkSyncAndMessage - Checks the input value and returns an error message if it is not valid.
   * @param {string} value
   * @return {string|undefined}
   */
  const checkSyncAndMessage = useCallback(
    (value) => {
      if (required && value.length === 0) {
        return "값이 비어있습니다.";
      }
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
    [
      minLength,
      pattern,
      validate,
      validateMessage,
      minMessage,
      patternMessage,
      required,
    ],
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
      addError(name, ref, v);
    } else {
      removeError(name);
    }

    // sync check 통과했을 때 validateAsync가 있으면 시도.
    if (v === undefined && !isEmpty && validateAsync) {
      const abortController = new AbortController();

      (async () => {
        try {
          const result = await validateAsync(value, abortController.signal);
          setIsValid(result);
          if (!result) {
            setErrorMessage(validateAsyncMessage);
            addError(name, ref, validateAsyncMessage);
          } else {
            setErrorMessage("");
            removeError(name);
          }
        } catch (e) {
          if (e instanceof DOMException && e.name === "AbortError") {
            // do nothing
          } else {
            throw e;
          }
        }
      })();
      return () => {
        abortController.abort();
        removeError(name);
      };
    }
  }, [
    checkSyncAndMessage,
    validateAsync,
    validateAsyncMessage,
    value,
    isEmpty,
    addError,
    removeError,
    name,
  ]);

  return (
    <Form.Group className={className}>
      {label
        && (
          <ValidationInputLabel className={labelClassName}>
            {label}
          </ValidationInputLabel>
        )}
      <Form.Control
        ref={ref}
        className={clsx(classes.input, {
          [classes.label_error]: !isValid && !isEmpty,
        }, inputClassName)}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onClick={onClick}
      >
      </Form.Control>
      {(!isValid && !isEmpty)
        ? <div className={classes["error_message"]}>{errorMessage}</div>
        : null}
    </Form.Group>
  );
}

export function ValidationInputLabel({ children, className }) {
  return (
    <Form.Label
      className={clsx(classes.label, className)}
    >
      {children}
    </Form.Label>
  );
}
