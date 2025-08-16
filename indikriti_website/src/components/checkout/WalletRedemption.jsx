import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { redeemWalletAmount } from '../../services/enhancedApi.js';

const WalletRedemption = ({ orderTotal, onWalletAmountChange, disabled = false }) => {
  const { user, wallet, updateWalletBalance } = useAuth();
  const [walletAmount, setWalletAmount] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState('');

  const maxRedeemableAmount = Math.min(wallet.balance, orderTotal);

  useEffect(() => {
    if (useWallet) {
      onWalletAmountChange?.(walletAmount);
    } else {
      onWalletAmountChange?.(0);
    }
  }, [walletAmount, useWallet, onWalletAmountChange]);

  const handleWalletToggle = (checked) => {
    setUseWallet(checked);
    setError('');
    
    if (checked) {
      // Auto-set to maximum redeemable amount
      setWalletAmount(maxRedeemableAmount);
    } else {
      setWalletAmount(0);
    }
  };

  const handleWalletAmountChange = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    
    if (numAmount > maxRedeemableAmount) {
      setError(`Maximum redeemable amount is ₹${maxRedeemableAmount}`);
      setWalletAmount(maxRedeemableAmount);
    } else if (numAmount < 0) {
      setError('Amount cannot be negative');
      setWalletAmount(0);
    } else {
      setError('');
      setWalletAmount(numAmount);
    }
  };

  if (!user || wallet.balance <= 0) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">💰</span>
          <div>
            <h3 className="font-medium text-green-800">Wallet Balance</h3>
            <p className="text-sm text-green-600">₹{wallet.balance} available</p>
          </div>
        </div>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useWallet}
            onChange={(e) => handleWalletToggle(e.target.checked)}
            disabled={disabled || maxRedeemableAmount <= 0}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <span className="text-sm font-medium text-green-800">Use Wallet</span>
        </label>
      </div>

      {useWallet && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Amount to redeem
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
              <input
                type="number"
                min="0"
                max={maxRedeemableAmount}
                step="1"
                value={walletAmount}
                onChange={(e) => handleWalletAmountChange(e.target.value)}
                disabled={disabled}
                className="w-full pl-8 pr-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleWalletAmountChange(Math.min(100, maxRedeemableAmount))}
              disabled={disabled || maxRedeemableAmount < 100}
              className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ₹100
            </button>
            <button
              type="button"
              onClick={() => handleWalletAmountChange(Math.min(500, maxRedeemableAmount))}
              disabled={disabled || maxRedeemableAmount < 500}
              className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ₹500
            </button>
            <button
              type="button"
              onClick={() => handleWalletAmountChange(maxRedeemableAmount)}
              disabled={disabled}
              className="flex-1 bg-green-200 text-green-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Max
            </button>
          </div>

          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Order Total:</span>
              <span className="font-medium">₹{orderTotal}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-600">Wallet Amount:</span>
              <span className="font-medium text-green-600">-₹{walletAmount}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center font-bold">
              <span>Final Amount:</span>
              <span className="text-orange-600">₹{orderTotal - walletAmount}</span>
            </div>
          </div>

          {walletAmount > 0 && (
            <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
              💡 You'll save ₹{walletAmount} using your wallet balance!
            </div>
          )}
        </div>
      )}

      {maxRedeemableAmount <= 0 && (
        <div className="text-sm text-gray-500 text-center py-2">
          Minimum order amount required to use wallet
        </div>
      )}
    </div>
  );
};

export default WalletRedemption;
