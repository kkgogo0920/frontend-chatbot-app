import Home from '../pages/Home';
import DocumentSummary from '../components/DocumentSummary';
import Inventory from '../pages/ProcurementFlow';
import ProductReviewFeed from '../components/ProductReviewFeed';

export const SIDEBAR_TABS = [
  {
    key: 'home',
    label: 'Home',
    component: Home,
  },
  {
    key: 'documents',
    label: 'Documents',
    component: DocumentSummary,
  },
  {
    key: 'reviews',
    label: 'Review',
    component: ProductReviewFeed,
  },
  {
    key: 'inventory',
    label: 'Inventory',
    component: Inventory,
  },
]; 