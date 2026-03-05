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
export type LogType = 'INDIVIDUAL' | 'BUDDY';

export interface LogSpot {
  id: string;
  name: string;
  caption: string | null;
  spotImages: Array<{ id: string; key: string; thumbnailKey: string }>;
}

export interface Log {
  id: string;
  title: string;
  logDate: string;
  visibility: LogVisibility;
  type: LogType;
  status: string;
  createdAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    nickname: string;
    email: string;
  };
  _count: {
    spots: number;
    participants: number;
  };
  // 상세 조회 시에만 포함
  spots?: LogSpot[];
}

export interface LogListParams extends PaginationParams {
  search?: string;
  userId?: string;
  visibility?: LogVisibility;
  type?: LogType;
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
  createdAt: string;
  deletedAt: string | null;
  spotImages: SpotImage[];
}

export interface SpotImage {
  id: string;
  key: string;
  thumbnailKey: string;
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
}

export interface ImageListParams extends PaginationParams {
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: EntityStatus;
}
