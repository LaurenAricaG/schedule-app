import { cn } from "@/utils/cn.utils";

type StatusBadgeProps = {
  active: boolean;
  labels?: { active: string; inactive: string };
};

export function StatusBadge({
  active,
  labels = { active: "ACTIVO", inactive: "ELIMINADO" },
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-widest",
        active ? "bg-success/10 text-success" : "bg-error/10 text-error",
      )}
    >
      {active ? labels.active : labels.inactive}
    </span>
  );
}
