"use client";

import { getScheduleByUser, getCoursesByUser } from "@/lib/courses/actions";
import { cn } from "@/utils/cn.utils";
import { useEffect, useState, useTransition } from "react";
import { ScheduleCardSkeleton } from "@/components/ui/Skeletons";
import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import Modal from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ScheduleForm } from "@/components/admin/Courses/ScheduleForm";
import { deleteSchedule } from "@/lib/schedules/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ScheduleItem = {
  id: number;
  dayOfWeek: string;
  startTime: string | Date;
  endTime: string | Date;
  course: { id: number; name: string; color: string | null; teacher: string };
  courseId: number;
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
  initialSchedules = [],
  isAdmin = false,
}: {
  userId: number;
  userName?: string;
  userLastname?: string;
  initialSchedules?: ScheduleItem[];
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [loading, setLoading] = useState(initialSchedules.length === 0);
  const [selectedDay, setSelectedDay] = useState<string>(getTodayKey);
  const [exporting, setExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null,
  );
  const [userCourses, setUserCourses] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (isAdmin && userCourses.length === 0) {
      getCoursesByUser(userId, 1, 100).then((res) => {
        if (res.success) setUserCourses(res.data.courses);
      });
    }
  }, [isAdmin, userId, userCourses.length]);

  useEffect(() => {
    if (initialSchedules.length > 0) {
      setSchedules(initialSchedules);
      setLoading(false);
      return;
    }

    getScheduleByUser(userId)
      .then((res) => {
        if (res.success) setSchedules(res.data);
      })
      .finally(() => setLoading(false));
  }, [userId, initialSchedules]);

  const handleDelete = async () => {
    if (!selectedSchedule) return;

    startTransition(async () => {
      const result = await deleteSchedule(selectedSchedule.id);
      if (result.success) {
        toast.success("Horario eliminado correctamente");
        router.refresh();
        setIsDeleteModalOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

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
          { columns, columnGap: 12 },
        ],
      };

      (pdfMake as any)
        .createPdf(docDefinition as any)
        .download(`horario-${fullName.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  const currentDayClasses = schedules.filter(
    (s) => s.dayOfWeek === selectedDay,
  );

  if (loading) return <ScheduleCardSkeleton />;

  return (
    <>
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
        <div className="flex flex-row items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h3 className="text-xl font-bold text-foreground">Horario</h3>
            <p className="text-sm text-foreground-muted mt-1">Académico</p>
          </div>
          <button
            onClick={exportToPDF}
            disabled={loading || schedules.length === 0 || exporting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border text-sm text-foreground-muted hover:text-foreground hover:bg-surface-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiClock size={16} />
            Exportar PDF
          </button>
        </div>

        {/* Móvil */}
        <div className="grid grid-cols-5 gap-2 mb-4 lg:hidden">
          {DAY_ORDER.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center py-2 rounded-xl border w-full transition-colors cursor-pointer",
                day === selectedDay
                  ? "bg-primary border-primary text-white"
                  : "bg-surface-card border-surface-border text-foreground-muted hover:text-foreground",
              )}
            >
              <span className="text-[11px] font-bold tracking-wider">
                {DAY_LABELS[day]}
              </span>
              <span className="text-lg font-serif">{getDateForDay(day)}</span>
            </button>
          ))}
        </div>

        <div className="lg:hidden">
          {currentDayClasses.length === 0 ? (
            <p className="text-sm text-foreground-muted text-center py-8">
              Sin clases este día
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {currentDayClasses.map((s) => (
                <div
                  key={s.id}
                  className="group relative flex flex-col rounded-xl p-4 border-l-4"
                  style={{
                    borderColor: s.course.color ?? "#888888",
                    backgroundColor: `${s.course.color ?? "#888888"}18`,
                  }}
                >
                  <span
                    className="text-[10px] font-bold tracking-wider mb-1"
                    style={{ color: s.course.color ?? "#888888" }}
                  >
                    {formatTime(s.startTime)} – {formatTime(s.endTime)}
                  </span>
                  <h4 className="font-bold text-sm mb-1 leading-tight text-foreground">
                    {s.course.name}
                  </h4>
                  <span className="text-[11px] text-foreground-muted">
                    {s.course.teacher}
                  </span>

                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSchedule(s);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/90 dark:bg-black/90 text-primary shadow-sm hover:scale-110 transition-transform cursor-pointer"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSchedule(s);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/90 dark:bg-black/90 text-error shadow-sm hover:scale-110 transition-transform cursor-pointer"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-5 gap-4">
          {DAY_ORDER.map((dayKey) => {
            const jsDay = new Date().getDay();
            const todayKey =
              jsDay >= 1 && jsDay <= 5
                ? ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"][
                    jsDay - 1
                  ]
                : null;
            const isToday = dayKey === todayKey;
            const dayClasses = schedules.filter((s) => s.dayOfWeek === dayKey);

            return (
              <div key={dayKey} className="flex flex-col">
                <div
                  className={cn(
                    "flex flex-col items-center mb-6 py-2 rounded-xl border",
                    isToday
                      ? "bg-primary border-primary text-white"
                      : "border-transparent text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "block text-[11px] font-bold tracking-widest uppercase",
                      isToday ? "text-white/80" : "text-foreground-muted",
                    )}
                  >
                    {DAY_LABELS[dayKey]}
                  </span>
                  <span className="block text-2xl font-serif mt-1">
                    {getDateForDay(dayKey)}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {dayClasses.length === 0 ? (
                    <p className="text-xs text-foreground-muted text-center py-4">
                      —
                    </p>
                  ) : (
                    dayClasses.map((s) => (
                      <div
                        key={s.id}
                        className="group relative flex flex-col rounded-xl p-4 border-l-4 transition-all hover:shadow-md"
                        style={{
                          borderColor: s.course.color ?? "#888888",
                          backgroundColor: `${s.course.color ?? "#888888"}18`,
                        }}
                      >
                        <span
                          className="text-[10px] font-bold tracking-wider mb-1"
                          style={{ color: s.course.color ?? "#888888" }}
                        >
                          {formatTime(s.startTime)} – {formatTime(s.endTime)}
                        </span>
                        <h4 className="font-bold text-sm mb-1 leading-tight text-foreground line-clamp-2">
                          {s.course.name}
                        </h4>
                        <span className="text-[11px] text-foreground-muted">
                          {s.course.teacher}
                        </span>

                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSchedule(s);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-black/60 text-primary shadow-sm hover:bg-primary hover:text-white transition-all cursor-pointer"
                              title="Editar"
                            >
                              <FiEdit2 size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSchedule(s);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white dark:bg-black/60 text-error shadow-sm hover:bg-error hover:text-white transition-all cursor-pointer"
                              title="Eliminar"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSchedule(null);
        }}
        title="Editar Horario"
        maxWidth="max-w-lg"
      >
        <ScheduleForm
          courses={userCourses}
          initialData={selectedSchedule}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSchedule(null);
          }}
        />
      </Modal>

      <ConfirmModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSchedule(null);
        }}
        onConfirm={handleDelete}
        title="¿Eliminar horario?"
        description="Esta acción quitará esta clase del horario de forma permanente."
        confirmLabel="Eliminar"
        confirmClassName="bg-error hover:opacity-90"
        isPending={isPending}
      />
    </>
  );
}
