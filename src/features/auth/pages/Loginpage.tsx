import CardCustom from '@/shared/components/card/CardCustom';
import { Button, Form, Image } from 'antd';
import logo from '@/assets/images/imageSTU.png';
import DynamicForm from '@/shared/components/form/DynamicForm';
import type { LoginPayLoad } from '../types/auth-type';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/redux/hooks';
import { useNotification } from '@/shared/hooks/useNotification';
import { loginThunk, getMeThunk } from '../store/auth-thunk';
import { loginFormFields } from '../constaints/login-form-fields';
const Loginpage = () => {
    const dispatch=useAppDispatch();
    const {showNotification}=useNotification();
    const navigate=useNavigate();
    const [form] =Form.useForm<LoginPayLoad>();
    const onFinish = async (values: LoginPayLoad) => {
    try {
      await dispatch(
        loginThunk({
          email: values.email,
          password: values.password,
        }),
      ).unwrap();

      await dispatch(getMeThunk()).unwrap();

      showNotification(
        'success',
        'Đăng nhập thành công',
        'Bạn đã đăng nhập thành công. Vui lòng tiếp tục sử dụng hệ thống.',
      );

      navigate('/', { replace: true });
    } catch (error: any) {
      showNotification('error', 'Đăng nhập thất bại', typeof error === 'string' ? error : 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  return (
    <CardCustom className="w-full max-w-md border-0 shadow-2xl">
      <div className="mx-auto flex h-24 w-24 items-center justify-center">
        <img src={logo} alt="STU Logo" className="h-full w-full object-contain" />
      </div>

      <div className="mb-2 text-center">
        <h1 className="mb-2 font-bold text-2xl">Đăng nhập</h1>

        <span className="text-gray-500">Nhập thông tin tài khoản để tiếp tục</span>
      </div>

      <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
        <DynamicForm<LoginPayLoad> fields={loginFormFields} />

        <div className="mb-6 flex items-center justify-end">
          <Link to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            Quên mật khẩu?
          </Link>
        </div>

        <Form.Item className="mb-4">
          <Button loading={false} htmlType="submit" type="primary" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center">
        <span className="text-gray-500">Chưa có tài khoản? </span>

        <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
          Đăng ký ngay
        </Link>
      </div>

      <div className="mt-8 text-center">
        <span className="text-xs text-gray-400">© 2026 YOEDU. Hệ thống quản lý đào tạo.</span>
      </div>
    </CardCustom>
  );
}

export default Loginpage