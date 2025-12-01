import { suggestUsernames } from "../../core/suggestions.js";
import { RobloxChecker } from "../../types/games/roblox.js";

export async function roblox(
  username: string,
  suggestions?: { enabled?: boolean; amount?: number; verification?: boolean }
): Promise<RobloxChecker> {
  try {
    const response = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] })
    });

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      let usernames = null;
      let text = "";

      if (suggestions?.enabled) {
        usernames = suggestUsernames(username, suggestions.amount ?? 3).join(", ");

        if (suggestions.verification) {
          const verifiedUsernames = [];
          for (const name of usernames.split(", ")) {
            const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usernames: [name] })
            });

            const userData = await userRes.json();
            if (userData.data.length === 0) verifiedUsernames.push(name);
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

      return {
        platform: "roblox",
        username: username,
        available: false,
        message: "Username has already been taken.",
        userInfo: data.data[0],
        suggestions: suggestions?.enabled ? usernames + text : null
      };
    }

    return {
      platform: "roblox",
      username: username,
      available: true,
      message: "Username is available"
    };
  } catch (error) {
    return {
      platform: "roblox",
      username: username,
      available: false,
      message: "Error checking username"
    };
  }
}