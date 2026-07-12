import { Avatar } from 'antd';
import { User } from 'lucide-react';

interface UserAvatarProps {
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ size = 80 }) => {
  return (
    <Avatar 
      size={size} 
      icon={<User size={size / 1.5} />} 
      className="flex items-center justify-center"
    />
  );
};

export default UserAvatar;
