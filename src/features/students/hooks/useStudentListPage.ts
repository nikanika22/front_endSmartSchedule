import { useState, useEffect } from 'react';
import type { Student } from '../types/students-type';
import { studentsApi } from '../api/students-api';
import { useNotification } from '@/shared/hooks/useNotification';

export const useStudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    let cancelled = false;

    const fetchStudents = async () => {
      try {
        const data = await studentsApi.getAll();
        if (!cancelled) {
          setStudents(data);
        }
      } catch {
        if (!cancelled) {
          showNotification('error', 'Lỗi', 'Không thể tải danh sách sinh viên.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchStudents();

    return () => {
      cancelled = true;
    };
  }, [showNotification]);

  const handleDelete = async (studentId: string) => {
    setDeletingId(studentId);
    try {
      await studentsApi.remove(Number(studentId));
      showNotification('success', 'Xóa thành công!', 'Sinh viên đã được xóa khỏi hệ thống.');
      setStudents((prev) => prev.filter((s) => s.student_id !== studentId));
    } catch {
      showNotification('error', 'Xóa thất bại', 'Có lỗi xảy ra khi xóa sinh viên.');
    } finally {
      setDeletingId(null);
    }
  };

  return { students, loading, deletingId, handleDelete };
};
