import type { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { ClassScheduleItem, PersonalEvent } from '../types/schedule-types';
import { buildScheduleCalendarEvents } from '../utils/schedule-calendar';

interface ScheduleCalendarProps {
  classes: ClassScheduleItem[];
  personalEvents: PersonalEvent[];
  primaryColor: string;
  selectable?: boolean;
  onSelectSlot?: (info: DateSelectArg) => void;
  onEventClick?: (arg: EventClickArg) => void;
}

const renderCalendarEvent = (arg: EventContentArg) => {
  const [mainTitle, ...details] = arg.event.title.split('\n');

  return (
    <div className="p-1 text-[11px] overflow-hidden h-full leading-snug flex flex-col justify-between text-white">
      <div>
        <div className="font-bold line-clamp-2 mb-0.5">{mainTitle}</div>
        {details.map((line) => (
          <div key={line} className="opacity-90 font-normal text-[10px] truncate">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

const ScheduleCalendar = ({
  classes,
  personalEvents,
  primaryColor,
  selectable = false,
  onSelectSlot,
  onEventClick,
}: ScheduleCalendarProps) => (
  <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="timeGridWeek"
    slotMinTime="07:00:00"
    slotMaxTime="22:00:00"
    allDaySlot={false}
    height="auto"
    // tuong tac voi event
    eventClick={onEventClick}
    //tao thêm event vào lịch
    selectable={selectable}
    selectMirror={selectable}
    select={onSelectSlot}
    locale="vi"
    events={buildScheduleCalendarEvents(classes, personalEvents, primaryColor)}
    headerToolbar={{
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    }}
    buttonText={{ today: 'Hôm nay', week: 'Tuần', day: 'Ngày' }}
    firstDay={1}
    dayHeaderFormat={{ weekday: 'long' }}
    eventContent={renderCalendarEvent}
  />
);

export default ScheduleCalendar;
