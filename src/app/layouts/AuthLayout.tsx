import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import StuLogo from '@/assets/images/imageSTU.png';

const { Content } = Layout;

const AuthLayout = () => {
  return (
    <Layout className="min-h-dvh w-full flex items-center justify-center bg-[#f8fafc] px-4 py-8">
      <Content className="w-full max-w-105 flex flex-col items-center justify-center relative z-10">
        
        {/* Beautiful Centered Logo */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full p-3 transition-transform hover:scale-105 duration-300">
            <img src={StuLogo} alt="STU Logo" className="h-full w-full object-contain drop-shadow-sm" />
          </div>
        </div>

        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthLayout;
