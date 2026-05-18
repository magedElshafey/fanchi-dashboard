// src/types/index.ts

export type Id = string;

export type ListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  lastPage: number;
};

export type HeroItem = {
  id: Id;
  title: string;
  subtitle?: string;
  isActive: boolean;
  images: string[];
  createdAt: string;
};

export type StatItem = {
  id: Id;
  title: string;
  value: number;
  trend: number;
  isActive: boolean;
  createdAt: string;
};

export type TestimonialItem = {
  id: Id;
  name: string;
  role?: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
};

export type SiteSettings = {
  logo?: string;
  favicon?: string;
  slogan?: string;
};

export type ContactSettings = {
  phone?: string;
  email?: string;
  address?: string;
  mapIframe?: string;
};

export type SocialPlatform = {
  id: Id;
  platform: string;
  url: string;
  isActive: boolean;
  createdAt: string;
};

export type SeoSetting = {
  id: Id;
  key: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
};

export type KpiStats = {
  revenue: number;
  users: number;
  orders: number;
  conversion: number;
  trafficSeries: { day: string; value: number }[];
  activitySeries: { day: string; value: number }[];
  topPages: { path: string; views: number }[];
};

// BUG FIX: was `id: number` — inconsistent with shared `Id = string`
export type ProductCode = {
  id: Id;
  product_id: Id;
  batch_id: Id;
  name: string;
  code: string;
  qr_code_url: string;
  manufacturing_date: string;
  expire_date: string;
  used_at: string | null;
  is_active: boolean;
  is_used: boolean;
  created_at: string;
  updated_at: string;
  user_id: Id;
};

// Added concrete types so entity hooks aren't typed as `any`
export type Product = {
  id: Id;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  sku: string;
  prefix: string;
  category: string;
  warranty_months: number;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type CodeBatch = {
  id: Id;
  batch_number: string;
  product_id: Id;
  manufacturing_date: string;
  expire_date: string;
  year: number;
  quantity: number;
  used_count: number;
  notes?: { ar?: string; en?: string };
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
};
