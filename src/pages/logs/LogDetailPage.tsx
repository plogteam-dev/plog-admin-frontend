import { useParams, useNavigate } from 'react-router';
import { Descriptions, Spin, Button, Space, Tag, App, List, Image as AntImage } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLog, useDeleteLog, useRestoreLog } from '@/hooks/useLogs';
import { CDN_BASE } from '@/constants';
import type { LogSpot } from '@/types';
import dayjs from 'dayjs';

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { data: log, isLoading } = useLog(id!);
  const deleteLog = useDeleteLog();
  const restoreLog = useRestoreLog();

  if (isLoading) return <Spin size="large" />;
  if (!log) return <div>로그를 찾을 수 없습니다.</div>;

  const handleDelete = () => {
    modal.confirm({
      title: '로그 삭제',
      content: `"${log.title}" 로그를 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      onOk: () =>
        deleteLog.mutateAsync(log.id).then(() => {
          message.success('로그가 삭제되었습니다.');
          navigate('/logs');
        }).catch(() => {
          message.error('삭제에 실패했습니다.');
        }),
    });
  };

  const handleRestore = () => {
    restoreLog.mutate(log.id, {
      onSuccess: () => message.success('로그가 복원되었습니다.'),
    });
  };

  const visibilityLabel = { public: '공개', private: '비공개', buddies: '버디' };

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/logs')}>
          목록
        </Button>
        {log.deletedAt ? (
          <Button onClick={handleRestore}>복원</Button>
        ) : (
          <Button danger onClick={handleDelete}>
            삭제
          </Button>
        )}
      </Space>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="제목">{log.title}</Descriptions.Item>
        <Descriptions.Item label="작성자">{log.user.nickname}</Descriptions.Item>
        <Descriptions.Item label="날짜">
          {dayjs(log.logDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="공개 범위">
          {visibilityLabel[log.visibility]}
        </Descriptions.Item>
        <Descriptions.Item label="타입">
          {log.type === 'BUDDY' ? '버디' : '개인'}
        </Descriptions.Item>
        <Descriptions.Item label="상태">
          {log.deletedAt ? (
            <Tag color="red">삭제됨</Tag>
          ) : (
            <Tag color="green">활성</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="스팟 수">{log._count.spots}</Descriptions.Item>
        <Descriptions.Item label="참여자 수">{log._count.participants}</Descriptions.Item>
        <Descriptions.Item label="생성일">
          {dayjs(log.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        {log.deletedAt && (
          <Descriptions.Item label="삭제일">
            {dayjs(log.deletedAt).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
        )}
      </Descriptions>

      {log.spots && log.spots.length > 0 && (
        <>
          <h3 style={{ marginTop: 32 }}>스팟 목록</h3>
          <List
            dataSource={log.spots}
            renderItem={(spot: LogSpot) => (
              <List.Item>
                <List.Item.Meta
                  title={spot.name}
                  description={spot.caption}
                />
                <AntImage.PreviewGroup>
                  <Space>
                    {spot.spotImages.map((img) => (
                      <AntImage
                        key={img.id}
                        width={80}
                        src={`${CDN_BASE}/${img.thumbnailKey}`}
                        preview={{ src: `${CDN_BASE}/${img.key}` }}
                      />
                    ))}
                  </Space>
                </AntImage.PreviewGroup>
              </List.Item>
            )}
          />
        </>
      )}
    </>
  );
}
