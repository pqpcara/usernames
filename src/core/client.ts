import puppeteer from "puppeteer";
import { github } from "../checkers/social/github.js";
import { instagram } from "../checkers/social/instagram.js";
import { minecraft } from "../checkers/games/minecraft.js";
import { roblox } from "../checkers/games/roblox.js";
import { InstagramChecker } from "../types/social/instagram.js";
import { GithubChecker } from "../types/social/github.js";
import { MinecraftChecker } from "../types/games/minecraft.js";
import { RobloxChecker } from "../types/games/roblox.js";

export class Client {
  public username: string | null = null;

  constructor() {}

  async github(username: string): Promise<GithubChecker> {
    return await github(username);
  }

  async instagram(username: string): Promise<InstagramChecker> {
    return await instagram(username);
  }

  async minecraft(username: string): Promise<MinecraftChecker> {
    return await minecraft(username);
  }

  async roblox(username: string): Promise<RobloxChecker> {
    return await roblox(username);
  }
}
