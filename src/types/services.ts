// ============================================================================
// API SERVICE TYPES
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// ============================================================================
// WEBSITE SETTINGS SERVICE
// ============================================================================

export interface WebsiteSettingsService {
  getWebsiteSettings(slug: string): Promise<any>;
  updateWebsiteSettings(slug: string, settings: any): Promise<any>;
}

// ============================================================================
// CATEGORY SERVICE
// ============================================================================

export interface CategoryService {
  getCategories(params?: any): Promise<any>;
  getCategory(id: number): Promise<any>;
  createCategory(category: any): Promise<any>;
  updateCategory(id: number, category: any): Promise<any>;
  deleteCategory(id: number): Promise<any>;
}

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export interface ProductService {
  getProducts(params?: any): Promise<any>;
  getProduct(id: number): Promise<any>;
  getProductsByCategory(categoryId: number, params?: any): Promise<any>;
  searchProducts(query: string, params?: any): Promise<any>;
  createProduct(product: any): Promise<any>;
  updateProduct(id: number, product: any): Promise<any>;
  deleteProduct(id: number): Promise<any>;
}

// ============================================================================
// CART SERVICE
// ============================================================================

export interface CartService {
  getCart(): Promise<any>;
  addToCart(productId: number, quantity: number): Promise<any>;
  updateCartItem(itemId: number, quantity: number): Promise<any>;
  removeFromCart(itemId: number): Promise<any>;
  clearCart(): Promise<any>;
  applyCoupon(code: string): Promise<any>;
  removeCoupon(): Promise<any>;
}

// ============================================================================
// ORDER SERVICE
// ============================================================================

export interface OrderService {
  getOrders(params?: any): Promise<any>;
  getOrder(id: number): Promise<any>;
  createOrder(order: any): Promise<any>;
  updateOrder(id: number, order: any): Promise<any>;
  cancelOrder(id: number): Promise<any>;
  getOrderStatus(id: number): Promise<any>;
}

// ============================================================================
// CUSTOMER SERVICE
// ============================================================================

export interface CustomerService {
  getCustomer(id: number): Promise<any>;
  createCustomer(customer: any): Promise<any>;
  updateCustomer(id: number, customer: any): Promise<any>;
  deleteCustomer(id: number): Promise<any>;
  getCustomerAddresses(customerId: number): Promise<any>;
  addCustomerAddress(customerId: number, address: any): Promise<any>;
  updateCustomerAddress(addressId: number, address: any): Promise<any>;
  deleteCustomerAddress(addressId: number): Promise<any>;
}

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

export interface AuthService {
  login(credentials: any): Promise<any>;
  logout(): Promise<any>;
  register(user: any): Promise<any>;
  refreshToken(): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  resetPassword(token: string, password: string): Promise<any>;
  getCurrentUser(): Promise<any>;
  updateProfile(user: any): Promise<any>;
}

// ============================================================================
// FILE UPLOAD SERVICE
// ============================================================================

export interface FileUploadService {
  uploadImage(file: File, folder?: string): Promise<any>;
  uploadMultipleImages(files: File[], folder?: string): Promise<any>;
  deleteImage(imageUrl: string): Promise<any>;
  getImageUrl(path: string): string;
}

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

export interface NotificationService {
  showSuccess(message: string, duration?: number): void;
  showError(message: string, duration?: number): void;
  showWarning(message: string, duration?: number): void;
  showInfo(message: string, duration?: number): void;
  showLoading(message?: string): void;
  hideLoading(): void;
}

// ============================================================================
// STORAGE SERVICE
// ============================================================================

export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

// ============================================================================
// CACHE SERVICE
// ============================================================================

export interface CacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  getKeys(): string[];
}

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

export interface ServiceError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

// ============================================================================
// UTILITY SERVICE TYPES
// ============================================================================

export interface PaginationService {
  getPage<T>(items: T[], page: number, pageSize: number): T[];
  getTotalPages(totalItems: number, pageSize: number): number;
  getPageInfo(totalItems: number, currentPage: number, pageSize: number): any;
}

export interface ValidationService {
  validateEmail(email: string): boolean;
  validatePhone(phone: string): boolean;
  validatePassword(password: string): boolean;
  validateRequired(value: any): boolean;
  validateMinLength(value: string, minLength: number): boolean;
  validateMaxLength(value: string, maxLength: number): boolean;
} 