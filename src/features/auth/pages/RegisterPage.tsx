import React, { useState } from 'react';
import { Button, Form, ConfigProvider, Modal, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import CardCustom from '@/shared/components/card/CardCustom';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { registerThunk } from '@/features/auth/store/auth-thunk';
import { registerFormFields } from '../constaints/register-form-fields';
import { useNotification } from '@/shared/hooks/useNotification';
import DynamicForm from '@/shared/components/form/DynamicForm';
import type { RegisterPayload } from '../types/auth-type';
import { USER_ROLE } from '@/features/students/user-role-type';
import { confirmRegistrationApi } from '../api/auth-api';

interface RegisterPageProps {
  isAdminMode?: boolean;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ isAdminMode = false }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [form] = Form.useForm<RegisterPayload>();

  // State OTP Modal
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async (values: RegisterPayload) => {
    try {
      await dispatch(
        registerThunk({
          student_id: values.massv,
          name: values.fullName,
          email: values.email,
          password: values.password,
          ...(isAdminMode ? { role: USER_ROLE.ADMIN } : {}),
        }),
      ).unwrap();

      if (isAdminMode) {
        showNotification('success', 'Thành công', 'Đã cấp tài khoản Admin mới thành công!');
        form.resetFields();
      } else {
        // Lưu email để dùng khi confirm OTP, mở modal
        setPendingEmail(values.email);
        setOtp('');
        setOtpModalOpen(true);
        showNotification('info', 'Kiểm tra email', 'Mã xác minh 6 số đã được gửi đến email của bạn.');
      }
    } catch (error: any) {
      const errorMsg = Array.isArray(error) ? error.join(', ') : error;
      showNotification('error', 'Đăng ký thất bại', errorMsg || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const handleConfirmOtp = async () => {
    if (otp.length !== 6) {
      showNotification('error', 'Mã không hợp lệ', 'Vui lòng nhập đủ 6 chữ số.');
      return;
    }
    try {
      setConfirmLoading(true);
      await confirmRegistrationApi({ email: pendingEmail, otp });
      setOtpModalOpen(false);
      showNotification('success', 'Xác minh thành công', 'Tài khoản đã được kích hoạt. Vui lòng đăng nhập.');
      navigate('/auth/login', { replace: true });
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || 'Mã xác minh không đúng hoặc đã hết hạn.';
      showNotification('error', 'Xác minh thất bại', msg);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className={isAdminMode ? "flex justify-center w-full" : ""}>
      <CardCustom className={isAdminMode ? "w-full max-w-150 mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm" : "w-full max-w-105 mx-auto border border-white/60 bg-white/80! backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-4 sm:p-6"}>

        {/* TABS */}
        {!isAdminMode && (
          <div className="flex mb-8 relative">
            <div className="absolute bottom-0 w-full h-0.5 bg-gray-100/50 rounded-full"></div>
            <Link to="/auth/login" className="flex-1 pb-3 text-center border-b-2 border-transparent text-gray-400! hover:text-gray-700! font-medium text-base transition-all relative z-10">Đăng nhập</Link>
            <Link to="/auth/register" className="flex-1 pb-3 text-center border-b-2 border-[#1f3568] text-[#1f3568]! font-bold text-base transition-all relative z-10">Đăng ký</Link>
          </div>
        )}

        {/* FORM */}
        <ConfigProvider theme={{ components: { Input: { borderRadius: 12, controlHeight: 44, colorBorder: '#e5e7eb', activeBorderColor: '#1f3568', hoverBorderColor: '#1f3568' } } }}>
          <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
            <DynamicForm<RegisterPayload> fields={registerFormFields} />

            {/* SUBMIT */}
            <Form.Item className="mb-2">
              <Button loading={loading} htmlType="submit" type="primary" block className="bg-[#1f3568]! hover:bg-[#152446]! border-none! h-11 rounded-xl text-base font-semibold shadow-lg shadow-blue-900/20 transition-all">
                {isAdminMode ? 'Cấp tài khoản Admin' : 'Đăng ký'}
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>

      </CardCustom>

      {/* OTP CONFIRM MODAL */}
      <Modal
        open={otpModalOpen}
        title={
          <div className="text-center">
            <div className="text-2xl mb-1">📬</div>
            <div className="text-base font-bold text-slate-800">Xác minh email</div>
          </div>
        }
        onCancel={() => setOtpModalOpen(false)}
        footer={null}
        centered
        width={380}
        maskClosable={false}
      >
        <div className="text-center text-sm text-slate-500 mb-5">
          <span className="font-semibold text-slate-700">{pendingEmail}</span>
        </div>

        <Input
          size="large"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="Nhập mã 6 chữ số"
          className="text-center text-lg tracking-[0.5em] rounded-xl mb-4"
          onPressEnter={handleConfirmOtp}
        />

        <Button
          type="primary"
          block
          size="large"
          loading={confirmLoading}
          onClick={handleConfirmOtp}
          className="bg-[#1f3568]! hover:bg-[#152446]! border-none! mt-5 rounded-xl font-semibold"
        >
          Xác minh
        </Button>

        <div className="text-center mt-5 text-xs text-slate-400">
          Mã có hiệu lực trong <span className="text-slate-600 font-medium">5 phút</span>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterPage;

