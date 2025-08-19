import { useApp } from '../../context/AppContext';
import Header from '../common/Header/Header';
import Footer from '../common/Footer/Footer';
import NotificationList from '../common/Notification/NotificationList';

const Layout = ({ children }) => {
  const { navItems } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Header navItems={navItems} />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <NotificationList />
      <Footer />
    </div>
  );
};

export default Layout;