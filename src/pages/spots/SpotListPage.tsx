import { Link } from 'react-router';
import { Table, Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSpots } from '@/hooks/useSpots';
import DeletionStatusTag from '@/components/DeletionStatusTag';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useQueryParams } from '@/hooks/useSearchParams';
import { PAGE_SIZE } from '@/constants';
import type { Spot } from '@/types';
import dayjs from 'dayjs';

export default function SpotListPage() {
  const { get, getNumber, set } = useQueryParams();
  const page = getNumber('page', 1);
  const search = get('search') ?? '';
  const status = get('status');
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useSpots({ page, limit: PAGE_SIZE, search: debouncedSearch, status: status as any });

  const columns = [
    {
      title: '스팟 이름',
      dataIndex: 'name',
      render: (text: string, record: Spot) => (
        <Link to={`/spots/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: '설명',
      dataIndex: 'caption',
      ellipsis: true,
      render: (text: string | null) => text ?? '-',
    },
    {
      title: '로그',
      dataIndex: ['log', 'title'],
      render: (text: string) => text || '-',
    },
    {
      title: '작성자',
      dataIndex: ['log', 'user', 'nickname'],
      render: (text: string) => text || '-',
    },
    {
      title: '이미지 수',
      dataIndex: ['_count', 'spotImages'],
      width: 90,
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '상태',
      dataIndex: 'deletedAt',
      width: 100,
      render: (_: string | null, record: Spot) => (
        <DeletionStatusTag
          deletedAt={record.deletedAt}
          deletedByLog={record.deletedByLog}
        />
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="스팟 이름 검색"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => set({ search: e.target.value, page: '1' })}
          allowClear
          style={{ width: 250 }}
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
