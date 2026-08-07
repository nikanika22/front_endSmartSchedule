import React, { useEffect, useEffectEvent, useState } from 'react';
import { Button, Spin } from 'antd';
import axios from 'axios';
import { PreferredSlotSection } from '../components/PreferredSlotSection';
import { AvoidDaysSection } from '../components/AvoidDaysSection';
import { PersonalEventsSection } from '../components/PersonalEventsSection';
import type { CreatePersonalEventDto, PersonalEvent, PreferredSlot } from '../types';
import { scheduleConfigApi } from '../api/schedule-config.api';
import { useNotification } from '@/shared/hooks/useNotification';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

const ScheduleConfigPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([]);
  const [preferredSlot, setPreferredSlot] = useState<PreferredSlot | null>(null);
  const [avoidDays, setAvoidDays] = useState<number[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const showFetchError = useEffectEvent((error: unknown) => {
    showNotification(
      'error',
      'Không thể tải cấu hình',
      getErrorMessage(error, 'Không thể tải cấu hình lịch học.'),
    );
  });

  useEffect(() => {
    let isMounted = true;

    const fetchScheduleConfig = async () => {
      try {
        const [events, preferences] = await Promise.all([
          scheduleConfigApi.getPersonalEvents(),
          scheduleConfigApi.getPreferences(),
        ]);

        if (!isMounted) return;

        setPersonalEvents(events);
        setPreferredSlot(preferences.preferred_slot ?? null);
        setAvoidDays(preferences.avoid_days ?? []);
      } catch (error) {
        if (isMounted) {
          showFetchError(error);
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void fetchScheduleConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      await Promise.all([
        preferredSlot
          ? scheduleConfigApi.updatePreferences({ preferred_slot: preferredSlot })
          : Promise.resolve(),
        scheduleConfigApi.addAvoidDays({ days: avoidDays }),
      ]);
      showNotification('success', 'Lưu thiết lập thành công!');
    } catch (error) {
      showNotification(
        'error',
        'Lưu thất bại',
        getErrorMessage(error, 'Không thể lưu thiết lập.'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateEvent = async (data: CreatePersonalEventDto) => {
    try {
      setIsMutating(true);
      const createdEvent = await scheduleConfigApi.createPersonalEvent(data);
      setPersonalEvents((events) => [...events, createdEvent]);
      showNotification('success', 'Thêm sự kiện thành công!');
    } catch (error) {
      showNotification(
        'error',
        'Thêm thất bại',
        getErrorMessage(error, 'Không thể thêm sự kiện cá nhân.'),
      );
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      setIsMutating(true);
      await scheduleConfigApi.deletePersonalEvent(eventId);
      setPersonalEvents((events) =>
        events.filter((event) => event.event_id !== eventId),
      );
      showNotification('success', 'Đã xóa sự kiện!');
    } catch (error) {
      showNotification(
        'error',
        'Xóa thất bại',
        getErrorMessage(error, 'Không thể xóa sự kiện cá nhân.'),
      );
    } finally {
      setIsMutating(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-0 gap-8 items-start">
        {/* Left Column: General Preferences */}
        <div className="lg:col-span-7 lg:pr-12 lg:border-r lg:border-gray-100">
          <PreferredSlotSection
            selectedSlot={preferredSlot}
            onSelect={setPreferredSlot}
          />
          <AvoidDaysSection
            avoidDays={avoidDays}
            onChange={setAvoidDays}
          />
        </div>

        {/* Right Column: Personal Events */}
        <div className="lg:col-span-5 lg:pl-12">
          <PersonalEventsSection
            events={personalEvents}
            onCreate={handleCreateEvent}
            onDelete={handleDeleteEvent}
            loading={isMutating}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
        <Button
          type="primary"
          size="large"
          onClick={handleSavePreferences}
          loading={isSaving}
          className="px-8 font-semibold h-11"
        >
          Lưu thiết lập
        </Button>
      </div>
    </div>
  );
};

export default ScheduleConfigPage;
