import { adminIsConfigured, isAdminAuthenticated } from "../../../lib/admin-auth";
import { persistenceMode } from "../../../lib/admin-storage";

export async function GET() {
  return Response.json({
    authenticated: await isAdminAuthenticated(),
    configured: adminIsConfigured(),
    persistence: persistenceMode(),
  });
}

