import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { AdminContent } from "../data/admin-content";

const CONTENT_PATH = "app/data/admin-content.json";

function repository() {
  if (process.env.GITHUB_REPOSITORY?.includes("/")) return process.env.GITHUB_REPOSITORY;
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  return owner && slug ? `${owner}/${slug}` : "";
}

function githubConfig() {
  const token = process.env.ADMIN_GITHUB_TOKEN?.trim() ?? "";
  const repo = repository();
  const branch = process.env.ADMIN_GITHUB_BRANCH?.trim() || process.env.VERCEL_GIT_COMMIT_REF || "main";
  return token && repo ? { token, repo, branch } : null;
}

export function persistenceMode() {
  if (githubConfig()) return "github" as const;
  if (process.env.VERCEL) return "unconfigured" as const;
  return "local" as const;
}

export async function readAdminContent(): Promise<AdminContent> {
  const source = await fs.readFile(path.join(process.cwd(), CONTENT_PATH), "utf8");
  return JSON.parse(source) as AdminContent;
}

async function saveGithubFile(filePath: string, content: Buffer, message: string) {
  const config = githubConfig();
  if (!config) throw new Error("A GitHub-alapú mentés nincs beállítva.");
  const endpoint = `https://api.github.com/repos/${config.repo}/contents/${filePath}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const current = await fetch(`${endpoint}?ref=${encodeURIComponent(config.branch)}`, { headers, cache: "no-store" });
  let sha: string | undefined;
  if (current.ok) sha = ((await current.json()) as { sha?: string }).sha;
  else if (current.status !== 404) throw new Error(`A GitHub jelenlegi fájlja nem olvasható (${current.status}).`);

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: content.toString("base64"),
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!response.ok) throw new Error(`A GitHub-mentés sikertelen (${response.status}).`);
}

export async function saveAdminContent(content: AdminContent) {
  const data = Buffer.from(`${JSON.stringify(content, null, 2)}\n`, "utf8");
  const mode = persistenceMode();
  if (mode === "github") {
    await saveGithubFile(CONTENT_PATH, data, "Admin: kollekció és árak frissítése");
    return mode;
  }
  if (mode === "unconfigured") {
    throw new Error("A production mentéshez állítsd be az ADMIN_GITHUB_TOKEN változót.");
  }
  await fs.writeFile(path.join(process.cwd(), CONTENT_PATH), data);
  return mode;
}

export async function saveCollectionImage(fileName: string, content: Buffer) {
  const relativePath = `public/images/collection/${fileName}`;
  const mode = persistenceMode();
  if (mode === "github") {
    await saveGithubFile(relativePath, content, `Admin: ${fileName} feltöltése`);
    return mode;
  }
  if (mode === "unconfigured") {
    throw new Error("A production feltöltéshez állítsd be az ADMIN_GITHUB_TOKEN változót.");
  }
  await fs.writeFile(path.join(process.cwd(), relativePath), content);
  return mode;
}

