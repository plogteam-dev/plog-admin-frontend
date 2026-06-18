import { useParams, useNavigate } from 'react-router';
import { Descriptions, Spin, Button, Space, Tag, List, Image as AntImage } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLog } from '@/hooks/useLogs';
import { CDN_BASE } from '@/constants';
import DeletionStatusTag from '@/components/DeletionStatusTag';
import type { LogSpot } from '@/types';
import dayjs from 'dayjs';

const visibilityLabel: Record<string, string> = {
  PUBLIC: '공개',
  PRIVATE: '비공개',
  BUDDIES: '버디',
};

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: log, isLoading } = useLog(id!);

  if (isLoading) return <Spin size="large" />;
  if (!log) return <div>로그를 찾을 수 없습니다.</div>;

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          목록
        </Button>
      </Space>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="제목">{log.title}</Descriptions.Item>
        <Descriptions.Item label="작성자">{log.user?.nickname}</Descriptions.Item>
        <Descriptions.Item label="날짜">
          {dayjs(log.logDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="공개 범위">
          {visibilityLabel[log.visibility] ?? log.visibility}
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
        <Descriptions.Item label="스팟 수">{log.spots?.length ?? 0}</Descriptions.Item>
        <Descriptions.Item label="참여자 수">{log.participants?.length ?? 0}</Descriptions.Item>
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
                  title={
                    <Space>
                      {spot.name}
                      <DeletionStatusTag
                        deletedAt={spot.deletedAt}
                        deletedByLog={spot.deletedByLog}
                        hideActive
                      />
                    </Space>
                  }
                  description={spot.caption}
                />
                <AntImage.PreviewGroup>
                  <Space align="start">
                    {spot.spotImages?.map((si) => (
                      <Space key={si.id} direction="vertical" size={4} align="center">
                        <AntImage
                          width={80}
                          src={`${CDN_BASE}/${si.image?.thumbnailKey}`}
                          preview={{ src: `${CDN_BASE}/${si.image?.key}` }}
                        />
                        <DeletionStatusTag
                          deletedAt={si.deletedAt}
                          deletedByLog={si.deletedByLog}
                          byLogLabel="상위 삭제됨"
                          hideActive
                        />
                      </Space>
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
