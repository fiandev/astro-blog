import NodeCache from "node-cache";

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
}

const userCache = global?.userCache || new NodeCache({ stdTTL: 600 });

if (!global.userCache) {
  global.userCache = userCache;
}


export async function fetchGithubUser(
  username: string
): Promise<GitHubUser | null> {
  if (userCache.has(username)) {
    console.log(`[CACHE HIT] Mengambil data ${username} dari cache.`);
    return userCache.get<GitHubUser>(username)!;
  }

  try {
    console.log(`[API FETCH] Mengambil data ${username} dari GitHub API...`);

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data: GitHubUser = await response.json();

    userCache.set(username, data);

    return data;
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    return null;
  }
}