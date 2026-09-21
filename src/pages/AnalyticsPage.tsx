import { useState } from 'react';
import {
  App,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Row,
  Segmented,
  Space,
  Spin,
  Statistic,
  Table,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dayjs, { type Dayjs } from 'dayjs';
import { useAnalytics, useRebuildAnalytics } from '@/hooks/useDashboard';
import {
  CHART_SERIES,
  VISIT_INTERVAL_BUCKETS,
  VISIT_INTERVAL_LABEL,
} from '@/constants';
import type {
  AnalyticsPlatform,
  DailyMetric,
  VisitIntervalItem,
  WeeklyMetric,
} from '@/types';

const { RangePicker } = DatePicker;

const num = (value?: number | null) => (value ?? 0).toLocaleString();

// 초 → m:ss
const formatSec = (value?: number | null) => {
  const total = Math.max(0, Math.round(value ?? 0));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
};

// 비율(%) — 분모 0이면 "-"
const formatRate = (numerator?: number | null, denominator?: number | null) => {
  if (!denominator) return '-';
  return `${(((numerator ?? 0) / denominator) * 100).toFixed(1)}%`;
};

const rateValue = (numerator: number, denominator: number) =>
  denominator ? Number((((numerator ?? 0) / denominator) * 100).toFixed(1)) : 0;

export default function AnalyticsPage() {
  const { message, modal } = App.useApp();

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [platform, setPlatform] = useState<AnalyticsPlatform>('all');

  const from = dateRange[0].format('YYYY-MM-DD');
  const to = dateRange[1].format('YYYY-MM-DD');

  const { data, isLoading, isFetching } = useAnalytics({ from, to, platform });
  const rebuild = useRebuildAnalytics();

  const daily = data?.daily ?? [];
  const weekly = data?.weekly ?? [];
  const latest = daily.length ? daily[daily.length - 1] : undefined;

  const dailyChart = daily.map((item) => ({
    ...item,
    label: dayjs(item.date).format('MM/DD'),
    creatorRate: rateValue(item.creators, item.auUsers),
  }));

  const visitChart = VISIT_INTERVAL_BUCKETS.map((bucket) => {
    const found = data?.visitInterval.find(
      (item: VisitIntervalItem) => item.bucket === bucket,
    );
    return { bucket, label: VISIT_INTERVAL_LABEL[bucket], users: found?.users ?? 0 };
  });

  const handleRebuild = () => {
    modal.confirm({
      title: '지표 재계산',
      content: `${from} ~ ${to} 기간의 일별 지표를 다시 계산합니다. 데이터 양에 따라 시간이 걸릴 수 있습니다.`,
      okText: '재계산',
      onOk: () =>
        rebuild
          .mutateAsync({ from, to })
          .then(() => message.success('재계산이 완료되었습니다.'))
          .catch(() => message.error('재계산에 실패했습니다.')),
    });
  };

  const retentionColumns = [
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
    },
    {
      title: 'D1',
      key: 'd1',
      render: (_: unknown, row: DailyMetric) =>
        `${formatRate(row.retainedD1, row.cohortD1)} (${num(row.cohortD1)}명)`,
    },
    {
      title: 'D7',
      key: 'd7',
      render: (_: unknown, row: DailyMetric) =>
        `${formatRate(row.retainedD7, row.cohortD7)} (${num(row.cohortD7)}명)`,
    },
    {
      title: 'D30',
      key: 'd30',
      render: (_: unknown, row: DailyMetric) =>
        `${formatRate(row.retainedD30, row.cohortD30)} (${num(row.cohortD30)}명)`,
    },
  ];

  const weeklyColumns = [
    {
      title: '주 시작',
      dataIndex: 'weekStart',
      key: 'weekStart',
      render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
    },
    {
      title: 'WAU',
      dataIndex: 'wau',
      key: 'wau',
      render: (value: number) => num(value),
    },
    {
      title: 'WAU 중 생성자',
      key: 'wauCreators',
      render: (_: unknown, row: WeeklyMetric) =>
        `${formatRate(row.wauCreators, row.wau)} (${num(row.wauCreators)}명)`,
    },
    {
      title: '세션',
      dataIndex: 'sessions',
      key: 'sessions',
      render: (value: number) => num(value),
    },
    {
      title: '평균 체류',
      dataIndex: 'avgSessionSec',
      key: 'avgSessionSec',
      render: (value: number) => formatSec(value),
    },
    {
      title: '신규',
      dataIndex: 'newUsers',
      key: 'newUsers',
      render: (value: number) => num(value),
    },
  ];

  // 일별 표 — 라인 차트의 표 대체 보기(색만으로 식별되지 않도록)
  const dailyColumns = [
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
    },
    {
      title: '가입자 AU',
      dataIndex: 'auUsers',
      key: 'auUsers',
      render: (value: number) => num(value),
    },
    {
      title: '미가입 AU 신규',
      dataIndex: 'auAnonNew',
      key: 'auAnonNew',
      render: (value: number) => num(value),
    },
    {
      title: '로그아웃 기가입자 AU',
      dataIndex: 'auAnonReturning',
      key: 'auAnonReturning',
      render: (value: number) => num(value),
    },
    {
      title: '세션',
      dataIndex: 'sessions',
      key: 'sessions',
      render: (value: number) => num(value),
    },
    {
      title: '평균 체류',
      dataIndex: 'avgSessionSec',
      key: 'avgSessionSec',
      render: (value: number) => formatSec(value),
    },
    {
      title: '생성자',
      dataIndex: 'creators',
      key: 'creators',
      render: (value: number) => num(value),
    },
  ];

  if (isLoading) return <Spin size="large" />;

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (dates?.[0] && dates?.[1]) {
              setDateRange([dates[0], dates[1]]);
            }
          }}
          allowClear={false}
        />
        <Segmented<AnalyticsPlatform>
          value={platform}
          onChange={setPlatform}
          options={[
            { label: '전체', value: 'all' },
            { label: 'iOS', value: 'ios' },
            { label: 'Android', value: 'android' },
          ]}
        />
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRebuild}
          loading={rebuild.isPending}
        >
          재계산
        </Button>
      </Space>

      <Spin spinning={isFetching}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8} xl={4}>
            <Card>
              <Statistic title="가입자 AU" value={num(latest?.auUsers)} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={5}>
            <Card>
              <Statistic title="미가입 AU 신규" value={num(latest?.auAnonNew)} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={5}>
            <Card>
              <Statistic
                title="로그아웃 기가입자 AU"
                value={num(latest?.auAnonReturning)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={5}>
            <Card>
              <Statistic
                title="생성률"
                value={formatRate(latest?.creators, latest?.auUsers)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={5}>
            <Card>
              <Statistic
                title="평균 체류"
                value={formatSec(latest?.avgSessionSec)}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card
              title="일별 활성 사용자"
              extra={
                latest ? (
                  <span style={{ color: '#8c8c8c' }}>
                    기준일 {dayjs(latest.date).format('YYYY-MM-DD')}
                  </span>
                ) : null
              }
            >
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={dailyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => num(Number(value))} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="auUsers"
                    name="가입자 AU"
                    stroke={CHART_SERIES.blue}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="auAnonNew"
                    name="미가입 AU 신규"
                    stroke={CHART_SERIES.orange}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="auAnonReturning"
                    name="로그아웃 기가입자 AU"
                    stroke={CHART_SERIES.aqua}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <Collapse
                ghost
                items={[
                  {
                    key: 'daily-table',
                    label: '표로 보기',
                    children: (
                      <Table
                        rowKey="date"
                        size="small"
                        dataSource={daily}
                        columns={dailyColumns}
                        pagination={false}
                        scroll={{ x: true, y: 320 }}
                      />
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} xl={12}>
            <Card title="일별 로그 생성자">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dailyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => num(Number(value))} />
                  <Bar
                    dataKey="creators"
                    name="생성자"
                    fill={CHART_SERIES.blue}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card title="일별 생성률 (생성자 ÷ 가입자 AU)">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dailyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => `${Number(value)}%`} />
                  <Line
                    type="monotone"
                    dataKey="creatorRate"
                    name="생성률"
                    stroke={CHART_SERIES.orange}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="방문 주기 (세션 간 간격)">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={visitChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => `${num(Number(value))}명`} />
                  <Bar
                    dataKey="users"
                    name="사용자"
                    fill={CHART_SERIES.blue}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} xl={12}>
            <Card title="리텐션 (가입일 코호트)">
              <Table
                rowKey="date"
                size="small"
                dataSource={[...daily].reverse()}
                columns={retentionColumns}
                pagination={{ pageSize: 10, showSizeChanger: false }}
              />
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card title="주간 지표">
              <Table
                rowKey="weekStart"
                size="small"
                dataSource={weekly}
                columns={weeklyColumns}
                pagination={false}
                scroll={{ x: true }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </>
  );
}
