import type { Dispatch, SetStateAction } from 'react';
import { Button, Input, Modal, Popconfirm } from 'antd';
import type {
  CalendarModalState,
  CreatePersonalEventDto,
} from '../types/schedule-types';

type Props = {
  state: CalendarModalState;
  setState: Dispatch<SetStateAction<CalendarModalState>>;
  onSave: (data: CreatePersonalEventDto) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onClose: () => void;
};

export default function CalendarEventModal({
  state,
  setState,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const isEdit = Boolean(state.eventId);

  const handleSave = () => {
    if (!state.start_time || !state.end_time) return;

    void onSave({
      title: state.title,
      start_time: state.start_time,
      end_time: state.end_time,
      start_date: state.start_date,
      end_date: state.end_date,
    });
  };

  const handleDelete = () => {
    if (state.eventId && onDelete) {
      void onDelete(state.eventId);
    }
  };

  return (
    <Modal
      open={state.open}
      title={isEdit ? 'Chi tiết sự kiện cá nhân' : 'Đăng ký khung giờ'}
      onCancel={onClose}
      footer={[
        isEdit && onDelete && (
          <Popconfirm
            key="delete"
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa sự kiện cá nhân này?"
            onConfirm={handleDelete}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger style={{ float: 'left' }}>
              Xóa sự kiện
            </Button>
          </Popconfirm>
        ),
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          {isEdit ? 'Cập nhật' : 'Lưu'}
        </Button>,
      ]}
    >
      <Input
        placeholder="Tên sự kiện"
        value={state.title}
        onChange={(event) =>
          setState((current) => ({
            ...current,
            title: event.target.value,
          }))
        }
      />

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-20 font-medium text-gray-600">Bắt đầu:</span>
          <span className="text-gray-800">{state.start_time} {state.start_date}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-20 font-medium text-gray-600">Kết thúc:</span>
          <span className="text-gray-800">{state.end_time} {state.end_date}</span>
        </div>
      </div>
    </Modal>
  );
}
