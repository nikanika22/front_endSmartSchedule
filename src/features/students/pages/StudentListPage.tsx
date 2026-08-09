import { Button, Popconfirm } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import CardCustom from '@/shared/components/card/CardCustom';
import PageHeader from '@/shared/components/page/PageHeader';
import TableCustom from '@/shared/components/table/TableCustom';
import type { Student } from '../types/students-type';
import { useStudentListPage } from '../hooks/useStudentListPage';

const StudentListPage = () => {
  const { students, loading, deletingId, handleDelete } = useStudentListPage();

  const columns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'student_id',
      width: 160,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as const,
      width: 120,
      render: (_: unknown, record: Student) => (
        <Popconfirm
          title="Xác nhận xóa"
          description={`Bạn có chắc muốn xóa sinh viên "${record.name}"?`}
          onConfirm={() => handleDelete(record.student_id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button
            danger
            size="small"
            loading={deletingId === record.student_id}
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Quản lý sinh viên"
        subtitle="Danh sách tất cả sinh viên trong hệ thống"
        icon={<TeamOutlined />}
      />

      <CardCustom>
        <TableCustom<Student>
          columns={columns}
          dataSource={students}
          loading={loading}
          rowKey="student_id"
          scroll={{ x: 'max-content' }}
        />
      </CardCustom>
    </div>
  );
};

export default StudentListPage;
