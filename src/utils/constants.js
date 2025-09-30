export const APP_NAME = 'Enrico Cerrini';
export const APP_DESCRIPTION = 'To\'liq kiyim do\'koni boshqaruv tizimi';

export const CURRENCY = 'UZS';
export const LOCALE = 'uz-UZ';

// Financial constants
export const DEFAULT_DISCOUNT = 0;

// API configuration
export const API_CONFIG = {
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Search and pagination
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  DEFAULT_LIMIT: 20, // Increased from 10 to 20 for better UX
  MAX_LIMIT: 1000, // Increased from 100 to 1000 to support more products
};

// Payment methods
export const PAYMENT_METHODS = {
  FULL: 'full',
  PARTIAL: 'partial',
  DEBT: 'debt',
  CASH: 'cash',
  TRANSFER: 'transfer',
};

// Modal sizes
export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  CLIENTS: '/clients',
  SALES: '/sales',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  FINANCE: '/finance',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CHECKOUT: '/checkout',
  SALES: '/sales',
  INVENTORY: '/inventory',
  CLIENTS: '/clients',
  FINANCE: '/finance',
  MARKETING: '/marketing',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  DEBTS: '/debts',
  SETTINGS_CATEGORIES: '/settings/categories',
  SETTINGS_ATTRIBUTES: '/settings/attributes',
  SETTINGS_BRANDS: '/settings/brands',
  SETTINGS_COLORS: '/settings/colors',
  SETTINGS_SIZES: '/settings/sizes',
  SETTINGS_SEASONS: '/settings/seasons',
};

export const NAVIGATION_ITEMS = [
  { name: 'Analitika', href: ROUTES.DASHBOARD, icon: 'Home' },
  { name: 'Sotuv', href: ROUTES.CHECKOUT, icon: 'ShoppingCart' },
  { name: 'Moliya', href: ROUTES.SALES, icon: 'Receipt' },
  { name: 'Qarzdorliklar', href: ROUTES.DEBTS, icon: 'AlertCircle' },
  { name: 'Inventar', href: ROUTES.INVENTORY, icon: 'Package' },
  { name: 'Mijozlar', href: ROUTES.CLIENTS, icon: 'Users' },
  { name: 'Xarajatlar', href: ROUTES.FINANCE, icon: 'DollarSign' },
  { name: 'Marketing', href: ROUTES.MARKETING, icon: 'MessageSquare' },
  { name: 'Hisobotlar', href: ROUTES.REPORTS, icon: 'BarChart3' },
];

export const SETTINGS_ITEMS = [
  {
    name: 'Sozlamalar',
    action: 'settings',
  },
  {
    name: 'Tizim sozlamalari',
    action: 'systemConfig',
  },
  {
    name: 'Foydalanuvchilarni boshqarish',
    action: 'userManagement',
  },
];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

export const DATE_FORMATS = {
  DISPLAY: 'dd MMMM yyyy',
  SHORT: 'dd.MM.yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd.MM.yyyy HH:mm',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Serverga ulanishda xatolik. Backend server ishga tushganligini tekshiring.',
  AUTHENTICATION_FAILED: 'Autentifikatsiya muvaffaqiyatsiz',
  VALIDATION_ERROR: 'Ma\'lumotlarni to\'g\'ri kiriting',
  PRODUCT_NOT_FOUND: 'Bu SKU kodiga mos mahsulot topilmadi',
  PRODUCT_OUT_OF_STOCK: 'Bu mahsulot omborda mavjud emas',
  CLIENT_REQUIRED: 'Iltimos, mijozni tanlang yoki yangi mijoz ismini kiriting',
  CART_EMPTY: 'Iltimos, savatga mahsulot qo\'shing',
  PAYMENT_VALIDATION: {
    FULL_PAYMENT_ENTERED: 'To\'liq to\'lov kiritilgan. To\'liq to\'lov usulini tanlang.',
    AMOUNT_REQUIRED: 'Iltimos, to\'langan summani kiriting.',
    CLIENT_DEBT: 'Mijozda qarzdorlik mavjud. Iltimos, avval qarzdorlikni to\'lang.',
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  OPERATION_SUCCESSFUL: 'Operatsiya muvaffaqiyatli',
  SALE_CREATED: 'Sotuv muvaffaqiyatli amalga oshirildi',
  CLIENT_CREATED: 'Mijoz muvaffaqiyatli qo\'shildi',
  PRODUCT_CREATED: 'Mahsulot muvaffaqiyatli qo\'shildi',
}; 