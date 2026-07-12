import React, { useState } from 'react';
import { courseApi } from '../api/course-api';
import useTable from '@/shared/hooks/useTable';
import type { Course } from '../types/course-type';
import PageHeader from '@/shared/components/page/PageHeader';
import { Button } from 'antd';
import { useFormModal } from '@/shared/hooks/useFormModal';
import FilterTableCustom from '@/shared/components/table/FilterTableCustom';
import { courseFilters } from '../constants/course-filter-table';
import TablePaginationCustom from '@/shared/components/table/TablePaginationCustom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import ActionGroup from '@/shared/components/table/ActionGroup';
import ModalFormCustom, { type SectionForm } from '@/shared/components/modal/ModalFormCustom';
import { FormModalMode } from '@/shared/types/form-modal-mode-type';
import { courseFormFields } from '../constants/course-form-fields';
import type { CourseFilterParams } from '../types/course-fliter-params';
import ClassManagementDrawer from '../components/ClassManagementDrawer';
import { UnorderedListOutlined } from '@ant-design/icons';

const CourseClassPage = () => {
  const { create, getAll, update, remove } = courseApi;

  // 1. Hooks quản lý trạng thái bảng dữ liệu
  const {
    data: courses,
    loading,
    pagination,
    filterValues,
    handleDelete,
    handleChangePage,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterReset,
    refetch,
  } = useTable<Course, CourseFilterParams>({
    fetchApi: getAll,
    removeApi: remove,
  });

  // 2. Hook quản lý trạng thái đóng/mở Modal Form
  const { open, mode, selectedRecord, openCreate, openView, openEdit, close } =
    useFormModal<Course>();

  // Trạng thái Drawer quản lý lớp
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCourseForClass, setSelectedCourseForClass] = useState<{ id: string; name: string } | null>(null);

  const openClassDrawer = (record: Course) => {
    setSelectedCourseForClass({ id: record.course_id, name: record.course_name });
    setDrawerOpen(true);
  };

  const closeClassDrawer = () => {
    setDrawerOpen(false);
    setSelectedCourseForClass(null);
  };

  // 3. Khai báo phần của Form nhập liệu môn học
  const sectionsCourseForm: SectionForm<any>[] = [
    {
      key: 'courseInfo',
      label: 'Thông tin môn học',
      fields: courseFormFields,
    },
  ];

  // 4. Khai báo các cột hiển thị trong bảng
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
    {
      title: 'Tác vụ',
      align: 'center' as const,
      render: (_: any, record: Course) => {
        return (
          <ActionGroup<Course>
            record={record}
            actions={[
              {
                show: () => true,
                icon: <UnorderedListOutlined />,
                tooltip: 'Quản lý lớp',
                onClick: openClassDrawer,
              },
              {
                show: () => true,
                icon: <EyeOutlined />,
                tooltip: 'Chi tiết',
                onClick: openView,
              },
              {
                show: () => true,
                icon: <EditOutlined />,
                tooltip: 'Sửa',
                onClick: openEdit,
              },
              {
                show: () => true,
                icon: <DeleteOutlined />,
                tooltip: 'Xóa',
                danger: true,
                onClick: () => handleDelete(record.course_id),
                isPopconfirm: true,
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Tiêu đề trang & Nút thêm mới */}
        <PageHeader
          title="Quản lý khóa học"
          subtitle="Danh sách khóa học"
          extra={
            <Button type="primary" onClick={openCreate}>
              + Thêm khóa học
            </Button>
          }
        />
        
        {/* Bộ lọc/Tìm kiếm đơn giản */}
        <div className="mb-4">
          <FilterTableCustom
            dataFilters={courseFilters}
            values={filterValues}
            onChange={handleFilterChange}
            onReset={handleFilterReset}
            onSubmit={handleFilterSubmit}
          />
        </div>

        {/* Bảng phân trang dữ liệu */}
        <TablePaginationCustom<Course>
          columns={columns as any}
          data={courses}
          loading={loading}
          pagination={pagination}
          onChangePage={handleChangePage}
        />

        {/* Modal Thêm/Sửa/Chi tiết khóa học */}
        <ModalFormCustom<Course>
          open={open}
          title="Khóa học"
          mode={mode}
          initialValues={selectedRecord}
          disabled={mode === FormModalMode.VIEW}
          onCancel={close}
          onSuccess={refetch}
          onSubmit={
            mode === FormModalMode.CREATE
              ? create
              : (values) => update(selectedRecord!.course_id, values)
          }
          sections={sectionsCourseForm}
        />

        {/* Drawer Quản lý lớp học */}
        <ClassManagementDrawer
          open={drawerOpen}
          courseId={selectedCourseForClass?.id || null}
          courseName={selectedCourseForClass?.name}
          onClose={closeClassDrawer}
        />
      </div>
    </>
  );
};

export default CourseClassPage;