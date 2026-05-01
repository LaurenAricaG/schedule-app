"use client";

import { cn } from "@/utils/cn.utils";

export default function UserSchedule({ userId }: { userId: number }) {
  // Mock data to match the visual requested by the user
  const schedule = [
    {
      day: "MON",
      date: "12",
      classes: [
        { time: "09:00 - 10:30", title: "Advanced Linear Algebra", room: "Hall B-12", color: "transparent" },
        { time: "14:00 - 15:30", title: "Research Seminar", room: "Virtual Room 4", color: "transparent" }
      ]
    },
    {
      day: "TUE",
      date: "13",
      classes: [
        { time: "11:00 - 12:30", title: "Comp Biology", room: "Lab 04 • In Progress", color: "blue" }
      ]
    },
    {
      day: "WED",
      date: "14",
      classes: [
        { time: "09:00 - 10:30", title: "Advanced Linear Algebra", room: "Hall B-12", color: "transparent" }
      ]
    },
    {
      day: "THU",
      date: "15",
      classes: [
        { time: "11:00 - 12:30", title: "Comp Biology", room: "Lab 04", color: "transparent" },
        { time: "15:00 - 16:30", title: "Lab Session", room: "Main Campus Hub", color: "transparent" }
      ]
    },
    {
      day: "FRI",
      date: "16",
      classes: [
        { time: "10:00 - 11:30", title: "Group Study", room: "Library Floor 3", color: "transparent" }
      ]
    }
  ];

  return (
    <div className="card p-6 ghost-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Weekly Class Schedule</h3>
          <p className="text-sm text-foreground-muted mt-1">Standard week view for Academic Term Spring 2024</p>
        </div>
        <div className="flex rounded-lg bg-surface-low p-1">
          <button className="rounded-md bg-surface-card px-4 py-1.5 text-sm font-semibold text-foreground shadow-sm">
            Work Week
          </button>
          <button className="rounded-md px-4 py-1.5 text-sm font-medium text-foreground-muted hover:text-foreground">
            Full Week
          </button>
        </div>
      </div>

      {/* Responsive Grid for Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {schedule.map((day) => (
          <div key={day.day} className="flex flex-col">
            <div className="text-center mb-6">
              <span className="block text-[11px] font-bold text-foreground-muted tracking-widest">{day.day}</span>
              <span className="block text-2xl font-serif text-foreground mt-1">{day.date}</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {day.classes.map((c, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col rounded-xl p-4 border-l-4",
                    c.color === "blue" 
                      ? "bg-primary border-primary text-white shadow-md dark:border-primary-container"
                      : "bg-surface-low/50 border-primary text-foreground dark:bg-surface-low dark:border-primary-container"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold tracking-wider mb-1",
                    c.color === "blue" ? "text-white/80" : "text-primary dark:text-primary-container"
                  )}>
                    {c.time}
                  </span>
                  <h4 className={cn(
                    "font-bold text-sm mb-1 leading-tight",
                    c.color === "blue" ? "text-white" : "text-foreground"
                  )}>
                    {c.title}
                  </h4>
                  <span className={cn(
                    "text-[11px]",
                    c.color === "blue" ? "text-white/70" : "text-foreground-muted"
                  )}>
                    {c.room}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
