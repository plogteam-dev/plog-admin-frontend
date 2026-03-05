import { Link } from 'react-router';
import { Table, Input, Select, Space, Tag, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useUsers } from '@/hooks/useUsers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useQueryParams } from '@/hooks/useSearchParams';
import { PAGE_SIZE } from '@/constants';
import type { User } from '@/types';
import dayjs from 'dayjs';

export default function UserListPage() {
  const { get, getNumber, set } = useQueryParams();
  const page = getNumber('page', 1);
  const search = get('search') ?? '';
  const status = get('status');
  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading } = useUsers({ page, limit: PAGE_SIZE, search: debouncedSearch, status: status as any });

  const columns = [
    {
      title: '프로필',
      dataIndex: 'profileImage',
      width: 60,
      render: (url: string | null) => <Avatar src={url} />,
    },
    {
      title: '닉네임',
      dataIndex: 'nickname',
      render: (text: string, record: User) => (
        <Link to={`/users/${record.id}`}>{text}</Link>
      ),
    },
    { title: '이메일', dataIndex: 'email' },
    {
      title: '로그 수',
      dataIndex: ['_count', 'logs'],
      width: 80,
    },
    {
      title: '스팟 수',
      dataIndex: ['_count', 'createdSpots'],
      width: 80,
    },
    {
      title: '가입일',
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
          placeholder="닉네임/이메일 검색"
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
          showTotal: (total) => `총 ${total}명`,
        }}
      />
    </>
  );
}
