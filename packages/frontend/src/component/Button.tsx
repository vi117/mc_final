import clsx from "clsx";
import { useRef } from "react";
import classes from "./Button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
  children: React.ReactNode;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  to?: string;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

function useRipple(spanRef: React.RefObject<HTMLSpanElement>) {
  return (e: { clientY: number; clientX: number }) => {
    if (!spanRef.current) return;
    const top = e.clientY;
    const left = e.clientX;

    const ripple = document.createElement("span");

    const rect = spanRef.current.getBoundingClientRect();
    const radius = Math.max(rect.width, rect.height) / 2;
    ripple.style.top = `${(top - rect.top).toFixed(0)}px`;
    ripple.style.left = `${(left - rect.left).toFixed(0)}px`;

    ripple.style.width = `${radius}px`;
    ripple.style.height = `${radius}px`;

    spanRef.current?.append(ripple);

    ripple.classList.add(classes.ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    }, { once: true });
  };
}

export function Button({
  children,
  variant,
  className,
  onMouseDown,
  onClick,
  ...rest
}: ButtonProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const rippleStart = useRipple(spanRef);

  return (
    <button
      className={clsx(
        classes.common,
        classes[variant ?? "contained"],
        className,
      )}
      onMouseDown={(e) => {
        onMouseDown?.(e);
        rippleStart(e);
      }}
      onClick={() => {
        onClick?.();
      }}
      {...rest}
    >
      {children}
      <span className={classes.ripple_container} ref={spanRef} />
    </button>
  );
}

export default Button;
