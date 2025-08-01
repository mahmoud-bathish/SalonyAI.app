// ============================================================================
// TYPE EXPORTS - MAIN INDEX FILE
// ============================================================================

// Export all API types
export * from './api';

// Export all component types
export * from './components';

// Export all service types
export * from './services';

// ============================================================================
// COMMONLY USED TYPE ALIASES
// ============================================================================

// Re-export commonly used types for convenience
export type {
  ApiResponse,
  WebsiteSettings,
  WebsiteSettingsResponse,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  Customer,
  Address,
  SocialMediaLinks,
  Language,
  LoadingState,
  PaginationParams,
  PaginatedResponse,
  PaginatedApiResponse
} from './api';

export type {
  NavbarProps,
  FooterProps,
  CategoriesProps,
  ProductCardProps,
  CartItemProps,
  LoadingSpinnerProps,
  ErrorMessageProps,
  ButtonProps,
  ModalProps,
  ContactFormData,
  NewsletterFormData,
  SearchFormData,
  ProductFilters,
  FilterOption,
  LayoutProps,
  PageProps,
  CartContextType,
  WebsiteContextType
} from './components';

export type {
  ApiConfig,
  ApiRequestOptions,
  WebsiteSettingsService,
  CategoryService,
  ProductService,
  CartService,
  OrderService,
  CustomerService,
  AuthService,
  FileUploadService,
  NotificationService,
  StorageService,
  CacheService,
  ServiceError,
  ServiceResult,
  PaginationService,
  ValidationService
} from './services';

// ============================================================================
// UTILITY TYPE HELPERS
// ============================================================================

// Helper type for making all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Helper type for making all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Helper type for picking specific properties
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Helper type for omitting specific properties
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Helper type for deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Helper type for nullable values
export type Nullable<T> = T | null;

// Helper type for optional values
export type Optional<T> = T | undefined;

// Helper type for union with null and undefined
export type Maybe<T> = T | null | undefined;

// ============================================================================
// COMMON TYPE CONSTANTS
// ============================================================================

// Common status types
export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export const LOADING_STATES = ['idle', 'loading', 'success', 'error'] as const;

// Common size types
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
export const SPINNER_SIZES = ['sm', 'md', 'lg'] as const;
export const MODAL_SIZES = ['sm', 'md', 'lg', 'xl'] as const;

// Common variant types
export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;

// ============================================================================
// TYPE GUARDS
// ============================================================================

// Type guard for checking if a value is not null or undefined
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Type guard for checking if a value is a string
export function isString(value: any): value is string {
  return typeof value === 'string';
}

// Type guard for checking if a value is a number
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Type guard for checking if a value is a boolean
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

// Type guard for checking if a value is an object
export function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null;
}

// Type guard for checking if a value is an array
export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

// Type guard for checking if a value is a function
export function isFunction(value: any): value is Function {
  return typeof value === 'function';
} 