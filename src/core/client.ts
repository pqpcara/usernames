import { github } from "../checkers/social/github.js";
import { instagram } from "../checkers/social/instagram.js";
import { minecraft } from "../checkers/games/minecraft.js";
import { roblox } from "../checkers/games/roblox.js";
import { discord } from "../checkers/social/discord.js";
import { InstagramChecker } from "../types/social/instagram.js";
import { GithubChecker } from "../types/social/github.js";
import { MinecraftChecker } from "../types/games/minecraft.js";
import { RobloxChecker } from "../types/games/roblox.js";
import { DiscordChecker } from "../types/social/discord.js";

interface ClientOptions {
  suggestions?: {
    enabled?: boolean;
    amount?: number;
    verification?: boolean;
  };
}

export class Client {
  public username: string | null = null;
  public suggestions: string[] | null = null;
  private options: ClientOptions;

  constructor(options: ClientOptions = {}) {
    this.options = {
      suggestions: options.suggestions || { enabled: false, amount: 3, verification: false }
    };
  }

  async discord(username: string): Promise<DiscordChecker> {
    if (this.options.suggestions?.enabled) {
      throw new Error("Discord version checker does not support suggestions.");
    }
    return await discord(username);
  }

  async github(username: string): Promise<GithubChecker> {
    return await github(username, this.options.suggestions);
  }

  async instagram(username: string): Promise<InstagramChecker> {
    if (this.options.suggestions?.enabled) {
      throw new Error("Instagram version checker does not support suggestions.");
    }
    return await instagram(username);
  }

  async minecraft(username: string): Promise<MinecraftChecker> {
    return await minecraft(username, this.options.suggestions);
  }

  async roblox(username: string): Promise<RobloxChecker> {
    return await roblox(username, this.options.suggestions);
  }
}