import { useState } from 'react';
import { Link } from 'react-router';
import { Table, Input, Select, Space, Button, Tag, App, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useUsers, useDeleteUser, useRestoreUser } from '@/hooks/useUsers';
import type { UserStatus, User } from '@/types';
import dayjs from 'dayjs';

export default function UserListPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<UserStatus | undefined>();
  const { message, modal } = App.useApp();

  const { data, isLoading } = useUsers({ page, limit, search, status });
  const deleteUser = useDeleteUser();
  const restoreUser = useRestoreUser();

  const handleDelete = (user: User) => {
    modal.confirm({
      title: '유저 삭제',
      content: `"${user.nickname}" 유저를 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      onOk: () =>
        deleteUser.mutateAsync(user.id).then(() => {
          message.success('유저가 삭제되었습니다.');
        }),
    });
  };

  const handleRestore = (id: string) => {
    restoreUser.mutate(id, {
      onSuccess: () => message.success('유저가 복원되었습니다.'),
    });
  };

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
    {
      title: '작업',
      width: 120,
      render: (_: unknown, record: User) =>
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
        <Input
          placeholder="닉네임/이메일 검색"
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
          pageSize: limit,
          onChange: setPage,
          showTotal: (total) => `총 ${total}명`,
        }}
      />
    </>
  );
}
