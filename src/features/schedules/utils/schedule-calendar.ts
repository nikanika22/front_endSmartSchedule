import type { EventInput } from '@fullcalendar/core';
import dayjs from 'dayjs';
import type {
  ClassScheduleItem,
  ConfirmedSchedule,
  PersonalEvent,
} from '../types/schedule-types';

const getFullCalendarDay = (day: number): number => (day === 8 ? 0 : day - 1);

export const buildScheduleCalendarEvents = (
  classes: ClassScheduleItem[],
  personalEvents: PersonalEvent[],
  primaryColor: string,
): EventInput[] => {
  const classEvents: EventInput[] = classes.map((classItem) => {
    const courseName = classItem.course_name || '';
    const title = courseName
      ? `${courseName}\nMã lớp: ${classItem.class_id}\nPhòng: ${classItem.room || 'N/A'}\nGV: ${classItem.instructor || 'N/A'}`
      : `${classItem.class_id}\nPhòng: ${classItem.room || 'N/A'}\nGV: ${classItem.instructor || 'N/A'}`;

    return {
      id: classItem.class_id,
      title,
      daysOfWeek: [getFullCalendarDay(classItem.day_of_week)],
      startTime: classItem.start_time,
      endTime: classItem.end_time,
      backgroundColor: primaryColor,
      borderColor: primaryColor,
      textColor: '#fff',
      extendedProps: { type: 'class' },
      startRecur: classItem.start_date
        ? dayjs(classItem.start_date).format('YYYY-MM-DD')
        : undefined,
      endRecur: classItem.end_date
        ? dayjs(classItem.end_date).add(1, 'day').format('YYYY-MM-DD')
        : undefined,
    };
  });

  const personalCalendarEvents = personalEvents.flatMap((event): EventInput[] => {
    const calendarEvent: EventInput = {
      id: event.event_id.toString(),
      title: `[Cá nhân] ${event.title}`,
      backgroundColor: '#94a3b8',
      borderColor: '#64748b',
      textColor: '#fff',
      extendedProps: { type: 'personal' },
    };

    if (!event.is_recurring && event.start_date) {
      const endDate = event.end_date || event.start_date;

      return [{
        ...calendarEvent,
        start: `${event.start_date}T${event.start_time}`,
        end: `${endDate}T${event.end_time}`,
      }];
    }

    if (event.day_of_week) {
      return [{
        ...calendarEvent,
        daysOfWeek: [getFullCalendarDay(event.day_of_week)],
        startTime: event.start_time,
        endTime: event.end_time,
        startRecur: event.start_date,
        endRecur: event.end_date
          ? dayjs(event.end_date).add(1, 'day').format('YYYY-MM-DD')
          : undefined,
      }];
    }

    return [];
  });

  return [...classEvents, ...personalCalendarEvents];
};

export const mapConfirmedScheduleClasses = (
  confirmedSchedule: ConfirmedSchedule,
): ClassScheduleItem[] => (confirmedSchedule.scheduleClasses ?? []).map((scheduleClass) => {
  const classDetails = scheduleClass.class;

  return {
    class_id: scheduleClass.class_id,
    course_id: classDetails?.course_id ?? scheduleClass.class_id,
    course_name: classDetails?.course_name ?? classDetails?.course?.course_name ?? '',
    semester_id: confirmedSchedule.semester_id,
    day_of_week: classDetails?.day_of_week ?? 2,
    start_time: classDetails?.start_time ?? '07:00',
    end_time: classDetails?.end_time ?? '09:00',
    room: classDetails?.room ?? '',
    instructor: classDetails?.instructor ?? '',
    max_students: classDetails?.max_students ?? 0,
    study_weeks: classDetails?.study_weeks ?? '',
    start_date: classDetails?.start_date ?? '',
    end_date: classDetails?.end_date ?? '',
    remaining_students: classDetails?.remaining_students ?? 0,
  };
});
