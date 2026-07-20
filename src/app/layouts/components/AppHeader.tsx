import { Layout, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { logout } from '@/features/auth/store/auth-slice';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '@/shared/components/avatar/UserAvatar';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, setCollapsed }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: () => dispatch(logout()),
    },
  ];

  return (
    <Header
      className="flex justify-between items-center px-4 border-b border-gray-200"
    >
      {/* LEFT */}
      <div className="text-xl cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {/* User dropdown */}
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer transition hover:opacity-80">
            <UserAvatar size={38} />

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700">
                {user?.full_name}
              </span>
              <span className="text-xs text-gray-500">
                {user?.role}
              </span>
            </div>
          </div>
        </Dropdown>

      </div>
    </Header>
  );
};

export default AppHeader;
