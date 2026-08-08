export type PreferredSlot = 'MORNING' | 'AFTERNOON' | 'EVENING';

export const PreferredSlotEnum = {
  MORNING: 'MORNING' as PreferredSlot,
  AFTERNOON: 'AFTERNOON' as PreferredSlot,
  EVENING: 'EVENING' as PreferredSlot,
};

export interface UpdatePreferenceDto {
  preferred_slot: PreferredSlot;
}

export interface SchedulePreferences {
  preferred_slot: PreferredSlot | null;
  avoid_days: number[];
}

export interface AvoidDaysDto {
  days: number[];
}

export interface CreatePersonalEventDto {
  title: string;
  day_of_week?: number;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
  start_date?: string;
  end_date?: string;
  note?: string;
}

export interface PersonalEvent {
  event_id: number;
  student_id: string;
  title: string;
  day_of_week?: number;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
  start_date?: string;
  end_date?: string;
  note?: string;
}
