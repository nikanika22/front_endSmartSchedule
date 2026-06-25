import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Select, TimePicker, Typography, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import type { CreatePersonalEventDto, PersonalEvent } from '../types';
import type { Dayjs } from 'dayjs';

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

  const handleSubmit = async (values: { title: string; day_of_week?: number; time: [Dayjs, Dayjs]; is_recurring?: boolean; note?: string }) => {
    try {
      const dto: CreatePersonalEventDto = {
        title: values.title,
        day_of_week: values.day_of_week,
        start_time: values.time[0].format('HH:mm:00'),
        end_time: values.time[1].format('HH:mm:00'),
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
    <div className="lg:pt-0 lg:border-t-0 pt-7 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-1">
            03 / THỜI GIAN BẬN CÁ NHÂN
          </span>
          <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">Khung giờ bận</h3>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsDrawerOpen(true)}
          size="middle"
          className="!bg-[var(--accent)] hover:!opacity-90 !text-white !rounded-xl !border-0 h-9 px-4 font-semibold text-xs shadow-sm shadow-[var(--accent)]/15 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
        >
          Thêm sự kiện
        </Button>
      </div>
      <Text className="text-slate-400 dark:text-slate-550 mb-6 block text-xs leading-relaxed">
        Khai báo khung giờ bận cố định trong tuần (VD: Lịch làm thêm, sinh hoạt CLB...).
      </Text>

      <div className="flex flex-col gap-0">
        {events.length === 0 ? (
          <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <CalendarOutlined className="text-3xl text-slate-300 dark:text-slate-700 mb-3" />
            <div className="text-slate-400 dark:text-slate-500 font-medium text-xs">Bạn chưa cấu hình khung giờ bận nào.</div>
          </div>
        ) : (
          events.map((item) => (
            <div
              key={item.event_id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 py-3 px-2 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 relative overflow-hidden flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.title}</span>
                  {item.is_recurring && (
                    <span className="bg-[var(--accent-bg)] text-[var(--accent)] px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider font-semibold">
                      Hàng tuần
                    </span>
                  )}
                </div>
                <div className="mt-1.5 text-slate-450 dark:text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1"><CalendarOutlined className="text-slate-350 dark:text-slate-600 text-xs" /> {getDayLabel(item.day_of_week)}</span>
                  <span className="flex items-center gap-1"><ClockCircleOutlined className="text-slate-350 dark:text-slate-600 text-xs" /> {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</span>
                  {item.note && <span className="italic text-slate-400/80 dark:text-slate-500/80 font-normal">Ghi chú: {item.note}</span>}
                </div>
              </div>
              <div className="flex-shrink-0 pt-1">
                <Popconfirm
                  title="Xóa sự kiện"
                  description="Bạn có chắc chắn muốn xóa sự kiện bận này không?"
                  onConfirm={() => onDelete(item.event_id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true, className: 'rounded-lg bg-rose-650 border-0 hover:bg-rose-600 text-white' }}
                  cancelButtonProps={{ className: 'rounded-lg dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }}
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined className="text-sm" />} 
                    type="text" 
                    className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-450 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-200" 
                  />
                </Popconfirm>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guide Tip Box to fill empty space */}
      <div className="mt-8 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
          Lưu ý xếp lịch
        </h4>
        <p className="text-[11px] text-slate-400 dark:text-slate-550 leading-relaxed">
          Hệ thống sẽ tự động tránh xếp lịch học trùng với các sự kiện cá nhân mà bạn đã khai báo ở đây.
        </p>
      </div>

      <Drawer
        title={<span className="font-bold text-base text-slate-800 dark:text-slate-200">Thêm sự kiện bận</span>}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        size="default"
        className="dark:bg-slate-900"
        styles={{ body: { padding: '24px' } }}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit} requiredMark={false}>
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500 dark:text-slate-400">TÊN SỰ KIỆN</span>} 
            name="title" 
            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện bận' }]}
          >
            <Input size="large" className="rounded-lg dark:bg-slate-850 dark:border-slate-700 dark:text-slate-200 text-sm h-10" placeholder="Vd: Đi làm part-time" />
          </Form.Item>
          
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500 dark:text-slate-400">THỨ TRONG TUẦN</span>} 
            name="day_of_week" 
            rules={[{ required: true, message: 'Vui lòng chọn thứ trong tuần' }]}
          >
            <Select size="large" className="rounded-lg text-sm h-10" popupClassName="dark:bg-slate-850" placeholder="Chọn thứ" options={DAYS_OPTIONS} />
          </Form.Item>
          
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500 dark:text-slate-400">KHOẢNG THỜI GIAN BẬN</span>} 
            name="time" 
            rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
          >
            <RangePicker size="large" className="w-full rounded-lg dark:bg-slate-850 dark:border-slate-700 text-sm h-10" format="HH:mm" placeholder={['Bắt đầu', 'Kết thúc']} />
          </Form.Item>
 
          <Form.Item 
            label={<span className="font-medium text-xs text-slate-500 dark:text-slate-400">GHI CHÚ (TÙY CHỌN)</span>} 
            name="note"
          >
            <Input.TextArea rows={3} className="rounded-lg dark:bg-slate-850 dark:border-slate-700 dark:text-slate-200 text-sm" placeholder="Nhập thêm ghi chú chi tiết..." />
          </Form.Item>
 
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            className="mt-6 bg-[var(--accent)] hover:opacity-90 border-0 rounded-lg shadow-sm font-semibold h-11 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center text-white text-sm" 
            loading={loading}
          >
            Lưu sự kiện bận
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};
