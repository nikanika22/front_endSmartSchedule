import { useAppSelector } from "@/app/redux/hooks";
import { Card, Descriptions, Divider } from "antd";
import UserAvatar from "@/shared/components/avatar/UserAvatar";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-xl shadow-md border-gray-200">
        
        {/* Phần Avatar và Tên ở giữa */}
        <div className="flex flex-col items-center justify-center mb-6">
          <UserAvatar size={100} />
          <h2 className="text-2xl font-semibold mt-4 text-gray-800">
            {user.full_name || 'Người dùng'}
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <Divider />

        {/* Phần thông tin chi tiết */}
        <Descriptions bordered column={1} labelStyle={{ width: '160px', fontWeight: 'bold' }}>
          <Descriptions.Item label="Họ và tên">
            {user.full_name || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Mật khẩu">
            ********
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;
