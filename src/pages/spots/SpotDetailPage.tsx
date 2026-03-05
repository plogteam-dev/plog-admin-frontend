import { useParams, useNavigate } from 'react-router';
import {
  Descriptions,
  Spin,
  Button,
  Space,
  Tag,
  Image,
  Empty,
  App,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSpot, useDeleteSpot, useRestoreSpot } from '@/hooks/useSpots';
import dayjs from 'dayjs';

const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL || '';

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { data: spot, isLoading } = useSpot(id!);
  const deleteSpot = useDeleteSpot();
  const restoreSpot = useRestoreSpot();

  if (isLoading) return <Spin size="large" />;
  if (!spot) return <div>스팟을 찾을 수 없습니다.</div>;

  const handleDelete = () => {
    modal.confirm({
      title: '스팟 삭제',
      content: `"${spot.name}" 스팟을 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      onOk: () =>
        deleteSpot.mutateAsync(spot.id).then(() => {
          message.success('스팟이 삭제되었습니다.');
          navigate('/spots');
        }),
    });
  };

  const handleRestore = () => {
    restoreSpot.mutate(spot.id, {
      onSuccess: () => message.success('스팟이 복원되었습니다.'),
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/spots')}>
          목록
        </Button>
        {spot.deletedAt ? (
          <Button onClick={handleRestore}>복원</Button>
        ) : (
          <Button danger onClick={handleDelete}>
            삭제
          </Button>
        )}
      </Space>

      <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="스팟 이름">{spot.name}</Descriptions.Item>
        <Descriptions.Item label="설명">
          {spot.caption ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="생성일">
          {dayjs(spot.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="상태">
          {spot.deletedAt ? (
            <Tag color="red">삭제됨</Tag>
          ) : (
            <Tag color="green">활성</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginBottom: 16 }}>
        이미지 ({spot.spotImages.length}장)
      </Typography.Title>
      {spot.spotImages.length > 0 ? (
        <Image.PreviewGroup>
          <Space wrap>
            {spot.spotImages.map((img) => (
              <Image
                key={img.id}
                width={150}
                height={150}
                src={`${CDN_BASE}/${img.key}`}
                fallback={`${CDN_BASE}/${img.thumbnailKey}`}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
            ))}
          </Space>
        </Image.PreviewGroup>
      ) : (
        <Empty description="이미지 없음" />
      )}
    </>
  );
}
