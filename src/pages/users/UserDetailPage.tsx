import { useParams, useNavigate } from 'react-router';
import { Descriptions, Spin, Button, Space, Avatar, Tag, Tooltip, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useUser, useDeleteUser, useRestoreUser } from '@/hooks/useUsers';
import { useLogs } from '@/hooks/useLogs';
import dayjs from 'dayjs';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { data: user, isLoading } = useUser(id!);
  // _count.logs는 삭제된 로그까지 포함한 생성 수라서, 삭제 수는 따로 조회한다.
  const { data: deletedLogs } = useLogs({
    userId: id!,
    status: 'deleted',
    page: 1,
    limit: 1,
  });
  const deleteUser = useDeleteUser();
  const restoreUser = useRestoreUser();

  if (isLoading) return <Spin size="large" />;
  if (!user) return <div>유저를 찾을 수 없습니다.</div>;

  const deletedCount = deletedLogs?.total;

  const handleDelete = () => {
    modal.confirm({
      title: '유저 삭제',
      content: `"${user.nickname}" 유저를 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      onOk: () =>
        deleteUser.mutateAsync(user.id).then(() => {
          message.success('유저가 삭제되었습니다.');
          navigate('/users');
        }).catch(() => {
          message.error('삭제에 실패했습니다.');
        }),
    });
  };

  const handleRestore = () => {
    restoreUser.mutate(user.id, {
      onSuccess: () => message.success('유저가 복원되었습니다.'),
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          목록
        </Button>
        {user.deletedAt ? (
          <Button onClick={handleRestore}>복원</Button>
        ) : (
          <Button danger onClick={handleDelete}>
            삭제
          </Button>
        )}
      </Space>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="프로필" span={2}>
          <Avatar src={user.profileImage} size={64} />
        </Descriptions.Item>
        <Descriptions.Item label="닉네임">{user.nickname}</Descriptions.Item>
        <Descriptions.Item label="이메일">{user.email}</Descriptions.Item>
        <Descriptions.Item label="성별">
          {user.gender === 'male'
            ? '남성'
            : user.gender === 'female'
              ? '여성'
              : '미설정'}
        </Descriptions.Item>
        <Descriptions.Item label="상태">
          {user.deletedAt ? (
            <Tag color="red">삭제됨</Tag>
          ) : (
            <Tag color="green">활성</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="로그 수">
          <Tooltip title={`생성 ${user._count.logs} / 삭제 ${deletedCount ?? 0}`}>
            <span>
              {user._count.logs}
              {!!deletedCount && (
                <span style={{ color: '#ff4d4f' }}>({deletedCount})</span>
              )}
            </span>
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="스팟 수">
          {user._count.createdSpots}
        </Descriptions.Item>
        <Descriptions.Item label="가입일">
          {dayjs(user.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        {user.deletedAt && (
          <Descriptions.Item label="삭제일">
            {dayjs(user.deletedAt).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
        )}
      </Descriptions>
    </>
  );
}
