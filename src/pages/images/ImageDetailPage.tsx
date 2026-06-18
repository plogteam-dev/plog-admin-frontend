import { useParams, useNavigate } from 'react-router';
import { Descriptions, Spin, Button, Space, Image, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useImage, useDeleteImage, useRestoreImage } from '@/hooks/useImages';
import { CDN_BASE } from '@/constants';
import DeletionStatusTag from '@/components/DeletionStatusTag';
import dayjs from 'dayjs';

export default function ImageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { data: image, isLoading } = useImage(id!);
  const deleteImage = useDeleteImage();
  const restoreImage = useRestoreImage();

  if (isLoading) return <Spin size="large" />;
  if (!image) return <div>이미지를 찾을 수 없습니다.</div>;

  const handleDelete = () => {
    modal.confirm({
      title: '이미지 삭제',
      content: '이 이미지를 삭제하시겠습니까?',
      okText: '삭제',
      okType: 'danger',
      onOk: () =>
        deleteImage.mutateAsync(image.id).then(() => {
          message.success('이미지가 삭제되었습니다.');
          navigate('/images');
        }).catch(() => {
          message.error('삭제에 실패했습니다.');
        }),
    });
  };

  const handleRestore = () => {
    restoreImage.mutate(image.id, {
      onSuccess: () => message.success('이미지가 복원되었습니다.'),
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          목록
        </Button>
        {image.deletedAt && !image.deletedByLog ? (
          <Button onClick={handleRestore}>복원</Button>
        ) : (
          <Button danger onClick={handleDelete}>
            삭제
          </Button>
        )}
      </Space>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Image
          src={`${CDN_BASE}/${image.key}`}
          style={{ maxWidth: 600, borderRadius: 8 }}
        />
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{image.id}</Descriptions.Item>
          <Descriptions.Item label="상태">
            <DeletionStatusTag
              deletedAt={image.deletedAt}
              deletedByLog={image.deletedByLog}
              byLogLabel="상위 삭제됨"
            />
          </Descriptions.Item>
          <Descriptions.Item label="생성일">
            {dayjs(image.createdAt).format('YYYY-MM-DD HH:mm')}
          </Descriptions.Item>
          {image.deletedAt && (
            <Descriptions.Item label={image.deletedByLog ? '상위 삭제일' : '삭제일'}>
              {dayjs(image.deletedByLog ? image.logDeletedAt : image.deletedAt).format(
                'YYYY-MM-DD HH:mm',
              )}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Space>
    </>
  );
}
