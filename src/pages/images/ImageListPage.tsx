import { useState } from 'react';
import { Link } from 'react-router';
import { Table, Select, Space, Tag, Image as AntImage, DatePicker } from 'antd';
import { useImages } from '@/hooks/useImages';
import { CDN_BASE, PAGE_SIZE } from '@/constants';
import type { EntityStatus } from '@/types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function ImageListPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EntityStatus | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();
  const { data, isLoading } = useImages({
    page,
    limit: PAGE_SIZE,
    status,
    dateFrom: dateRange?.[0],
    dateTo: dateRange?.[1],
  });

  const columns = [
    {
      title: '썸네일',
      dataIndex: 'thumbnailKey',
      width: 140,
      render: (key: string) => (
        <AntImage
          width={120}
          height={120}
          src={`${CDN_BASE}/${key}`}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: string) => <Link to={`/images/${id}`}>{id.slice(0, 8)}...</Link>,
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
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
        <RangePicker
          onChange={(_, dateStrings) => {
            if (dateStrings[0] && dateStrings[1]) {
              setDateRange(dateStrings as [string, string]);
            } else {
              setDateRange(undefined);
            }
            setPage(1);
          }}
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
