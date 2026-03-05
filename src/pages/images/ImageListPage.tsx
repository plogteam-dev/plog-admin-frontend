import { useState } from 'react';
import { Link } from 'react-router';
import { Table, Select, Space, Button, Tag, App, Image as AntImage, DatePicker } from 'antd';
import { useImages, useDeleteImage, useRestoreImage } from '@/hooks/useImages';
import type { ImageStatus, Image } from '@/types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL || '';

export default function ImageListPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState<ImageStatus | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();
  const { message, modal } = App.useApp();

  const { data, isLoading } = useImages({
    page,
    limit,
    status,
    dateFrom: dateRange?.[0],
    dateTo: dateRange?.[1],
  });
  const deleteImage = useDeleteImage();
  const restoreImage = useRestoreImage();

  const handleDelete = (image: Image) => {
    modal.confirm({
      title: '이미지 삭제',
      content: '이 이미지를 삭제하시겠습니까?',
      okText: '삭제',
      okType: 'danger',
      onOk: () =>
        deleteImage.mutateAsync(image.id).then(() => {
          message.success('이미지가 삭제되었습니다.');
        }),
    });
  };

  const handleRestore = (id: string) => {
    restoreImage.mutate(id, {
      onSuccess: () => message.success('이미지가 복원되었습니다.'),
    });
  };

  const columns = [
    {
      title: '썸네일',
      dataIndex: 'thumbnailKey',
      width: 80,
      render: (key: string) => (
        <AntImage
          width={50}
          height={50}
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
    {
      title: '작업',
      width: 120,
      render: (_: unknown, record: Image) =>
        record.deletedAt ? (
          <Button size="small" onClick={() => handleRestore(record.id)}>
            복원
          </Button>
        ) : (
          <Button size="small" danger onClick={() => handleDelete(record)}>
            삭제
          </Button>
        ),
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
          pageSize: limit,
          onChange: setPage,
          showTotal: (total) => `총 ${total}개`,
        }}
      />
    </>
  );
}
