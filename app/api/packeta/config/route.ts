import { getPacketaApiKey } from "../../../lib/packeta";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(
      { apiKey: getPacketaApiKey() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { message: "A Packeta integráció még nincs beállítva." },
      { status: 503 },
    );
  }
}
