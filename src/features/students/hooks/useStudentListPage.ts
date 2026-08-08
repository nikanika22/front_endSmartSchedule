import { useState, useEffect, useCallback } from 'react';
import type { Student } from '../types/students-type';
import { studentsApi } from '../api/students-api';
import { useNotification } from '@/shared/hooks/useNotification';

export const useStudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch {
      showNotification('error', 'Lỗi', 'Không thể tải danh sách sinh viên.');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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
