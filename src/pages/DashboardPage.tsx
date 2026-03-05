import { Card, Col, Row, Statistic, Spin } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useDashboardStats } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <Spin size="large" />;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="전체 유저"
              value={data?.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="전체 로그"
              value={data?.totalLogs}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="전체 스팟"
              value={data?.totalSpots}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="전체 이미지"
              value={data?.totalImages}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="오늘 신규 유저"
              value={data?.newUsersToday}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="오늘 신규 로그"
              value={data?.newLogsToday}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
