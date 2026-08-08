import type { Dispatch, SetStateAction } from 'react';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import CardCustom from '@/shared/components/card/CardCustom';
import PageHeader from '@/shared/components/page/PageHeader';
import type {
  CalendarModalState,
  ClassScheduleItem,
  CreatePersonalEventDto,
  PersonalEvent,
} from '../types/schedule-types';
import CalendarEventModal from './CalendarEventModal';
import ScheduleCalendar from './ScheduleCalendar';

interface ConfirmedScheduleViewProps {
  classes: ClassScheduleItem[];
  personalEvents: PersonalEvent[];
  primaryColor: string;
  calendarModal: CalendarModalState;
  setCalendarModal: Dispatch<SetStateAction<CalendarModalState>>;
  onSelectSlot: (info: DateSelectArg) => void;
  onEventClick: (arg: EventClickArg) => void;
  onSavePersonalEvent: (data: CreatePersonalEventDto) => Promise<void>;
  onDeletePersonalEvent: (id: number) => Promise<void>;
  onCloseModal: () => void;
}

const ConfirmedScheduleView = ({
  classes,
  personalEvents,
  primaryColor,
  calendarModal,
  setCalendarModal,
  onSelectSlot,
  onEventClick,
  onSavePersonalEvent,
  onDeletePersonalEvent,
  onCloseModal,
}: ConfirmedScheduleViewProps) => (
  <div className="flex flex-col gap-6">
    <PageHeader
      title="Thời khóa biểu của tôi"
      subtitle="Lịch học đã được xác nhận và lưu cố định"
    />
    <CardCustom>
      <ScheduleCalendar
        classes={classes}
        personalEvents={personalEvents}
        primaryColor={primaryColor}
        selectable
        onSelectSlot={onSelectSlot}
        onEventClick={onEventClick}
      />
      <CalendarEventModal
        state={calendarModal}
        setState={setCalendarModal}
        onSave={onSavePersonalEvent}
        onDelete={onDeletePersonalEvent}
        onClose={onCloseModal}
      />
    </CardCustom>
  </div>
);

export default ConfirmedScheduleView;
