// Route configuration for the application

// Import page components
import HomePage from '../pages/Home/HomePage';
import CartPage from '../pages/Cart/CartPage';
import ProductPage from '../pages/Product/ProductPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import NotFoundPage from '../pages/NotFoundPage';
import CategoryPage from '../pages/Category/CategoryPage';
import TestPage from '../pages/TestPage';

// Define routes
const routes = [
  {
    path: '/',
    element: HomePage,
    exact: true,
    name: 'Home',
    public: true,
  },
  {
    path: '/products/:id',
    element: ProductPage,
    exact: true,
    name: 'Product Details',
    public: true,
  },
  {
    path: '/category/:categoryId',
    element: CategoryPage,
    exact: true,
    name: 'Category',
    public: true,
  },
  {
    path: '/category/:categoryId/subcategory/:subcategoryId',
    element: CategoryPage,
    exact: true,
    name: 'Subcategory',
    public: true,
  },
  {
    path: '/category/:categoryId/subcategory/:subcategoryId/product-type/:productTypeId',
    element: CategoryPage,
    exact: true,
    name: 'Product Type',
    public: true,
  },
  {
    path: '/cart',
    element: CartPage,
    exact: true,
    name: 'Shopping Cart',
    public: true,
  },
  {
    path: '/checkout',
    element: CheckoutPage,
    exact: true,
    name: 'Checkout',
    public: true,
  },
  {
    path: '/test-hierarchy',
    element: TestPage,
    exact: true,
    name: 'Test Hierarchy',
    public: true,
  },
  {
    path: '*',
    element: NotFoundPage,
    name: 'Not Found',
    public: true,
  },
];

export default routes;