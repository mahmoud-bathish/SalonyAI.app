import type { WebsiteSettingsResponse, CategoriesResponse, ProductsResponse } from '@/types';

const API_BASE_URL = 'https://api.salonyai.com/api';
const HARDCODED_TENANT_IDENTIFIER = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

export async function getWebsiteSettings(slug: string): Promise<WebsiteSettingsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/WebsiteSetting/${slug}`, {
      method: 'GET',
      headers: {
        'accept': 'text/plain',
        'x-tenant-identifier': HARDCODED_TENANT_IDENTIFIER,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: 404 - Website "${slug}" not found`);
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data: WebsiteSettingsResponse = await response.json();
    
    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format received from server');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching website settings:', error);
    
    // Re-throw with more specific error message if it's a network error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Failed to fetch - Network connection error');
    }
    
    throw error;
  }
}

export async function getCategories(tenantIdentifier: string, skip: number = 0, take: number = 10): Promise<CategoriesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ProductCategory?skip=${skip}&take=${take}`, {
      method: 'GET',
      headers: {
        'accept': 'text/plain',
        'x-tenant-identifier': tenantIdentifier,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Categories not found');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data: CategoriesResponse = await response.json();
    
    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format received from server');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Re-throw with more specific error message if it's a network error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Failed to fetch - Network connection error');
    }
    
    throw error;
  }
}

export async function getProducts(tenantIdentifier: string, categoryId: number, skip: number = 0, take: number = 10): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/Product?categoryId=${categoryId}&skip=${skip}&take=${take}`, {
      method: 'GET',
      headers: {
        'accept': 'text/plain',
        'x-tenant-identifier': tenantIdentifier,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Products not found');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data: ProductsResponse = await response.json();
    
    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format received from server');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Re-throw with more specific error message if it's a network error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Failed to fetch - Network connection error');
    }
    
    throw error;
  }
}