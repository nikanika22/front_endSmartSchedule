import { useEffect, useState } from 'react';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { useNotification } from '@/shared/hooks/useNotification';
import { scheduleConfigApi } from '@/features/schedule-config/api/schedule-config.api';
import { scheduleApi } from '../api/schedule-api';
import { resetSchedules, setActiveTabKey } from '../store/schedules-slice';
import type {
  CalendarModalState,
  ConfirmedSchedule,
  CreatePersonalEventDto,
  PersonalEvent,
} from '../types/schedule-types';
import { mapConfirmedScheduleClasses } from '../utils/schedule-calendar';

interface ScheduleLocationState {
  fromEnroll?: boolean;
}

const initialCalendarModalState: CalendarModalState = {
  open: false,
  title: '',
  start_time: '',
  end_time: '',
  start_date: '',
  end_date: '',
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return fallback;
  }

  const response = error.response as { data?: { message?: string } };
  return response.data?.message ?? fallback;
};

export const useSchedulePage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { solutions, activeTabKey, generateStatus, error } = useAppSelector(
    (state) => state.schedules,
  );
  const navigationState = location.state as ScheduleLocationState | null;
  const shouldFetchConfirmedSchedule = !navigationState?.fromEnroll && solutions.length === 0;

  const [confirmedSchedule, setConfirmedSchedule] = useState<ConfirmedSchedule | null>(null);
  const [isFetchingConfirmed, setIsFetchingConfirmed] = useState(shouldFetchConfirmedSchedule);
  const [isConfirming, setIsConfirming] = useState(false);
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([]);
  const [calendarModal, setCalendarModal] = useState(initialCalendarModalState);

  const refreshPersonalEvents = async () => {
    try {
      const events = await scheduleConfigApi.getPersonalEvents();
      setPersonalEvents(events);
    } catch (personalEventsError) {
      console.error('Không thể tải sự kiện cá nhân:', personalEventsError);
    }
  };

  useEffect(() => {
    let isActive = true;

    scheduleConfigApi.getPersonalEvents()
      .then((events) => {
        if (isActive) setPersonalEvents(events);
      })
      .catch((personalEventsError) => {
        console.error('Không thể tải sự kiện cá nhân:', personalEventsError);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (generateStatus === 'failed' && error) {
      showNotification('error', 'Sinh thời khóa biểu thất bại', error);
    }
    // showNotification được tạo lại bởi hook dùng chung; chỉ chạy lại khi trạng thái generate đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStatus, error]);

  useEffect(() => {
    let isActive = true;

    if (shouldFetchConfirmedSchedule && !confirmedSchedule) {
      scheduleApi.getCurrentSchedule()
        .then((confirmed) => {
          if (!isActive) return;
          setConfirmedSchedule(confirmed);
          setIsFetchingConfirmed(false);
        })
        .catch((fetchError) => {
          if (!isActive) return;
          console.error(fetchError);
          setIsFetchingConfirmed(false);
        });
    }

    window.history.replaceState({}, '');

    return () => {
      isActive = false;
    };
    // Chỉ kiểm tra lại lịch đã xác nhận khi danh sách phương án chuyển giữa rỗng/có dữ liệu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutions.length]);

  const handleSelectSlot = (info: DateSelectArg) => {
    const start = dayjs(info.start);
    const end = dayjs(info.end);

    setCalendarModal({
      open: true,
      title: '',
      start_time: start.format('HH:mm:ss'),
      end_time: end.format('HH:mm:ss'),
      start_date: start.format('YYYY-MM-DD'),
      end_date: end.format('YYYY-MM-DD'),
      eventId: undefined,
      type: undefined,
    });
  };

  const handleEventClick = (arg: EventClickArg) => {
    const eventType = arg.event.extendedProps.type as 'class' | 'personal';

    if (eventType === 'class') {
      showNotification(
        'info',
        'Lịch học cố định',
        'Đây là lịch học tín chỉ đã xác nhận, không thể sửa/xóa.',
      );
      return;
    }

    if (eventType === 'personal') {
      const rawId = arg.event.id;
      const eventId = Number(rawId);
      const cleanTitle = arg.event.title.replace(/^\[Cá nhân\]\s*/, '');
      const start = arg.event.start ? dayjs(arg.event.start) : null;
      const end = arg.event.end ? dayjs(arg.event.end) : null;

      setCalendarModal({
        open: true,
        title: cleanTitle,
        start_time: start ? start.format('HH:mm:ss') : '',
        end_time: end ? end.format('HH:mm:ss') : '',
        start_date: start ? start.format('YYYY-MM-DD') : '',
        end_date: end ? end.format('YYYY-MM-DD') : '',
        eventId: Number.isNaN(eventId) ? undefined : eventId,
        type: 'personal',
      });
    }
  };

  const closeCalendarModal = () => {
    setCalendarModal((current) => ({ ...current, open: false }));
  };

  const handleDeletePersonalEvent = async (id: number) => {
    try {
      await scheduleConfigApi.deletePersonalEvent(id);
      showNotification('success', 'Xóa thành công!', 'Sự kiện cá nhân đã được xóa.');
      closeCalendarModal();
      await refreshPersonalEvents();
    } catch (deleteError) {
      showNotification(
        'error',
        'Xóa sự kiện thất bại',
        getErrorMessage(deleteError, 'Có lỗi xảy ra'),
      );
    }
  };

  const handleSavePersonalEvent = async (data: CreatePersonalEventDto) => {
    try {
      if (calendarModal.eventId) {
        await scheduleConfigApi.updatePersonalEvent(calendarModal.eventId, data);
        showNotification(
          'success',
          'Cập nhật thành công!',
          'Sự kiện cá nhân đã được cập nhật.',
        );
      } else {
        await scheduleConfigApi.createPersonalEvent(data);
        showNotification(
          'success',
          'Đăng ký sự kiện thành công!',
          'Sự kiện cá nhân đã được lưu.',
        );
      }
      closeCalendarModal();
      await refreshPersonalEvents();
    } catch (saveError) {
      showNotification(
        'error',
        'Lưu sự kiện thất bại',
        getErrorMessage(saveError, 'Có lỗi xảy ra'),
      );
    }
  };

  const handleConfirm = async () => {
    const selectedSolution = solutions[Number(activeTabKey)];
    if (!selectedSolution) return;

    try {
      setIsConfirming(true);
      const confirmed = await scheduleApi.saveSchedule({
        schedule_id: selectedSolution.schedule_id,
      });
      setConfirmedSchedule(confirmed);
      dispatch(resetSchedules());
      showNotification(
        'success',
        'Xác nhận lịch thành công!',
        'Lịch học đã được lưu cố định.',
      );
    } catch (confirmError) {
      showNotification(
        'error',
        'Xác nhận thất bại',
        getErrorMessage(confirmError, 'Có lỗi xảy ra'),
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const handleChangeSolution = (key: string) => {
    dispatch(setActiveTabKey(key));
  };

  const handleCancelSolutions = () => {
    dispatch(resetSchedules());
  };

  const confirmedClasses = confirmedSchedule
    ? mapConfirmedScheduleClasses(confirmedSchedule)
    : [];

  return {
    solutions,
    activeSolution: solutions[Number(activeTabKey)] ?? solutions[0],
    activeTabKey,
    generateStatus,
    error,
    confirmedSchedule,
    confirmedClasses,
    isConfirming,
    personalEvents,
    calendarModal,
    setCalendarModal,
    isLoading: generateStatus === 'loading' || isFetchingConfirmed,
    handleSelectSlot,
    handleEventClick,
    handleSavePersonalEvent,
    handleDeletePersonalEvent,
    closeCalendarModal,
    handleConfirm,
    handleChangeSolution,
    handleCancelSolutions,
  };
};
