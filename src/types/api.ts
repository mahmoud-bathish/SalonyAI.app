// ============================================================================
// API RESPONSE MODELS
// ============================================================================

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  error?: ApiError;
  data: T;
  isSuccessful: boolean;
}

export interface ApiError {
  className: string;
  message: string;
  innerException: string;
  stackTrace: string;
}

// ============================================================================
// WEBSITE SETTINGS MODELS
// ============================================================================

export interface WebsiteSettings {
  id: number;
  tenantIdentifier: string;
  slug: string;
  supportedLanguages: number[];
  logoUrl: string;
  themeColor: string;
  youtubeLink?: string;
  facebookLink?: string;
  instagramLink?: string;
  tikTokLink?: string;
  linkedInLink?: string;
  xLink?: string;
  address_Ar: string;
  address_En: string;
  deliveryDays: number;
  shippingCost: number;
  isActive: boolean;
  dateCreated: string;
  dateModified: string;
}

export type WebsiteSettingsResponse = ApiResponse<WebsiteSettings>;

// ============================================================================
// CATEGORY MODELS
// ============================================================================

export interface CategoryTranslation {
  id: number;
  languageCode: number;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  tenantIdentifier: string;
  imageUrl: string;
  isActive: boolean;
  dateCreated: string;
  dateModified: string;
  translations: CategoryTranslation[];
}

export type CategoryResponse = ApiResponse<Category>;
export type CategoriesResponse = ApiResponse<Category[]>;

// ============================================================================
// PRODUCT MODELS
// ============================================================================

export interface ProductTranslation {
  id: number;
  languageCode: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  tenantIdentifier: string;
  categoryId: number;
  price: number;
  imageUrl: string;
  images: ProductImage[];
  isActive: boolean;
  inStock: boolean;
  stockQuantity: number;
  dateCreated: string;
  dateModified: string;
  translations: ProductTranslation[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: number;
}

export type ProductResponse = ApiResponse<Product>;
export type ProductsResponse = ApiResponse<Product[]>;

// ============================================================================
// CART MODELS
// ============================================================================

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
  dateAdded: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  dateCreated: string;
  dateModified: string;
}

export type CartResponse = ApiResponse<Cart>;

// ============================================================================
// ORDER MODELS
// ============================================================================

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  dateCreated: string;
  dateModified: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type OrderResponse = ApiResponse<Order>;
export type OrdersResponse = ApiResponse<Order[]>;

// ============================================================================
// CUSTOMER MODELS
// ============================================================================

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  dateCreated: string;
  dateModified: string;
}

export interface Address {
  id: number;
  customerId: number;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export type CustomerResponse = ApiResponse<Customer>;
export type AddressResponse = ApiResponse<Address>;

// ============================================================================
// SOCIAL MEDIA MODELS
// ============================================================================

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
  telegram?: string;
}

// ============================================================================
// LANGUAGE MODELS
// ============================================================================

export interface Language {
  id: number;
  code: string;
  name: string;
  nameNative: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
}

export type LanguageResponse = ApiResponse<Language>;
export type LanguagesResponse = ApiResponse<Language[]>;

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;