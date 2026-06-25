import { axiosClient } from '@/shared/lib/axios';
import type { 
  UpdatePreferenceDto, 
  AvoidDaysDto, 
  CreatePersonalEventDto, 
  PersonalEvent 
} from '../types';

export const scheduleConfigApi = {
  // --- Preferences ---
  getPreferences: async () => {
    const response = await axiosClient.get('/preferences');
    return response.data;
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
  getPersonalEvents: async (): Promise<{ data: PersonalEvent[] }> => {
    // Note: Assuming there is a GET endpoint. If not, this might return 404 until implemented.
    const response = await axiosClient.get('/personal-events');
    return response.data;
  },

  createPersonalEvent: async (data: CreatePersonalEventDto) => {
    const response = await axiosClient.post('/personal-events', data);
    return response.data;
  },
  
  deletePersonalEvent: async (eventId: number) => {
    const response = await axiosClient.delete(`/personal-events/${eventId}`);
    return response.data;
  }
};
