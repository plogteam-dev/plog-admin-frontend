import { useState } from 'react';
import { Card, Col, Row, Statistic, Spin, DatePicker } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs, { type Dayjs } from 'dayjs';
import { useDashboardStats, useDashboardDailyStats } from '@/hooks/useDashboard';

const { RangePicker } = DatePicker;

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const dailyParams = {
    from: dateRange[0].format('YYYY-MM-DD'),
    to: dateRange[1].format('YYYY-MM-DD'),
  };

  const { data: dailyData, isLoading: isDailyLoading } =
    useDashboardDailyStats(dailyParams);

  const chartData = dailyData?.items.map((item) => ({
    ...item,
    date: dayjs(item.date).format('MM/DD'),
  }));

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
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title="일별 신규 추이"
            extra={
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates?.[0] && dates?.[1]) {
                    setDateRange([dates[0], dates[1]]);
                  }
                }}
                allowClear={false}
              />
            }
          >
            <Spin spinning={isDailyLoading}>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    name="신규 유저"
                    stroke="#1677ff"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="newLogs"
                    name="신규 로그"
                    stroke="#52c41a"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Spin>
          </Card>
        </Col>
      </Row>
    </>
  );
}
