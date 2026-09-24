import "server-only";

const SHIPO_API_URL = "https://api.shipo.ro";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const apiKey = process.env.SHIPO_API_KEY;
  if (!apiKey) throw new Error("A Shipo API-kulcs nincs beállítva.");

  const response = await fetch(`${SHIPO_API_URL}/auth`, {
    method: "POST",
    headers: { "auth-key": apiKey },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("A Shipo-hitelesítés sikertelen.");

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) throw new Error("A Shipo nem adott hozzáférési tokent.");

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

export async function shipoFetch<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${SHIPO_API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) cachedToken = null;
    throw new Error(`Shipo API-hiba (${response.status}).`);
  }

  return response.json() as Promise<T>;
}
