import AxiosMockAdapter from "axios-mock-adapter";
import { api } from "../lib/api";
import type {
  ContactSettings,
  HeroItem,
  KpiStats,
  ListResponse,
  SeoSetting,
  SiteSettings,
  SocialPlatform,
  StatItem,
  TestimonialItem,
} from "../types/entities";

type Db = {
  hero: HeroItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
  social: SocialPlatform[];
  seo: SeoSetting[];
  settings: {
    site: SiteSettings;
    contact: ContactSettings;
  };
};

const DB_KEY = "dashboard_mvp_db_v1";

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function seed(): Db {
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dd = d.toISOString().slice(5, 10); // MM-DD
    return dd;
  });

  return {
    hero: [
      { id: uid(), title: "Premium Eye Care", subtitle: "Modern clinic experience", isActive: true, images: [], createdAt: nowIso() },
      { id: uid(), title: "Laser Vision Correction", subtitle: "Clear vision, faster", isActive: true, images: [], createdAt: nowIso() },
    ],
    stats: [
      { id: uid(), title: "Patients", value: 12450, trend: 12, isActive: true, createdAt: nowIso() },
      { id: uid(), title: "Appointments", value: 1840, trend: 6, isActive: true, createdAt: nowIso() },
      { id: uid(), title: "Reviews", value: 920, trend: 18, isActive: true, createdAt: nowIso() },
    ],
    testimonials: [
      { id: uid(), name: "Sarah", role: "Teacher", rating: 5, comment: "Excellent service and very professional.", isActive: true, createdAt: nowIso() },
      { id: uid(), name: "Omar", role: "Engineer", rating: 4, comment: "Clean place, smooth booking experience.", isActive: true, createdAt: nowIso() },
    ],
    social: [
      { id: uid(), platform: "Facebook", url: "https://facebook.com", isActive: true, createdAt: nowIso() },
      { id: uid(), platform: "Instagram", url: "https://instagram.com", isActive: true, createdAt: nowIso() },
    ],
    seo: [
      { id: uid(), key: "home", title: "Home | Clinic", description: "Professional eye care clinic.", isActive: true, createdAt: nowIso() },
      { id: uid(), key: "about", title: "About | Clinic", description: "Meet our doctors and services.", isActive: true, createdAt: nowIso() },
    ],
    settings: {
      site: { slogan: "See Better. Live Better." },
      contact: { phone: "+20 100 000 0000", email: "info@example.com", address: "Cairo, Egypt", mapIframe: "" },
    },
  };
}

function readDb(): Db {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const s = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(s));
    return s;
  }
  try {
    return JSON.parse(raw) as Db;
  } catch {
    const s = seed();
    localStorage.setItem(DB_KEY, JSON.stringify(s));
    return s;
  }
}

