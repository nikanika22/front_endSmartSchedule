import { axiosClient } from '@/shared/lib/axios';
import type { 
  UpdatePreferenceDto, 
  AvoidDaysDto, 
  CreatePersonalEventDto, 
  PersonalEvent,
  SchedulePreferences,
} from '../types';

interface ApiResponse<T> {
  data: T;
}

const unwrapData = <T>(response: T | ApiResponse<T>): T => {
  if (
    typeof response === 'object' &&
    response !== null &&
    'data' in response
  ) {
    return response.data;
  }

  return response;
};

export const scheduleConfigApi = {
  // --- Preferences ---
  getPreferences: async (): Promise<SchedulePreferences> => {
    const response = await axiosClient.get('/preferences');
    return unwrapData<SchedulePreferences>(response.data);
  },

  updatePreferences: async (data: UpdatePreferenceDto) => {
    const response = await axiosClient.post('/preferences', data);
    return response.data;
  },

  addAvoidDays: async (data: AvoidDaysDto) => {
    const response = await axiosClient.post('/preferences/avoid-days', data);
    return response.data;
  },

  // --- Personal Events ---
  getPersonalEvents: async (): Promise<PersonalEvent[]> => {
    const response = await axiosClient.get('/personal-events');
    return unwrapData<PersonalEvent[]>(response.data);
  },

  createPersonalEvent: async (data: CreatePersonalEventDto): Promise<PersonalEvent> => {
    const response = await axiosClient.post('/personal-events', data);
    return unwrapData<PersonalEvent>(response.data);
  },
  
  deletePersonalEvent: async (eventId: number) => {
    const response = await axiosClient.delete(`/personal-events/${eventId}`);
    return response.data;
  },
};
