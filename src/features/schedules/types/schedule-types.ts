import type { PersonalEvent } from '@/features/schedule-config/types';

// Re-export for convenience within the feature
export type { PersonalEvent };

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

export interface ActiveSemester {
  semester_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
export type CalendarModalState = {
    open: boolean;
    mode: 'create' | 'view';
    eventId?: string;
    title: string;
    start_time?: string;
    end_time?: string;
    start_day?: string;
    end_day?: string;
};