import { Link } from 'react-router';
import { Table, Select, Space, Tag, Typography } from 'antd';
import { useReports } from '@/hooks/useReports';
import { useQueryParams } from '@/hooks/useSearchParams';
import {
  PAGE_SIZE,
  REPORT_TARGET_LABEL,
  REPORT_STATUS_LABEL,
  REPORT_STATUS_COLOR,
  REPORT_REASON_LABEL,
} from '@/constants';
import type {
  Report,
  ReportStatus,
  ReportTargetType,
  ReportReason,
} from '@/types';
import dayjs from 'dayjs';

// 대상 타입별 신고 대상 요약
function targetSummary(record: Report): string {
  switch (record.targetType) {
    case 'log':
      return record.log?.title || '(제목 없음)';
    case 'comment':
      return record.comment?.content || '(내용 없음)';
    case 'user':
      return record.reportedUser?.nickname || '(알 수 없음)';
    default:
      return '-';
  }
}

export default function ReportListPage() {
  const { get, getNumber, set } = useQueryParams();
  const page = getNumber('page', 1);
  const status = get('status') as ReportStatus | undefined;
  const targetType = get('targetType') as ReportTargetType | undefined;
  const reason = get('reason') as ReportReason | undefined;

  const { data, isLoading } = useReports({
    page,
    limit: PAGE_SIZE,
    status,
    targetType,
    reason,
  });

  const columns = [
    {
      title: '신고자',
      dataIndex: ['reporter', 'nickname'],
      width: 120,
    },
    {
      title: '대상',
      dataIndex: 'targetType',
      width: 80,
      render: (t: ReportTargetType) => REPORT_TARGET_LABEL[t] ?? t,
    },
    {
      title: '대상 요약',
      render: (_: unknown, record: Report) => (
        <Link to={`/reports/${record.id}`}>
          <Typography.Text ellipsis style={{ maxWidth: 320 }}>
            {targetSummary(record)}
          </Typography.Text>
        </Link>
      ),
    },
    {
      title: '사유',
      dataIndex: 'reason',
      width: 110,
      render: (r: ReportReason) => REPORT_REASON_LABEL[r] ?? r,
    },
    {
      title: '상태',
      dataIndex: 'status',
      width: 90,
      render: (s: ReportStatus) => (
        <Tag color={REPORT_STATUS_COLOR[s]}>{REPORT_STATUS_LABEL[s] ?? s}</Tag>
      ),
    },
    {
      title: '신고일',
      dataIndex: 'createdAt',
      width: 160,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          placeholder="상태"
          value={status}
          onChange={(val) => set({ status: val, page: '1' })}
          allowClear
          style={{ width: 120 }}
          options={Object.entries(REPORT_STATUS_LABEL).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Select
          placeholder="대상 타입"
          value={targetType}
          onChange={(val) => set({ targetType: val, page: '1' })}
          allowClear
          style={{ width: 120 }}
          options={Object.entries(REPORT_TARGET_LABEL).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Select
          placeholder="사유"
          value={reason}
          onChange={(val) => set({ reason: val, page: '1' })}
          allowClear
          style={{ width: 140 }}
          options={Object.entries(REPORT_REASON_LABEL).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.items}
        loading={isLoading}
        pagination={{
          current: page,
          total: data?.total,
          pageSize: PAGE_SIZE,
          onChange: (p) => set({ page: String(p) }),
          showTotal: (total) => `총 ${total}개`,
        }}
      />
    </>
  );
}
