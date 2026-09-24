"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, GripVertical, ImagePlus, LogOut, Save, Trash2 } from "lucide-react";
import { AdminContent, GalleryItem, GALLERY_CATEGORIES } from "../data/admin-content";
import { PRODUCTS } from "../data/products";
import { useLanguage } from "../i18n/LanguageProvider";

type Session = { authenticated: boolean; configured: boolean; persistence: "github" | "local" | "unconfigured" };
type Tab = "gallery" | "prices";

async function readJson(response: Response) {
  return (await response.json().catch(() => ({}))) as Record<string, unknown>;
}

export default function AdminPage() {
  const { locale, t } = useLanguage();
  const a = useCallback((hu: string, ro: string) => locale === "hu" ? hu : ro, [locale]);
  const [session, setSession] = useState<Session | null>(null);
  const [content, setContent] = useState<AdminContent | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("gallery");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sessionResponse = await fetch("/api/admin/session", { cache: "no-store" });
    const nextSession = await sessionResponse.json() as Session;
    setSession(nextSession);
    if (!nextSession.authenticated) return;
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    const data = await readJson(response);
    if (!response.ok) throw new Error(String(data.error ?? a("A tartalom nem tölthető be.", "Conținutul nu poate fi încărcat.")));
    setContent(data.content as AdminContent);
  }, [a]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load().catch((reason) => setError(reason instanceof Error ? reason.message : String(reason))), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await readJson(response);
    setBusy(false);
    if (!response.ok) return setError(String(data.error ?? a("Sikertelen belépés.", "Autentificare nereușită.")));
    setPassword("");
    await load();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setContent(null);
    await load();
  };

  const updateGallery = (id: string, update: Partial<GalleryItem>) => {
    setContent((current) => current ? { ...current, gallery: current.gallery.map((item) => item.id === id ? { ...item, ...update } : item) } : current);
  };

  const orderedGallery = useMemo(() => content?.gallery.slice().sort((left, right) => left.order - right.order) ?? [], [content]);

  const reorder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setContent((current) => {
      if (!current) return current;
      const items = current.gallery.slice().sort((left, right) => left.order - right.order);
      const sourceIndex = items.findIndex((item) => item.id === sourceId);
      const targetIndex = items.findIndex((item) => item.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const [moved] = items.splice(sourceIndex, 1);
      items.splice(targetIndex, 0, moved);
      return { ...current, gallery: items.map((item, order) => ({ ...item, order })) };
    });
  };

  const move = (id: string, direction: -1 | 1) => {
    const index = orderedGallery.findIndex((item) => item.id === id);
    const target = orderedGallery[index + direction];
    if (target) reorder(id, target.id);
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true); setError(""); setMessage("");
    try {
      for (const file of Array.from(files)) {
        const prepared = await prepareImage(file);
        const form = new FormData();
        form.set("file", prepared.file);
        form.set("width", String(prepared.width));
        form.set("height", String(prepared.height));
        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await readJson(response);
        if (!response.ok) throw new Error(`${file.name}: ${String(data.error ?? a("feltöltési hiba", "eroare de încărcare"))}`);
        setContent((current) => current ? { ...current, gallery: [...current.gallery, { ...(data.item as GalleryItem), order: current.gallery.length }] } : current);
      }
      setMessage(a("A képek feltöltve. A megjelenéshez mentsd a katalógust is.", "Imaginile au fost încărcate. Salvează și catalogul pentru publicare."));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally { setBusy(false); }
  };

  const save = async () => {
    if (!content) return;
    setBusy(true); setError(""); setMessage("");
    const normalized = { ...content, gallery: orderedGallery.map((item, order) => ({ ...item, order })) };
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(normalized) });
    const data = await readJson(response);
    setBusy(false);
    if (!response.ok) return setError(String(data.error ?? a("A mentés sikertelen.", "Salvarea a eșuat.")));
    setContent(normalized);
    setMessage(data.persistence === "github" ? a("Mentve. A weboldal automatikus újratelepítése elindult.", "Salvat. Republicarea automată a site-ului a început.") : a("Helyben mentve.", "Salvat local."));
  };

  if (!session) return <AdminShell><p className="font-barlow text-black/50">{a("Admin betöltése…", "Se încarcă panoul de administrare…")}</p></AdminShell>;
  if (!session.authenticated) return (
    <AdminShell>
      <form onSubmit={login} className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-8 shadow-xl">
        <p className="font-barlow text-xs font-black uppercase tracking-[0.22em] text-[#c77720]">ROKKA ADMIN</p>
        <h1 className="mt-3 font-barlow-condensed text-4xl font-bold uppercase">{a("Belépés", "Autentificare")}</h1>
        <p className="mt-3 font-barlow text-sm text-black/55">{session.configured ? a("Add meg az adminjelszót.", "Introdu parola de administrator.") : a("Előbb állítsd be az ADMIN_PASSWORD és ADMIN_SESSION_SECRET környezeti változókat.", "Configurează mai întâi variabilele ADMIN_PASSWORD și ADMIN_SESSION_SECRET.")}</p>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-6 h-14 w-full rounded-2xl border border-black/10 px-5 outline-none focus:border-[#d99a4d]" placeholder={a("Adminjelszó", "Parolă administrator")} />
        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{t(error)}</p>}
        <button disabled={busy || !session.configured} className="mt-5 h-13 w-full rounded-full bg-[#8f592d] font-barlow text-sm font-bold text-white disabled:opacity-35">{busy ? a("Belépés…", "Autentificare…") : a("Belépek", "Autentificare")}</button>
      </form>
    </AdminShell>
  );

  if (!content) return <AdminShell><p>{error ? t(error) : a("Tartalom betöltése…", "Se încarcă conținutul…")}</p></AdminShell>;

  return (
    <main className="min-h-screen bg-[#f4eee5] px-4 py-6 text-[#20221f] md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white/80 px-5 py-4 shadow-sm">
          <div className="flex items-center gap-4"><Link href="/" className="grid h-10 w-10 place-items-center rounded-full border border-black/10" aria-label={t("Főoldal")}><ArrowLeft size={18} /></Link><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#c77720]">ROKKA</p><h1 className="font-barlow-condensed text-3xl font-bold uppercase">ADMIN</h1></div></div>
          <div className="flex items-center gap-2"><button onClick={save} disabled={busy} className="flex h-11 items-center gap-2 rounded-full bg-[#d99a4d] px-5 text-sm font-bold text-white disabled:opacity-40"><Save size={17} /> {a("Mentés", "Salvează")}</button><button onClick={logout} className="grid h-11 w-11 place-items-center rounded-full border border-black/10" aria-label={a("Kilépés", "Ieșire")}><LogOut size={17} /></button></div>
        </header>

        {session.persistence === "unconfigured" && <p className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{a("A production mentés még nincs bekötve. Állítsd be az ADMIN_GITHUB_TOKEN változót.", "Salvarea în producție nu este încă configurată. Setează ADMIN_GITHUB_TOKEN.")}</p>}
        {message && <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{message}</p>}
        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{t(error)}</p>}

        <div className="mt-6 flex gap-2 rounded-2xl bg-white/65 p-2">
          <TabButton active={tab === "gallery"} onClick={() => setTab("gallery")}>{a(`Kollekció (${content.gallery.length})`, `Colecție (${content.gallery.length})`)}</TabButton>
          <TabButton active={tab === "prices"} onClick={() => setTab("prices")}>{a("Termékárak", "Prețuri produse")}</TabButton>
        </div>

        {tab === "gallery" ? (
          <section className="mt-6">
            <label className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-[#8f592d] px-6 font-barlow text-sm font-bold text-white"><ImagePlus size={18} />{busy ? a("Feltöltés…", "Se încarcă…") : a("Képek feltöltése", "Încarcă imagini")}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(event) => { void uploadFiles(event.target.files); event.currentTarget.value = ""; }} className="sr-only" /></label>
            <p className="mt-3 text-sm text-black/50">{a("Húzd a kártyákat a kívánt sorrendbe, vagy használd a nyilakat. A kikapcsolt kép nem jelenik meg a kollekcióban.", "Trage cardurile în ordinea dorită sau folosește săgețile. Imaginile dezactivate nu apar în colecție.")}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {orderedGallery.map((item, index) => (
                <article key={item.id} draggable onDragStart={() => setDraggedId(item.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId) reorder(draggedId, item.id); setDraggedId(null); }} className={`grid grid-cols-[110px_minmax(0,1fr)] gap-4 rounded-2xl border bg-white p-3 shadow-sm ${item.enabled ? "border-black/10" : "border-black/5 opacity-55"}`}>
                  <div className="relative min-h-40 overflow-hidden rounded-xl bg-black/5"><Image src={item.src} alt="" fill sizes="110px" className="object-cover" /></div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2"><span className="flex items-center text-xs font-black text-black/35"><GripVertical size={16} /> {index + 1}</span><div className="flex"><button onClick={() => move(item.id, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center disabled:opacity-20" aria-label={a("Feljebb", "Mai sus")}><ArrowUp size={15} /></button><button onClick={() => move(item.id, 1)} disabled={index === orderedGallery.length - 1} className="grid h-8 w-8 place-items-center disabled:opacity-20" aria-label={a("Lejjebb", "Mai jos")}><ArrowDown size={15} /></button><button onClick={() => { if (window.confirm(a("Biztosan kiveszed ezt a képet?", "Sigur elimini această imagine?"))) setContent((current) => current ? { ...current, gallery: current.gallery.filter((entry) => entry.id !== item.id) } : current); }} className="grid h-8 w-8 place-items-center text-red-600" aria-label={t("eltávolítása")}><Trash2 size={15} /></button></div></div>
                    <input value={item.titleHu} onChange={(event) => updateGallery(item.id, { titleHu: event.target.value })} className="mt-2 h-9 w-full rounded-lg border border-black/10 px-3 text-sm" aria-label="Magyar cím" />
                    <input value={item.titleRo} onChange={(event) => updateGallery(item.id, { titleRo: event.target.value })} className="mt-2 h-9 w-full rounded-lg border border-black/10 px-3 text-sm" aria-label="Titlu română" />
                    <select value={item.category} onChange={(event) => updateGallery(item.id, { category: event.target.value as GalleryItem["category"] })} className="mt-2 h-9 w-full rounded-lg border border-black/10 px-2 text-sm">{GALLERY_CATEGORIES.map((category) => <option key={category} value={category}>{t(category)}</option>)}</select>
                    <label className="mt-2 flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={item.enabled} onChange={(event) => updateGallery(item.id, { enabled: event.target.checked })} /> {a("Megjelenik", "Vizibilă")}</label>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : <PriceEditor content={content} setContent={setContent} a={a} />}
      </div>
    </main>
  );
}

function PriceEditor({ content, setContent, a }: { content: AdminContent; setContent: React.Dispatch<React.SetStateAction<AdminContent | null>>; a: (hu: string, ro: string) => string }) {
  const { t } = useLanguage();
  const setPrice = (productId: string, section: "materials" | "variants", key: string, value: number) => setContent((current) => current ? { ...current, priceOverrides: { ...current.priceOverrides, [productId]: { ...current.priceOverrides[productId], [section]: { ...current.priceOverrides[productId]?.[section], [key]: value } } } } : current);
  const setSizePrice = (productId: string, material: string, size: string, value: number) => setContent((current) => current ? { ...current, priceOverrides: { ...current.priceOverrides, [productId]: { ...current.priceOverrides[productId], sizes: { ...current.priceOverrides[productId]?.sizes, [material]: { ...current.priceOverrides[productId]?.sizes?.[material], [size]: value } } } } } : current);
  return <section className="mt-6 grid gap-5 lg:grid-cols-2">{PRODUCTS.map((product) => <article key={product.id} className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm"><h2 className="font-barlow-condensed text-3xl font-bold uppercase">{product.name}</h2><p className="mt-1 text-sm text-black/50">{t(product.subtitle)}</p><div className="mt-5 space-y-4">{product.materialOptions.filter((material) => typeof material.price === "number").map((material) => <label key={material.name} className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-4"><span className="text-sm font-bold">{t(material.name)} <small className="block font-normal text-black/40">{a("Alapár", "Preț de bază")}</small></span><PriceInput value={content.priceOverrides[product.id]?.materials?.[material.name] ?? material.price ?? ""} onChange={(value) => setPrice(product.id, "materials", material.name, value)} /></label>)}{product.variantOptions?.map((variant) => <label key={variant.id} className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-4"><span className="text-sm font-bold">{t(variant.name)}</span><PriceInput value={content.priceOverrides[product.id]?.variants?.[variant.id] ?? variant.price} onChange={(value) => setPrice(product.id, "variants", variant.id, value)} /></label>)}{product.sizePrices && Object.entries(product.sizePrices).map(([material, prices]) => <div key={material} className="border-t border-black/10 pt-4"><p className="mb-3 text-xs font-black uppercase tracking-wider">{t(material)} · {a("méretárak", "prețuri pe mărimi")}</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{Object.entries(prices).map(([size, price]) => <label key={size} className="text-xs font-bold">{size}<PriceInput compact value={content.priceOverrides[product.id]?.sizes?.[material]?.[size] ?? price} onChange={(value) => setSizePrice(product.id, material, size, value)} /></label>)}</div></div>)}</div></article>)}</section>;
}

function PriceInput({ value, onChange, compact = false }: { value: number | ""; onChange: (value: number) => void; compact?: boolean }) {
  return <span className="relative block"><input type="number" min="1" step="1" value={value} onChange={(event) => onChange(Math.max(1, Number(event.target.value) || 1))} className={`${compact ? "mt-1 h-9" : "h-11"} w-full rounded-xl border border-black/10 pl-3 pr-11 font-bold outline-none focus:border-[#d99a4d]`} /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-black/35">RON</span></span>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`h-11 rounded-xl px-5 text-sm font-black transition ${active ? "bg-[#8f592d] text-white" : "text-black/50 hover:bg-black/5"}`}>{children}</button>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#f4eee5] px-5">{children}</main>;
}

async function prepareImage(source: File) {
  const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" });
  const scale = Math.min(1, 3000 / bitmap.width, 3000 / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("A kép nem dolgozható fel.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("A WebP-konvertálás sikertelen.")), "image/webp", 0.98));
  return { file: new File([blob], `${source.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" }), width, height };
}
