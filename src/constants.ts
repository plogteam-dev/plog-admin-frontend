export const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL || '';

export const PAGE_SIZE = 20;

export const VISIBILITY_LABEL: Record<string, string> = {
  public: '전체 공개',
  private: '비공개',
  buddies: '버디 공개',
};

// 신고 (Report) 라벨/색상
export const REPORT_TARGET_LABEL: Record<string, string> = {
  log: '로그',
  comment: '댓글',
  user: '사용자',
};

export const REPORT_STATUS_LABEL: Record<string, string> = {
  pending: '접수',
  reviewed: '확인함',
  actioned: '조치함',
};

export const REPORT_STATUS_COLOR: Record<string, string> = {
  pending: 'gold',
  reviewed: 'blue',
  actioned: 'green',
};

export const REPORT_REASON_LABEL: Record<string, string> = {
  spam: '스팸',
  harassment: '괴롭힘',
  sexual_content: '성적 콘텐츠',
  violence: '폭력',
  hate_speech: '혐오 발언',
  impersonation: '사칭',
  other: '기타',
};

// 사용 분석 — 방문 주기 버킷 (명세 §6 순서 고정)
export const VISIT_INTERVAL_BUCKETS = [
  '1d',
  '2-3d',
  '4-7d',
  '8-14d',
  '15-30d',
  '30d+',
] as const;

export const VISIT_INTERVAL_LABEL: Record<string, string> = {
  '1d': '매일',
  '2-3d': '2~3일',
  '4-7d': '4~7일',
  '8-14d': '8~14일',
  '15-30d': '15~30일',
  '30d+': '30일 이상',
};

// 차트 시리즈 색 (검증된 팔레트 슬롯 1·2·3)
export const CHART_SERIES = {
  blue: '#2a78d6',
  orange: '#eb6834',
  aqua: '#1baf7a',
} as const;
