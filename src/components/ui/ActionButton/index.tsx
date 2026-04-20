import { cn } from "@/utils/cn.utils";

type ActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export function ActionButton({
  children,
  onClick,
  className = "text-foreground-muted hover:bg-foreground-muted/10",
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}
