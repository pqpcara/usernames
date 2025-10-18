export interface MinecraftChecker {
  platform: string;
  id: string | null;
  username: string;
  available: boolean | null;
  message: string;
}
