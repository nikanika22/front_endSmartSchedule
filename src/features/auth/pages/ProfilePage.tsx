import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { Card, Descriptions, Divider, Input, Button, message, Space } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined, LockOutlined } from "@ant-design/icons";
import UserAvatar from "@/shared/components/avatar/UserAvatar";
import { updateMeApi } from "../api/auth-api";
import { getMeThunk } from "../store/auth-thunk";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);

  const [isEditingPw, setIsEditingPw] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  if (!user) return null;

  const openEditName = () => {
    setEditName(user.full_name || '');
    setIsEditingName(true);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setEditName('');
  };

  const handleSaveName = async () => {
    if (!editName.trim()) return message.error("Tên không được để trống");
    try {
      setNameLoading(true);
      await updateMeApi({ name: editName });
      message.success("Cập nhật tên thành công");
      setIsEditingName(false);
      dispatch(getMeThunk());
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setNameLoading(false);
    }
  };

  const cancelEditPw = () => {
    setIsEditingPw(false);
    setOldPw('');
    setNewPw('');
  };

  const handleSavePassword = async () => {
    if (!oldPw || !newPw) return message.error("Vui lòng nhập đầy đủ mật khẩu");
    if (newPw.length < 8) return message.error("Mật khẩu mới phải có ít nhất 8 ký tự");
    try {
      setPwLoading(true);
      await updateMeApi({ old_password: oldPw, password: newPw });
      message.success("Đổi mật khẩu thành công");
      cancelEditPw();
    } catch (e: any) {
      message.error(e?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <Card className="w-full max-w-xl shadow-md border-gray-200">

        <div className="flex flex-col items-center mb-6">
          <UserAvatar size={100} />
          <h2 className="text-2xl font-semibold mt-4 text-gray-800 m-0">{user.full_name || 'Người dùng'}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <Divider />

        <Descriptions bordered column={1} labelStyle={{ width: '160px', fontWeight: 'bold' }}>

          <Descriptions.Item label="Họ và tên">
            {isEditingName ? (
              <Space>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} onPressEnter={handleSaveName} disabled={nameLoading} />
                <Button type="primary" size="small" icon={<SaveOutlined />} onClick={handleSaveName} loading={nameLoading}>Lưu</Button>
                <Button size="small" icon={<CloseOutlined />} onClick={cancelEditName} disabled={nameLoading}>Hủy</Button>
              </Space>
            ) : (
              <div className="flex items-center justify-between">
                <span>{user.full_name || 'Chưa cập nhật'}</span>
                <Button type="link" size="small" icon={<EditOutlined />} onClick={openEditName}>Sửa</Button>
              </div>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>

          <Descriptions.Item label="Mật khẩu">
            {isEditingPw ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input.Password placeholder="Mật khẩu cũ" value={oldPw} onChange={(e) => setOldPw(e.target.value)} prefix={<LockOutlined />} disabled={pwLoading} />
                <Input.Password placeholder="Mật khẩu mới (≥8 ký tự)" value={newPw} onChange={(e) => setNewPw(e.target.value)} prefix={<LockOutlined />} disabled={pwLoading} />
                <Space>
                  <Button type="primary" size="small" icon={<SaveOutlined />} onClick={handleSavePassword} loading={pwLoading}>Lưu</Button>
                  <Button size="small" icon={<CloseOutlined />} onClick={cancelEditPw} disabled={pwLoading}>Hủy</Button>
                </Space>
              </Space>
            ) : (
              <div className="flex items-center justify-between">
                <span>********</span>
                <Button type="link" size="small" icon={<EditOutlined />} onClick={() => setIsEditingPw(true)}>Đổi mật khẩu</Button>
              </div>
            )}
          </Descriptions.Item>

        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfilePage;
