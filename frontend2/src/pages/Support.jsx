import React from 'react';
import { Card } from '../components/ui';

const Support = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="mt-1 text-sm text-gray-500">
          Get help and contact support
        </p>
      </div>

      <Card>
        <div className="p-6 text-center">
          <p className="text-gray-500">Support center coming soon...</p>
        </div>
      </Card>
    </div>
  );
};

export default Support;
