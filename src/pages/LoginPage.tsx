import { useNavigate } from 'react-router';
import { Form, Input, Button, Card, Typography, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/hooks/useAuth';
import type { LoginRequest } from '@/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const loginMutation = useLogin();

  const onFinish = (values: LoginRequest) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        message.success('로그인 성공');
        navigate('/');
      },
      onError: () => {
        message.error('이메일 또는 비밀번호가 올바르지 않습니다.');
      },
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 400 }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Rilo Admin
        </Typography.Title>
        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '이메일을 입력하세요' },
              { type: 'email', message: '유효한 이메일을 입력하세요' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="이메일" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              block
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
