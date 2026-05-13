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
        className="block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-2"
      >
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted/40 transition-colors">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          className={cn(
            "w-full rounded-lg border border-black/8 bg-surface py-3 text-sm text-foreground outline-none transition-colors focus:border-primary dark:border-white/10",
            Icon ? "pl-10 pr-3" : "px-3",
            error && "border-error focus:border-error",
            props.disabled && "opacity-60 cursor-not-allowed",
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
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
        className="block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-2"
      >
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          "w-full min-h-30 rounded-lg border border-black/8 bg-surface px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary dark:border-white/10 resize-none",
          error && "border-error focus:border-error",
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
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
        "flex items-center gap-3 px-4 h-12 rounded-lg cursor-pointer transition-all duration-300",
        checked
          ? "bg-primary/10 text-primary font-bold"
          : "bg-surface border border-black/8 dark:border-white/10 text-foreground-muted hover:bg-surface-low",
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
          checked
            ? "bg-primary border-primary"
            : "border-foreground-muted/20 bg-surface-card",
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
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </label>
  );
}
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
  icon?: IconType;
  error?: string;
  className?: string;
}

export function SelectField({
  label,
  options,
  icon: Icon,
  error,
  className,
  id,
  ...props
}: SelectFieldProps) {
  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-2"
      >
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted/40 transition-colors pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <select
          id={id}
          className={cn(
            "w-full rounded-lg border border-black/8 bg-surface py-3 text-sm text-foreground outline-none transition-colors focus:border-primary dark:border-white/10 appearance-none cursor-pointer",
            Icon ? "pl-10 pr-10" : "px-3 pr-10",
            error && "border-error focus:border-error",
            props.disabled && "opacity-60 cursor-not-allowed",
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted/40 pointer-events-none">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
