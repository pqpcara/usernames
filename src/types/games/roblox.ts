export interface RobloxUserInfo {
  requestedUsername: string;
  hasVerifiedBadge: boolean;
  id: number;
  name: string;
  displayName: string;
}

export interface RobloxChecker {
  platform: string;
  id?: number | null;
  username: string;
  available: boolean | null;
  message: string | null;
  userInfo?: RobloxUserInfo | null;
}
