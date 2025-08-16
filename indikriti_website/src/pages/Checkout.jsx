import Header from '../components/Header.jsx';
import FooterNav from '../components/FooterNav.jsx';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mobile-container bg-white">
        <Header />
        
        <div className="min-h-screen pb-20">
          <div className="flex items-center justify-center min-h-[60vh] p-5">
            <div className="text-center max-w-md">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
              <p className="text-gray-600 mb-8">
                Secure payment processing and order confirmation coming soon!
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.history.back()}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                >
                  �� Go Back
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
                >
                  Back to Home
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-6">
                Want this page implemented? Continue prompting to add more features!
              </p>
            </div>
          </div>
        </div>

        <FooterNav />
      </div>
    </div>
  );
};

export default Checkout;
