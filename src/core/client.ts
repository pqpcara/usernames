import puppeteer from "puppeteer";
import { github } from "../checkers/github.js";

export interface CheckResult {
  platform: string;
  username: string;
  available: boolean | null;
  suggestions?: string | null;
  message?: string | null;
  error?: string | null;
}

export class Client {
  public username: string | null = null;

  constructor() {}

  async github(username: string): Promise<CheckResult> {
    return await github(username);
  }
}
