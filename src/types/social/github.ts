export interface GithubChecker {
  platform: string;
  username: string;
  available: boolean | null;
  message: string | null;
  suggestions?: string | null;
}
