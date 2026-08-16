import { useEffect, useState } from 'react';
import { FormModalMode, type FormModalModeType } from '../../types/form-modal-mode-type';
import ModalCustom from './ModalCustom';
import { useNotification } from '@/shared/hooks/useNotification';
import { Button, Form, Tabs } from 'antd';
import DynamicForm from '../form/DynamicForm';
import type { FormFieldTypeKey } from '@/shared/types/form-field-type';
import type { ElementType } from 'react';
import dayjs from 'dayjs';

export interface FormContext {
  mode?: FormModalModeType;
}

export interface FormField<T> {
  name: keyof T;
  label: string;
  type: FormFieldTypeKey;
  placeholder?: string;
  disabled?: boolean | ((context: FormContext) => boolean);
  rules?: any[];
  col?: number;
  icon?: ElementType;
}

export interface SectionForm<T> {
  key: string;
  label: string;
  fields: FormField<T>[];
}

interface ModalFormCustomProps<T> {
  open: boolean;

  title: string;

  mode: FormModalModeType;

  initialValues?: Partial<T> | null;

  sections: SectionForm<T>[];

  disabled?: boolean;

  onCancel: () => void;

  onSuccess: () => void;

  onSubmit?: (values: T) => Promise<void>;
}

const ModalFormCustom = <T,>({
  open,
  title,
  mode,
  initialValues,
  sections,
  onCancel,
  onSuccess,
  onSubmit,
  disabled,
}: ModalFormCustomProps<T>) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (initialValues) {
      const formattedValues = { ...initialValues } as any;
      if (formattedValues.start_date) formattedValues.start_date = dayjs(formattedValues.start_date);
      if (formattedValues.end_date) formattedValues.end_date = dayjs(formattedValues.end_date);
      form.setFieldsValue(formattedValues);
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (values: T) => {
    try {
      setLoading(true);

      const payload = { ...values } as any;
      if (payload.start_date && dayjs.isDayjs(payload.start_date)) {
        payload.start_date = payload.start_date.format('YYYY-MM-DD');
      }
      if (payload.end_date && dayjs.isDayjs(payload.end_date)) {
        payload.end_date = payload.end_date.format('YYYY-MM-DD');
      }

      if (onSubmit) {
        await onSubmit(payload as T);
      }

      showNotification('success', 'Thành công', 'Dữ liệu đã được lưu thành công');

      form.resetFields();

      onCancel();

      onSuccess();
    } catch (error: any) {
      showNotification(
        'error',
        'Lỗi',
        error?.response?.data?.message || error?.response?.data?.error?.message || 'Không thể lưu dữ liệu. Vui lòng thử lại',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom
      open={open}
      title={
        mode === FormModalMode.CREATE
          ? `Thêm ${title.toLowerCase()}`
          : mode === FormModalMode.EDIT
            ? `Cập nhật ${title.toLowerCase()}`
            : `Thông tin ${title.toLowerCase()}`
      }
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Tabs
          items={sections.map((section) => ({
            key: section.key,
            label: section.label,
            children: <DynamicForm<T> fields={section.fields} disabled={disabled} mode={mode} />,
          }))}
        />

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Hủy</Button>

          <Button type="primary" htmlType="submit" loading={loading} disabled={disabled}>
            Lưu
          </Button>
        </div>
      </Form>
    </ModalCustom>
  );
};

export default ModalFormCustom;
