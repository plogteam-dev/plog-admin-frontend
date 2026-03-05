export const CDN_BASE = import.meta.env.VITE_CDN_BASE_URL || '';

export const PAGE_SIZE = 20;

export const VISIBILITY_LABEL: Record<string, string> = {
  public: '전체 공개',
  private: '비공개',
  buddies: '버디 공개',
};
