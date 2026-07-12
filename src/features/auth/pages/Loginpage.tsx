import CardCustom from '@/shared/components/card/CardCustom';
import { Button, Form, ConfigProvider } from 'antd';
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
    <CardCustom className="w-full max-w-[420px] mx-auto border border-white/60 !bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-4 sm:p-6">
      
      {/* TABS */}
      <div className="flex mb-8 relative">
        <div className="absolute bottom-0 w-full h-[2px] bg-gray-100/50 rounded-full"></div>
        <Link to="/auth/login" className="flex-1 pb-3 text-center border-b-2 border-[#1f3568] !text-[#1f3568] font-bold text-base transition-all relative z-10">Đăng nhập</Link>
        <Link to="/auth/register" className="flex-1 pb-3 text-center border-b-2 border-transparent !text-gray-400 hover:!text-gray-700 font-medium text-base transition-all relative z-10">Đăng ký</Link>
      </div>

      <ConfigProvider theme={{ components: { Input: { borderRadius: 12, controlHeight: 44, colorBorder: '#e5e7eb', activeBorderColor: '#1f3568', hoverBorderColor: '#1f3568' } } }}>
        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
          <DynamicForm<LoginPayLoad> fields={loginFormFields} />

          <div className="mb-6 flex items-center justify-end">
            <Link to="/auth/forgot-password" className="text-sm !text-[#1f3568] font-medium hover:!text-[#152446] transition-colors">
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item className="mb-2">
            <Button loading={false} htmlType="submit" type="primary" block className="!bg-[#1f3568] hover:!bg-[#152446] !border-none h-[44px] rounded-xl text-base font-semibold shadow-lg shadow-blue-900/20 transition-all">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>

    </CardCustom>
  );
}

export default Loginpage