import React, { useEffect } from 'react';
import { Tabs, Button, Progress, Spin, Badge, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setActiveTabKey, resetSchedules } from '../store/schedules-slice';
import { scheduleApi } from '../api/schedule-api';
import { useNotification } from '@/shared/hooks/useNotification';
import CardCustom from '@/shared/components/card/CardCustom';
import RowCustom from '@/shared/components/row/RowCustom';
import PageHeader from '@/shared/components/page/PageHeader';
import EmptyCustom from '@/shared/components/empty/EmptyCustom';
import { Col } from 'antd';
import type { ClassScheduleItem } from '../types/schedule-types';
import type { PersonalEvent } from '@/features/schedule-config/types';

// Chuyển day_of_week của DB (2-8: T2-CN) sang index FullCalendar (0-6: CN-T7)
const getFCDay = (day: number): number => (day === 8 ? 0 : day - 1);

const buildCalendarEvents = (
  classes: ClassScheduleItem[],
  personalEvents: PersonalEvent[],
  primaryColor: string = '#0ea5e9',
) => {
  const events: any[] = [];

  classes.forEach((cls) => {
    const courseName = cls.course_name || '';
    const titleText = courseName 
      ? `${courseName}\nMã lớp: ${cls.class_id}\nPhòng: ${cls.room || 'N/A'}\nGV: ${cls.instructor || 'N/A'}`
      : `${cls.class_id}\nPhòng: ${cls.room || 'N/A'}\nGV: ${cls.instructor || 'N/A'}`;
    events.push({
      title: titleText,
      daysOfWeek: [getFCDay(cls.day_of_week)],
      startTime: cls.start_time,
      endTime: cls.end_time,
      backgroundColor: primaryColor,
      borderColor: primaryColor,
      textColor: '#fff',
      extendedProps: { type: 'class' },
    });
  });

  personalEvents.forEach((pe) => {
    if (pe.day_of_week) {
      events.push({
        id: `personal-${pe.event_id}`,
        title: `[Cá nhân] ${pe.title}`,
        daysOfWeek: [getFCDay(pe.day_of_week)],
        startTime: pe.start_time,
        endTime: pe.end_time,
        backgroundColor: '#94a3b8',
        borderColor: '#64748b',
        textColor: '#fff',
        extendedProps: { type: 'personal' },
      });
    }
  });

  return events;
};

const ScoreBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="font-bold" style={{ color }}>
        {typeof value === 'number' ? `${Math.round(value * 100)}%` : value}
      </span>
    </div>
    {typeof value === 'number' && (
      <Progress percent={Math.round(value * 100)} strokeColor={color} showInfo={false} strokeWidth={7} />
    )}
  </div>
);

const SchedulePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { token } = theme.useToken();

  const {
    solutions,
    activeTabKey,
    generateStatus,
    error,
  } = useAppSelector((s) => s.schedules);

  const [confirmedSchedule, setConfirmedSchedule] = React.useState<any | null>(null);
  const [fetchStatus, setFetchStatus] = React.useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [confirmStatus, setConfirmStatus] = React.useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');

  const personalEvents = useAppSelector((s) => s.scheduleConfig.personalEvents);



  useEffect(() => {
    const fromEnroll = (location.state as any)?.fromEnroll;
    if (!fromEnroll && solutions.length === 0) {
      // Vào thẳng URL hoặc F5 và KHÔNG ĐANG TRONG TRẠNG THÁI CHỌN LỊCH → kiểm tra lịch đã xác nhận chưa
      const fetchConfirmed = async () => {
        try {
          setFetchStatus('loading');
          const confirmed = await scheduleApi.getCurrentSchedule();
          setConfirmedSchedule(confirmed);
          setFetchStatus('succeeded');
        } catch (err) {
          console.error(err);
          setFetchStatus('failed');
        }
      };
      fetchConfirmed();
    }
    // Xóa state để lần navigate sau không bị nhầm
    window.history.replaceState({}, '');
  }, [solutions.length]);

  const handleConfirm = async () => {
    const idx = parseInt(activeTabKey, 10);
    const selected = solutions[idx];
    if (!selected) return;

    try {
      setConfirmStatus('loading');
      const result = await scheduleApi.saveSchedule({
        schedule_id: selected.schedule_id,
      });
      setConfirmedSchedule(result);
      dispatch(resetSchedules()); // Xóa mảng solutions đi vì đã chọn xong
      setConfirmStatus('succeeded');
      showNotification('success', 'Xác nhận lịch thành công!', 'Lịch học đã được lưu cố định.');
    } catch (err: any) {
      setConfirmStatus('failed');
      showNotification('error', 'Xác nhận thất bại', err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // ── Loading states ──────────────────────────────────────────────
  const isLoading =
    generateStatus === 'loading' || fetchStatus === 'loading';

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <Spin size="large" />
        <p className="text-gray-500 font-medium animate-pulse">
          {generateStatus === 'loading'
            ? 'Hệ thống đang chạy thuật toán tối ưu xếp lịch...'
            : 'Đang tải thông tin lịch học...'}
        </p>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error && !confirmedSchedule && solutions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <EmptyCustom title={error} />
        <Button onClick={() => navigate('/courses')}>Quay lại Đăng ký môn</Button>
      </div>
    );
  }

  // ── Confirmed schedule (READ-ONLY) ──────────────────────────────
  if (confirmedSchedule && solutions.length === 0) {
    console.log('Dữ liệu Lịch đã xác nhận (confirmedSchedule) từ BE:', confirmedSchedule);
    const classes: ClassScheduleItem[] = confirmedSchedule.scheduleClasses?.map((sc: any) => ({
      class_id: sc.class_id,
      course_id: sc.class?.course_id ?? sc.class_id,
      course_name: sc.class?.course_name ?? sc.class?.course?.course_name ?? '',
      semester_id: confirmedSchedule.semester_id,
      day_of_week: sc.class?.day_of_week ?? 2,
      start_time: sc.class?.start_time ?? '07:00',
      end_time: sc.class?.end_time ?? '09:00',
      room: sc.class?.room ?? '',
      instructor: sc.class?.instructor ?? '',
      max_students: sc.class?.max_students ?? 0,
    })) ?? [];

    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Thời khóa biểu của tôi"
          subtitle="Lịch học đã được xác nhận và lưu cố định"
        />
        <CardCustom>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            height="auto"
            locale="vi"
            events={buildCalendarEvents(classes, personalEvents, token.colorPrimary)}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' }}
            buttonText={{ today: 'Hôm nay', week: 'Tuần', day: 'Ngày' }}
            firstDay={1}
            eventContent={(arg) => {
              const lines = arg.event.title.split('\n');
              const mainTitle = lines[0];
              const details = lines.slice(1);
              return (
                <div className="p-1 text-[11px] overflow-hidden h-full leading-snug flex flex-col justify-between text-white">
                  <div>
                    <div className="font-bold line-clamp-2 mb-0.5">{mainTitle}</div>
                    {details.map((line, i) => (
                      <div key={i} className="opacity-90 font-normal text-[10px] truncate">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />
        </CardCustom>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────
  if (solutions.length === 0) {
    if (generateStatus === 'succeeded') {
      return (
        <div className="flex flex-col justify-center items-center h-[70vh] gap-4 text-center px-4">
          <EmptyCustom title="Không tìm thấy phương án xếp lịch học nào phù hợp!" />
          <p className="text-gray-500 max-w-md text-sm -mt-2">
            Hệ thống không tìm thấy lịch học nào không bị trùng giờ. Hãy thử giảm bớt ngày bận, lịch cá nhân trong mục <strong>Cấu hình lịch học</strong> hoặc điều chỉnh môn đăng ký.
          </p>
          <div className="flex gap-3 mt-2">
            <Button onClick={() => navigate('/courses')}>
              Đăng ký môn học
            </Button>
            <Button type="primary" onClick={() => navigate('/schedule-config')}>
              Cấu hình lịch học
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <EmptyCustom title="Bạn chưa có thời khóa biểu. Hãy đăng ký môn học trước!" />
        <Button type="primary" onClick={() => navigate('/courses')}>
          Đăng ký môn học
        </Button>
      </div>
    );
  }

  const activeSolution = solutions[parseInt(activeTabKey, 10)];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Đề xuất Thời khóa biểu"
        subtitle={`${solutions.length} phương án tối ưu được đề xuất cho bạn`}
        extra={
          <div className="flex gap-3">
            <Button 
              danger 
              onClick={() => {
                dispatch(resetSchedules());
              }}
            >
              Hủy đề xuất
            </Button>
            <Button
              type="primary"
              size="large"
              loading={confirmStatus === 'loading'}
              onClick={handleConfirm}
            >
              Xác nhận chọn Lịch này
            </Button>
          </div>
        }
      />

      <RowCustom>
        {/* Cột trái: Điểm tối ưu */}
        <Col xs={24} lg={6}>
          <CardCustom title="Điểm tối ưu phương án">
            <ScoreBar label="Tổng hợp" value={activeSolution.score_total} color={token.colorPrimary} />
            <ScoreBar label="Sở thích buổi học" value={activeSolution.score_pref} color="#0d9488" />
            <ScoreBar label="Giờ nghỉ giải lao" value={activeSolution.score_break} color="#d97706" />
            <ScoreBar label="Cân bằng lịch học" value={activeSolution.score_balance} color="#e11d48" />
            <ScoreBar label="Thuật toán" value={activeSolution.algorithm_tag} color="#3b82f6" />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
              <p className="font-semibold text-gray-700 mb-1">💡 Mẹo nhỏ:</p>
              Hệ thống đã so sánh với lịch cá nhân và sở thích của bạn để tìm lịch học phù hợp nhất.
            </div>
          </CardCustom>
        </Col>

        {/* Cột phải: Tabs + FullCalendar */}
        <Col xs={24} lg={18}>
          <CardCustom>
            <Tabs
              activeKey={activeTabKey}
              onChange={(key) => dispatch(setActiveTabKey(key))}
              type="card"
              items={solutions.map((sol, idx) => ({
                key: idx.toString(),
                label: (
                  <span className="px-1 font-semibold">
                    Phương án {idx + 1}
                    <Badge
                      count={`${Math.round(sol.score_total * 100)}%`}
                      className="ml-2"
                      style={{
                        backgroundColor: idx === parseInt(activeTabKey, 10) ? token.colorPrimary : '#94a3b8',
                        fontSize: '10px',
                      }}
                    />
                  </span>
                ),
              }))}
            />

            <div className="mt-3">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                slotMinTime="07:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                height="auto"
                locale="vi"
                events={buildCalendarEvents(activeSolution.classes, personalEvents, token.colorPrimary)}
                headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' }}
                buttonText={{ today: 'Hôm nay', week: 'Tuần', day: 'Ngày' }}
                firstDay={1}
                dayHeaderFormat={{ weekday: 'long' }}
                eventContent={(arg) => {
                  const lines = arg.event.title.split('\n');
                  const mainTitle = lines[0];
                  const details = lines.slice(1);
                  return (
                    <div className="p-1 text-[11px] overflow-hidden h-full leading-snug flex flex-col justify-between text-white">
                      <div>
                        <div className="font-bold line-clamp-2 mb-0.5">{mainTitle}</div>
                        {details.map((line, i) => (
                          <div key={i} className="opacity-90 font-normal text-[10px] truncate">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </CardCustom>
        </Col>
      </RowCustom>
    </div>
  );
};

export default SchedulePage;
