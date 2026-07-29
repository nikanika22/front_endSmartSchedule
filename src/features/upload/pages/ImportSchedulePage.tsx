import React, { useState } from 'react';
import { Card, Upload, Button, Row, Col, Typography, Spin } from 'antd';
import { InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import PageHeader from '@/shared/components/page/PageHeader';
import { uploadApi } from '../api/upload-api';
import { useNotification } from '@/shared/hooks/useNotification';

const { Dragger } = Upload;
const { Text } = Typography;

const ImportSchedulePage: React.FC = () => {
  const [courseFileList, setCourseFileList] = useState<UploadFile[]>([]);
  const [classFileList, setClassFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { showNotification } = useNotification();

  const handleUpload = async () => {
    if (courseFileList.length === 0 && classFileList.length === 0) {
      showNotification('warning', 'Lỗi', 'Vui lòng chọn ít nhất một file để upload.');
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    try {
      if (courseFileList.length > 0) {
        const courseFile = courseFileList[0].originFileObj as File;
        await uploadApi.uploadCourses(courseFile);
        successCount++;
      }

      if (classFileList.length > 0) {
        const classFile = classFileList[0].originFileObj as File;
        await uploadApi.uploadClasses(classFile);
        successCount++;
      }

      showNotification(
        'success',
        'Thành công',
        `Đã import thành công ${successCount} loại dữ liệu.`,
      );
      
      // Xóa form sau khi thành công
      setCourseFileList([]);
      setClassFileList([]);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra trong quá trình upload.';
      showNotification('error', 'Upload thất bại', errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const courseProps: UploadProps = {
    onRemove: () => setCourseFileList([]),
    beforeUpload: (file) => {
      setCourseFileList([{ ...file, originFileObj: file }]);
      return false; // Ngăn không cho upload tự động
    },
    fileList: courseFileList,
    maxCount: 1,
    accept: '.xlsx, .xls, .csv',
  };

  const classProps: UploadProps = {
    onRemove: () => setClassFileList([]),
    beforeUpload: (file) => {
      setClassFileList([{ ...file, originFileObj: file }]);
      return false; // Ngăn không cho upload tự động
    },
    fileList: classFileList,
    maxCount: 1,
    accept: '.xlsx, .xls, .csv',
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Import Thời khóa biểu" />
      <Spin spinning={isUploading} tip="Đang tải dữ liệu lên hệ thống...">
        <Card className="rounded-xl shadow-sm border-gray-200">
          <Row gutter={[24, 24]}>
            {/* Cột 1: Môn học */}
            <Col xs={24} md={12}>
              <div className="mb-2">
                <Text strong className="text-base text-gray-700">1. File Danh sách Môn học</Text>
              </div>
              <Dragger {...courseProps} className="bg-blue-50/50 hover:border-blue-400 transition-colors">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-blue-500" />
                </p>
                <p className="ant-upload-text text-gray-600 font-medium">Nhấn hoặc kéo thả file Excel vào khu vực này</p>
                <p className="ant-upload-hint text-gray-400">
                  Hỗ trợ định dạng .xlsx, .xls
                </p>
              </Dragger>
            </Col>

            {/* Cột 2: Lớp học */}
            <Col xs={24} md={12}>
              <div className="mb-2">
                <Text strong className="text-base text-gray-700">2. File Danh sách Lớp học</Text>
              </div>
              <Dragger {...classProps} className="bg-green-50/50 hover:border-green-400 transition-colors">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-green-500" />
                </p>
                <p className="ant-upload-text text-gray-600 font-medium">Nhấn hoặc kéo thả file Excel vào khu vực này</p>
                <p className="ant-upload-hint text-gray-400">
                  Hỗ trợ định dạng .xlsx, .xls
                </p>
              </Dragger>
            </Col>
          </Row>

          <div className="mt-8 flex justify-center pt-6 border-t border-gray-100">
            <Button
              type="primary"
              size="large"
              icon={<CloudUploadOutlined />}
              onClick={handleUpload}
              disabled={courseFileList.length === 0 && classFileList.length === 0}
              className="px-10 font-medium h-11 rounded-lg bg-[#22d10f]! hover:bg-[#000000]!"
            >
              Kích hoạt Import
            </Button>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ImportSchedulePage;
