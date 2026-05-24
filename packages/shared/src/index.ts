// ─── Order Status ───────────────────────────────────────────────────────────
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// ─── Contact Methods ─────────────────────────────────────────────────────────
export type ContactMethod =
  | 'TELEGRAM'
  | 'DISCORD'
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'TWITTER';

export const CONTACT_LABELS: Record<ContactMethod, string> = {
  TELEGRAM: 'Telegram',
  DISCORD: 'Discord',
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  TWITTER: 'X (Twitter)',
};

// ─── Pricing ─────────────────────────────────────────────────────────────────
export interface PricePackage {
  hearts: number;
  price: number;
  label?: string;
  popular?: boolean;
}

export const PRICE_PACKAGES: PricePackage[] = [
  { hearts: 20,  price: 0.99 },
  { hearts: 30,  price: 1.29 },
  { hearts: 50,  price: 1.99, popular: true },
  { hearts: 100, price: 3.79 },
  { hearts: 150, price: 5.49 },
  { hearts: 250, price: 8.49, label: 'Best Value' },
];

export const BASE_PRICE_PER_HEART = 0.99 / 20; // ~0.0495 per heart

export function calculatePrice(hearts: number): number {
  // Find the best matching package or interpolate
  const sorted = [...PRICE_PACKAGES].sort((a, b) => b.hearts - a.hearts);
  for (const pkg of sorted) {
    if (hearts >= pkg.hearts) {
      const rate = pkg.price / pkg.hearts;
      return Math.round(rate * hearts * 100) / 100;
    }
  }
  // Below minimum, use base rate
  return Math.round(BASE_PRICE_PER_HEART * hearts * 100) / 100;
}

// ─── ETA Logic ───────────────────────────────────────────────────────────────
export const MAX_HEARTS_PER_DAY = 50;
export const BUFFER_DAYS = 2;

export function calculateETA(totalHearts: number): number {
  return Math.ceil(totalHearts / MAX_HEARTS_PER_DAY) + BUFFER_DAYS;
}

export function calculateRemainingETA(
  totalHearts: number,
  deliveredHearts: number
): number {
  const remaining = totalHearts - deliveredHearts;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / MAX_HEARTS_PER_DAY) + 1;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name?: string;
  telegramId?: string;
  telegramUsername?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  skyFriendCode: string;
  hearts: number;
  heartsDelivered: number;
  price: number;
  status: OrderStatus;
  contactMethod: ContactMethod;
  contactUsername: string;
  etaDays: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface CreateOrderInput {
  skyFriendCode: string;
  hearts: number;
  contactMethod: ContactMethod;
  contactUsername: string;
  notes?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalClients: number;
  heartsDeliveredToday: number;
  dailyCapacityUsed: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
