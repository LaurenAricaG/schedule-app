export type TaskStatus = "PENDING" | "COMPLETED";

export type ReminderType = "EMAIL" | "SMS" | "WHATSAPP";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type Role = {
  id: number;
  rol: string;
  createdAt: Date;
  deletedAt: Date | null;
};

export type User = {
  id: number;
  name: string;
  lastname: string | null;
  email: string;
  username: string;
  password: string;
  rolId: number;
  status: boolean;
  createdAt: Date;
  deletedAt: Date | null;
};

export type Course = {
  id: number;
  name: string;
  color: string | null;
  teacher: string;
  userId: number;
  createdAt: Date;
  deletedAt: Date | null;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  dueDate: Date;
  status: TaskStatus;
  courseId: number;
  createdAt: Date;
  deletedAt: Date | null;
};

export type Reminder = {
  id: number;
  taskId: number;
  type: ReminderType;
  remindAt: Date;
  sent: boolean;
  createdAt: Date;
  deletedAt: Date | null;
};

export type Schedule = {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
  courseId: number;
  createdAt: Date;
  deletedAt: Date | null;
};

export type UserWithRole = User & {
  rol: Role;
};

export type CourseWithSchedules = Course & {
  schedules: Schedule[];
};

export type CourseWithAll = Course & {
  user: UserWithRole;
  schedules: Schedule[];
  tasks: TaskWithReminders[];
};

export type TaskWithReminders = Task & {
  reminders: Reminder[];
  course: Course;
};

export type UserWithCourses = UserWithRole & {
  courses: CourseWithSchedules[];
};

export type CreateUserDTO = {
  name: string;
  lastname?: string;
  email: string;
  username: string;
  password: string;
  rolId: number;
};

export type UpdateUserDTO = Partial<Omit<CreateUserDTO, "password">> & {
  password?: string;
  status?: boolean;
};

export type CreateCourseDTO = {
  name: string;
  color?: string;
  teacher: string;
  userId: number;
};

export type UpdateCourseDTO = Partial<CreateCourseDTO>;

export type CreateTaskDTO = {
  title: string;
  description?: string;
  dueDate: Date;
  courseId: number;
};

export type UpdateTaskDTO = Partial<CreateTaskDTO> & {
  status?: TaskStatus;
};

export type CreateReminderDTO = {
  taskId: number;
  type: ReminderType;
  remindAt: Date;
};

export type CreateScheduleDTO = {
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
  courseId: number;
};

export type UpdateScheduleDTO = Partial<CreateScheduleDTO>;

export type UserTableRow = {
  id: number;
  name: string;
  lastname: string | null;
  email: string;
  username: string;
  status: boolean;
  createdAt: Date;
  rol: {
    id: number;
    rol: string;
  };
};

export type CourseTableRow = {
  id: number;
  name: string;
  color: string | null;
  teacher: string;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
  _count: {
    schedules: number;
    tasks: number;
  };
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type UserFilters = {
  search?: string;
  rolId?: number;
  status?: boolean;
  page?: number;
  pageSize?: number;
};

export type CourseFilters = {
  search?: string;
  userId?: number;
  page?: number;
  pageSize?: number;
};

export type TaskFilters = {
  courseId?: number;
  status?: TaskStatus;
  dueBefore?: Date;
  dueAfter?: Date;
};
