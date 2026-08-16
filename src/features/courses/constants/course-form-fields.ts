import { FormFieldType } from '@/shared/types/form-field-type';
import { FormModalMode } from '@/shared/types/form-modal-mode-type';
import type { FormContext, FormField } from '@/shared/components/modal/ModalFormCustom';
import type { Course } from '../types/course-type';

export const courseFormFields: FormField<Course>[] = [
  {
    name: 'course_id',
    label: 'Mã khóa học',
    type: FormFieldType.Input,
    placeholder: 'Nhập mã khóa học...',
    disabled: ({ mode }: FormContext) => mode === FormModalMode.EDIT,
    rules: [
      { required: true, message: 'Vui lòng nhập mã khóa học!' },
      { pattern: /^CS\d{5}$/, message: 'Mã môn học không hợp lệ. Định dạng ví dụ: CS03001 (CS và 5 số đằng sau)!' },
      { max: 20, message: 'Mã khóa học không được dài quá 20 ký tự!' }
    ],
  },
  {
    name: 'course_name',
    label: 'Tên khóa học',
    type: FormFieldType.Input,
    placeholder: 'Nhập tên khóa học...',
    rules: [
      { required: true, message: 'Vui lòng nhập tên khóa học!' },
      { max: 200, message: 'Tên khóa học không được dài quá 200 ký tự!' }
    ],
  },
  {
    name: 'credits',
    label: 'Số tín chỉ',
    type: FormFieldType.InputNumber,
    placeholder: 'Nhập số tín chỉ...',
    rules: [
      { required: true, message: 'Vui lòng nhập số tín chỉ!' },
      { type: 'number', min: 1, max: 20, message: 'Số tín chỉ phải từ 1 đến 20!' }
    ],
  },
  {
    name: 'department',
    label: 'Khoa/Bộ môn',
    type: FormFieldType.Input,
    placeholder: 'Nhập tên khoa...',
    rules: [
      { max: 100, message: 'Tên khoa không được dài quá 100 ký tự!' }
    ],
  },
  {
    name: 'start_date',
    label: 'Ngày bắt đầu',
    type: FormFieldType.DatePicker,
  },
  {
    name: 'end_date',
    label: 'Ngày kết thúc',
    type: FormFieldType.DatePicker,
  },
];
