'use client';

import { use } from 'react';
import { CartProvider } from '@/contexts/CartContext';

export default function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  
  return (
    <CartProvider slug={slug}>
      {children}
    </CartProvider>
  );
} 