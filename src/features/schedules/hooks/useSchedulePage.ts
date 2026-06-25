import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleApi } from '../api/schedule-api';
import { scheduleConfigApi } from '@/features/schedule-config/api/schedule-config.api';
import { courseRoleAdminApi } from '@/features/courses/api/course-api';
import { useNotification } from '@/shared/hooks/useNotification';
import type {
  ScheduleSolution,
  PersonalEvent,
  Course,
} from '../types/schedule-types';

export const useSchedulePage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [semesterId, setSemesterId] = useState<string>('');
  const [semesterName, setSemesterName] = useState<string>('');
  const [solutions, setSolutions] = useState<ScheduleSolution[]>([]);
  const [activeTabKey, setActiveTabKey] = useState<string>('0');
  const [courseMap, setCourseMap] = useState<Record<string, Course>>({});
  const [personalEvents, setPersonalEvents] = useState<PersonalEvent[]>([]);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch active semester
        const activeSemester = await scheduleApi.getActiveSemester();
        if (!activeSemester?.semester_id) {
          throw new Error('Không tìm thấy học kỳ đang hoạt động!');
        }
        setSemesterId(activeSemester.semester_id);
        setSemesterName(activeSemester.name);

        // 2. Build course_id -> Course map for display names
        const courses = await courseRoleAdminApi.getAll();
        const map: Record<string, Course> = {};
        if (Array.isArray(courses)) {
          courses.forEach((c: Course) => {
            map[c.course_id.toString()] = c;
          });
        }
        setCourseMap(map);

        // 3. Load personal events (non-blocking — failure is OK)
        try {
          const eventsRes = await scheduleConfigApi.getPersonalEvents();
          const list: PersonalEvent[] = Array.isArray(eventsRes)
            ? eventsRes
            : (eventsRes as { data?: PersonalEvent[] })?.data ?? [];
          setPersonalEvents(list);
        } catch {
          console.warn('Could not load personal events; proceeding without them.');
        }

        // 4. Generate schedule suggestions
        const result = await scheduleApi.generateSchedules({
          semester_id: activeSemester.semester_id,
          max_solutions: 3,
        });

        setSolutions(result?.schedules?.length > 0 ? result.schedules : []);
        setActiveTabKey('0');
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } }; message?: string })
            ?.response?.data?.message ??
          (err as { message?: string })?.message ??
          'Có lỗi xảy ra khi tải dữ liệu hoặc sinh lịch.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const handleSave = async () => {
    const index = parseInt(activeTabKey, 10);
    const selectedSolution = solutions[index];
    if (!selectedSolution) return;

    setSaving(true);
    try {
      await scheduleApi.saveSchedule({
        schedule_id: selectedSolution.schedule_id,
        semester_id: semesterId,
      });
      showNotification('success', 'Lưu lịch học thành công!', 'Bạn có thể xem lịch học tại trang chủ.');
      navigate('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Không thể lưu lịch học. Vui lòng thử lại.';
      showNotification('error', 'Lưu lịch thất bại', msg);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    semesterName,
    solutions,
    activeTabKey,
    setActiveTabKey,
    courseMap,
    personalEvents,
    handleSave,
    navigate,
  };
};
