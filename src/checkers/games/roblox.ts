import { RobloxChecker } from "../../types/games/roblox.js";

export async function roblox(username: string): Promise<RobloxChecker> {
  try {
    const response = await fetch(
      `https://users.roblox.com/v1/usernames/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernames: [username] }),
      },
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const user = data.data[0];
      return {
        platform: "roblox",
        username: username,
        available: false,
        message: "Username has already been taken.",
        userInfo: data.data[0],
      };
    }

    return {
      platform: "roblox",
      username: username,
      available: true,
      message: "Username is available",
    };
  } catch (error) {
    return {
      platform: "roblox",
      username: username,
      available: false,
      message: "Error checking username",
    };
  }
}
