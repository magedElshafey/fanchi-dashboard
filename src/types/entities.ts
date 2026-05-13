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
