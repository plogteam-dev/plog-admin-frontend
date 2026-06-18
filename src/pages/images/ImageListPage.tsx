import { Link } from 'react-router';
import { Table, Select, Space, Image as AntImage, DatePicker } from 'antd';
import { useImages } from '@/hooks/useImages';
import { CDN_BASE, PAGE_SIZE } from '@/constants';
import { useQueryParams } from '@/hooks/useSearchParams';
import DeletionStatusTag from '@/components/DeletionStatusTag';
import type { Image } from '@/types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function ImageListPage() {
  const { get, getNumber, set } = useQueryParams();
  const page = getNumber('page', 1);
  const status = get('status');
  const dateFrom = get('dateFrom');
  const dateTo = get('dateTo');

  const { data, isLoading } = useImages({
    page,
    limit: PAGE_SIZE,
    status: status as any,
    dateFrom,
    dateTo,
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
      width: 110,
      render: (_: string | null, record: Image) => (
        <DeletionStatusTag
          deletedAt={record.deletedAt}
          deletedByLog={record.deletedByLog}
          byLogLabel="상위 삭제됨"
        />
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
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
        <RangePicker
          onChange={(_, dateStrings) => {
            if (dateStrings[0] && dateStrings[1]) {
              set({ dateFrom: dateStrings[0], dateTo: dateStrings[1], page: '1' });
            } else {
              set({ dateFrom: undefined, dateTo: undefined, page: '1' });
            }
          }}
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
