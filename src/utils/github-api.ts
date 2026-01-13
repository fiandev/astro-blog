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

interface CacheEntry {
  data: GitHubUser;
  expiry: number;
}

const userCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 10 * 60 * 1000;

export async function fetchGithubUser(
  username: string
): Promise<GitHubUser | null> {
  const now = Date.now();

  if (userCache.has(username)) {
    const cached = userCache.get(username)!;
    if (cached.expiry > now) {
      console.log(`[CACHE HIT] Mengambil data ${username} dari cache.`);
      return cached.data;
    }
    userCache.delete(username);
  }

  try {
    console.log(`[API FETCH] Mengambil data ${username} dari GitHub API...`);

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data: GitHubUser = await response.json();

    userCache.set(username, {
      data,
      expiry: now + CACHE_DURATION,
    });

    return data;
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    return null;
  }
}
