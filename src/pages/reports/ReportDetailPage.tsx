import { useParams, useNavigate, Link } from 'react-router';
import { Descriptions, Spin, Button, Space, Tag, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useReport, useUpdateReport } from '@/hooks/useReports';
import { useDeleteLog } from '@/hooks/useLogs';
import { useDeleteUser } from '@/hooks/useUsers';
import { useDeleteComment } from '@/hooks/useComments';
import {
  REPORT_TARGET_LABEL,
  REPORT_STATUS_LABEL,
  REPORT_STATUS_COLOR,
  REPORT_REASON_LABEL,
} from '@/constants';
import type { Report } from '@/types';
import dayjs from 'dayjs';

// 대상 삭제 여부 (이미 조치된 콘텐츠인지)
function targetDeletedAt(report: Report): string | null {
  switch (report.targetType) {
    case 'log':
      return report.log?.deletedAt ?? null;
    case 'comment':
      return report.comment?.deletedAt ?? null;
    case 'user':
      return report.reportedUser?.deletedAt ?? null;
    default:
      return null;
  }
}

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { data: report, isLoading } = useReport(id!);
  const updateReport = useUpdateReport();
  const deleteLog = useDeleteLog();
  const deleteUser = useDeleteUser();
  const deleteComment = useDeleteComment();

  if (isLoading) return <Spin size="large" />;
  if (!report) return <div>신고를 찾을 수 없습니다.</div>;

  const targetLabel = REPORT_TARGET_LABEL[report.targetType] ?? report.targetType;
  const deletedAt = targetDeletedAt(report);

  // 조치 없이 "확인함"으로만 표시
  const handleReview = () => {
    updateReport.mutate(
      { id: String(report.id), data: { status: 'reviewed' } },
      { onSuccess: () => message.success('확인함 처리되었습니다.') },
    );
  };

  // status만 actioned로 변경 (이미 삭제된 콘텐츠일 때)
  const handleMarkActioned = () => {
    updateReport.mutate(
      { id: String(report.id), data: { status: 'actioned' } },
      { onSuccess: () => message.success('조치함 처리되었습니다.') },
    );
  };

  // 대상 콘텐츠 삭제 → status=actioned
  const handleDeleteTarget = () => {
    const deleteFn = () => {
      switch (report.targetType) {
        case 'log':
          return deleteLog.mutateAsync(report.logId!);
        case 'comment':
          return deleteComment.mutateAsync(report.commentId!);
        case 'user':
          return deleteUser.mutateAsync(report.reportedUserId!);
        default:
          return Promise.reject(new Error('알 수 없는 대상 타입'));
      }
    };

    modal.confirm({
      title: `${targetLabel} 삭제 후 조치`,
      content:
        report.targetType === 'user'
          ? '신고된 사용자를 정지(삭제)하고 신고를 조치함으로 처리합니다.'
          : `신고된 ${targetLabel}을(를) 삭제하고 신고를 조치함으로 처리합니다.`,
      okText: '삭제 및 조치',
      okType: 'danger',
      onOk: () =>
        deleteFn()
          .then(() =>
            updateReport.mutateAsync({
              id: String(report.id),
              data: { status: 'actioned' },
            }),
          )
          .then(() => message.success('조치 완료되었습니다.'))
          .catch(() => message.error('조치에 실패했습니다.')),
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 24 }} wrap>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          목록
        </Button>
        {report.status === 'pending' && (
          <Button onClick={handleReview}>확인함 (조치 없음)</Button>
        )}
        {report.status !== 'actioned' &&
          (deletedAt ? (
            <Button onClick={handleMarkActioned}>조치함 처리</Button>
          ) : (
            <Button danger onClick={handleDeleteTarget}>
              {targetLabel} 삭제 후 조치
            </Button>
          ))}
      </Space>

      <Descriptions title="신고 정보" bordered column={2}>
        <Descriptions.Item label="신고 ID">{report.id}</Descriptions.Item>
        <Descriptions.Item label="상태">
          <Tag color={REPORT_STATUS_COLOR[report.status]}>
            {REPORT_STATUS_LABEL[report.status] ?? report.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="신고자">
          {report.reporter?.nickname}
        </Descriptions.Item>
        <Descriptions.Item label="대상 타입">{targetLabel}</Descriptions.Item>
        <Descriptions.Item label="사유">
          {REPORT_REASON_LABEL[report.reason] ?? report.reason}
        </Descriptions.Item>
        <Descriptions.Item label="신고일">
          {dayjs(report.createdAt).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="상세 내용" span={2}>
          {report.detail || '-'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        title="신고된 대상"
        bordered
        column={2}
        style={{ marginTop: 32 }}
      >
        {report.targetType === 'log' && (
          <>
            <Descriptions.Item label="제목" span={2}>
              {report.log ? (
                <Link to={`/logs/${report.log.id}`}>
                  {report.log.title || '(제목 없음)'}
                </Link>
              ) : (
                '(삭제되었거나 찾을 수 없음)'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="작성자">
              {report.log?.user?.nickname ?? '-'}
            </Descriptions.Item>
          </>
        )}

        {report.targetType === 'comment' && (
          <>
            <Descriptions.Item label="내용" span={2}>
              {report.comment?.content ?? '(삭제되었거나 찾을 수 없음)'}
            </Descriptions.Item>
            <Descriptions.Item label="작성자">
              {report.comment?.user?.nickname ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label="부모 로그">
              {report.comment?.spot?.logId ? (
                <Link to={`/logs/${report.comment.spot.logId}`}>로그 보기</Link>
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </>
        )}

        {report.targetType === 'user' && (
          <>
            <Descriptions.Item label="닉네임">
              {report.reportedUser ? (
                <Link to={`/users/${report.reportedUser.id}`}>
                  {report.reportedUser.nickname}
                </Link>
              ) : (
                '(삭제되었거나 찾을 수 없음)'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="이메일">
              {report.reportedUser?.email ?? '-'}
            </Descriptions.Item>
          </>
        )}

        <Descriptions.Item label="대상 상태">
          {deletedAt ? (
            <Tag color="red">삭제됨</Tag>
          ) : (
            <Tag color="green">활성</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
