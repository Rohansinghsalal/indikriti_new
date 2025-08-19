import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import routes from './routeConfig';

const AppRouter = () => {
  return (
    <Layout>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
            exact={route.exact}
          />
        ))}
      </Routes>
    </Layout>
  );
};

export default AppRouter;