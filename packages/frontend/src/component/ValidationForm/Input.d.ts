interface ValidationInputProps {
  className: string;
  name: string;
  label: string;
  labelClassName: string;
  inputClassName: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  minMessage?: string;
  pattern?: RegExp;
  patternMessage?: string;
  validate?: (value: string) => boolean;
  validateMessage?: string;
  validateAsync?: (
    value: string,
    signal: AbortSignal,
  ) => Promise<boolean>;
  validateAsyncMessage?: string;
  placeholder: string;
}

export function ValidationInput(props: ValidationInputProps): React.ReactNode;

interface ValidationInputLabelProps {
  children: React.ReactNode;
  className: string;
}

export function ValidationInputLabel(
  props: ValidationInputLabelProps,
): React.ReactNode;
