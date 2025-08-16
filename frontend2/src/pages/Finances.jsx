import React from 'react';
import FinanceDashboard from '../components/finances/FinanceDashboard';

const Finances = () => {
  // Mock financial data
  const financialData = {
    revenue: 125000,
    expenses: 75000,
    profit: 50000,
    transactions: [
      { id: 1, type: 'income', description: 'Product Sale', amount: 1999.99, date: '2023-12-01', status: 'completed' },
      { id: 2, type: 'expense', description: 'Office Rent', amount: 15000, date: '2023-12-01', status: 'completed' },
      { id: 3, type: 'income', description: 'Product Sale', amount: 799.99, date: '2023-11-30', status: 'completed' },
      { id: 4, type: 'expense', description: 'Marketing', amount: 5000, date: '2023-11-30', status: 'completed' },
      { id: 5, type: 'income', description: 'Product Sale', amount: 3999.99, date: '2023-11-29', status: 'completed' }
    ],
    recentTransactions: [
      { id: 1, type: 'income', description: 'Product Sale - Cotton Bedsheet', amount: 1999.99, date: '2023-12-01', status: 'completed' },
      { id: 2, type: 'income', description: 'Product Sale - Silk Suit', amount: 3999.99, date: '2023-12-01', status: 'completed' },
      { id: 3, type: 'expense', description: 'Office Rent Payment', amount: 15000, date: '2023-12-01', status: 'completed' },
      { id: 4, type: 'income', description: 'Product Sale - Linen Runner', amount: 799.99, date: '2023-11-30', status: 'completed' },
      { id: 5, type: 'expense', description: 'Marketing Campaign', amount: 5000, date: '2023-11-30', status: 'completed' },
      { id: 6, type: 'income', description: 'Product Sale - Cotton Towel', amount: 299.99, date: '2023-11-29', status: 'completed' },
      { id: 7, type: 'expense', description: 'Inventory Purchase', amount: 25000, date: '2023-11-29', status: 'completed' },
      { id: 8, type: 'income', description: 'Product Sale - Silk Scarf', amount: 599.99, date: '2023-11-28', status: 'completed' }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your revenue, expenses, and financial performance
        </p>
      </div>

      <FinanceDashboard
        revenue={financialData.revenue}
        expenses={financialData.expenses}
        profit={financialData.profit}
        transactions={financialData.transactions}
        recentTransactions={financialData.recentTransactions}
      />
    </div>
  );
};

export default Finances;
