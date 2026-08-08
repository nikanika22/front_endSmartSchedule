import type { Dispatch, SetStateAction } from 'react';
import { Button, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { CalendarModalState, PersonalEvent } from '../types/schedule-types';
import type { CreatePersonalEventDto } from '@/features/schedule-config/types';

dayjs.extend(isoWeek);



type Props = {
    state: CalendarModalState;
    setState: Dispatch<SetStateAction<CalendarModalState>>;
    onSave: (data: CreatePersonalEventDto) => Promise<PersonalEvent>;
    onDelete: () => void;
    onClose: () => void;
};

export default function CalendarEventModal({
    state,
    setState,
    onSave,
    onDelete,
    onClose,
}: Props) {
    return (
        <Modal
            open={state.open}
            title={
                state.mode === 'create'
                    ? 'Đăng ký khung giờ'
                    : 'Thông tin sự kiện'
            }
            onCancel={onClose}
            footer={
                state.mode === 'create'
                    ? [
                        <Button key="cancel" onClick={onClose}>
                            Hủy
                        </Button>,

                        <Button key="save" type="primary" onClick={() => onSave(state as CreatePersonalEventDto)}>
                            Lưu
                        </Button>,
                    ]
                    : [
                        <Button key="delete" danger onClick={onDelete}>
                            Xóa
                        </Button>,

                        <Button key="close" onClick={onClose}>
                            Đóng
                        </Button>,
                    ]
            }
        >
            <Input
                placeholder="Tên sự kiện"
                value={state.title}
                disabled={state.mode === 'view'}
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