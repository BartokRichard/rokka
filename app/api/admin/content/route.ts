import { isAdminContent } from "../../../data/admin-content";
import { isAdminAuthenticated, requestIsSameOrigin } from "../../../lib/admin-auth";
import { persistenceMode, readAdminContent, saveAdminContent } from "../../../lib/admin-storage";

export async function GET() {
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Nincs jogosultság." }, { status: 401 });
  return Response.json({ content: await readAdminContent(), persistence: persistenceMode() });
}

export async function PUT(request: Request) {
  if (!requestIsSameOrigin(request)) return Response.json({ error: "Érvénytelen kérés." }, { status: 403 });
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Nincs jogosultság." }, { status: 401 });
  const content = await request.json().catch(() => null);
  if (!isAdminContent(content)) return Response.json({ error: "Érvénytelen katalógusadat." }, { status: 400 });
  try {
    const persistence = await saveAdminContent(content);
    return Response.json({ ok: true, persistence });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "A mentés sikertelen." }, { status: 500 });
  }
}

