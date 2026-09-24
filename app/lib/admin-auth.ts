import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "rokka-admin-session";
const SESSION_SECONDS = 60 * 60 * 12;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LIMIT = 8;
const loginAttempts = new Map<string, { count: number; startedAt: number }>();

function configuredPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

function equalSecrets(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function signature(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function adminIsConfigured() {
  return Boolean(configuredPassword() && sessionSecret().length >= 32);
}

export function passwordIsValid(password: unknown) {
  return adminIsConfigured() && typeof password === "string" && equalSecrets(password, configuredPassword());
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expires);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${payload}.${signature(payload)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  if (!adminIsConfigured()) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [expiresText, providedSignature] = token.split(".");
  const expires = Number(expiresText);
  if (!Number.isInteger(expires) || expires <= Date.now() / 1000 || !providedSignature) return false;
  return equalSecrets(providedSignature, signature(expiresText));
}

export function requestIsSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const originUrl = new URL(origin);
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || new URL(request.url).host;
    const protocol = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "");
    return originUrl.host === host && originUrl.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

export function adminLoginKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function adminLoginAllowed(key: string) {
  const attempt = loginAttempts.get(key);
  if (!attempt || Date.now() - attempt.startedAt > LOGIN_WINDOW_MS) return true;
  return attempt.count < LOGIN_LIMIT;
}

export function recordAdminLoginFailure(key: string) {
  const current = loginAttempts.get(key);
  if (!current || Date.now() - current.startedAt > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, startedAt: Date.now() });
  } else {
    current.count += 1;
  }
}

export function clearAdminLoginFailures(key: string) {
  loginAttempts.delete(key);
}
