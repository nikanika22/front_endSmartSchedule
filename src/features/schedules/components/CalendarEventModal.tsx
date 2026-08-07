import type { Dispatch, SetStateAction } from 'react';
import { Button, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { CalendarModalState } from '../types/schedule-types';

dayjs.extend(isoWeek);



type Props = {
    state: CalendarModalState;
    setState: Dispatch<SetStateAction<CalendarModalState>>;
    onSave: () => void;
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
    const selectedDate = state.start
        ? dayjs(state.start)
        : null;

    const weekNumber = selectedDate?.isoWeek();

    const weekStart = selectedDate
        ?.startOf('isoWeek')
        .format('DD/MM/YYYY');

    const weekEnd = selectedDate
        ?.endOf('isoWeek')
        .format('DD/MM/YYYY');

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

                        <Button key="save" type="primary" onClick={onSave}>
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

            <div className="mt-4">
                Bắt đầu:{' '}
                {state.start
                    ? dayjs(state.start).format('DD/MM/YYYY HH:mm')
                    : ''}
            </div>

            <div>
                Kết thúc:{' '}
                {state.end
                    ? dayjs(state.end).format('DD/MM/YYYY HH:mm')
                    : ''}
            </div>

            <div className="mt-2">
                Tuần {weekNumber}: {weekStart} – {weekEnd}
            </div>
        </Modal>
    );
}