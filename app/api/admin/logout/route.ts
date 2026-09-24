import { clearAdminSession, requestIsSameOrigin } from "../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!requestIsSameOrigin(request)) return Response.json({ error: "Érvénytelen kérés." }, { status: 403 });
  await clearAdminSession();
  return Response.json({ ok: true });
}

