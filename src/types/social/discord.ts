export interface DiscordChecker {
  platform: string;
  username: string;
  available: boolean | null;
  message?: string | null;
  error?: string | null;
  suggestions?: string | null;
}
