import React, { useEffect, useState } from 'react';
import { Spin, Typography, Row, Col, Card, Statistic, Select, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  DashboardOutlined,
  SwapOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { dashboardApi } from '../api/dashboard-api';
import { semesterApi } from '@/features/courses/api/semester-api';
import PageHeader from '@/shared/components/page/PageHeader';
import type { ActiveSemester, algorithmCount, algorithmCountResponse } from '../types/dashboard-types';
import { semesterIdRules, semesterNameRules, semesterDateRangeRules } from '../utils/semesterFormRules';

const { Text } = Typography;

const DashBoard: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState<number | null>(null);
  const [totalClasses, setTotalClasses] = useState<number | null>(null);
  const [activeSemester, setActiveSemester] = useState<ActiveSemester | null>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [algorithmCounts, setAlgorithmCounts] = useState<algorithmCountResponse | null>(null);

  // Modal thêm học kỳ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Biến state để lưu giá trị chọn tạm thời trên Dropdown trước khi bấm Áp dụng
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Gọi song song các API để tải nhanh hơn
        const [coursesRes, classesRes, activeSemRes, semestersRes, algorithmCountsRes] = await Promise.allSettled([
          dashboardApi.getCourseQuantity(),
          dashboardApi.getClassQuantity(),
          dashboardApi.getActiveSemester(),
          semesterApi.getAll(),
          dashboardApi.getAlgorithmCounts()
        ]);
        
        if (coursesRes.status === 'fulfilled') setTotalCourses(coursesRes.value);
        if (classesRes.status === 'fulfilled') setTotalClasses(classesRes.value);
        if (algorithmCountsRes.status === 'fulfilled') 
          {
            setAlgorithmCounts(algorithmCountsRes.value);
            console.log(algorithmCountsRes.value.total);
          }
        if (activeSemRes.status === 'fulfilled') {
          setActiveSemester(activeSemRes.value.data ?? null);
          setSelectedSemesterId(activeSemRes.value.data?.semester_id ?? null);
        }
        
        if (semestersRes.status === 'fulfilled') {
          setSemesters(semestersRes.value.data ?? []);
        }
      } catch (e) {
        console.error('Lỗi lấy dữ liệu dashboard:', e);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const handleChangeSemester = (value: string) => {
    setSelectedSemesterId(value);
  };

  const handleApplySemester = async () => {
    if (!selectedSemesterId) return;
    
    try {
      setLoading(true);
      await semesterApi.setActive(selectedSemesterId);
      
      const matched = semesters.find(s => s.semester_id === selectedSemesterId);
      if (matched) {
        setActiveSemester(matched);
      }
      message.success('Đã thay đổi học kỳ hoạt động thành công');
    } catch (error) {
      console.error('Lỗi khi đổi học kỳ:', error);
      message.error('Không thể thay đổi học kỳ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSemester = async (values: any) => {
    try {
      setLoading(true);
      await semesterApi.create({
        semester_id: values.semester_id,
        name: values.name,
        start_date: values.dateRange[0].format('YYYY-MM-DD'),
        end_date: values.dateRange[1].format('YYYY-MM-DD'),
      });
      message.success('Thêm học kỳ thành công');
      setIsModalOpen(false);
      form.resetFields();
      
      const semestersRes = await semesterApi.getAll();
      setSemesters(semestersRes.data ?? []);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm học kỳ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <PageHeader
        title="Tổng quan hệ thống"
        subtitle="Thống kê dữ liệu hệ thống SmartSchedule"
        icon={<DashboardOutlined />}
        extra={
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
             <Text className="text-gray-500 text-sm font-medium ml-2">Học kỳ làm việc:</Text>
             <Select 
                value={selectedSemesterId} 
                style={{ width: 220 }} 
                loading={loading}
                onChange={handleChangeSemester}
                options={semesters.map(s => ({ value: s.semester_id, label: s.name || s.semester_id }))}
                placeholder="Chọn học kỳ"
             />
             <Button 
                type="primary" 
                icon={<SwapOutlined />} 
                onClick={handleApplySemester}
                disabled={!selectedSemesterId || selectedSemesterId === activeSemester?.semester_id}
              >
                Áp dụng
              </Button>
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                Thêm
              </Button>
          </div>
        }
      />

      <Spin spinning={loading} size="large">
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24} sm={12} lg={8}>
            <Card bordered={true} className="shadow-sm hover:shadow-md transition-shadow border-gray-200 rounded-xl h-full">
              <Statistic
                title={<span className="text-gray-500 font-medium text-sm">Tổng số môn học</span>}
                value={totalCourses ?? 0}
                valueStyle={{ color: '#1f2937', fontWeight: 600, fontSize: '32px' }}
                prefix={<BookOutlined className="text-blue-500 mr-3" />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card bordered={true} className="shadow-sm hover:shadow-md transition-shadow border-gray-200 rounded-xl h-full">
              <Statistic
                title={<span className="text-gray-500 font-medium text-sm">Tổng số lớp học</span>}
                value={totalClasses ?? 0}
                valueStyle={{ color: '#1f2937', fontWeight: 600, fontSize: '32px' }}
                prefix={<TeamOutlined className="text-emerald-500 mr-3" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card bordered={true} className="shadow-sm hover:shadow-md transition-shadow border-gray-200 rounded-xl h-full">
              <Statistic
                title={<span className="text-gray-500 font-medium text-sm">Tổng lịch đã generate</span>}
                value={algorithmCounts?.total ?? 0}
                valueStyle={{ color: '#1f2937', fontWeight: 600, fontSize: '32px' }}
                prefix={<TeamOutlined className="text-emerald-500 mr-3" />}
              />
            </Card>
          </Col>
          
          {
            algorithmCounts && algorithmCounts.data.map((algo: algorithmCount) => (
              <Col xs={24} sm={12} lg={8} key={algo.algorithm}>
                <Card bordered={true} className="shadow-sm hover:shadow-md transition-shadow border-gray-200 rounded-xl h-full">
                  <Statistic
                    title={<span className="text-gray-500 font-medium text-sm">Số lịch dùng {algo.algorithm}</span>}
                    value={algo.count}
                    valueStyle={{ color: '#1f2937', fontWeight: 600, fontSize: '32px' }}
                    prefix={<DashboardOutlined className="text-purple-500 mr-3" />}
                  />
                </Card>
              </Col>
            ))
          }
          <Col xs={24} sm={12} lg={8}>
            <Card bordered={true} className="shadow-sm hover:shadow-md transition-shadow border-gray-200 rounded-xl bg-slate-50 h-full flex flex-col justify-between" styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%' } }}>
               <div>
                 <Statistic
                  title={<span className="text-gray-500 font-medium text-sm">Trạng thái học kỳ</span>}
                  value={activeSemester ? "Đang hoạt động" : "Chưa cấu hình"}
                  valueStyle={{ 
                    color: activeSemester ? '#52c41a' : '#faad14', 
                    fontWeight: 600, 
                    fontSize: '22px', 
                    marginTop: '8px' 
                  }}
                  prefix={<CalendarOutlined className="mr-2" />}
                />
               </div>
              <div className="mt-auto">
                {activeSemester ? (
                  <div className="mt-3 text-xs text-gray-500 font-medium border-t border-gray-200 pt-3">
                    Thời gian: {new Date(activeSemester.start_date).toLocaleDateString('vi-VN')} - {new Date(activeSemester.end_date).toLocaleDateString('vi-VN')}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
                    Vui lòng chọn học kỳ làm việc ở góc phải phía trên.
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>

      <Modal
        title="Thêm học kỳ mới"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        confirmLoading={loading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSemester}>
          <Form.Item name="semester_id" label="Mã học kỳ" rules={semesterIdRules}>
            <Input placeholder="VD: HK1-2025" />
          </Form.Item>
          <Form.Item name="name" label="Tên học kỳ" rules={semesterNameRules}>
            <Input placeholder="VD: Học kỳ 1 (2024-2025)" />
          </Form.Item>
          <Form.Item name="dateRange" label="Thời gian" rules={semesterDateRangeRules}>
            <DatePicker.RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashBoard;