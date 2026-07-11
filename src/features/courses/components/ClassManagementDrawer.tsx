import React, { useEffect, useState } from 'react';
import { Drawer, Table, Button, Spin } from 'antd';
import { courseApi } from '../api/course-api';
import type { Class } from '../types/course-type';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ActionGroup from '@/shared/components/table/ActionGroup';
import { useNotification } from '@/shared/hooks/useNotification';

interface ClassManagementDrawerProps {
  open: boolean;
  courseId: string | null;
  courseName?: string;
  onClose: () => void;
}

const ClassManagementDrawer: React.FC<ClassManagementDrawerProps> = ({
  open,
  courseId,
  courseName,
  onClose,
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const fetchClasses = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const res = await courseApi.getDetail(courseId);
      // Giả sử API trả về course detail có chứa mảng classes
      const courseData = res.data || res;
      setClasses(courseData.classes || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách lớp:', error);
      showNotification('error', 'Lỗi', 'Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && courseId) {
      fetchClasses();
    } else {
      setClasses([]); // Reset khi đóng
    }
  }, [open, courseId]);

  const handleEditClass = (record: Class) => {
    // TODO: Mở form chỉnh sửa lớp
    console.log('Edit class', record);
    showNotification('warning', 'Đang phát triển', 'Chức năng sửa lớp học chưa được tích hợp');
  };

  const handleDeleteClass = async (classId: string) => {
    // TODO: Gọi API xóa lớp
    console.log('Delete class', classId);
    showNotification('info', 'Đang phát triển', 'Chức năng xóa lớp học chưa được tích hợp');
  };

  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'class_id',
      width: 150,
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester_id',
      width: 120,
    },
    {
      title: 'Thứ',
      dataIndex: 'day_of_week',
      align: 'center' as const,
      width: 80,
    },
    {
      title: 'Ca học',
      render: (_: any, record: Class) => `${record.start_time} - ${record.end_time}`,
      width: 150,
    },
    {
      title: 'Phòng',
      dataIndex: 'room',
      width: 100,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
    },
    {
      title: 'Sĩ số tối đa',
      dataIndex: 'max_students',
      align: 'center' as const,
      width: 110,
    },
    {
      title: 'Tác vụ',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: Class) => (
        <ActionGroup<Class>
          record={record}
          actions={[
            {
              show: () => true,
              icon: <EditOutlined />,
              tooltip: 'Sửa',
              onClick: handleEditClass,
            },
            {
              show: () => true,
              icon: <DeleteOutlined />,
              tooltip: 'Xóa',
              danger: true,
              onClick: () => handleDeleteClass(record.class_id),
              isPopconfirm: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Drawer
      title={`Quản lý lớp học - ${courseName || courseId}`}
      width={1000}
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showNotification('info', 'Đang phát triển', 'Chức năng thêm lớp học chưa được tích hợp')}>
          Thêm Lớp
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Table<Class>
          columns={columns}
          dataSource={classes}
          rowKey="class_id"
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      </Spin>
    </Drawer>
  );
};

export default ClassManagementDrawer;
