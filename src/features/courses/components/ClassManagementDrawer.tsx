import React, { useEffect, useState } from 'react';
import { Drawer, Table, Button, Spin, Modal, Form, Input, InputNumber, Select, TimePicker } from 'antd';
import { courseApi } from '../api/course-api';
import { classApi } from '../api/class-api';
import { semesterApi } from '../api/semester-api';
import type { Class } from '../types/course-type';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ActionGroup from '@/shared/components/table/ActionGroup';
import { useNotification } from '@/shared/hooks/useNotification';
import dayjs from 'dayjs';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [form] = Form.useForm();
  const [semesters, setSemesters] = useState<any[]>([]);

  const fetchSemesters = async () => {
    try {
      const res = await semesterApi.getAll();
      setSemesters(res.data || res);
    } catch (error) {
      console.error('Lỗi khi tải học kỳ:', error);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

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

  const handleAddClass = () => {
    setEditingClass(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditClass = (record: Class) => {
    setEditingClass(record);
    form.setFieldsValue({
      ...record,
      start_time: record.start_time ? dayjs(record.start_time, 'HH:mm:ss') : null,
      end_time: record.end_time ? dayjs(record.end_time, 'HH:mm:ss') : null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      setLoading(true);
      await classApi.delete(classId);
      showNotification('success', 'Thành công', 'Đã xóa lớp học');
      fetchClasses();
    } catch (error: any) {
      showNotification('error', 'Lỗi', error?.response?.data?.error?.message || 'Xóa lớp học thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClass = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload = {
        ...values,
        course_id: courseId,
        start_time: values.start_time ? values.start_time.format('HH:mm:ss') : null,
        end_time: values.end_time ? values.end_time.format('HH:mm:ss') : null,
      };

      if (editingClass) {
        await classApi.update(editingClass.class_id, payload);
        showNotification('success', 'Thành công', 'Đã cập nhật thông tin lớp học');
      } else {
        await classApi.create(payload);
        showNotification('success', 'Thành công', 'Đã thêm lớp học mới');
      }
      setIsModalOpen(false);
      fetchClasses();
    } catch (error: any) {
      if (error?.errorFields) return; // Lỗi validate form
      showNotification('error', 'Lỗi', error?.response?.data?.error?.message || 'Lưu lớp học thất bại');
    } finally {
      setLoading(false);
    }
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClass}>
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

      <Modal
        title={editingClass ? "Chỉnh sửa lớp học" : "Thêm lớp học"}
        open={isModalOpen}
        onOk={handleSaveClass}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="class_id" label="Mã nhóm lớp" rules={[{ required: true, message: 'Vui lòng nhập mã nhóm lớp' }]}>
            <Input disabled={!!editingClass} placeholder="VD: SE102_HTTT_01" />
          </Form.Item>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="semester_id" label="Học kỳ" rules={[{ required: true, message: 'Vui lòng chọn học kỳ' }]}>
              <Select placeholder="Chọn học kỳ">
                {semesters.map(s => (
                  <Select.Option key={s.semester_id} value={s.semester_id}>
                    {s.semester_name || s.semester_id}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="day_of_week" label="Thứ" rules={[{ required: true, message: 'Vui lòng chọn thứ' }]}>
              <Select placeholder="Chọn thứ">
                {[2, 3, 4, 5, 6, 7, 8].map(d => (
                  <Select.Option key={d} value={d}>
                    {d === 8 ? 'Chủ nhật' : `Thứ ${d}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="start_time" label="Giờ bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
              <TimePicker format="HH:mm:ss" className="w-full" placeholder="07:30:00" />
            </Form.Item>
            
            <Form.Item name="end_time" label="Giờ kết thúc" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
              <TimePicker format="HH:mm:ss" className="w-full" placeholder="11:30:00" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="max_students" label="Sĩ số tối đa" rules={[{ required: true, message: 'Vui lòng nhập sĩ số' }]}>
              <InputNumber min={1} className="w-full" placeholder="VD: 40" />
            </Form.Item>

            <Form.Item name="room" label="Phòng">
              <Input placeholder="VD: C.101" />
            </Form.Item>
          </div>

          <Form.Item name="instructor" label="Giảng viên">
            <Input placeholder="Tên giảng viên" />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default ClassManagementDrawer;
