"use client";

import { getScheduleByUser } from "@/lib/courses/actions";
import { cn } from "@/utils/cn.utils";
import { useEffect, useState } from "react";
import { ScheduleCardSkeleton } from "@/components/ui/Skeletons";

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
const DAY_LABELS_ES: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
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

export default function UserSchedule({
  userId,
  userName,
  userLastname,
}: {
  userId: number;
  userName?: string;
  userLastname?: string;
}) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(getTodayKey);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getScheduleByUser(userId)
      .then((res) => {
        if (res.success) setSchedules(res.data);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  async function exportToPDF() {
    setExporting(true);
    try {
      const pdfMake = (await import("pdfmake/build/pdfmake")).default;
      const pdfFonts = (await import("pdfmake/build/vfs_fonts")).default;
      (pdfMake as any).vfs = (pdfFonts as any).vfs;

      const columns = DAY_ORDER.map((day) => {
        const dayClasses = schedules.filter((s) => s.dayOfWeek === day);

        return {
          stack: [
            // Cabecera del día
            {
              table: {
                widths: ["*"],
                body: [
                  [
                    {
                      text: DAY_LABELS_ES[day],
                      alignment: "center",
                      bold: true,
                      fontSize: 9,
                      color: "#555555",
                      fillColor: "#f4f4f6",
                      border: [false, false, false, false],
                      margin: [0, 4, 0, 4],
                    },
                  ],
                ],
              },
              layout: "noBorders",
              margin: [0, 0, 0, 8],
            },
            // Clases
            ...(dayClasses.length === 0
              ? [
                  {
                    text: "—",
                    alignment: "center" as const,
                    color: "#bbbbbb",
                    fontSize: 10,
                  },
                ]
              : dayClasses.map((s) => {
                  const color = s.course.color ?? "#888888";
                  const r = parseInt(color.slice(1, 3), 16);
                  const g = parseInt(color.slice(3, 5), 16);
                  const b = parseInt(color.slice(5, 7), 16);
                  const bgHex = `#${[r, g, b]
                    .map((v) =>
                      Math.round(v + (255 - v) * 0.88)
                        .toString(16)
                        .padStart(2, "0"),
                    )
                    .join("")}`;

                  return {
                    table: {
                      widths: [1, "*"],
                      body: [
                        [
                          {
                            text: "",
                            fillColor: color,
                            border: [false, false, false, false],
                          },
                          {
                            stack: [
                              {
                                text: `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`,
                                fontSize: 8,
                                bold: true,
                                color,
                                margin: [0, 0, 0, 2],
                              },
                              {
                                text: s.course.name,
                                fontSize: 10,
                                bold: true,
                                color: "#1a1a1a",
                                margin: [0, 0, 0, 2],
                              },
                              {
                                text: s.course.teacher,
                                fontSize: 8,
                                color: "#777777",
                              },
                            ],
                            fillColor: bgHex,
                            border: [false, false, false, false],
                            margin: [6, 6, 6, 6],
                          },
                        ],
                      ],
                    },
                    layout: "noBorders",
                    margin: [0, 0, 0, 7],
                  };
                })),
          ],
        };
      });

      const fullName = [userName, userLastname].filter(Boolean).join(" ");
      const fileName = `horario-${[userName, userLastname]
        .filter(Boolean)
        .join("-")
        .toLowerCase()}.pdf`;

      const docDefinition = {
        pageOrientation: "landscape" as const,
        pageMargins: [32, 32, 32, 32] as [number, number, number, number],
        content: [
          {
            text: `Horario de ${fullName || "Estudiante"}`,
            fontSize: 18,
            bold: true,
            color: "#111111",
            margin: [0, 0, 0, 4],
          },
          {
            text: "Horario académico",
            fontSize: 10,
            color: "#888888",
            margin: [0, 0, 0, 20],
          },
          {
            columns,
            columnGap: 12,
          },
        ],
      };

      (pdfMake as any).createPdf(docDefinition as any).download(fileName);
    } finally {
      setExporting(false);
    }
  }

  const classes = schedules
    .filter((s) => s.dayOfWeek === selectedDay)
    .map((s) => ({
      time: `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`,
      title: s.course.name,
      room: s.course.teacher,
      color: s.course.color ?? "#888888",
    }));

  if (loading) {
    return <ScheduleCardSkeleton />;
  }

  return (
    <>
      {/* ── Modal exportando ────────────────────────────── */}
      {exporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-surface-card rounded-2xl p-10 flex flex-col items-center gap-5 shadow-xl border border-surface-border">
            <svg
              className="animate-spin text-primary"
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <div className="text-center">
              <p className="font-bold text-foreground text-lg">Generando PDF</p>
              <p className="text-sm text-foreground-muted mt-1">
                Esto puede tomar unos segundos...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6 ghost-border">
        {/* Header */}
        <div className="flex flex-row items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h3 className="text-xl font-bold text-foreground">Horario</h3>
            <p className="text-sm text-foreground-muted mt-1">Académico</p>
          </div>
          <button
            onClick={exportToPDF}
            disabled={loading || schedules.length === 0 || exporting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border text-sm text-foreground-muted hover:text-foreground hover:bg-surface-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar PDF
          </button>
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

        <div className="lg:hidden">
          {classes.length === 0 ? (
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
            const todayKey = isWeekday ? dayMap[jsDay] : null;

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
                    {dayClasses.length === 0 ? (
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
    </>
  );
}
