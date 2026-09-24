import { randomUUID } from "node:crypto";
import { isAdminAuthenticated, requestIsSameOrigin } from "../../../lib/admin-auth";
import { saveCollectionImage } from "../../../lib/admin-storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!requestIsSameOrigin(request)) return Response.json({ error: "Érvénytelen kérés." }, { status: 403 });
  if (!(await isAdminAuthenticated())) return Response.json({ error: "Nincs jogosultság." }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: "Hiányzó képfájl." }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return Response.json({ error: "A kép legfeljebb 10 MB lehet." }, { status: 400 });
  const width = Number(form.get("width"));
  const height = Number(form.get("height"));
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 3000 || height > 3000) {
    return Response.json({ error: "Érvénytelen képméret." }, { status: 400 });
  }

  try {
    const id = `admin-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const converted = Buffer.from(await file.arrayBuffer());
    const isWebp = file.type === "image/webp" && converted.length > 12 && converted.subarray(0, 4).toString("ascii") === "RIFF" && converted.subarray(8, 12).toString("ascii") === "WEBP";
    if (!isWebp) return Response.json({ error: "Csak ellenőrzött WebP-kép tölthető fel." }, { status: 400 });
    const fileName = `${id}.webp`;
    const persistence = await saveCollectionImage(fileName, converted);
    return Response.json({
      item: {
        id,
        src: `/images/collection/${fileName}`,
        titleHu: file.name.replace(/\.[^.]+$/, ""),
        titleRo: file.name.replace(/\.[^.]+$/, ""),
        category: "Női",
        enabled: true,
        order: 0,
        width,
        height,
        originalName: file.name,
      },
      persistence,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "A képfeltöltés sikertelen." }, { status: 400 });
  }
}
