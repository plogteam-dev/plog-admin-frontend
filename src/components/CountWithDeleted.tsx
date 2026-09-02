import { Tooltip } from 'antd';

interface CountWithDeletedProps {
  /** 삭제된 것까지 포함한 총 생성 수 */
  total: number;
  /** 그중 삭제된 수 (백엔드가 아직 안 내려주면 undefined) */
  deleted?: number;
}

/**
 * "총 5개 생성, 그중 3개 삭제"를 `5(3)` 형태로 표시한다.
 * 삭제된 게 없으면 괄호 없이 숫자만 보여준다.
 */
export default function CountWithDeleted({
  total,
  deleted,
}: CountWithDeletedProps) {
  if (!deleted) return <>{total}</>;

  return (
    <Tooltip title={`총 ${total}개 중 ${deleted}개 삭제됨`}>
      <span>
        {total}
        <span style={{ color: '#ff4d4f' }}>({deleted})</span>
      </span>
    </Tooltip>
  );
}
