import { FormFieldType } from '@/shared/types/form-field-type';
import { rules } from '@/shared/utils/rules';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import type { RegisterPayload } from '../types/auth-type';
import type { FormField } from '@/shared/components/modal/ModalFormCustom';
import type { FormInstance, RuleObject } from 'antd/es/form';


export const registerFormFields: FormField<RegisterPayload>[] = [
    {
        name: 'massv',
        label: 'Mã sinh viên',
        type: FormFieldType.Input,
        placeholder: 'Nhập mã sinh viên',
        icon: MailOutlined,
        rules: [
            {
               pattern: /^DH\d{6,15}$/i, 
               message: 'MSSV sai định dạng. Ví dụ đúng: DH52200762',
               required: true,
            },
        ],
        col: 24,
    },
  {
    name: 'fullName',
    label: 'Họ và tên',
    type: FormFieldType.Input,
    placeholder: 'Nhập họ và tên',
    icon: MailOutlined,
    rules: [
      { required: true, message: 'Vui lòng nhập họ tên' },
      { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
      { max: 100, message: 'Họ tên không được vượt quá 100 ký tự' }
    ],
    col: 24,
  },
  {
    name: 'email',
    label: 'Email',
    type: FormFieldType.Input,
    placeholder: 'Nhập email',
    icon: MailOutlined,
    rules: [
      { required: true, message: 'Vui lòng nhập email' },
      {
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

  {
    name: 'confirmPassword',
    label: 'Xác nhận mật khẩu',
    type: FormFieldType.InputPassword,
    placeholder: 'Nhập lại mật khẩu',
    icon: LockOutlined,
    rules: [
      {
        required: true,
        message: 'Vui lòng xác nhận mật khẩu',
      },
      rules.password,
      ({ getFieldValue }: FormInstance<RegisterPayload>) => ({
        validator(_: RuleObject, value: string) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }

          return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
        },
      }),
    ],
    col: 24,
  },
];
