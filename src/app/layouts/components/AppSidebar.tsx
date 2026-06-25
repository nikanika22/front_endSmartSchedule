import { Image, Layout, Menu, type MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  SolutionOutlined,
  UserOutlined,
  BookOutlined,
  AuditOutlined,
  ReadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import STU_Logo from '@/assets/images/imageSTU.png';
import { useTheme } from '@/app/providers/theme/hooks/useTheme';
import { USER_ROLE, type UserRole } from '@/features/students/user-role-type'
import { useAppSelector } from '@/app/redux/hooks';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number] & {
  roles?: UserRole[];
  children?: MenuItem[];
};

interface AppSidebarProps {
  collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'user-management',
      label: 'Quản lý người dùng',
      icon: <TeamOutlined />,
      roles: [USER_ROLE.ADMIN, USER_ROLE.ADMIN], // Chỉ admin và manager mới thấy menu này
      children: [
        {
          key: '/accounts',
          icon: <AuditOutlined />,
          label: 'Tài khoản',
        },
        {
          key: '/students',
          icon: <UserOutlined />,
          label: 'Học viên',
        },
        {
          key: '/teachers',
          icon: <SolutionOutlined />,
          label: 'Giáo viên',
        },
      ],
    },
    {
      key: 'academic-management',
      label: 'Quản lý Cá Nhân',
      icon: <BookOutlined />,
      children: [
        {
          key: '/courses',
          icon: <SolutionOutlined />,
          label: 'Khóa học của tôi',
        },
        {
          key: '/schedule-config',
          icon: <SettingOutlined />,
          label: 'Cấu hình lịch học',
        },
        {
          key: '/schedules',
          icon: <ReadOutlined />,
          label: 'Lịch học của tôi',
        },
      ],
    },
  ];
  const filterMenuByRole = (items: MenuItem[], role?: UserRole): MenuItem[] => {
    return (
      items
        // Nếu item không có trường roles hoặc trường roles có chứa role của user thì giữ lại
        .filter((item) => !item.roles || item.roles.includes(role!))
        // Với các item có children, tiếp tục lọc children theo cùng logic
        .map((item) => ({
          ...item,
          children: item.children ? filterMenuByRole(item.children, role) : undefined,
        }))
        // Sau khi lọc, loại bỏ các item có children nhưng không còn children nào sau khi lọc
        .filter((item) => {
          const isLeaf = !item.children;
          const hasChildren = item.children?.length;

          return isLeaf || hasChildren;
        }) as MenuItem[]
    );
  };

  return (
    <Sider width={240} collapsed={collapsed}>
      <div
        className={`h-16 flex items-center justify-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <Image src={STU_Logo} preview={false} width={collapsed ? 48 : 64} />
      </div>

      <Menu
        theme={theme}
        mode="inline"
        items={filterMenuByRole(menuItems, user?.role)}
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSidebar;
