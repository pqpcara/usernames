import { suggestUsernames } from "../../core/suggestions.js";
import { MinecraftChecker } from "../../types/games/minecraft.js";

async function fetchWithRetry(url: string, retries: number = 3): Promise<Response> {
  let attempt = 0;
  while (attempt < retries) {
    const res = await fetch(url);
    if (res.status === 429) {
      const delay = 1000 * (attempt + 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    } else {
      return res;
    }
  }
  throw new Error("Rate limit exceeded after multiple retries.");
}

export async function minecraft(
  username: string,
  suggestions?: { enabled?: boolean; amount?: number; verification?: boolean }
): Promise<MinecraftChecker> {
  try {
    const res = await fetchWithRetry(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (res.status === 403) {
      return {
        platform: "minecraft",
        id: null,
        username,
        available: null,
        message: "The request is blocked by Mojang."
      };
    }

    if (!res.ok) {
      return {
        platform: "minecraft",
        id: null,
        username,
        available: true,
        message: "Username is available."
      };
    }

    let usernames = null;
    let text = "";

    if (suggestions?.enabled) {
      usernames = suggestUsernames(username, suggestions.amount ?? 3).join(", ");

      if (suggestions.verification) {
        const verifiedUsernames = [];
        for (const name of usernames.split(", ")) {
          const response = await fetchWithRetry(`https://api.mojang.com/users/profiles/minecraft/${name}`);
          if (response.status === 403) {
            return {
              platform: "minecraft",
              id: null,
              username,
              available: null,
              message: "The request is blocked by Mojang."
            };
          }
          if (!response.ok) verifiedUsernames.push(name);
        }

        if (verifiedUsernames.length > 0) {
          text = verifiedUsernames.length === 1
            ? `${verifiedUsernames[0]} is available.`
            : `${verifiedUsernames.slice(0, -1).join(", ")} or ${verifiedUsernames[verifiedUsernames.length - 1]} are available.`;
        } else {
          text = "No suggestions are available.";
        }
        usernames = verifiedUsernames.join(", ");
      } else {
        text = `${usernames} unverified.`;
      }
    }

    const data = await res.json();
    return {
      platform: "minecraft",
      id: data.id,
      username: data.name,
      available: false,
      message: "Username has already been taken.",
      suggestions: suggestions?.enabled ? usernames + text : null
    };
  } catch {
    return {
      platform: "minecraft",
      id: null,
      username,
      available: null,
      message: "Error checking username."
    };
  }
}