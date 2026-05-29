import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import axios from 'axios'
import {Link as RouterLink} from 'react-router-dom'
const {  Paragraph, Title } = Typography
import { useNavigate } from 'react-router-dom'
type LoginFormValues = {
  email: string
  password: string
  remember?: boolean
}

const LoginPage = () => {
    const navigate = useNavigate()
  const handleSubmit = async (values: LoginFormValues) => {
     try{
        const response = await axios.post(
          'http://localhost:3000/auth/login',
          {
            email: values.email,
            password: values.password,
          },
         )
         const {access_token}= response.data;
         console.log('Login successful, access token:', access_token)
         localStorage.setItem('accessToken', access_token)
       
         navigate("/calendar")
          }  
     
     catch (error) {
        console.error('Login error:', error)
     }
  }

  return (
    <main className="flex min-h-screen w-screen items-center justify-center bg-slate-50 p-4">
      <Card
        className="shadow-sm w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <Title level={2} className="!mb-2">
            Đăng nhập
          </Title>
        </div>

        <Form<LoginFormValues>
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui long nhap email' },
              { type: 'email', message: 'Email khong hop le' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="student@example.com"
              size="middle"
            />
          </Form.Item>

          <Form.Item
            label="Mat khau"
            name="password"
            rules={[{ required: true, message: 'Vui long nhap mat khau' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhap mat khau"
              size="middle"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="middle" block>
            Đăng nhập
          </Button>

          <Paragraph className="!mb-0 !mt-6 text-center text-slate-500">
            Chua co tai khoan? <RouterLink to="/register">Dang ky ngay</RouterLink>
          </Paragraph>
        </Form>
      </Card>
    </main>
  )
}

export default LoginPage
