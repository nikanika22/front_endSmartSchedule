import React, { useEffect } from 'react';
import { Button, Spin } from 'antd';
import { PreferredSlotSection } from '../components/PreferredSlotSection';
import { AvoidDaysSection } from '../components/AvoidDaysSection';
import { PersonalEventsSection } from '../components/PersonalEventsSection';
import type { CreatePersonalEventDto } from '../types';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  fetchScheduleConfigThunk,
  savePreferencesThunk,
  createPersonalEventThunk,
  deletePersonalEventThunk,
} from '../store/schedule-config-thunk';
import { setPreferredSlot, setAvoidDays } from '../store/schedule-config-slice';
import { useNotification } from '@/shared/hooks/useNotification';
import PageHeader from '@/shared/components/page/PageHeader';

const ScheduleConfigPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const {
    personalEvents,
    preferredSlot,
    avoidDays,
    fetchStatus,
    saveStatus,
    mutateStatus,
  } = useAppSelector((s) => s.scheduleConfig);

  // Mỗi lần mount → fetch lại từ server (luôn đồng bộ)
  useEffect(() => {
    dispatch(fetchScheduleConfigThunk());
  }, [dispatch]);

  const handleSavePreferences = async () => {
    // Luôn gửi preferences và avoidDays để backend xoá nếu người dùng bỏ chọn hết
    const result = await dispatch(
      savePreferencesThunk({
        preference: preferredSlot ? { preferred_slot: preferredSlot } : undefined,
        avoidDays: { days: avoidDays },
      }),
    );

    if (savePreferencesThunk.fulfilled.match(result)) {
      showNotification('success', 'Lưu thiết lập thành công!');
    } else {
      showNotification('error', 'Lưu thất bại', result.payload as string);
    }
  };

  const handleCreateEvent = async (data: CreatePersonalEventDto) => {
    const result = await dispatch(createPersonalEventThunk(data));
    if (createPersonalEventThunk.fulfilled.match(result)) {
      showNotification('success', 'Thêm sự kiện thành công!');
    } else {
      showNotification('error', 'Thêm thất bại', result.payload as string);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    const result = await dispatch(deletePersonalEventThunk(eventId));
    if (deletePersonalEventThunk.fulfilled.match(result)) {
      showNotification('success', 'Đã xóa sự kiện!');
    } else {
      showNotification('error', 'Xóa thất bại', result.payload as string);
    }
  };

  if (fetchStatus === 'loading' && personalEvents.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  const isMutating = mutateStatus === 'loading';
  const isSaving = saveStatus === 'loading';

  return (
    <div className="w-full">
      <PageHeader
        title="Cấu hình Lịch học"
        subtitle="Thiết lập sở thích và lịch cá nhân để hệ thống sinh lịch phù hợp hơn"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-0 gap-8 items-start">
        {/* Left Column: General Preferences */}
        <div className="lg:col-span-7 lg:pr-12 lg:border-r lg:border-gray-100">
          <PreferredSlotSection
            selectedSlot={preferredSlot}
            onSelect={(slot) => dispatch(setPreferredSlot(slot))}
          />
          <AvoidDaysSection
            avoidDays={avoidDays}
            onChange={(days) => dispatch(setAvoidDays(days))}
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
