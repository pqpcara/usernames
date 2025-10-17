import puppeteer from "puppeteer";
import { github } from "../checkers/github.js";
import { instagram } from "../checkers/instagram.js";

export class Client {
  public username: string | null = null;

  constructor() {}

  async github(username: string): Promise<any> {
    return await github(username);
  }

  async instagram(username: string): Promise<any> {
    return await instagram(username);
  }
}
