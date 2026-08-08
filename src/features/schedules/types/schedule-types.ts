import type {
  CreatePersonalEventDto,
  PersonalEvent,
} from '@/features/schedule-config/types';

// Re-export for convenience within the feature
export type { CreatePersonalEventDto, PersonalEvent };

export interface ClassScheduleItem {
  class_id: string;
  course_id: string;
  course_name?: string;
  semester_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  instructor: string;
  max_students: number;
  study_weeks: string;
  start_date?: string;
  end_date?: string;
  remaining_students?: number;
}

export interface ScheduleSolution {
  schedule_id: number;
  score_total: number;
  score_break: number;
  score_pref: number;
  score_balance: number;
  algorithm_tag?: string;
  classes: ClassScheduleItem[];
}

interface ConfirmedClassDetails {
  course_id?: string;
  course_name?: string;
  course?: {
    course_name?: string;
  };
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  room?: string;
  instructor?: string;
  max_students?: number;
  study_weeks?: string;
  start_date?: string;
  end_date?: string;
  remaining_students?: number;
}

interface ConfirmedScheduleClass {
  class_id: string;
  class?: ConfirmedClassDetails;
}

export interface ConfirmedSchedule {
  schedule_id?: number;
  semester_id: string;
  scheduleClasses?: ConfirmedScheduleClass[];
}

export interface CalendarModalState {
  open: boolean;
  title: string;
  start_time?: string;
  end_time?: string;
  start_date?: string;
  end_date?: string;
  eventId?: number;
  type?: 'class' | 'personal';
}
