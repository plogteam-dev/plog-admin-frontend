// API 공통 응답 래퍼
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

// API 에러 응답
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 페이지네이션 쿼리 파라미터
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 인증
export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  admin: Admin;
}

// 대시보드
export interface DashboardStats {
  totalUsers: number;
  totalLogs: number;
  totalSpots: number;
  totalImages: number;
  newUsersToday: number;
  newLogsToday: number;
}

export interface DailyStatsItem {
  date: string;
  newUsers: number;
  newLogs: number;
}

export interface DailyStatsResponse {
  items: DailyStatsItem[];
}

export interface DailyStatsParams {
  from?: string;
  to?: string;
}

// 공통
export type EntityStatus = 'active' | 'deleted';

// 유저
export type Gender = 'male' | 'female' | null;

export interface User {
  id: string;
  nickname: string;
  email: string;
  profileImage: string | null;
  createdAt: string;
  deletedAt: string | null;
  gender: Gender;
  _count: {
    logs: number;
    createdSpots: number;
  };
  /**
   * `_count`는 소프트 삭제된 것까지 포함한 총 생성 수이고,
   * 그중 삭제된 수가 여기에 담긴다. (스팟은 부모 로그 삭제도 삭제로 취급)
   */
  _deletedCount?: {
    logs: number;
    createdSpots: number;
  };
}

export interface UserListParams extends PaginationParams {
  search?: string;
  status?: EntityStatus;
}

export interface UserUpdateRequest {
  nickname?: string;
  email?: string;
}

// 로그
export type LogVisibility = 'private' | 'public' | 'buddies';

export interface LogSpot {
  id: string;
  name: string;
  caption: string | null;
  deletedAt: string | null;
  logDeletedAt: string | null;
  deletedByLog: boolean;
  spotImages: SpotImage[];
}

export interface Log {
  id: string;
  title: string;
  logDate: string;
  visibility: LogVisibility;
  createdAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    nickname: string;
    email: string;
  };
  _count: {
    spots: number;
  };
  // 상세 조회 시에만 포함
  spots?: LogSpot[];
}

export interface LogListParams extends PaginationParams {
  search?: string;
  userId?: string;
  visibility?: LogVisibility;
  dateFrom?: string;
  dateTo?: string;
  status?: EntityStatus;
}

export interface LogUpdateRequest {
  title?: string;
  visibility?: LogVisibility;
}

// 스팟
export interface Spot {
  id: string;
  name: string;
  caption: string | null;
  latitude: number | null;
  longitude: number | null;
  order: number;
  createdAt: string;
  deletedAt: string | null;
  logDeletedAt: string | null;
  deletedByLog: boolean;
  region1DepthName: string | null;
  region2DepthName: string | null;
  region3DepthName: string | null;
  log?: {
    id: string;
    title: string;
    user: { id: string; nickname: string; email?: string };
  };
  place?: { id: string; name: string } | null;
  spotImages: SpotImage[];
  _count?: { spotImages?: number; reactions?: number };
}

export interface SpotImage {
  id: string;
  deletedAt: string | null;
  logDeletedAt: string | null;
  deletedByLog: boolean;
  image: {
    id: string;
    key: string;
    thumbnailKey: string;
    shotAt?: string;
  };
}

export interface SpotListParams extends PaginationParams {
  search?: string;
  logId?: string;
  status?: EntityStatus;
}

export interface SpotUpdateRequest {
  name?: string;
  caption?: string;
}

// 이미지
export interface Image {
  id: string;
  key: string;
  thumbnailKey: string;
  createdAt: string;
  deletedAt: string | null;
  logDeletedAt: string | null;
  deletedByLog: boolean;
}

export interface ImageListParams extends PaginationParams {
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: EntityStatus;
}

// 신고 (Report)
export type ReportTargetType = 'log' | 'comment' | 'user';
export type ReportStatus = 'pending' | 'reviewed' | 'actioned';
export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'sexual_content'
  | 'violence'
  | 'hate_speech'
  | 'impersonation'
  | 'other';

// 신고된 댓글 (admin/reports 상세에서 포함)
export interface ReportComment {
  id: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    nickname: string;
    email: string;
  };
  // 댓글 신고 → 부모 로그(/logs/:id) 링크용
  spot?: {
    logId: string;
  } | null;
}

export interface Report {
  id: number;
  reporterId: string;
  targetType: ReportTargetType;
  logId: string | null;
  commentId: string | null;
  reportedUserId: string | null;
  reason: ReportReason;
  detail: string | null;
  status: ReportStatus;
  createdAt: string;
  // include로 함께 로딩되는 관계 (목록: 요약 / 상세: 실물)
  reporter: {
    id: string;
    nickname: string;
    email: string;
  };
  log?: {
    id: string;
    title: string;
    deletedAt: string | null;
    user: { id: string; nickname: string; email: string };
  } | null;
  comment?: ReportComment | null;
  reportedUser?: {
    id: string;
    nickname: string;
    email: string;
    deletedAt: string | null;
  } | null;
}

export interface ReportListParams extends PaginationParams {
  status?: ReportStatus;
  targetType?: ReportTargetType;
  reason?: ReportReason;
}

export interface ReportUpdateRequest {
  status: Exclude<ReportStatus, 'pending'>;
}
