export { categories } from './categories';
export { products, productMetadata } from './products';
export { categoryColors, themes, gradients } from './colors';

// Constants
export const ITEMS_PER_PAGE = 6;
export const DEFAULT_CATEGORY = 'black';

// Helper functions
export const formatPrice = (price) => {
  if (typeof price === 'string') return price;
  return `$${price.toFixed(2)}`;
};

export const calculateDiscount = (price, quantity) => {
  const numPrice = typeof price === 'string' ? parseFloat(price.replace('$', '')) : price;
  if (quantity >= 10000) return numPrice * 0.85;
  if (quantity >= 5000) return numPrice * 0.90;
  if (quantity >= 1000) return numPrice * 0.95;
  return numPrice;
};

// Types
export const ProductType = {
  BLACK: 'black',
  PLASTIC: 'plastic',
  COMPOSTABLE: 'compostable',
  SOUP: 'soup',
  PORTION: 'portion',
  SUSHI: 'sushi',
  ALUMINUM: 'aluminum',
  UTENSILS: 'utensils'
}; 