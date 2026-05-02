"use client";

import { getScheduleByUser } from "@/lib/courses";
import { cn } from "@/utils/cn.utils";
import { useEffect, useState } from "react";

type ScheduleItem = {
  id: number;
  dayOfWeek: string;
  startTime: string | Date;
  endTime: string | Date;
  course: { id: number; name: string; color: string | null; teacher: string };
};

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
] as const;
const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lun",
  TUESDAY: "Mar",
  WEDNESDAY: "Mié",
  THURSDAY: "Jue",
  FRIDAY: "Vie",
};

function formatTime(value: string | Date): string {
  if (value instanceof Date) {
    const h = String(value.getUTCHours()).padStart(2, "0");
    const m = String(value.getUTCMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
  return String(value).slice(0, 5);
}

function getTodayKey(): string {
  const map: Record<number, string> = {
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
  };
  // sábado (6) y domingo (0) → lunes por defecto
  return map[new Date().getDay()] ?? "MONDAY";
}

function getDateForDay(dayName: string): number {
  const order = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const today = new Date();
  const diff = order.indexOf(dayName) - today.getDay();
  const t = new Date(today);
  t.setDate(today.getDate() + diff);
  return t.getDate();
}

export default function UserSchedule({ userId }: { userId: number }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(getTodayKey);

  useEffect(() => {
    getScheduleByUser(userId)
      .then((res) => {
        if (res.success) setSchedules(res.data);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const classes = schedules
    .filter((s) => s.dayOfWeek === selectedDay)
    .map((s) => ({
      time: `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`,
      title: s.course.name,
      room: s.course.teacher,
      color: s.course.color ?? "#888888",
    }));

  return (
    <div className="card p-6 ghost-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Horario Semanal</h3>
          <p className="text-sm text-foreground-muted mt-1">Semana actual</p>
        </div>
      </div>

      {/* ── Tabs móvil (< lg) ───────────────────────────── */}
      <div className="grid grid-cols-5 gap-2 mb-4 lg:hidden">
        {DAY_ORDER.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center py-2 rounded-xl border w-full transition-colors",
                isSelected
                  ? "bg-primary border-primary text-white"
                  : "bg-surface-card border-surface-border text-foreground-muted hover:text-foreground",
              )}
            >
              <span className="text-[11px] font-bold tracking-wider">
                {DAY_LABELS[day]}
              </span>
              <span className="text-lg font-serif">{getDateForDay(day)}</span>
            </button>
          );
        })}
      </div>

      {/* ── Contenido móvil (< lg) ──────────────────────── */}
      <div className="lg:hidden">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 bg-surface-low rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <p className="text-sm text-foreground-muted text-center py-8">
            Sin clases este día
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {classes.map((c, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl p-4 border-l-4"
                style={{
                  borderColor: c.color,
                  backgroundColor: `${c.color}18`,
                }}
              >
                <span
                  className="text-[10px] font-bold tracking-wider mb-1"
                  style={{ color: c.color }}
                >
                  {c.time}
                </span>
                <h4 className="font-bold text-sm mb-1 leading-tight text-foreground">
                  {c.title}
                </h4>
                <span className="text-[11px] text-foreground-muted">
                  {c.room}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Grid desktop (lg+) ──────────────────────────── */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {(() => {
          const jsDay = new Date().getDay();
          const isWeekday = jsDay >= 1 && jsDay <= 5;
          const dayMap: Record<number, string> = {
            1: "MONDAY",
            2: "TUESDAY",
            3: "WEDNESDAY",
            4: "THURSDAY",
            5: "FRIDAY",
          };
          const todayKey = isWeekday ? dayMap[jsDay] : null; // null si es sáb/dom

          return DAY_ORDER.map((dayKey) => {
            const isToday = dayKey === todayKey;
            const dayClasses = schedules
              .filter((s) => s.dayOfWeek === dayKey)
              .map((s) => ({
                time: `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`,
                title: s.course.name,
                room: s.course.teacher,
                color: s.course.color ?? "#888888",
              }));

            return (
              <div key={dayKey} className="flex flex-col">
                <div
                  className={cn(
                    "flex flex-col items-center mb-6 py-2 rounded-xl border",
                    isToday
                      ? "bg-primary border-primary"
                      : "border-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "block text-[11px] font-bold tracking-widest",
                      isToday ? "text-white" : "text-foreground-muted",
                    )}
                  >
                    {DAY_LABELS[dayKey]}
                  </span>
                  <span
                    className={cn(
                      "block text-2xl font-serif mt-1",
                      isToday ? "text-white" : "text-foreground",
                    )}
                  >
                    {getDateForDay(dayKey)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {loading ? (
                    <div className="h-24 bg-surface-low rounded-xl animate-pulse" />
                  ) : dayClasses.length === 0 ? (
                    <p className="text-xs text-foreground-muted text-center py-4">
                      —
                    </p>
                  ) : (
                    dayClasses.map((c, i) => (
                      <div
                        key={i}
                        className="flex flex-col rounded-xl p-4 border-l-4"
                        style={{
                          borderColor: c.color,
                          backgroundColor: `${c.color}18`,
                        }}
                      >
                        <span
                          className="text-[10px] font-bold tracking-wider mb-1"
                          style={{ color: c.color }}
                        >
                          {c.time}
                        </span>
                        <h4 className="font-bold text-sm mb-1 leading-tight text-foreground">
                          {c.title}
                        </h4>
                        <span className="text-[11px] text-foreground-muted">
                          {c.room}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
