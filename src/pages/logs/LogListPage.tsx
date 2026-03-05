import { Link } from 'react-router';
import { Table, Input, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLogs } from '@/hooks/useLogs';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useQueryParams } from '@/hooks/useSearchParams';
import { PAGE_SIZE } from '@/constants';
import type { LogVisibility, LogType, Log } from '@/types';
import dayjs from 'dayjs';

export default function LogListPage() {
  const { get, getNumber, set } = useQueryParams();
  const page = getNumber('page', 1);
  const search = get('search') ?? '';
  const status = get('status');
  const visibility = get('visibility') as LogVisibility | undefined;
  const type = get('type') as LogType | undefined;
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useLogs({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    status: status as any,
    visibility,
    type,
  });

  const columns = [
    {
      title: '제목',
      dataIndex: 'title',
      render: (text: string, record: Log) => (
        <Link to={`/logs/${record.id}`}>{text || '(제목 없음)'}</Link>
      ),
    },
    {
      title: '작성자',
      dataIndex: ['user', 'nickname'],
    },
    {
      title: '로그 날짜',
      dataIndex: 'logDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '공개',
      dataIndex: 'visibility',
      width: 80,
      render: (v: LogVisibility) => {
        const map = { public: '공개', private: '비공개', buddies: '버디' };
        return map[v];
      },
    },
    {
      title: '타입',
      dataIndex: 'type',
      width: 80,
      render: (t: LogType) => (t === 'BUDDY' ? '버디' : '개인'),
    },
    {
      title: '스팟',
      dataIndex: ['_count', 'spots'],
      width: 60,
    },
    {
      title: '상태',
      dataIndex: 'deletedAt',
      width: 80,
      render: (deletedAt: string | null) =>
        deletedAt ? <Tag color="red">삭제됨</Tag> : <Tag color="green">활성</Tag>,
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="제목 검색"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => set({ search: e.target.value, page: '1' })}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="상태"
          value={status}
          onChange={(val) => set({ status: val, page: '1' })}
          allowClear
          style={{ width: 120 }}
          options={[
            { label: '활성', value: 'active' },
            { label: '삭제됨', value: 'deleted' },
          ]}
        />
        <Select
          placeholder="공개 범위"
          value={visibility}
          onChange={(val) => set({ visibility: val, page: '1' })}
          allowClear
          style={{ width: 120 }}
          options={[
            { label: '공개', value: 'public' },
            { label: '비공개', value: 'private' },
            { label: '버디', value: 'buddies' },
          ]}
        />
        <Select
          placeholder="타입"
          value={type}
          onChange={(val) => set({ type: val, page: '1' })}
          allowClear
          style={{ width: 120 }}
          options={[
            { label: '개인', value: 'INDIVIDUAL' },
            { label: '버디', value: 'BUDDY' },
          ]}
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
