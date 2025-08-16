import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import Layout from '../components/Layout.jsx';

const Profile = ({ onNavigate }) => {
  const { user, logout, wallet, refreshWalletData } = useAuth();
  const { getCartItemsCount, getWishlistCount } = useCart();
  const { getAnalyticsData, clearAnalyticsData } = useAnalytics();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    instagramId: user?.instagramId || ''
  });

  const handleLogout = () => {
    logout();
    onNavigate?.('home');
  };

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const analyticsData = getAnalyticsData();
  const recentEvents = analyticsData.slice(-10).reverse();

  // Generate unique referral ID if user doesn't have one
  const referralId = user?.referralCode || `${user?.name?.substring(0, 3).toUpperCase() || 'USR'}${user?.mobileNumber?.slice(-4) || '1234'}`;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralId);
    // You could show a toast notification here
    alert('Referral code copied to clipboard!');
  };

  const shareReferral = () => {
    const shareText = `Join Indikriti and get ₹100 bonus! Use my referral code: ${referralId}`;
    const shareUrl = `${window.location.origin}?ref=${referralId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Indikriti',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Referral link copied to clipboard!');
    }
  };

  return (
    <Layout currentPage="profile" title="Profile">
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 rounded-3xl p-6 shadow-xl border border-white/50 mb-6 backdrop-blur-sm">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h1>
                <p className="text-gray-600">{user?.email}</p>
                {user?.mobileNumber && (
                  <p className="text-sm text-blue-600 font-medium">📱 +91 {user.mobileNumber}</p>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-all shadow-lg border border-blue-100"
              >
                {isEditing ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-2xl backdrop-blur-sm border border-white/50">
                <div className="text-2xl font-bold text-blue-600">{getCartItemsCount()}</div>
                <div className="text-sm text-gray-600 font-medium">Cart Items</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl backdrop-blur-sm border border-white/50">
                <div className="text-2xl font-bold text-purple-600">{getWishlistCount()}</div>
                <div className="text-sm text-gray-600 font-medium">Wishlist</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-2xl backdrop-blur-sm border border-white/50">
                <div className="text-2xl font-bold text-green-600">₹{wallet.balance}</div>
                <div className="text-sm text-gray-600 font-medium">Wallet</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50 mb-6">
            <div className="flex space-x-2 overflow-x-auto">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'wallet', label: 'Wallet', icon: '💰' },
                { id: 'referral', label: 'Referral', icon: '🎁' },
                { id: 'orders', label: 'Orders', icon: '📦' },
                { id: 'activity', label: 'Activity', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 rounded-3xl p-6 shadow-xl border border-white/50 backdrop-blur-sm">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">👤</span>
                  Profile Information
                </h2>
                
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Instagram ID
                      </label>
                      <input
                        type="text"
                        value={editForm.instagramId}
                        onChange={(e) => setEditForm(prev => ({ ...prev, instagramId: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                        placeholder="@your_instagram_handle"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                      >
                        💾 Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
                        <p className="text-gray-800 font-medium">{user?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Email</label>
                        <p className="text-gray-800 font-medium">{user?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Mobile Number</label>
                        <p className="text-gray-800 font-medium">+91 {user?.mobileNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Instagram ID</label>
                        <p className="text-gray-800 font-medium">{user?.instagramId || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Member Since</label>
                        <p className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">User ID</label>
                        <p className="text-gray-800 font-medium font-mono">{referralId}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wallet' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">💰</span>
                    Wallet
                  </h2>
                  <button
                    onClick={refreshWalletData}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    🔄 Refresh
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 rounded-3xl p-6 text-white mb-6 shadow-xl">
                  <h3 className="text-lg font-medium mb-2 opacity-90">Current Balance</h3>
                  <p className="text-4xl font-bold">₹{wallet.balance}</p>
                  <p className="text-blue-100 mt-2">Available for use</p>
                </div>

                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Recent Transactions
                </h3>
                {wallet.transactions?.length > 0 ? (
                  <div className="space-y-3">
                    {wallet.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/70 border border-white/50 rounded-2xl backdrop-blur-sm">
                        <div>
                          <p className="font-semibold text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <div className={`font-bold text-lg ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💳</div>
                    <p className="text-gray-600">No transactions found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'referral' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">🎁</span>
                  Referral Program
                </h2>
                
                <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-3xl p-6 text-white mb-6 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
                  <div className="bg-white/20 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold font-mono">{referralId}</p>
                      <p className="text-green-100 text-sm">Share with friends to earn rewards!</p>
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="bg-white text-green-600 px-4 py-2 rounded-xl font-semibold hover:bg-green-50 transition-all"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/70 border border-white/50 rounded-2xl p-6 backdrop-blur-sm">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">👥</span>
                      Friends Referred
                    </h4>
                    <p className="text-3xl font-bold text-blue-600">0</p>
                    <p className="text-gray-600 text-sm">Total referrals</p>
                  </div>
                  <div className="bg-white/70 border border-white/50 rounded-2xl p-6 backdrop-blur-sm">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">💰</span>
                      Earnings
                    </h4>
                    <p className="text-3xl font-bold text-green-600">₹0</p>
                    <p className="text-gray-600 text-sm">From referrals</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={shareReferral}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center"
                  >
                    <span className="mr-2">🔗</span>
                    Share Referral Link
                  </button>
                  
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                    <h4 className="font-bold text-blue-800 mb-2">How it works:</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Share your referral code with friends</li>
                      <li>• They get ₹100 bonus on signup</li>
                      <li>• You earn ₹50 for each successful referral</li>
                      <li>• No limit on referrals!</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">📦</span>
                  My Orders
                </h2>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">No orders yet</h3>
                  <p className="text-gray-600 mb-6">When you place your first order, it will appear here</p>
                  <button
                    onClick={() => onNavigate?.('home')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    🛍️ Start Shopping
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">📊</span>
                    Activity Log
                  </h2>
                  <button
                    onClick={clearAnalyticsData}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    🗑️ Clear Data
                  </button>
                </div>
                
                {recentEvents.length > 0 ? (
                  <div className="space-y-3">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-white/70 border border-white/50 rounded-2xl backdrop-blur-sm">
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">{event.name.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          {Object.keys(event.data).length} data points
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-600">No activity data found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center"
            >
              <span className="mr-2">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