function writeDb(db: Db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function list<T extends { createdAt: string }>(items: T[], page: number, pageSize: number, q: string, fields: (keyof T)[] = []): ListResponse<T> {
  const query = q.trim().toLowerCase();
  const filtered = query
    ? items.filter((it) => fields.some((k) => String(it[k] ?? "").toLowerCase().includes(query)))
    : items;

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return { items: paged, total, page, pageSize };
}

export function setupMockApi() {
  const mock = new AxiosMockAdapter(api, { delayResponse: 450 });

  mock.onGet("/stats").reply(() => {
    const stats: KpiStats = {
      revenue: 128_400,
      users: 9_420,
      orders: 1_320,
      conversion: 3.4,
      trafficSeries: Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const day = d.toISOString().slice(5, 10);
        return { day, value: Math.round(2200 + Math.sin(i / 2) * 380 + Math.random() * 220) };
      }),
      activitySeries: Array.from({ length: 14 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const day = d.toISOString().slice(5, 10);
        return { day, value: Math.round(24 + Math.cos(i / 2) * 8 + Math.random() * 6) };
      }),
      topPages: [
        { path: "/patient-education/cataract", views: 12450 },
        { path: "/services/lasik", views: 9320 },
        { path: "/patient-education/glaucoma", views: 7810 },
        { path: "/contact", views: 6200 },
      ],
    };
    return [200, stats];
  });

  // Generic entity list
  mock.onGet("/entity").reply((config) => {
    const db = readDb();
    const entity = String(config.params?.entity ?? "");
    const page = Math.max(1, Number(config.params?.page ?? 1) || 1);
    const pageSize = Math.max(5, Number(config.params?.pageSize ?? 10) || 10);
    const q = String(config.params?.q ?? "");

    const map: Record<string, any> = {
      hero: { items: db.hero, fields: ["title", "subtitle"] },
      stats: { items: db.stats, fields: ["title"] },
      testimonials: { items: db.testimonials, fields: ["name", "role", "comment"] },
      social: { items: db.social, fields: ["platform", "url"] },
      seo: { items: db.seo, fields: ["key", "title", "description"] },
    };

    if (!map[entity]) return [404, { message: "Unknown entity" }];

    const result = list(map[entity].items, page, pageSize, q, map[entity].fields);
    return [200, result];
  });

  mock.onPost("/entity").reply((config) => {
    const db = readDb();
    const body = JSON.parse(config.data || "{}");
    const entity = String(body.entity ?? "");
    const payload = body.payload ?? {};

    const createdAt = nowIso();
    const record = { id: uid(), createdAt, ...payload };

    switch (entity) {
      case "hero":
        db.hero.unshift(record);
        break;
      case "stats":
        db.stats.unshift(record);
        break;
      case "testimonials":
        db.testimonials.unshift(record);
        break;
      case "social":
        db.social.unshift(record);
        break;
      case "seo":
        db.seo.unshift(record);
        break;
      default:
        return [404, { message: "Unknown entity" }];
    }

    writeDb(db);
    return [201, record];
  });

  mock.onPut(/\/entity\/.+/).reply((config) => {
    const db = readDb();
    const id = String(config.url?.split("/").pop() || "");
    const body = JSON.parse(config.data || "{}");
    const entity = String(body.entity ?? "");
    const patch = body.payload ?? {};

    const updater = (arr: any[]) => {
      const idx = arr.findIndex((x) => x.id === id);
      if (idx === -1) return null;
      arr[idx] = { ...arr[idx], ...patch };
      return arr[idx];
    };

    let updated: any = null;
    if (entity === "hero") updated = updater(db.hero);
    if (entity === "stats") updated = updater(db.stats);
    if (entity === "testimonials") updated = updater(db.testimonials);
    if (entity === "social") updated = updater(db.social);
    if (entity === "seo") updated = updater(db.seo);

    if (!updated) return [404, { message: "Not found" }];
    writeDb(db);
    return [200, updated];
  });

  mock.onDelete(/\/entity\/.+/).reply((config) => {
    const db = readDb();
    const id = String(config.url?.split("/").pop() || "");
    const entity = String(config.params?.entity ?? "");

    const remover = (arr: any[]) => {
      const idx = arr.findIndex((x) => x.id === id);
      if (idx === -1) return false;
      arr.splice(idx, 1);
      return true;
    };

    let ok = false;
    if (entity === "hero") ok = remover(db.hero);
    if (entity === "stats") ok = remover(db.stats);
    if (entity === "testimonials") ok = remover(db.testimonials);
    if (entity === "social") ok = remover(db.social);
    if (entity === "seo") ok = remover(db.seo);

    if (!ok) return [404, { message: "Not found" }];
    writeDb(db);
    return [200, { ok: true }];
  });

  // Settings: site/contact
  mock.onGet("/settings/site").reply(() => {
    const db = readDb();
    return [200, db.settings.site];
  });
  mock.onPut("/settings/site").reply((config) => {
    const db = readDb();
    const patch = JSON.parse(config.data || "{}");
    db.settings.site = { ...db.settings.site, ...patch };
    writeDb(db);
    return [200, db.settings.site];
  });

  mock.onGet("/settings/contact").reply(() => {
    const db = readDb();
    return [200, db.settings.contact];
  });
  mock.onPut("/settings/contact").reply((config) => {
    const db = readDb();
    const patch = JSON.parse(config.data || "{}");
    db.settings.contact = { ...db.settings.contact, ...patch };
    writeDb(db);
    return [200, db.settings.contact];
  });
}
