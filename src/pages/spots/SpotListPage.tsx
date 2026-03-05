import { useState } from 'react';
import { Link } from 'react-router';
import { Table, Input, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSpots } from '@/hooks/useSpots';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { PAGE_SIZE } from '@/constants';
import type { EntityStatus, Spot, SpotImage } from '@/types';
import dayjs from 'dayjs';

export default function SpotListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EntityStatus | undefined>();
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useSpots({ page, limit: PAGE_SIZE, search: debouncedSearch, status });

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
      title: '이미지 수',
      dataIndex: 'spotImages',
      width: 90,
      render: (images: SpotImage[]) => images?.length ?? 0,
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
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
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="스팟 이름 검색"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          allowClear
          style={{ width: 250 }}
        />
        <Select
          placeholder="상태"
          value={status}
          onChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
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
          current: data?.page,
          total: data?.total,
          pageSize: PAGE_SIZE,
          onChange: setPage,
          showTotal: (total) => `총 ${total}개`,
        }}
      />
    </>
  );
}
