import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import CategoryDashboard from './components/admin/CategoryDashboard';
import ProductDashboard from './components/admin/ProductDashboard';
import ProductsPage from './components/ProductsPage';
import ProductDetails from './components/ProductDetails';
import HomePage from './components/Homepage';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/sign-up',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/products/:id',
    element: <ProductDetails />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/admin/categories',
    element: <CategoryDashboard />,
  },
  {
    path: '/admin/products',
    element: <ProductDashboard />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
