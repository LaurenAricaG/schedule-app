import { useState, useRef, useEffect } from "react";
import { IconType } from "react-icons";
import { cn } from "@/utils/cn.utils";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: IconType;
  error?: string;
  className?: string;
}

export function InputField({
  label,
  icon: Icon,
  error,
  className,
  id,
  ...props
}: InputFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-2 ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted/30 transition-colors group-focus-within:text-primary/70 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          className={cn(
            "w-full rounded-xl border border-black/8 bg-surface-card py-3.5 text-sm text-foreground outline-none transition-all duration-200",
            "hover:border-black/20 hover:bg-surface-low/50",
            "focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-primary/50",
            Icon ? "pl-11 pr-4" : "px-4",
            error && "border-error focus:border-error focus:ring-error/5",
            props.disabled && "opacity-60 cursor-not-allowed bg-surface-low",
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-error ml-1">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  className?: string;
}

export function TextAreaField({
  label,
  error,
  className,
  id,
  ...props
}: TextAreaFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-2 ml-1"
      >
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          "w-full min-h-32 rounded-xl border border-black/8 bg-surface-card px-4 py-3.5 text-sm text-foreground outline-none transition-all duration-200",
          "hover:border-black/20 hover:bg-surface-low/50",
          "focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-primary/50 resize-none",
          error && "border-error focus:border-error focus:ring-error/5",
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-error ml-1">{error}</p>}
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

export function CheckboxField({
  label,
  checked,
  onChange,
  id,
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 px-4 h-12 rounded-xl cursor-pointer transition-all duration-300 border",
        checked
          ? "bg-primary/5 border-primary/20 text-primary font-semibold"
          : "bg-surface-card border-black/5 dark:border-white/5 text-foreground-muted hover:bg-surface-low hover:border-black/10",
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
          checked
            ? "bg-primary border-primary scale-110 shadow-lg shadow-primary/20"
            : "border-foreground-muted/20 bg-surface",
        )}
      >
        {checked && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <span className="text-xs uppercase tracking-wide font-medium">{label}</span>
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  options: { value: string | number; label: string }[];
  value: string | number;
  onChange: (value: string | number) => void;
  icon?: IconType;
  error?: string;
  className?: string;
  id?: string;
  placeholder?: string;
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  icon: Icon,
  error,
  className,
  id,
  placeholder = "Seleccionar...",
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("w-full", className)} ref={containerRef}>
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-2 ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        {/* Trigger Button */}
        <button
          type="button"
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between rounded-xl border border-black/8 bg-surface-card py-3.5 text-sm text-foreground outline-none transition-all duration-200",
            "hover:border-black/20 hover:bg-surface-low/50",
            "focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-primary/50",
            Icon ? "pl-11 pr-4" : "px-4",
            error && "border-error focus:border-error focus:ring-error/5",
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted/30 transition-colors group-focus-within:text-primary/70 pointer-events-none">
                <Icon size={18} />
              </div>
            )}
            <span className={cn(!selectedOption && "text-foreground-muted/60")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <svg
            className={cn(
              "w-4 h-4 text-foreground-muted/30 transition-transform duration-200",
              isOpen && "rotate-180 text-primary/70",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 py-1.5 overflow-hidden rounded-xl border border-black/8 bg-surface-card shadow-2xl shadow-black/10 dark:border-white/10 animate-in fade-in zoom-in duration-150 origin-top">
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-black/10">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left",
                    opt.value === value
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-surface-low dark:hover:bg-white/5",
                  )}
                >
                  {opt.label}
                  {opt.value === value && (
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-error ml-1">{error}</p>
      )}
    </div>
  );
}
