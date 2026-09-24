import { adminIsConfigured, adminLoginAllowed, adminLoginKey, clearAdminLoginFailures, createAdminSession, passwordIsValid, recordAdminLoginFailure, requestIsSameOrigin } from "../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!requestIsSameOrigin(request)) return Response.json({ error: "Érvénytelen kérés." }, { status: 403 });
  if (!adminIsConfigured()) return Response.json({ error: "Az admin belépés még nincs beállítva." }, { status: 503 });
  const loginKey = adminLoginKey(request);
  if (!adminLoginAllowed(loginKey)) return Response.json({ error: "Túl sok próbálkozás. Próbáld újra később." }, { status: 429 });
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  if (!passwordIsValid(body?.password)) {
    recordAdminLoginFailure(loginKey);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return Response.json({ error: "Hibás jelszó." }, { status: 401 });
  }
  clearAdminLoginFailures(loginKey);
  await createAdminSession();
  return Response.json({ ok: true });
}
