import { MinecraftChecker } from "../../types/games/minecraft.js";

export async function minecraft(username: string): Promise<MinecraftChecker> {
  try {
    const res = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${username}`,
    );

    if (!res.ok) {
      return {
        platform: "minecraft",
        id: null,
        username,
        available: true,
        message: "Username is available.",
      };
    }

    const data = await res.json();
    return {
      platform: "minecraft",
      id: data.id,
      username: data.name,
      available: false,
      message: "Username has already been taken.",
    };
  } catch {
    return {
      platform: "minecraft",
      id: null,
      username,
      available: null,
      message: "Error checking username.",
    };
  }
}
