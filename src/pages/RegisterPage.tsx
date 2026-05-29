import {
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const {Title } = Typography

type RegisterFormValues = {
  name: string
  student_id: string
  email: string
  password: string
  confirmPassword: string
}

function RegisterPage() {
  const navigate = useNavigate()

  const handleSubmit = async(values: RegisterFormValues) => {
      const payload = {
        name: values.name,
        student_id: values.student_id,
        email: values.email,
        password: values.password,
      }

      try{
       const response= await axios.post(
        'http://localhost:3000/auth/register',
        payload,
       )
       console.log('Registration successful:', response.data)
       navigate('/login')
      }
      catch( error ) {
        if (axios.isAxiosError(error)) {
          console.log('Registration payload:', payload)
          console.log('Registration status:', error.response?.status)
          console.log('Registration error:', error.response?.data)
          return
        }

        console.log('Registration error:', error)
      }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-lg shadow-sm">
        <div className="mb-8 text-center">
          <Title level={2} className="!mb-2">
            Tao tai khoan
          </Title>
        </div>

        <Form<RegisterFormValues> layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Ho va ten"
            name="name"
            rules={[{ required: true, message: 'Vui long nhap ho va ten' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyen Van A"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Ma sinh vien"
            name="student_id"
            rules={[{ required: true, message: 'Vui long nhap ma sinh vien' }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder="Nhap ma sinh vien"
              size="large"
            />
          </Form.Item>

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
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mat khau"
            name="password"
            rules={[
              { required: true, message: 'Vui long nhap mat khau' },
              { min: 8, message: 'Mat khau phai co it nhat 8 ky tu' },
              {
                pattern: /(?=.*[A-Z])(?=.*\d)/,
                message: 'Mat khau phai co it nhat 1 chu hoa va 1 so',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Tao mat khau"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Nhap lai mat khau"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui long nhap lai mat khau' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('Mat khau nhap lai khong khop'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhap lai mat khau"
              size="large"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block>
            Dang ky
          </Button>
        </Form>
      </Card>
    </main>
  )
}

export default RegisterPage
