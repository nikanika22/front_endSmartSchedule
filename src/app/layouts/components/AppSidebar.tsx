import { Image, Layout, Menu, type MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,

  SolutionOutlined,
  ReadOutlined,
  SettingOutlined,
  PlusOutlined,
  UserAddOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import STU_Logo from '@/assets/images/imageSTU.png';
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

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      roles: [USER_ROLE.ADMIN] // Chỉ Admin mới thấy Dashboard
    },
    {
      key: "/addCourses",
      icon: <PlusOutlined />,
      label: "Thêm Môn học",
      roles: [USER_ROLE.ADMIN]
    },
    {
      key: "/create-admin",
      icon: <UserAddOutlined />,
      label: "Cấp tài khoản",
      roles: [USER_ROLE.ADMIN]
    },
    {
      key: "/import-schedule",
      icon: <CloudUploadOutlined />,
      label: "Import Thời khóa biểu",
      roles: [USER_ROLE.ADMIN]
    },
    {
      key: "/courses",
      icon: <SolutionOutlined />,
      label: "Quản lý Môn học",
        roles: [USER_ROLE.STUDENT]
    },
    {
      key: "/schedule-config",
      icon: <SettingOutlined />,
      label: "Cấu hình lịch học",
      roles: [USER_ROLE.STUDENT]
    },
    {
      key: "/schedules",
      icon: <ReadOutlined />,
      label: "Lịch học của tôi",
      roles: [USER_ROLE.STUDENT]
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
        className="h-[64px] flex items-center justify-center border-b border-slate-200"
      >
        <Image src={STU_Logo} preview={false} width={collapsed ? 48 : 64} />
      </div>

      <Menu
        theme="light" // Đặt menu ở chế độ light để khớp với nền Sider nhạt
        mode="inline"
        items={filterMenuByRole(menuItems, user?.role)}
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSidebar;
