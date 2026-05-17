export type Id = string;

export type ListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type HeroItem = {
  id: Id;
  title: string;
  subtitle?: string;
  isActive: boolean;
  images: string[]; // base64 strings
  createdAt: string;
};

export type StatItem = {
  id: Id;
  title: string;
  value: number;
  trend: number; // -100..100
  isActive: boolean;
  createdAt: string;
};

export type TestimonialItem = {
  id: Id;
  name: string;
  role?: string;
  rating: number; // 1..5
  comment: string;
  isActive: boolean;
  createdAt: string;
};

export type SiteSettings = {
  logo?: string; // base64
  favicon?: string; // base64
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

export type Codes = {
  id: number;
  product_id: number;
  batch_id: number;
  name: string;
  code: string;
  qr_code_url: string;
  manufacturing_date: string;
  expire_date: string;
  used_at: string;
  is_active: boolean;
  is_used: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
};
