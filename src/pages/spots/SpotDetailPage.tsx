import { useParams, useNavigate } from 'react-router';
import {
  Descriptions,
  Spin,
  Button,
  Space,
  Tag,
  Image,
  Empty,
  Typography,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSpot } from '@/hooks/useSpots';
import { CDN_BASE } from '@/constants';
import dayjs from 'dayjs';

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: spot, isLoading } = useSpot(id!);

  if (isLoading) return <Spin size="large" />;
  if (!spot) return <div>스팟을 찾을 수 없습니다.</div>;

  const region = [spot.region1DepthName, spot.region2DepthName, spot.region3DepthName]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          목록
        </Button>
      </Space>

      <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="스팟 이름">{spot.name}</Descriptions.Item>
        <Descriptions.Item label="설명">
          {spot.caption ?? '-'}
        </Descriptions.Item>
        <Descriptions.Item label="로그">{spot.log?.title || '-'}</Descriptions.Item>
        <Descriptions.Item label="작성자">{spot.log?.user?.nickname || '-'}</Descriptions.Item>
        <Descriptions.Item label="지역">{region || '-'}</Descriptions.Item>
        <Descriptions.Item label="장소">{spot.place?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="좌표">
          {spot.latitude && spot.longitude
            ? `${spot.latitude}, ${spot.longitude}`
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="상태">
          {spot.deletedAt ? (
            <Tag color="red">삭제됨</Tag>
          ) : (
            <Tag color="green">활성</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="생성일">
          {dayjs(spot.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        {spot.deletedAt && (
          <Descriptions.Item label="삭제일">
            {dayjs(spot.deletedAt).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Typography.Title level={5} style={{ marginBottom: 16 }}>
        이미지 ({spot.spotImages?.length ?? 0}장)
      </Typography.Title>
      {spot.spotImages && spot.spotImages.length > 0 ? (
        <Image.PreviewGroup>
          <Space wrap>
            {spot.spotImages.map((si: any) => (
              <Image
                key={si.id}
                width={150}
                height={150}
                src={`${CDN_BASE}/${si.image?.thumbnailKey}`}
                preview={{ src: `${CDN_BASE}/${si.image?.key}` }}
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
