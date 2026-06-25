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
}

export interface ScheduleSolution {
  schedule_id: number;
  score_total: number;
  score_break: number;
  score_pref: number;
  score_balance: number;
  classes: ClassScheduleItem[];
}

export interface ActiveSemester {
  semester_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
