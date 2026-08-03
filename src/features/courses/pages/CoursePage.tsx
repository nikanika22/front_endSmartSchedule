import React, { useState,useEffect } from 'react';
import { type Course } from '../types/course-type';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../api/course-api';
import { enrollmentApi } from '@/features/enrollments/api/enrollment-api';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { generateScheduleThunk } from '@/features/schedules/store/schedules-thunk';
import { useNotification } from '@/shared/hooks/useNotification';
import useTable from '@/shared/hooks/useTable';
import PageHeader from '@/shared/components/page/PageHeader';
import TablePaginationCustom from '@/shared/components/table/TablePaginationCustom';
import { ReadOutlined } from '@ant-design/icons';

const CoursePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showNotification } = useNotification();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const generateStatus = useAppSelector((s) => s.schedules.generateStatus);

  const { data: courses, loading, pagination, handleChangePage } = useTable<Course, any>({
    fetchApi: courseApi.getAll,
  });

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      try {
        const myEnrollments = await enrollmentApi.getMyEnrollments();
        const enrolledIds = myEnrollments.map((e) => e.course_id);
        setSelectedRowKeys(enrolledIds);
      } catch (error) {
        console.error('Failed to fetch my enrollments:', error);
      }
    };
    fetchMyEnrollments();
  }, []);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await enrollmentApi.deleteMyEnrollments();
      await Promise.all(
        selectedRowKeys.map((course_id) =>
          enrollmentApi.create({ course_id: course_id.toString() })
        )
      );
      showNotification('success', 'Đăng ký thành công!', 'Hệ thống đang sinh lịch học tối ưu...');
      dispatch(generateScheduleThunk());
      navigate('/schedules', { state: { fromEnroll: true } });
    } catch (error: any) {
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
    { title: 'Mã khóa học', dataIndex: 'course_id', width: 150 },
    { title: 'Tên khóa học', dataIndex: 'course_name' },
    { title: 'Số tín chỉ', dataIndex: 'credits', align: 'center' as const, width: 120 },
    { title: 'Khoa', dataIndex: 'department', width: 250 },
  ];

  return (
    <div className="flex flex-col gap-4">
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
              Đăng ký
            </Button>
          ) : undefined
        }
      />

      <TablePaginationCustom<Course>
        columns={columns}
        data={courses}
        loading={loading}
        pagination={pagination}
        onChangePage={handleChangePage}
        rowSelection={{
          selectedRowKeys,
          hideSelectAll: true,
          onChange: setSelectedRowKeys,
        }}
        rowKey="course_id"
        rowClassName={(record: Course) =>
          selectedRowKeys.includes(record.course_id)
            ? '[&>td]:!text-blue-600 [&>td]:!font-semibold'
            : ''
        }
      />
    </div>
  );
};

export default CoursePage;
