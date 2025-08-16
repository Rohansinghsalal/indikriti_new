const FooterNav = () => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', active: true },
    { id: 'search', label: 'Search', icon: '🔍', active: false },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️', active: false },
    { id: 'profile', label: 'Profile', icon: '👤', active: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterNav;
