import React, { useEffect, useState } from 'react';
import { type Course } from '../types/course-type';
import { Table, Button, message } from 'antd';
import { courseRoleAdminApi } from '../api/course-api';
import { enrollmentApi } from '@/features/enrollments/api/enrollment-api';
import PageHeader from '@/shared/components/page/PageHeader';

const CoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [enrolling, setEnrolling] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseRoleAdminApi.getAll();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 môn học!');
      return;
    }

    try {
      setEnrolling(true);
      // Giả định bạn đang đăng ký cho học kỳ hiện tại là 'SEM01'
      // Bạn có thể đổi lại mã học kỳ thực tế trong Database để không bị lỗi.
      const semester_id = 'SEM01'; 
      
      // Gọi API đăng ký song song cho nhiều môn
      await Promise.all(
        selectedRowKeys.map((course_id) =>
          enrollmentApi.create({
            course_id: course_id.toString(),
            semester_id,
          })
        )
      );

      message.success('Đăng ký môn học thành công!');
      setSelectedRowKeys([]); // Reset checkbox sau khi đăng ký xong
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      message.error(error?.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký!');
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
      <div className="relative flex justify-center items-center mb-6">
        {selectedRowKeys.length > 0 && (
          <div className="absolute right-0">
            <Button 
              type="primary" 
              onClick={handleEnroll} 
              loading={enrolling}
            >
              Đăng ký ({selectedRowKeys.length} môn)
            </Button>
          </div>
        )}
      </div>

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
