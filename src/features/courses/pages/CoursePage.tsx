import React, { useEffect, useState } from 'react';
import { type Course } from '../types/course-type';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { courseRoleAdminApi } from '../api/course-api';
import { enrollmentApi } from '@/features/enrollments/api/enrollment-api';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { generateScheduleThunk } from '@/features/schedules/store/schedules-thunk';
import { useNotification } from '@/shared/hooks/useNotification';
import PageHeader from '@/shared/components/page/PageHeader';
import { scheduleApi } from '@/features/schedules/api/schedule-api';
import { ReadOutlined } from '@ant-design/icons';

const CoursePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [activeSemesterId, setActiveSemesterId] = useState<string>('');

  // Theo dõi trạng thái generate từ Redux
  const generateStatus = useAppSelector((s) => s.schedules.generateStatus);

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        const [coursesData, semesterRes, myEnrollments] = await Promise.all([
          courseRoleAdminApi.getAll(),
          scheduleApi.getActiveSemester(),
          enrollmentApi.getMyEnrollments(),
        ]);
        setCourses(coursesData);
        if (semesterRes?.semester_id) {
          setActiveSemesterId(semesterRes.semester_id);
        }

        // Pre-tick các môn đã đăng ký
        const enrolledIds = myEnrollments.map((e: any) => e.course_id);
        setSelectedRowKeys(enrolledIds);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, []);

  const handleEnroll = async () => {
    if (!activeSemesterId) {
      showNotification('error', 'Lỗi học kỳ', 'Không tìm thấy học kỳ hoạt động. Vui lòng tải lại trang!');
      return;
    }

    try {
      setEnrolling(true);

      // Bước 1: Xóa toàn bộ enrollment cũ
      await enrollmentApi.deleteMyEnrollments();

      // Bước 2: Tạo lại theo selection hiện tại (song song)
      await Promise.all(
        selectedRowKeys.map((course_id) =>
          enrollmentApi.create({
            course_id: course_id.toString(),
            semester_id: activeSemesterId,
          })
        )
      );

      showNotification('success', 'Đăng ký thành công!', 'Hệ thống đang sinh lịch học tối ưu...');

      // Bước 3: Dispatch generate schedule vào Redux TRƯỚC khi navigate
      dispatch(generateScheduleThunk({ semester_id: activeSemesterId, max_solutions: 3 }));

      // Bước 4: Navigate sang SchedulePage, báo hiệu đến từ CoursePage
      navigate('/schedules', { state: { fromEnroll: true } });
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      showNotification(
        'error',
        'Đăng ký thất bại',
        error?.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký!',
      );
    } finally {
      setEnrolling(false);
    }
  };

  const columns = [
    {
      title: 'Mã khóa học',
      dataIndex: 'course_id',
      width: 150,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'course_name',
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'credits',
      align: 'center' as const,
      width: 120,
    },
    {
      title: 'Khoa',
      dataIndex: 'department',
      width: 250,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 -m-6 min-h-[calc(100vh-64px)]">
      <PageHeader
        title="Đăng ký môn học"
        subtitle="Chọn các môn học bạn muốn đăng ký trong học kỳ này"
        icon={<ReadOutlined />}
        extra={
          selectedRowKeys.length > 0 ? (
            <Button
              type="primary"
              onClick={handleEnroll}
              loading={enrolling || generateStatus === 'loading'}
              size="large"
            >
              Đăng ký ({selectedRowKeys.length} môn)
            </Button>
          ) : undefined
        }
      />

      <Table<Course>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={courses}
        loading={loading}
        rowKey="course_id"
        pagination={{ pageSize: 10 }}
        tableLayout="fixed"
      />
    </div>
  );
};

export default CoursePage;
