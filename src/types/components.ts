// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

export interface NavbarProps {
  logoUrl: string;
  slug: string;
  themeColor: string;
}

export interface FooterProps {
  address_En: string;
  address_Ar?: string;
  themeColor: string;
  slug: string;
  youtubeLink?: string;
  facebookLink?: string;
  instagramLink?: string;
  tikTokLink?: string;
  linkedInLink?: string;
  xLink?: string;
}

export interface CategoriesProps {
  categories?: any[];
  loading?: boolean;
  error?: string;
}

export interface ProductCardProps {
  product: any;
  onAddToCart?: (product: any) => void;
}

export interface CartItemProps {
  item: any;
  onUpdateQuantity?: (itemId: number, quantity: number) => void;
  onRemoveItem?: (itemId: number) => void;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// ============================================================================
// FORM INTERFACES
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface SearchFormData {
  query: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// FILTER INTERFACES
// ============================================================================

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  brands?: string[];
  ratings?: number[];
}

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

// ============================================================================
// LAYOUT INTERFACES
// ============================================================================

export interface LayoutProps {
  children: React.ReactNode;
  websiteSettings?: any;
  loading?: boolean;
  error?: string;
}

export interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// ============================================================================
// CONTEXT INTERFACES
// ============================================================================

export interface CartContextType {
  cart: any;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
}

export interface WebsiteContextType {
  settings: any;
  loading: boolean;
  error: string | null;
  refreshSettings: () => void;
}

// ============================================================================
// UTILITY COMPONENT TYPES
// ============================================================================

export type ReactComponent<P = {}> = React.ComponentType<P>;

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface WithId {
  id: string | number;
} 