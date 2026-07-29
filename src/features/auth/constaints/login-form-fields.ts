import type { FormField } from '@/shared/components/modal/ModalFormCustom';
import { FormFieldType } from '@/shared/types/form-field-type';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import type { LoginPayLoad } from '../types/auth-type';

export const loginFormFields: FormField<LoginPayLoad>[] = [
  {
    name: 'email',
    label: 'Email',
    type: FormFieldType.Input,
    placeholder: 'Nhập email',
    icon: MailOutlined,
    rules: [
      {
        required: true,
       pattern: /^dh\d+@student\.stu\.edu\.vn$/,
        message: 'Email phải thuộc trường STU, ví dụ: dh52200762@student.stu.edu.vn',
      },
    ],
    col: 24,
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    type: FormFieldType.InputPassword,
    placeholder: 'Nhập mật khẩu',
    icon: LockOutlined,
     rules: [
      { required: true, message: 'Vui lòng nhập mật khẩu' },
      { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự.' },
      {
        pattern: /(?=.*[A-Z])(?=.*\d)/,
        message: 'Mật khẩu phải có ít nhất 1 chữ hoa và 1 số.',
      },
    ],
    col: 24,
  },
];
