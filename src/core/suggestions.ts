export function suggestUsernames(username: string, amount: number = 3): string[] {
  const types = [
    `${Math.floor(Math.random() * 100)}${username}`,
    `${username}${Math.floor(Math.random() * 100)}`,
    `${username}_${Math.floor(Math.random() * 100)}`,
    `${username}.${Math.floor(Math.random() * 100)}`,
    `${username}${new Date().getFullYear()}`,
    `${username}${Math.floor(Math.random() * 10)}`,
  ];

  const suggestions = new Set<string>();

  while (suggestions.size < amount) {
    const suggestion = types[Math.floor(Math.random() * types.length)];
    suggestions.add(suggestion);
  }

  return Array.from(suggestions);
}