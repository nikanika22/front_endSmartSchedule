import React, { useState } from 'react';
import { Button, DatePicker, Drawer, Form, Input, Select, TimePicker, Typography, Popconfirm, theme } from 'antd';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { CreatePersonalEventDto, PersonalEvent } from '../types';
import dayjs, { type Dayjs } from 'dayjs';

const { Text } = Typography;
const { RangePicker } = TimePicker;

interface Props {
  events: PersonalEvent[];
  onCreate: (data: CreatePersonalEventDto) => Promise<void>;
  onDelete: (eventId: number) => Promise<void>;
  loading?: boolean;
}

const DAYS_OPTIONS = [
  { value: 2, label: 'Thứ 2' },
  { value: 3, label: 'Thứ 3' },
  { value: 4, label: 'Thứ 4' },
  { value: 5, label: 'Thứ 5' },
  { value: 6, label: 'Thứ 6' },
  { value: 7, label: 'Thứ 7' },
  { value: 8, label: 'Chủ Nhật' },
];

export const PersonalEventsSection: React.FC<Props> = ({ events, onCreate, onDelete, loading }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const handleSubmit = async (values: {
    title: string;
    day_of_week?: number;
    time: [Dayjs, Dayjs];
    date_range: [Dayjs, Dayjs];
    is_recurring?: boolean;
    note?: string;
  }) => {
    try {
      const dto: CreatePersonalEventDto = {
        title: values.title,
        day_of_week: values.day_of_week,
        start_time: values.time[0].format('HH:mm:00'),
        end_time: values.time[1].format('HH:mm:00'),
        start_date: values.date_range[0].format('YYYY-MM-DD'),
        end_date: values.date_range[1].format('YYYY-MM-DD'),
        is_recurring: values.is_recurring !== undefined ? values.is_recurring : true,
        note: values.note,
      };
      await onCreate(dto);
      setIsDrawerOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const getDayLabel = (val?: number) => {
    if (!val) return 'Ngày tùy chọn';
    const day = DAYS_OPTIONS.find(d => d.value === val);
    return day ? day.label : `Thứ ${val}`;
  };

  return (
    <div className="lg:pt-0 lg:border-t-0 pt-7 border-t border-slate-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-850">Khung giờ bận</h3>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsDrawerOpen(true)}
          size="middle"
          className="!rounded-xl h-9 px-4 font-semibold text-xs shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-white"
        >
          Thêm sự kiện
        </Button>
      </div>
      <Text className="text-slate-400 mb-6 block text-xs leading-relaxed">
        Khai báo khung giờ bận cố định trong tuần (VD: Lịch làm thêm, sinh hoạt CLB...).
      </Text>

      <div className="flex flex-col gap-0 mt-5">
        {events.length === 0 ? (
          <div 
            className="py-10 text-center rounded-2xl border border-dashed"
            style={{ borderColor: token.colorBorderSecondary }}
          >
            <CalendarOutlined className="text-3xl mb-3" style={{ color: token.colorTextDescription }} />
            <div className="font-medium text-xs text-slate-400">Bạn chưa cấu hình khung giờ bận nào.</div>
          </div>
        ) : (
          events.map((item) => (
            <div
              key={item.event_id}
              className="group transition-all duration-300 p-4 rounded-xl border mb-3 relative overflow-hidden flex items-start justify-between gap-4 shadow-sm"
              style={{
                backgroundColor: token.colorBgContainer,
                borderColor: token.colorBorderSecondary,
              }}
            >
              {/* Accent vertical line */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 opacity-70" 
                style={{ backgroundColor: token.colorPrimary }}
              />
              <div className="flex-1 pl-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-slate-850 transition-colors duration-250 group-hover:text-primary-active">
                    {item.title}
                  </span>
                  {item.is_recurring && (
                    <span 
                      className="px-2 py-0.5 rounded-full font-mono text-[8px] uppercase tracking-wider font-bold"
                      style={{
                        backgroundColor: token.colorPrimaryBg,
                        color: token.colorPrimary,
                      }}
                    >
                      Cố định
                    </span>
                  )}
                </div>
                <div className="mt-2 text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1.5">
                    <CalendarOutlined style={{ color: token.colorPrimary }} className="text-xs" /> {getDayLabel(item.day_of_week)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockCircleOutlined style={{ color: token.colorPrimary }} className="text-xs" /> {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                  </span>
                  {item.start_date && (
                    <span className="text-[11px] text-slate-400">
                      ({dayjs(item.start_date).format('DD/MM/YYYY')} - {dayjs(item.end_date || item.start_date).format('DD/MM/YYYY')})
                    </span>
                  )}
                </div>
                {item.note && (
                  <div className="mt-1.5 text-[11px] text-slate-400/90 italic">
                    Ghi chú: {item.note}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 pt-0.5">
                <Popconfirm
                  title="Xóa sự kiện"
                  description="Bạn có chắc chắn muốn xóa sự kiện bận này không?"
                  onConfirm={() => onDelete(item.event_id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true, className: 'rounded-lg bg-rose-600 border-0 hover:bg-rose-500 text-white font-medium text-xs h-8 px-3' }}
                  cancelButtonProps={{ className: 'rounded-lg text-xs h-8 px-3' }}
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined className="text-sm" />} 
                    type="text" 
                    className="text-slate-450 hover:text-rose-500 hover:bg-rose-50 rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-200"
                  />
                </Popconfirm>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guide Tip Box */}
      <div 
        className="mt-8 p-4 border rounded-2xl flex gap-3 shadow-sm"
        style={{
          backgroundColor: token.colorBgContainer,
          borderColor: token.colorBorderSecondary,
        }}
      >
        <div 
          className="p-2 rounded-xl h-fit"
          style={{
            backgroundColor: token.colorPrimaryBg,
            color: token.colorPrimary,
          }}
        >
          <InfoCircleOutlined className="text-base flex" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-0.5">
            Lưu ý xếp lịch tự động
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hệ thống sẽ tự động tránh xếp lịch học trùng với các sự kiện cá nhân mà bạn đã khai báo ở đây để tối ưu hóa thời gian biểu của bạn.
          </p>
        </div>
      </div>

      <Drawer
        title={<span className="font-bold text-base text-slate-800">Thêm sự kiện bận</span>}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        size="default"
        styles={{ body: { padding: '24px' } }}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit} requiredMark={false}>
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500">TÊN SỰ KIỆN</span>}
            name="title" 
            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện bận' }]}
          >
            <Input size="large" className="rounded-lg text-sm h-10" placeholder="Vd: Đi làm part-time" />
          </Form.Item>
          
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500">THỜI GIAN ÁP DỤNG (BẮT ĐẦU & KẾT THÚC)</span>}
            name="date_range" 
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu và kết thúc' }]}
          >
            <DatePicker.RangePicker 
              size="large" 
              className="w-full rounded-lg text-sm h-10" 
              format="DD/MM/YYYY" 
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']} 
            />
          </Form.Item>

          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500">THỨ TRONG TUẦN</span>}
            name="day_of_week" 
            rules={[{ required: true, message: 'Vui lòng chọn thứ trong tuần' }]}
          >
            <Select size="large" className="rounded-lg text-sm h-10" placeholder="Chọn thứ" options={DAYS_OPTIONS} />
          </Form.Item>
          
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500">KHOẢNG THỜI GIAN BẬN</span>}
            name="time" 
            rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
          >
            <RangePicker size="large" className="w-full rounded-lg text-sm h-10" format="HH:mm" placeholder={['Bắt đầu', 'Kết thúc']} />
          </Form.Item>
 
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500">GHI CHÚ (TÙY CHỌN)</span>}
            name="note"
          >
            <Input.TextArea rows={3} className="rounded-lg text-sm" placeholder="Nhập thêm ghi chú chi tiết..." />
          </Form.Item>
 
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            className="mt-6 border-0 rounded-lg shadow-sm font-semibold h-11 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center text-white text-sm" 
            loading={loading}
          >
            Lưu sự kiện bận
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

