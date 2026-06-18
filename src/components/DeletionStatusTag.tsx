import { Tag } from 'antd';

interface DeletionStatusTagProps {
  /** 실질 삭제 시각 (자기 삭제 또는 부모발 삭제) */
  deletedAt: string | null;
  /** true면 자기 자신은 삭제되지 않았고 부모(로그/스팟) 때문에만 삭제로 보이는 상태 */
  deletedByLog?: boolean;
  /** 활성 상태일 때 태그를 렌더링하지 않음 (목록 썸네일 등에서 사용) */
  hideActive?: boolean;
  /** 부모발 삭제 태그 라벨 (기본: '로그 삭제됨') */
  byLogLabel?: string;
}

/**
 * 엔티티의 삭제 상태를 표시하는 태그.
 * - 활성: 초록 '활성'
 * - 부모(로그/스팟)발 삭제: 주황 '로그 삭제됨' (자기 자신은 삭제 안 됨)
 * - 자기 삭제: 빨강 '삭제됨'
 */
export default function DeletionStatusTag({
  deletedAt,
  deletedByLog,
  hideActive,
  byLogLabel = '로그 삭제됨',
}: DeletionStatusTagProps) {
  if (!deletedAt) {
    return hideActive ? null : <Tag color="green">활성</Tag>;
  }
  if (deletedByLog) {
    return <Tag color="orange">{byLogLabel}</Tag>;
  }
  return <Tag color="red">삭제됨</Tag>;
}
